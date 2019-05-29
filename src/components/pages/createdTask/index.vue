<template>
  <div id="createdTask">
    <div class="createdTask">
      <div class="taskTop" ref="taskTop"></div>
      <div class="main" :style="mainHeight">
        <div class="taskType">
          <label>任务类型</label>
          <div @click="changeTaskType = !changeTaskType">
            <p>{{postShowName}}</p>
            <i :class="[changeTaskType ? '' : 'downSelect']"></i>
          </div>
        </div>
        <div class="radioChecks" :class="[changeTaskType?'show':'hidden']">
          <div v-for="item in highList" class="contents">
            <p @click="checkChoose(item)" :class="{'chooseCheck': postName === item.id}">
              {{item.text}}
            </p>
          </div>
        </div>
        <div>
          <!--显示formatData -->
          <div v-if="item.showForm === 'formatData' || item.picker" v-for="(item,index) in drawSlither">
            <!--select 下拉选择-->
            <zl-input
              v-if="!item.pickerRead"
              v-model="formatData[item.keyName]"
              @focus="choosePicker(item,form[item.keyName],item.keyName)"
              :key="index"
              :type="item.type"
              :label="item.label"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :placeholder="item.placeholder">
              <div class="zl-button" v-if="item.button">{{item.button}}</div>
              <div class="unit" v-if="item.unit">{{item.unit}}</div>
            </zl-input>
            <zl-input
              v-else
              v-model="form[item.keyName]"
              @focus="choosePicker(item,form[item.keyName],item.keyName)"
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
          <!--文件上传-->
          <div v-else-if="item.picker === 'upload'">
            <div v-for="upload in item.photos" class="flex">
              <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>
            </div>
          </div>
          <!--显示form -->
          <div v-else>
            <!--select 下拉选择-->
            <div v-if="item.disabled">
              <zl-input
                :key="index"
                v-model="form[item.keyName]"
                @focus="choosePicker(item,form[item.keyName],item.keyName)"
                :type="item.type"
                :label="item.label"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
            <!--普通输入框-->
            <div v-else>
              <zl-input
                :key="index"
                v-model="form[item.keyName]"
                :type="item.type"
                :label="item.label"
                :placeholder="item.placeholder">
                <div class="unit" v-if="item.unit">{{item.unit}}</div>
              </zl-input>
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="commonBtn" ref="commonBtn">
        <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="saveSubmit(item.type)">
          {{item.label}}
        </p>
      </div>
    </div>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--有input picker-->
    <picker-slot :module="popupModule" :pickers="pickers" :drawing="drawSlither" :postData="form" :formData="formatData"
                 :popup="popupStatus" @close="onConfirm"></picker-slot>
    <!--no-picker 门牌地址-->
    <no-picker :module="noPickerModule" :drawing="drawSlither" :postData="form" :popup="popupStatus"
               :formData="formatData" @close="onConfirm"></no-picker>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
    <!--房屋地址搜索-->
    <search-house :module="searchHouseModule" :config="searchConfig" @close="getHouse"></search-house>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" :config="staffConfig" @close="getStaffInfo"></search-staff>
    <!--小区搜索-->
    <search-village :module="searchVillageModule" @close="getVillage"></search-village>
  </div>
</template>

