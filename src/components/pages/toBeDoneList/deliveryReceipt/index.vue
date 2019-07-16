<template>
  <div id="deliveryReceipt" :style="this.mainListHeight()">
    <div class="top" ref="top">
      <div>
        <p @click="slither = 0" :class="{'choose': slither !== Object.keys(drawSlither).length - 1}">物品交接</p>
        <p @click="slither = Object.keys(drawSlither).length - 1"
           :class="{'choose': slither === Object.keys(drawSlither).length - 1}">费用交接</p>
        <h2>{{mainTop[slither]}}</h2>
      </div>
      <h1 @click="previewDelivery">
        <span class="writingMode">预览</span>
      </h1>
    </div>
    <div class="mainTouch" ref="main" @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
      <div :style="slitherCss" class="transition" :class="['transition' + allReportNum]">
        <div class="slide justify-around" :class="['slide' + slither]">
          <ul :style="mainWidth" v-for="slither in Object.keys(drawSlither)">
            <li v-if="slither === 'bedroom'" v-for="(item,index) in drawSlither[slither]">
              <div class="bedroom">
                <p>
                  <b>次卧{{myUtils.DX(index+1)}}</b>
                  <van-icon name="cross" color="#4570FE" size=".36rem" v-if="drawSlither[slither].length > 1"
                            @click='removeChange(slither,item.keyName,index)'/>
                </p>
                <div class="addChange" v-if="(index+1) === drawSlither[slither].length">
                  <span @click="addChange(slither,'',index,item)">+</span>
                </div>
              </div>
              <div v-for="room in item">
                <div v-if="room.showForm === 'formatData'">
                  <zl-input
                    v-model="formatData[slither][index][room.keyName]"
                    @focus="choosePicker(room,form[slither][index][room.keyName],slither,index)"
                    :key="index"
                    :type="room.type"
                    :label="room.label"
                    :readonly="room.readonly"
                    :disabled="room.disabled"
                    :placeholder="room.placeholder">
                    <div class="zl-button" v-if="room.button">{{room.button}}</div>
                    <div class="unit" v-if="room.unit">{{room.unit}}</div>
                  </zl-input>
                  <div v-for="child in room.children" v-if="!child.hidden">
                    <div v-if="child.type">
                      <div class="items-center">
                        <zl-input
                          v-model="form[slither][index][room.keyName][child.keyName]"
                          :key="index"
                          :type="child.type"
                          :label="child.label"
                          :placeholder="child.placeholder">
                          <div class="zl-button" v-if="child.button">{{child.button}}</div>
                          <div class="unit" v-if="child.unit">{{child.unit}}</div>
                        </zl-input>
                      </div>
                      <div class="prompts" v-if="child.prompts">{{child.prompts}}</div>
                    </div>
                    <div v-else>
                      <Upload :file="child" :getImg="album[slither][index][child.keyName]" :close="!closePhoto"
                              @success="getImgDataBed"></Upload>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <zl-input
                    v-model="form[slither][index][room.keyName]"
                    :key="index"
                    :type="room.type"
                    :label="room.label"
                    :placeholder="room.placeholder">
                    <div class="zl-button" v-if="room.button">{{room.button}}</div>
                    <div class="unit" v-if="room.unit">{{room.unit}}</div>
                  </zl-input>
                </div>
              </div>
            </li>
            <li v-else-if="item.status === 'child'">
              <!--select 下拉选择-->
              <div v-if="item.showForm === 'formatData'">
                <zl-input
                  v-model="formatData[slither][item.keyName]"
                  @focus="choosePicker(item,form[slither][item.keyName],slither)"
                  :key="index"
                  :type="item.type"
                  :label="item.label"
                  :readonly="item.readonly"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder">
                  <div class="zl-button" v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
                <div v-for="child in item.children" v-if="!child.hidden">
                  <div v-if="child.type">
                    <div class="items-center">
                      <zl-input
                        v-model="form[slither][item.keyName][child.keyName]"
                        :key="index"
                        :type="child.type"
                        :label="child.label"
                        :placeholder="child.placeholder">
                        <div class="zl-button" v-if="child.button">{{child.button}}</div>
                        <div class="unit" v-if="child.unit">{{child.unit}}</div>
                      </zl-input>
                    </div>
                    <div class="prompts" v-if="child.prompts">{{child.prompts}}</div>
                  </div>
                  <div v-else>
                    <Upload :file="child" :getImg="album[slither][item.keyName]" :close="!closePhoto"
                            @success="getImgDataObj"></Upload>
                  </div>
                </div>
              </div>
              <div v-else>
                <zl-input
                  v-model="form[slither][item.keyName]"
                  :key="index"
                  :type="item.type"
                  :label="item.label"
                  :placeholder="item.placeholder">
                  <div class="zl-button" v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
              </div>
            </li>
            <li v-else>
              <!--显示formatData -->
              <div v-if="item.showForm === 'formatData'">
                <!--select 下拉选择-->
                <zl-input
                  v-model="formatData[item.keyName]"
                  @focus="choosePicker(item, form[item.keyName])"
                  :key="index"
                  :type="item.type"
                  :label="item.label"
                  :readonly="item.readonly"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder">
                  <div class="zl-button" v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
                <div v-if="item.changeList" style="border-bottom: 3px solid #f8f8f8;">
                  <div v-for="change in item.changeList[form[item.keyName]['payment_type']]">
                    <zl-input
                      v-model="form[item.keyName][change.keyName]"
                      :key="index"
                      :type="change.type"
                      :label="change.label"
                      @input="listenInput(item.keyName)"
                      :readonly="change.readonly"
                      :disabled="change.disabled"
                      :placeholder="change.placeholder">
                    </zl-input>
                  </div>
                </div>
                <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
              </div>
              <!--上传-->
              <div v-else-if="item.picker === 'upload' && item.photos" class="uploadForm">
                <div v-for="upload in item.photos" class="flex">
                  <Upload :file="upload" :getImg="album[upload.keyName]" :close="!closePhoto"
                          @success="getImgData"></Upload>
                </div>
              </div>
              <!--普通输入框-->
              <div v-else-if="item.keyName === 'other_fee'">
                <div v-for="(val,num) in item.value">
                  <div class="items-center">
                    <label class="labelTitle">{{item.label + (myUtils.DX(num+1))}}</label>
                    <zl-input
                      v-for="(str,i) in val"
                      :key="i"
                      v-model="form[item.keyName][num][str.keyName]"
                      :type="str.type"
                      @input="listenInput(item.keyName)"
                      :placeholder="str.placeholder">
                    </zl-input>
                    <div v-if="item.button && item.value.length > 1">
                      <van-icon name="cross" color="#4570FE" size=".36rem"
                                @click='removeChange(slither,item.keyName,index,num)'/>
                    </div>
                  </div>
                </div>
                <div class="addChange">
                  <span @click="addChange(slither,item.keyName,index,item.value[0])">+</span>
                </div>
              </div>
              <div v-else>
                <zl-input
                  v-if="!item.hidden"
                  :key="index"
                  v-model="form[item.keyName]"
                  :type="item.type"
                  :label="item.label"
                  @input="listenInput(item.keyName)"
                  :placeholder="item.placeholder">
                  <div v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
              </div>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </li>
          </ul>
        </div>
        <footer>
          <div class="commonBtn" :style="mainWidth">
            <p class="btn reset" @click="saveReport(2)">重置</p>
            <p class="btn deliver" @click="saveReport(1)">保存</p>
            <p class="btn" @click="saveReport(0)">发布</p>
          </div>
        </footer>
      </div>
    </div>
    <div class="changeTag justify-center">
      <i v-for="(item,index) in allReportNum" :class="{'hover': slither === index}" @click="slither = index"></i>
    </div>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--分类 选择-->
    <delivery-picker-slot :module="popupModule" :pickers="pickers" :drawing="drawSlither" :postData="form"
                          :formData="formatData" :popup="popupStatus" @close="onConfirm"></delivery-picker-slot>
  </div>
