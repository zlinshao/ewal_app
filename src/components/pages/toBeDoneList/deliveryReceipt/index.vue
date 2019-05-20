<template>
  <div id="deliveryReceipt" :style="this.mainListHeight()">
    <div class="top" ref="top">
      <div>
        <p @click="slither = 0"></p>
        <p @click="slither = 4"></p>
        <h2>{{mainTop[slither]}}</h2>
      </div>
      <h1></h1>
    </div>
    <div class="mainTouch" ref="main" @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
      <div :style="slitherCss" class="transition" :class="['transition' + allReportNum]">
        <div class="slide justify-around" :class="['slide' + slither]">
          <ul :style="mainWidth" v-for="slither in Object.keys(drawSlither)">
            <li v-if="item.status === 'child'" v-for="(item,index) in drawSlither[slither]">
              <!--select 下拉选择-->
              <div v-if="item.showForm === 'formatData'">
                <zl-input
                  v-model="formatData[slither][item.keyName]"
                  @focus="choosePicker(item,form[slither][item.keyName],slither,item)"
                  :key="index"
                  :type="item.type"
                  :label="item.label"
                  :readonly="item.readonly"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder">
                  <div class="zl-button" v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
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
              <div v-for="child in item.children" v-if="!child.hidden">
                <div v-if="child.type">
                  <div class="items-center">
                    <zl-input
                      v-model="form[slither][item.keyName][child.keyName]"
                      :key="index"
                      :type="child.type"
                      :label="child.label"
                      @input="listenInput(slither,item.keyName)"
                      :placeholder="child.placeholder">
                      <div class="zl-button" v-if="child.button">{{child.button}}</div>
                      <div class="unit" v-if="child.unit">{{child.unit}}</div>
                    </zl-input>
                  </div>
                  <div class="prompts" v-if="child.prompts">{{child.prompts}}</div>
                </div>
                <div v-else>
                  <Upload :file="child" :getImg="album[child.keyName]" :close="!closePhoto"
                          @success="getImgDataObj"></Upload>
                </div>
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
                <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
              </div>
              <!--上传-->
              <div v-else-if="item.picker === 'upload' && item.value" class="uploadForm">
                <div v-for="upload in item.value" class="flex">
                  <Upload :file="upload" :getImg="album[upload.keyName]" :close="!closePhoto"
                          @success="getImgData"></Upload>
                </div>
              </div>
              <!--普通输入框-->
              <div v-else-if="item.keyName === 'other_fee'">
                <div v-for="(val,num) in item.value">
                  <zl-input
                    :key="index"
                    v-model="form[item.keyName][num]"
                    :type="item.type"
                    :label="item.label + (myUtils.DX(num+1))"
                    @input="listenInput(item.keyName)"
                    :placeholder="item.placeholder">
                    <div v-if="item.button && item.value.length > 1">
                      <van-icon name="cross" color="#4570FE" size=".36rem"
                                @click='removeChange(slither,item.keyName,index,num)'/>
                    </div>
                  </zl-input>
                </div>
                <div :class="item.keyName">
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
            <p class="btn deliver" @click="saveReport(1)">草稿</p>
            <p class="btn" @click="saveReport(0)">发布</p>
          </div>
        </footer>
      </div>
    </div>
    <div class="changeTag justify-center">
      <i v-for="(item,index) in allReportNum" :class="{'hover': slither === index}" @click="changeTag(index)"></i>
    </div>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></choose-time>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--有input picker-->
    <delivery-picker-slot :module="popupModule" :pickers="pickers" :drawing="drawSlither" :postData="form"
                          :formData="formatData"
                          :popup="popupStatus" @close="onConfirm"></delivery-picker-slot>
    <!--分类选择-->
    <delivery-picker :module="deliveryModule" :pickers="pickers" :form="form" :formData="formatData"
                     @close="onConfirm"></delivery-picker>
  </div>
</template>