<script>
  import SearchHouse from '../../common/searchHouse.vue';
  import NoPicker from '../../common/no-picker.vue';
  import SearchStaff from '../../common/searchStaff.vue';
  import SearchVillage from '../../common/searchVillage.vue';

  export default {
    name: "index",
    components: {NoPicker, SearchStaff, SearchVillage, SearchHouse},
    data() {
      return {
        touchStartTime: 0,      //触摸开始时间
        touchEndTime: 0,        //触摸结束时间
        touchLastTime: 0,       //最后一次点击时间
        mainHeight: '',
        changeTaskType: false,
        postName: 'CollectTakeLook',
        postShowName: '收房带看',
        highList: [
          {
            id: 'CollectTakeLook',
            text: '收房带看',
          }, {
            id: 'RentTakeLook',
            text: '租房带看',
          }, {
            id: 'HouseCleaning',
            text: '保洁任务',
          }, {
            id: 'HouseRepair',
            text: '维修任务',
          }
        ],
        buttons: [
          {
            label: '取消',
            type: 'back'
          },
          {
            label: '重置',
            type: 'reset'
          },
          {
            label: '创建',
            type: 'submit'
          },
        ],
        album: {},
        form: {},
        formatData: {},
        showData: {
          dateVal: '',                  //日期
          dateKey: '',                  //日期 字段名
          dateType: '',                 //日期类型 默认date 时分datetime
          dateIdx: '',                  //日期字段下标 变化情况使用
        },
        timeModule: false,              //popup 日期选择
        popupModule: false,             //popup 模态框
        noPickerModule: false,          //popup 模态框
        popupStatus: '',                //popup 模态框
        pickerModule: false,            //正常 select 下拉框
        pickers: {},
        drawSlither: [],
        searchStaffModule: false,//员工搜索
        staffConfig: {},//员工搜索 配置
        searchConfig: {},
        // 小区搜索
        searchVillageModule: false,
        // 搜索房屋
        searchHouseModule: false,
      }
    },
    mounted() {
      let taskTop = this.$refs.taskTop.offsetHeight;
      let commonBtn = this.$refs.commonBtn.offsetHeight;
      this.mainHeight = this.mainListHeight((taskTop + commonBtn));
    },
    activated() {
      let query = this.$route.query;
      this.checkChoose(query);
    },
    watch: {},
    computed: {},
    methods: {
      //房屋搜索
      getHouse(val, config) {
        this.onCancel();
        if (val !== 'close') {
          this.form[config.keyName] = [val.id];
          this.formatData[config.keyName] = val.name;
        }
      },
      // 小区搜索
      getVillage(val) {
        this.onCancel();
        if (val !== 'close') {
          this.form.community_id = val.id;
          this.form.community_name = val.name;
          this.formatData.community_name = val.name;
        }
      },
      // 选择任务类型 show hidden
      checkChoose(item) {
        this.postName = item.id || 'CollectTakeLook';
        this.postShowName = item.text || '收房带看';
        this.changeTaskType = false;
        this.resetting();
      },
      // 图片上传
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 提交 重置 取消
      saveSubmit(val = '') {
        switch (val) {
          case 'submit'://提交
            this.$httpZll.createdTask(this.form, this.postName).then(res => {
              if (res.success) {
                this.resetting();
                this.$router.go(-1);
              }
            });
            break;
          case 'reset'://重置
            this.resetting();
            break;
          case 'back'://取消
            this.$router.go(-1);
            this.resetting();
            break;
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
      // 员工搜索结果
      getStaffInfo(val, all) {
        this.onCancel();
        if (val !== 'close') {
          if (this.staffConfig) {
            let key = this.staffConfig.keys || 'staff_name';
            this.form[key] = val.id;
            this.formatData[key] = val.name;
            this.staffConfig.preFill = all;
            dicties.primary = {};
            if (all.length === 1) {
              this.form.primary = all[0].id;
              this.formatData.primary = all[0].name;
              dicties.primary[all[0].id] = all[0].name;
            } else {
              this.form.primary = '';
              this.formatData.primary = '';
              for (let item of all) {
                dicties.primary[item.id] = item.name;
              }
            }
          } else {
            switch (this.postName) {
              case 'HouseCleaning':
              case 'HouseRepair':
                this.form.receive_id = val.staff_id;
                this.formatData.receive_id = val.staff_name;
                break;

            }
          }
        }
      },
      // 搜索 员工 小区 房屋
      choosePicker(val, value, num = '', parentKey = '') {
        this.popupStatus = val.picker;
        switch (val.picker) {
          case 'picker':
            this.pickerModule = true;
            this.inputSelect(val, num, parentKey).then(picker => {
              this.pickers = picker;
            });
            break;
          case 'date':
            this.chooseTime(val, value);
            break;
          case 'searchHouse':
            this.searchHouseModule = true;
            this.searchConfig = val;
            break;
          case 'searchStaff':
            this.searchStaffModule = true;
            break;
          case 'searchVillage':
            this.searchVillageModule = true;
            break;
          case 'noPicker':
            this.noPickerModule = true;
            break;
          default:
            this.popupModule = true;
            this.inputSelect(val, num, parentKey).then(picker => {
              this.pickers = picker;
            });
            break;
        }
      },
      // 确认选择
      onConfirm(value, show) {
        this.onCancel();
        if (value !== 'close') {
          this.form = value;
          this.formatData = show;
        }
      },
      // 关闭模态框
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.noPickerModule = false;
        this.searchStaffModule = false;
        this.searchHouseModule = false;
        this.searchVillageModule = false;
      },
      // 初始化数据
      resetting() {
        this.drawSlither = this.jsonClone(defineNewTask[this.postName]);
        let all = this.initFormData(this.drawSlither, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        this.album = all.album;
        if (this.postName === 'CollectTakeLook' || this.postName === 'RentTakeLook') {
          this.staffConfig = {//员工搜索 配置
            num: 3,
            preFill: [],
            keys: 'take_peoples',
          };
        } else {
          this.staffConfig = {};
        }
        // this.form.primary = 69;
        // this.form.take_peoples = [69];
        // this.form = {
        //   area: "122",
        //   community_id: 446,
        //   community_name: "太平北路122号",
        //   customer_name: "张琳琳",
        //   contact_phone: "18052001167",
        //   property_type: {id: "419", name: "住宅"},
        //   decorate: {id: "405", name: "毛坯"},
        //   direction: {id: "1", name: "东"},
        //   door_address: ["12", "33", "44"],
        //   floor: 3,
        //   floors: 18,
        //   house_type: [2, 2, 2],
        //   primary: 69,
        //   take_peoples: [69],
        // };
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #createdTask {
    background-color: #F8F8F8;

    .createdTask {
      .taskTop {
        height: .8rem;
        @include bgImage('../../../assets/image/add/toubupolang.png');
      }

      .main, .commonBtn {
        background-color: #FFFFFF;
      }

      .main {
        @include scroll;
        margin: 0 .3rem;
        padding: 0 .3rem;

        .taskType {
          @include flex('items-center');
          min-height: .88rem;

          label {
            min-width: 2.4rem;
            text-align: right;
          }

          div {
            @include flex('items-bet');
            width: 100%;

            p {
              width: 80%;
              padding: 0 .3rem;
            }

            i {
              width: .4rem;
              height: .4rem;
              @include bgImage('../../../assets/image/toBeDone/downselect.png');
              @include transition(all .51s);
            }

            .downSelect {
              @include transform(rotateZ(-180deg));
            }
          }
        }

        /*显示单选框*/
        .radioChecks {
          padding: 0 0 0 1rem;
          @include transform(translateX(100%));
          transition: all .6s;
          opacity: 0;

          .contents {
            width: 33.33%;
          }
        }

        .hidden {
          height: 0;
          opacity: 0;
          @include transform(translateX(100%));
        }

        .show {
          height: 1.6rem;
          opacity: 1;
          @include transform(translateX(0));
        }
      }

      .commonBtn {
        padding: .3rem;
      }
    }
  }
</style>
