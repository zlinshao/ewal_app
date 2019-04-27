<template>
  <div id="createdTask">
    <div class="createdTask">
      <div class="taskTop" ref="taskTop"></div>
      <div class="main" :style="mainHeight">
        <div class="taskType">
          <label>任务类型</label>
          <div @click="changeTaskType = !changeTaskType">
            <input type="text" placeholder="选择类型" v-model="postShowName" readonly>
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
          <div v-if="item.showForm === 'formatData'" v-for="(item,index) in drawSlither[postName]">
            <!--select 下拉选择-->
            <div v-if="(item.picker && item.readonly) || item.disabled">
              <zl-input
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
              <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
            </div>
          </div>
          <!--显示form -->
          <div v-else>
            <!--select 下拉选择-->
            <div v-if="(item.picker && item.readonly) || item.disabled">
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
    <picker-slot :module="popupModule" :pickers="pickers" :drawing="drawForm" :postData="form" :formData="formatData"
                 :popup="popupStatus" @close="onConfirm"></picker-slot>
    <!--no-picker 门牌地址-->
    <no-picker :module="noPickerModule" :drawing="drawForm" :postData="form" :popup="popupStatus"
               :formData="formatData" @close="onConfirm"></no-picker>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></choose-time>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" :config="staffConfig" @close="getStaffInfo"></search-staff>
    <!--小区搜索-->
    <search-village :module="searchVillageModule" @close="getVillage"></search-village>
  </div>
</template>