<script>
  import DeliveryPicker from './deliveryPicker.vue'
  import DeliveryPickerSlot from './delivery-picker-slot.vue'

  export default {
    name: "index",
    components: {DeliveryPicker, DeliveryPickerSlot},
    data() {
      return {
        mainTop: ['客厅', '厨房/阳台/卫生间', '主卧', '次卧', '费用交接'],
        slither: 0,
        startClientX: 0,
        endClientX: 0,
        allReportNum: 0,
        popupStatus: '',
        pickerModule: false,
        deliveryModule: false,
        popupModule: false,
        timeModule: false,
        pickers: {
          title: '',                        //picker标题
          type: '',                         //字典类型
          keyName: '',                      //字段名
          childKeys: [],                    //字段名
          parentKey: '',                    //父级 字段名 变化有picker
          columns: [],                      //下拉框选择文本列表
          ids: [],                          //当前字典所有id
          index: '',                        //变化下标
        },
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
      }
    },
    created() {
    },
    mounted() {
    },
    activated() {
      this.resetting();
      this.allReportNum = Object.keys(this.drawSlither).length;
      let top = this.$refs.top.offsetHeight + 30;
      let main = this.$refs.main.offsetWidth + "px";
      this.mainWidth = {minWidth: main, maxWidth: main};
      this.slitherCss = this.mainListHeight(top);
      this.slitherCss.width = this.allReportNum + '00%';
    },
    watch: {},
    computed: {
      allDetail() {
        return this.$store.state.app.allDetail;
      }
    },
    methods: {
      changeTag(index) {
        this.slither = index;
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
      // 监听输入框
      listenInput(val) {
      },
      // 其他费用
      addChange(slither, name, index, value) {
        this.drawSlither[slither][index].value.push(value);
        this.form[name].push('');
      },
      // 其他费用
      removeChange(slither, name, index, num) {
        this.drawSlither[slither][index].value.splice(num, 1);
        this.form[name].splice(num, 1);
      },
      // 下拉选择
      choosePicker(item, value = '', parentKey = '', child) {
        this.popupStatus = item.picker;
        if (item.status === 'child') {

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
          this.pickers.title = child.label;
          this.pickers.parentKey = parentKey;
          this.pickers.keyName = item.keyName;
          this.pickers.childKeys = item.childKeys;
          this.popupModule = true;
        } else if (item.status === 'date') {
          this.chooseTime(item, value);
        } else {
          this.pickerModule = true;
          this.pickers = this.inputSelect(this.pickers, item, value, parentKey);
        }
      },
      // 确认选择
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
          this.isBadShowHidden(form);
        }
      },
      isBadShowHidden() {
        let list = this.drawSlither;
        for (let item of Object.keys(list)) {
          for (let key of list[item]) {
            if (key.status === 'child') {
              if (key.children) {
                if (this.form[item][key.keyName].is_bad === 1) {
                  for (let val of key.children) {
                    val.hidden = false;
                  }
                } else {
                  this.form[item][key.keyName].bad_number = 0;
                  for (let val of key.children) {
                    val.hidden = true;
                  }
                }
              }
            }
          }
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
        this.form[val.dateKey] = val.dateVal;
        this.formatData[val.dateKey] = val.dateVal;
        this.onCancel();
      },
      // close Module
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.deliveryModule = false;
      },
      // 图片
      getImgDataObj(val, file) {
        let key = file.slither;
        this.form[key][file.keyName]['photo'] = val[1];
      },
      // 图片
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      saveReport(val) {
        this.form.is_draft = val;
        switch (val) {
          case 0:
            this.$httpZll.postDeliveryReceipt(this.form).then(res => {

            });
            break;
          case 1:
            break;
          case 2:
            this.resetting();
            break;
        }
        console.log(this.form);
      },
      resetting() {
        this.slither = 0;
        this.closePhoto = true;
        setTimeout(_ => {
          this.closePhoto = false;
        }, 100);
        this.drawSlither = this.jsonClone(defineArticleReceipt);
        for (let item of Object.keys(this.drawSlither)) {
          if (item !== 'slither') {
            this.form[item] = {};
            this.formatData[item] = {};
          }
          for (let key of this.drawSlither[item]) {
            if (key.status === 'child') {
              this.form[item][key.keyName] = key.keyType;
              this.formatData[item][key.keyName] = '';
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
                for (let pic of key.value) {
                  this.form[pic.keyName] = [];
                }
              } else {
                this.form[key.keyName] = key.keyType;
                this.formatData[key.keyName] = key.keyType;
              }
            }
          }
        }
        this.form.task_id = this.allDetail.task_id;
        this.form.house_id = this.allDetail.house_id;//房屋ID
        if (this.allDetail.ewal_contract) {
          this.form.contract_id = JSON.parse(this.allDetail.ewal_contract).v3_contract_id;//合同ID
        } else {
          this.form.contract_id = '';
        }
        this.form.collect_or_rent = '1';//收租标记
        this.form = Object.assign({}, this.form);
      },
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

    .top {
      padding: 0 .5rem;
      background-color: #4570FE;
      height: 2.2rem;
      @include flex('justify-bet');

      div {
        @include flex();
        flex-wrap: wrap;

        p {
          margin-right: .15rem;
          width: 1.5rem;
          height: .6rem;
          background-color: #448aff;
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
        background-color: #CF2E33;
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

      .transition2 {
        .slide1 {
          @include transform(translateX(-50%));
        }
      }

      .transition3 {
        .slide1 {
          @include transform(translateX(-33.33%));
        }

        .slide2 {
          @include transform(translateX(-66.33%));
        }
      }

      .transition4 {
        .slide1 {
          @include transform(translateX(-25%));
        }

        .slide2 {
          @include transform(translateX(-50%));
        }

        .slide3 {
          @include transform(translateX(-75%));
        }
      }

      .transition5 {
        .slide1 {
          @include transform(translateX(-20%));
        }

        .slide2 {
          @include transform(translateX(-40%));
        }

        .slide3 {
          @include transform(translateX(-60%));
        }

        .slide4 {
          @include transform(translateX(-80%));
        }
      }

      ul {
        height: 100%;
        padding-right: .2rem;
        @include scroll;

        li {
          .other_fee {
            span {
              display: inline-block;
              margin-left: 1.8rem;
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