</template>

<script>
  import DeliveryPickerSlot from './delivery-picker-slot.vue'

  export default {
    name: "index",
    components: {DeliveryPickerSlot},
    data() {
      return {
        allDetail: {},
        mainTop: [],
        slither: 0,
        startClientX: 0,
        endClientX: 0,
        allReportNum: 0,
        popupStatus: '',
        pickerModule: false,
        deliveryModule: false,
        popupModule: false,
        timeModule: false,
        pickers: {},
        slitherCss: {},
        mainWidth: {},
        closePhoto: false,
        album: {},                          //图片
        form: {},
        formatData: {},                     //DOM显示数据
        showData: {
          dateVal: '',                      //日期
          dateKey: '',                      //日期 字段名
          dateType: '',                     //日期类型 默认date 时分datetime
          dateIdx: '',                      //日期字段下标 变化情况使用
        },
        drawSlither: {},

        childPhoto: [],
        bulletinType: {},                   //报备类型
        checkout: false,                    //是否从退租报备进来
      }
    },
    created() {
    },
    mounted() {
    },
    beforeRouteLeave(to, from, next) {
      this.closePhoto = true;
      setTimeout(_ => {
        this.closePhoto = false;
      }, 100);
      next(vm => {
      })
    },
    activated() {
      this.bulletinType = JSON.parse(sessionStorage.bulletin_type || '{}');
      this.allDetail = JSON.parse(sessionStorage.task_detail || '{}');
      this.slither = 0;
      this.drawSlither = {};
      this.checkout = this.bulletinType.bulletin === 'bulletin_checkout';
      this.mainTop = ['客厅', '厨房/阳台/卫生间', '主卧', '次卧', '费用交接'];
      this.allReportNum = Object.keys(defineArticleReceipt).length;
      this.resetting();
      this.getDraft(this.allDetail.task_id);
      let top = this.$refs.top.offsetHeight + 30;
      let main = this.$refs.main.offsetWidth + "px";
      this.mainWidth = {minWidth: main, maxWidth: main};
      this.slitherCss = this.mainListHeight(top);
      this.slitherCss.width = this.allReportNum + '00%';
    },
    watch: {},
    computed: {},
    methods: {
      // 监听 input 金额计算
      listenInput(name) {
        if (name !== 'total_fee') {
          let value = 0;
          for (let key of this.form.other_fee) {
            value = value + Number(key.value || 0);
          }
          let water = this.form.water_payment_type;
          let water_num1 = Number(water.water_card_balance || 0);
          let water_num2 = Number(water.water_unit_price || 0);
          let water_all = water_num1 + water_num2;

          let electric = this.form.electric_payment_type;
          let electric_num1 = Number(electric.electric_card_balance || 0);
          let electric_num2 = Number(electric.electric_valley_unit_price || 0);
          let electric_num3 = Number(electric.electric_peak_unit_price || 0);
          let electric_all = electric_num1 + electric_num2 + electric_num3;

          let gas = this.form.gas_payment_type;
          let gas_num1 = Number(gas.gas_card_balance || 0);
          let gas_num2 = Number(gas.gas_price || 0);
          let gas_all = gas_num1 + gas_num2;

          let num1 = Number(this.form.property_costs || 0);
          let num2 = Number(this.form.public_fee || 0);
          let num3 = Number(this.form.repair_fees || 0);
          let num_all = num1 + num2 + num3;
          this.form.total_fee = value + num_all + water_all + electric_all + gas_all;
        }
      },
      // 预览交接单
      previewDelivery() {
        this.$httpZll.postPreviewDelivery(this.form).then(res => {
          this.$ddSkip(res.data);
        })
      },
      // 获取交接单草稿
      getDraft(id) {
        this.$httpZll.getDeliveryDraft(id).then(res => {
          if (res) {
            let data = res.data;
            this.form.id = data.id;
            this.handlePreFill(data);
          } else {
            let house_id = '';
            if (this.allDetail.ewal_contract) {
              house_id = JSON.parse(this.allDetail.ewal_contract || '{}').house_id || '';
            } else {
              house_id = this.allDetail.house_id || '';
            }
            this.$httpZll.getNewDeliveryDraft({house_id: house_id}).then(res => {
              if (res) {
                let value = JSON.parse(res.data.draft_content || '{}');
                this.handlePreFill(value);
              }
            });
          }
        })
      },
      // 交接单 草稿预填
      handlePreFill(res) {
        let title = ['hall_goods', 'kitchen_balcony_bathroom', 'master_bedroom'];
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          if (title.includes(item)) {
            for (let name of Object.keys(res[item])) {
              this.getHandleData(res, item, name);
            }
          } else if (item === 'bedroom') {
            res[item].forEach((bed, index) => {
              if (index !== 0) {
                let obj = {}, pic = {};
                let draw = this.jsonClone(this.drawSlither[item][0]);
                for (let room of draw) {
                  if (room.children) {
                    room.picker = room.picker + index;
                    for (let child of room.children) {
                      if (child.status === 'upload') {
                        child.picker = index;
                        child.keyName = child.keyName + '-' + index;
                        pic[child.keyName] = [];
                        obj[child.keyName] = '';
                      }
                    }
                  }
                }
                this.drawSlither[item].push(draw);
                this.formatData[item].push(obj);
                this.album[item].push(pic);
              }
              for (let name of Object.keys(bed)) {
                this.getHandleData(res, item, name, index);
              }
            });
          } else {
            switch (item) {
              case 'house_album':
                this.$httpZll.getUploadUrl(res[item]).then(res => {
                  this.album[item] = res.data;
                  this.album = Object.assign({}, this.album);
                });
                break;
              case 'is_clean':
              case 'cleaning_type':
                this.formatData[item] = dicties[item][res[item]];
                break;
              case 'cleaning_time':
                this.formatData[item] = res[item];
                break;
              case 'other_fee':
                if (res[item].length > 1) {
                  for (let other of this.drawSlither['slither']) {
                    if (other.keyName === 'other_fee') {
                      other.value.push(other.value[0]);
                    }
                  }
                }
                break;
              case 'water_payment_type':
              case 'electric_payment_type':
              case 'gas_payment_type':
                this.paymentTypeReset(item);
                let type = this.form[item].payment_type;
                if (type || type === 0) {
                  this.formatData[item] = dicties[item][type];
                }
                this.form[item] = res[item] || this.form[item];
                break;
            }
          }
        }
        this.listenInput();
        this.detailFormData();
        this.isBadShowHidden();
      },
      // 请求数据处理
      getHandleData(res, item, name, index) {
        let value;
        if (typeof index === 'number') {
          value = res[item][index][name];
        } else {
          value = res[item][name];
        }
        if (value) {
          let show = [];
          for (let child of Object.keys(value)) {
            if (child === 'photo') {
              if (value[child].length) {
                this.$httpZll.getUploadUrl(value[child]).then(res => {
                  if (typeof index === 'number') {
                    this.album[item][index][name] = res.data;
                  } else {
                    this.album[item][name] = res.data;
                  }
                  this.album = Object.assign({}, this.album);
                })
              }
            } else {
              let unit = '';
              let sets = ['air_conditioning', 'tv'];//台
              let few = ['chair', 'door_lock_key', 'key'];//把
              unit = sets.includes(name) ? '台' : (few.includes(name) ? '把' : '个');
              if (value[child]) {
                let num = Number(value[child]);
                switch (child) {
                  case 'is_have':
                    if (num) {
                      show[0] = '有';
                    } else {
                      show[0] = '没有';
                    }
                    break;
                  case 'type':
                    for (let dict of Object.keys(dicties[name])) {
                      if (dict.includes('0')) {
                        show[0] = dicties[name]['value_0'][num];
                      }
                    }
                    break;
                  case 'is_bad':
                    if (num) {
                      show[1] = '损坏';
                    } else {
                      show[1] = '无损坏';
                    }
                    break;
                  case 'bad_number':
                    if (num) {
                      show[2] = num + unit;
                    }
                    break;
                  case 'number':
                    if (num) {
                      show[3] = '共' + num + unit;
                    }
                    break;
                }
                let temp = [];
                for (let i of show) {
                  if (i) {
                    temp.push(i);
                  }
                }
                if (typeof index === 'number') {
                  this.formatData[item][index][name] = temp.join('/');
                } else {
                  this.formatData[item][name] = temp.join('/');
                }
              }
            }
          }
        }
      },
      // touch 左右切换
      tapStart(event) {
        for (let item of event.touches) {
          this.startClientX = item.clientX;
          this.endClientX = item.clientX;
        }
      },
      tapMove(event) {
        for (let item of event.touches) {
          this.endClientX = item.clientX;
        }
      },
      tapEnd() {
        let start = this.startClientX;
        let end = this.endClientX;
        if (start - end > 66) {
          if ((this.allReportNum - 1) > this.slither > 0) {
            this.slither++;
          }
        }
        if (start - end < -66) {
          if (this.slither > 0) {
            this.slither--;
          }
        }
      },
      // 变化增加
      addChange(slither, name, index, item) {
        let obj = {};
        let cloneVal = this.jsonClone(item);
        if (slither === 'bedroom') {
          let idx = index + 1, str = {}, arr = [], pic = {};
          for (let val of cloneVal) {
            if (val.children) {
              val.picker = val.picker + idx;
              for (let child of val.children) {
                if (child.status === 'upload') {
                  child.picker = idx;
                  child.keyName = child.keyName + '-' + idx;
                }
                child.hidden = true;
                pic[child.keyName] = [];
                str[child.keyName] = '';
              }
            }
            obj[val.keyName] = val.keyType;
            arr.push(val);
          }
          this.drawSlither[slither].push(arr);
          this.form[slither].push(obj);
          this.formatData[slither].push(str);
          this.album[slither].push(pic);
          return;
        }
        this.drawSlither[slither][index].value.push(cloneVal);
        for (let item of cloneVal) {
          obj[item.keyName] = item.keyType;
        }
        this.form[name].push(obj);
      },
      // 变化删除
      removeChange(slither, name, index, num = '') {
        if (slither === 'bedroom') {
          this.drawSlither[slither].splice(index, 1);
          this.form[slither].splice(index, 1);
          this.formatData[slither].splice(index, 1);
          this.album[slither].splice(index, 1);
          this.form[slither].forEach((pic, index) => {
            for (let key of Object.keys(pic)) {
              if (pic[key].photo && pic[key].photo.length) {
                this.$httpZll.getUploadUrl(pic[key].photo, 'close').then(res => {
                  for (let album of Object.keys(this.album[slither][index])) {
                    if (album.includes(key)) {
                      this.album[slither][index][album] = res.data;
                    }
                  }
                  this.album = Object.assign({}, this.album);
                })
              }
            }
          });
          return;
        }
        this.form[name].splice(num, 1);
        this.drawSlither[slither][index].value.splice(num, 1);
        this.formatData[name].splice(num, 1);
        this.album[name].splice(num, 1);
      },
      // 下拉选择
      choosePicker(item, value = '', parentKey = '', index = '') {
        this.popupStatus = item.picker;
        if (item.status === 'child') {
          this.deliveryPicker(item, value, parentKey, index);
        } else if (item.picker === 'date') {
          this.chooseTime(item, value);
        } else {
          this.pickerModule = true;
          this.inputSelect(item, value, parentKey).then(picker => {
            this.pickers = picker;
          });
        }
      },
      // 交接单 picker
      deliveryPicker(item, value, parentKey, index) {
        this.$closePicker().then(res => {
          this.pickers = res;
          let dict = dicties[item.keyName];
          this.pickers.columns = [];
          this.pickers.ids = [];
          for (let item of Object.keys(dict)) {
            let obj = {values: []}, ids = {values: []};
            for (let val of Object.keys(dict[item])) {
              obj.values.push(dict[item][val]);
              ids.values.push(val);
            }
            this.pickers.columns.push(obj);
            this.pickers.ids.push(ids);
          }
          this.pickers.title = item.label;
          this.pickers.index = index;
          this.pickers.parentKey = parentKey;
          this.pickers.keyName = item.keyName;
          this.pickers.childKeys = item.childKeys;
          this.popupModule = true;
        });
      },
      // 确认选择
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
          this.isBadShowHidden();
          let name = this.pickers.keyName;
          this.paymentTypeReset(name);
        }
      },
      // 费用交接 缴费类型切换
      paymentTypeReset(name) {
        let arr = ['water_payment_type', 'electric_payment_type', 'gas_payment_type'];
        if (!arr.includes(name)) return;
        let data = this.jsonClone(defineArticleReceipt.slither);
        for (let item of data) {
          if (item.keyName === name) {
            let type = this.form[name].payment_type || '0';
            this.form[name] = {};
            if (String(type) === '0') return;
            for (let change of item.changeList[type]) {
              this.form[name][change.keyName] = change.keyType;
            }
            this.form[name].payment_type = type;
          }
        }
      },
      // 显示/隐藏 图片 备注
      isBadShowHidden() {
        let list = this.drawSlither;
        for (let item of Object.keys(list)) {
          list[item].forEach((key, index) => {
            if (item === 'bedroom') {
              key.forEach((bed) => {
                if (bed.children) {
                  for (let room of bed.children) {
                    let num = this.form[item][index][bed.keyName].is_bad;
                    room.hidden = !(num === 1 || num === '1');
                  }
                }
              })
            } else {
              if (key.status === 'child') {
                if (key.children) {
                  let num = this.form[item][key.keyName].is_bad;
                  if (num === 1 || num === '1') {
                    for (let val of key.children) {
                      val.hidden = false;
                    }
                  } else {
                    this.form[item][key.keyName].bad_number = '';
                    for (let val of key.children) {
                      val.hidden = true;
                    }
                  }
                }
              }
            }
          })
        }
      },
      // 日期选择
      chooseTime(val, date) {
        this.timeModule = true;
        this.formatData.dateKey = val.keyName;
        this.formatData.dateVal = date;
      },
      // 确认时间
      onConTime(val) {
        this.onCancel();
        if (val !== 'close') {
          this.form[val.dateKey] = val.dateVal;
          this.formatData[val.dateKey] = val.dateVal;
        }
      },
      // close Module
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.deliveryModule = false;
      },
      // 图片 损坏次卧
      getImgDataBed(val, file) {
        let names = file.keyName.split('__');
        let name1 = names[1].split('-')[0];
        this.form[names[0]][file.picker][name1]['photo'] = val[1];
      },
      // 损坏照片
      getImgDataObj(val, file) {
        let names = file.keyName.split('__');
        this.form[names[0]][names[1]]['photo'] = val[1];
      },
      // 图片
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 发布
      saveReport(val) {
        let url = '';
        url = this.checkout ? '/check_out' : '';
        this.form.is_draft = val;
        switch (val) {
          case 0:
          case 1:
            this.$httpZll.postDeliveryReceipt(this.form, url).then(res => {
              if (res) {
                if (val === 1) {
                  this.form.id = res.data.id;
                } else {
                  if (this.checkout) {
                    this.allDetail.content.handover_id = res.data.id;
                  }
                  sessionStorage.setItem('task_detail', JSON.stringify(this.allDetail));
                  this.$router.go(-1);
                }
              }
            });
            break;
          case 2:
            this.$dialog('重置', '您确定要清空表单吗?').then(status => {
              if (status) {
                this.resetting();
              }
            });
            break;
        }
      },
      // 重置
      resetting(val) {
        // defineArticleReceipt['slither'] = handlerFreeDeliveryChange[val];
        this.drawSlither = this.jsonClone(defineArticleReceipt);
        for (let item of Object.keys(this.drawSlither)) {
          if (item !== 'slither') {
            if (item === 'bedroom') {
              this.album[item] = [];
              this.form[item] = [];
              this.formatData[item] = [];
            } else {
              this.album[item] = {};
              this.form[item] = {};
              this.formatData[item] = {};
            }
          }
          for (let key of this.drawSlither[item]) {
            if (item === 'bedroom') {
              this.drawSlither[item].forEach((res, index) => {
                this.form[item][index] = {};
                this.formatData[item][index] = {};
                this.album[item][index] = {};
                for (let room of res) {
                  this.form[item][index][room.keyName] = room.keyType;
                  this.album[item][index][room.keyName] = [];
                  if (room.childKeys) {
                    this.formatData[item][index][room.keyName] = '';
                    for (let child of room.childKeys) {
                      this.form[item][index][room.keyName][child] = '';
                    }
                    for (let child of room.children) {
                      if (child.status === 'upload') {
                        this.form[item][index][room.keyName]['photo'] = [];
                      } else {
                        this.form[item][index][room.keyName][child.keyName] = '';
                      }
                    }
                  }
                }
              })
            } else if (key.status === 'child') {
              this.form[item][key.keyName] = key.keyType;
              this.formatData[item][key.keyName] = '';
              this.album[item][key.keyName] = [];
              if (key.childKeys || key.children) {
                for (let child of key.childKeys) {
                  this.form[item][key.keyName][child] = '';
                }
                for (let val of key.children) {
                  if (val.status === 'upload') {
                    this.form[item][key.keyName]['photo'] = val.keyType;
                  } else {
                    this.form[item][key.keyName][val.keyName] = val.keyType;
                  }
                }
              }
            } else {
              if (key.picker === 'upload') {
                for (let pic of key.photos) {
                  this.form[pic.keyName] = [];
                }
              } else if (key.status === 'other_fee') {
                this.form[key.keyName] = key.keyType;
                let obj = {};
                for (let other of key.value) {
                  for (let val of other) {
                    obj[val.keyName] = '';
                  }
                }
                this.form[key.keyName].push(obj);
              } else if (key.changeList) {
                this.form[key.keyName] = {};
                this.formatData[key.keyName] = dicties[key.keyName][key.keyType];
                this.form[key.keyName].payment_type = key.keyType;
                for (let change of Object.keys(key.changeList)) {
                  for (let child of key.changeList[change]) {
                    this.form[key.keyName][child.keyName] = child.keyType;
                  }
                }
              } else {
                this.form[key.keyName] = key.keyType;
                if (key.keyType) {
                  this.formatData[key.keyName] = dicties[key.keyName][key.keyType];
                } else {
                  this.formatData[key.keyName] = key.keyType;
                }
              }
            }
          }
        }
        this.detailFormData();
      },
      detailFormData() {
        this.form.task_id = this.allDetail.task_id;
        if (this.allDetail.ewal_contract) {
          let contract = JSON.parse(this.allDetail.ewal_contract || '{}');
          this.form.house_id = contract.house_id;//房屋ID
          this.form.contract_id = contract.v3_contract_id;//合同ID
        } else {
          if (this.allDetail.house_id) {
            this.form.house_id = this.allDetail.house_id;
          } else {
            this.form.house_id = '';
          }
          if (this.allDetail.contract_id) {
            this.form.contract_id = this.allDetail.contract_id;
          } else {
            this.form.contract_id = '';
          }
        }
        this.form.collect_or_rent = this.allDetail.bulletin_type === 'bulletin_collect_basic' ? 1 : 2;//收租标记
        this.form = Object.assign({}, this.form);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  @mixin deliveryImg($n) {
    @include bgImage('../../../../assets/image/deliveryReceipt/'+$n+'.png');
  }

  #deliveryReceipt {
    background-color: #F8F8F8;
    border-top: .1rem solid #f8f8f8;

    .top {
      padding: 0 .5rem;
      background-color: #4570FE;
      height: 2.2rem;
      @include flex('justify-bet');

      div {
        @include flex();
        flex-wrap: wrap;

        p {
          font-size: .26rem;
          margin-right: .15rem;
          width: 1.5rem;
          height: .6rem;
          text-align: center;
          line-height: .6rem;
          @include radius(.1rem);
          color: #4570FE;
          background-color: #8FB1FF;
        }

        .choose {
          background-color: #CDDEFF;
        }

        h2 {
          @include transform(translateY(-.3rem));
          width: 100%;
          color: #FFFFFF;
        }
      }

      h1 {
        @include flex('flex-center');
        width: .7rem;
        height: 1rem;
        color: #FFFFFF;
        @include radius(0 0 1rem 1rem);
        background-color: #43A046;
      }
    }

    .mainTouch {
      margin: -.6rem .3rem 0;
      padding: .24rem 0;
      background-color: #FFFFFF;
      overflow-x: hidden;
      @include radius(.1rem);
      @include flex();

      .transition {
        @include flex('bet-column');

        .slide {
          @include transition(all .3s);
          height: 100%;
        }

        .slide0 {
          @include transform(translateX(0));
        }
      }

      @mixin slides($n) {
        $num: 100% / $n;
        @for $i from 1 through $n {
          .transition#{$n} {
            .slide#{$i} {
              @include transform(translateX(-($num*$i)));
            }
          }
        }
      }
      @include slides(2);
      @include slides(3);
      @include slides(4);
      @include slides(5);
      @include slides(6);
      @include slides(7);
      @include slides(8);
      @include slides(9);
      @include slides(10);

      ul {
        height: 100%;
        padding-right: .2rem;
        @include scroll;

        li {
          .addChange {
            margin-left: 2rem;

            span {
              display: inline-block;
              text-align: center;
              width: .5rem;
              height: .5rem;
              line-height: .5rem;
              font-size: .5rem;
              color: #FFFFFF;
              background-color: #4A74FE;
              @include radius(50%);
            }
          }

          .bedroom {
            @include flex('items-bet');
            padding-right: .3rem;

            p {
              @include flex('items-center');

              b {
                margin-right: .2rem;
                color: #4570FE;
                padding: .1rem .24rem;
                @include radius(0 1rem 1rem 0);
                background-color: rgba(69, 112, 254, .2);
              }
            }
          }
        }
      }

      footer {
        border-top: 1px solid #F2F2F2;

        .commonBtn {
          padding: .3rem .1rem .1rem;
          @include transition(all .3s);
        }
      }
    }

    .changeTag {
      i {
        width: .2rem;
        height: .2rem;
        background: rgba(69, 112, 254, .3);
        @include radius(50%);
        margin: .2rem .1rem 0;
      }

      .hover {
        width: .3rem;
        @include radius(1rem);
        background: rgba(69, 112, 254, 1);
      }
    }
  }
</style>