<script>
  import NoPicker from '../../common/no-picker.vue';
  import SearchStaff from '../../common/searchStaff.vue';
  import SearchVillage from '../../common/searchVillage.vue';

  export default {
    name: "index",
    components: {NoPicker, SearchStaff, SearchVillage},
    data() {
      return {
        touchStartTime: 0,      //触摸开始时间
        touchEndTime: 0,        //触摸结束时间
        touchLastTime: 0,       //最后一次点击时间
        mainHeight: '',
        changeTaskType: false,
        postName: 'CollectTakeLook',
        postShowName: '收房待办',
        highList: [
          {
            id: 'CollectTakeLook',
            text: '收房待办',
          }, {
            id: 'RentTakeLook',
            text: '租房待办',
          }, {
            id: 3,
            text: '尾款跟进',
          }, {
            id: 4,
            text: '房源跟进',
          }, {
            id: 5,
            text: '资料补齐',
          }, {
            id: 6,
            text: '贴条换锁',
          }, {
            id: 7,
            text: '房屋交接',
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
        pickers: {
          title: '',                    //picker标题
          type: '',                     //字典类型
          keyName: '',                  //字段名
          parentKey: '',                //父级 字段名 变化有picker
          columns: [],                  //下拉框选择文本列表
          ids: [],                      //当前字典所有id
          index: '',                    //变化下标
        },

        drawForm: [],                   //表单集合
        resetDrawing: [],               //clone 重置使用
        drawSlither: {                  //表单渲染 json
          // 收房带看
          CollectTakeLook: [
            {
              label: '小区名称',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'community_name',
              keyType: [],
              type: 'text',
              status: '',
              picker: 'searchVillage',
              slot: '',
            },
            {
              label: '门牌地址',
              placeholder: '必填 请填写',// placeholder
              readonly: 'readonly',
              keyName: 'door_address',
              keyType: [],
              type: 'text',
              status: '',
              picker: 'noPicker',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
              moreArray: [
                {
                  label: '栋',
                  placeholder: '必填',
                  type: 'text',
                  keyType: '',
                  status: '',
                  slot: '',
                },
                {
                  label: '单元',
                  placeholder: '必填',
                  type: 'text',
                  keyType: '',
                  status: '',
                  slot: '',
                },
                {
                  label: '门牌号',
                  placeholder: '必填',
                  type: 'text',
                  keyType: '',
                  status: '',
                  slot: '',
                },
              ],
            },
            {
              label: '客户姓名',
              placeholder: '必填 请输入',
              keyName: 'customer_name',
              keyType: '',
              type: 'text',
              button: '银行卡识别',
              icon: 'identity',
              status: '',
              slot: '',
            },
            {
              label: '客户电话',
              placeholder: '必填 请输入',
              keyName: 'customer_phone',
              keyType: '',
              type: 'number',
              status: '',
              slot: '',
            },
            {
              label: '房屋类型',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'property_type',
              keyType: '',
              type: 'text',
              status: 'obj',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '户型',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'house_type',
              keyType: [],
              type: 'text',
              status: 'arrs-0-1-1',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '面积',
              placeholder: '必填 请输入',
              readonly: 'readonly',
              keyName: 'area',
              keyType: '',
              type: 'number',
              status: '',
              unit: '平米',
              picker: 'pickerSlot',
              pickerRead: 'no',
              slot: '',
            },
            {
              label: '装修',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'decorate',
              keyType: '',
              type: 'text',
              status: 'obj',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '朝向',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'direction',
              keyType: '',
              type: 'text',
              status: 'obj',
              showForm: 'formatData',//picker 显示form 或 formatData
              picker: 'pickerSlot',
              slot: '',
            },
            {
              label: '楼层',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'floors',
              keyType: [],
              type: 'text',
              status: 'arrs-3-0',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '带看人',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'take_peoples',
              keyType: [],
              type: 'text',
              status: '',
              picker: 'searchStaff',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '主带看人',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'primary',
              keyType: [],
              type: 'text',
              status: 'objInt',
              picker: 'picker',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
          ],
          RentTakeLook: [
            {
              label: '客户姓名',
              placeholder: '必填 请输入',
              keyName: 'customer_name',
              keyType: '',
              type: 'text',
              button: '银行卡识别',
              icon: 'identity',
              status: '',
              slot: '',
            },
            {
              label: '客户电话',
              placeholder: '必填 请输入',
              keyName: 'contact_phone',
              keyType: '',
              type: 'text',
              status: '',
              slot: '',
            },
            {
              label: '户型',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'house_type',
              keyType: [],
              type: 'text',
              status: 'arrs-0-1-1',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '面积',
              placeholder: '必填 请输入',
              readonly: 'readonly',
              keyName: 'area',
              keyType: '',
              type: 'number',
              status: '',
              unit: '平米',
              picker: 'pickerSlot',
              pickerRead: 'no',
              slot: '',
            },
            {
              label: '装修',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'decorate',
              keyType: '',
              type: 'text',
              status: 'obj',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
            {
              label: '朝向',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'direction',
              keyType: '',
              type: 'text',
              status: 'obj',
              showForm: 'formatData',//picker 显示form 或 formatData
              picker: 'pickerSlot',
              slot: '',
            },
            {
              label: '楼层',
              placeholder: '必填 请选择',
              readonly: 'readonly',
              keyName: 'floors',
              keyType: [],
              type: 'text',
              status: 'arrs-3-0',
              picker: 'pickerSlot',
              showForm: 'formatData',//picker 显示form 或 formatData
              slot: '',
            },
          ],
        },
        searchStaffModule: false,       //员工搜索
        staffConfig: {                  //员工搜索 配置
          num: 3,
          preFill: [],
          keys: 'take_peoples',
        },
        // 小区搜索
        searchVillageModule: false,
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
      let taskTop = this.$refs.taskTop.offsetHeight;
      let commonBtn = this.$refs.commonBtn.offsetHeight;
      this.mainHeight = this.mainListHeight((taskTop + commonBtn));
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {
      // 小区搜索
      getVillage(val) {
        this.onCancel();
        if (val !== 'close') {
          this.form.community_id = val.id;
          this.form.community_name = val.name;
        }
      },
      // 选择类型 show hidden
      checkChoose(item) {
        this.postShowName = item.text;
        this.postName = item.id;
        this.changeTaskType = !this.changeTaskType;
      },
      saveSubmit(val = '') {
        switch (val) {
          case 'submit'://提交
            this.$http.createdTask(this.form, this.postName).then(res => {
              if (res.success) {
                this.resetting();
                this.routerReplace('/toBeDone', {}, 'goBack');
              }
            });
            break;
          case 'reset'://重置
            this.resetting();
            break;
          case 'cancel'://取消
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
        this.form[val.dateKey] = val.dateVal;
        this.onCancel();
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
            for (let key of Object.keys(val)) {
              this.form[key] = val[key];
            }
          }
        }
      },
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.noPickerModule = false;
        this.searchStaffModule = false;
        this.searchVillageModule = false;
      },
      // show picker
      choosePicker(val, date, num = '', parentKey = '') {
        // 搜索
        if (val.picker.includes('search')) {
          switch (val.picker) {
            case 'searchStaff':
              this.searchStaffModule = true;
              return;
            case 'searchVillage':
              this.searchVillageModule = true;
              return;
          }
        }
        // 日期
        if (val.status === 'date') {
          this.chooseTime(val, date);
          return;
        }
        this.popupStatus = val.picker;
        if (val.picker === 'picker') {
          this.pickerModule = true;
        } else if (val.picker === 'noPicker') {
          this.noPickerModule = true;
          return;
        } else {
          this.popupModule = true;
        }
        if (val.pickerRead) return;
        this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
      },
      // 确认选择
      onConfirm(value, show) {
        this.onCancel();
        if (value !== 'close') {
          this.form = value;
          this.formatData = show;
        }
      },
      // 初始化数据
      resetting() {
        this.drawForm = this.jsonClone(this.drawSlither[this.postName]);
        let all = this.initFormData(this.drawForm, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        this.staffConfig = {                  //员工搜索 配置
          num: 3,
          preFill: [],
          keys: 'take_peoples',
        };
        this.form = {
          area: "122",
          community_id: 446,
          community_name: "太平北路122号",
          customer_name: "发送",
          contact_phone: "12321312",
          property_type: {id: "419", name: "住宅"},
          decorate: {id: "405", name: "毛坯"},
          direction: {id: "1", name: "东"},
          door_address: ["12", "33", "44"],
          floor: 3,
          floors: 18,
          house_type: [2, 2, 2],
          primary: 60,
          take_peoples: [60],
        };
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
            input {
              width: 80%;
              display: inline-block;
              padding: 0 .3rem;
            }
            i {
              width: .4rem;
              height: .4rem;
              @include bgImage('../../../assets/image/toBeDone/downselect.png');
              @include transition(all .5s);
            }
            .downSelect {
              @include transform(rotateZ(-180deg));
            }
          }
        }
        /*显示单选框*/
        .radioChecks {
          padding: 0 0 0 1rem;
          transform: translateX(100%);
          transition: transform 1s;
          opacity: 0;
          .contents {
            width: 33.33%;
          }
        }
        .hidden {
          height: 0;
        }
        .show {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .commonBtn {
        height: 1.2rem;
      }
    }
  }
</style>
