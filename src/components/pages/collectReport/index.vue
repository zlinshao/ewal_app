<template>
  <div id="collectReport">
    <div class="collectReport" :class="['bgBanner-' + (slither + 1)]">
      <div>
        <div class="bulletinTitle" ref="title">
          <label>{{mainTop[slither]}}</label>
          <p v-if="allReportNum > 1">
            <i v-for="(i,idx) in allReportNum" :class="{'hover': idx === slither}" @click="slither = idx"></i>
          </p>
        </div>
        <div class="mainRadius" :class="['mainRadius'+allReportNum]" ref="main"
             @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
          <div class="justify-around transition" :class="['slide' + slither]" :style="[slitherCss]">
            <div class="main" :style="[mainWidth]" v-for="slither in Object.keys(drawSlither)">
              <!--显示formatData -->
              <div v-if="item.showForm === 'formatData'" v-for="(item,index) in drawSlither[slither]">
                <!--select 下拉选择-->
                <zl-input
                  v-model="formatData[item.keyName]"
                  @focus="choosePicker(item,form[item.keyName])"
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
              <!--显示form -->
              <div v-else>
                <!--select 下拉选择-->
                <div v-if="(item.picker && item.readonly) || item.disabled">
                  <zl-input
                    :key="index"
                    v-model="form[item.keyName]"
                    @focus="choosePicker(item,form[item.keyName])"
                    :type="item.type"
                    :label="item.label"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder">
                    <div class="zl-confirmation" :class="[item.icon]" v-if="item.button">
                      <i :class="item.icon" v-if="item.icon"></i>{{item.button}}
                    </div>
                    <div class="unit" v-if="item.unit">{{item.unit}}</div>
                  </zl-input>
                  <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
                </div>
                <!--家电-->
                <div v-else-if="item.picker === 'electrical'" class="electrical flex">
                  <label class="labelTitle">{{item.label}}</label>
                  <div class="justify-around">
                    <div v-for="(key,index) in item.value">
                      <h1 @click="electricalModule = true">
                        <span :class="['electrical-' + (index + 1)]"></span>
                      </h1>
                      <p>{{form[key.key]}}</p>
                    </div>
                  </div>
                </div>
                <!--上传-->
                <div v-else-if="item.picker === 'upload' && item.value" class="uploadForm">
                  <div v-for="upload in item.value" class="flex">
                    <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>
                  </div>
                </div>
                <!--备注条款-->
                <div v-else-if="item.picker === 'remark_terms'" class="remark_terms flex">
                  <zl-input
                    :key="index"
                    v-model="formatData[item.keyName]"
                    @focus="choosePicker(item)"
                    :type="item.type"
                    :label="item.label"
                    readonly="readonly"
                    :placeholder="item.placeholder">
                  </zl-input>
                </div>
                <!--增加附属租客-->
                <div class="addCustomer" v-else-if="item.picker === 'addCustomer' && !showCustomer"
                     @click="showCustomer = true">{{item.button}}
                </div>
                <!--变化-->
                <div v-else-if="item.picker && item.picker.includes('change')">
                  <div v-for="(change,num) in item.children" v-if="showCustomer || item.picker === 'changePrice'">
                    <div class="items-bet payWayChange"
                         v-if="item.children.length > 1 || item.picker === 'changeCustomer'">
                      <div class="items-center">
                        <p>第{{(myUtils.DX(num+1))}}{{item.pickerText}}</p>
                        <van-icon name="cross" color="#4570FE" size=".36rem"
                                  @click='removeChange(slither,item.keyName,index,num)'/>
                      </div>
                      <div class="zl-button" @click="changeInput(slither,item.keyName,index,item.children[0])"
                           v-if="num === (item.children.length - 1)">
                        {{item.button}}
                      </div>
                    </div>
                    <div v-for="(key,idx) in change" v-if="key.showForm === 'formatData'">
                      <zl-input
                        v-if="(key.picker && key.readonly) || key.disabled"
                        v-model="formatData[item.keyName][num][key.keyName]"
                        @focus="choosePicker(key,form[item.keyName][num][key.keyName],num,item.keyName)"
                        :key="idx"
                        :type="key.type"
                        :label="key.label"
                        :readonly="key.readonly"
                        :disabled="key.disabled"
                        :placeholder="key.placeholder">
                        <div class="unit" v-if="item.unit">{{item.unit}}</div>
                        <div class="zl-button" v-if="key.button && item.children.length < 2"
                             @click="changeInput(slither,item.keyName,index,change)">
                          {{key.button}}
                        </div>
                      </zl-input>
                      <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
                    </div>
                    <div v-else>
                      <zl-input
                        v-if="((key.picker && key.readonly) || key.disabled) && key.length !== form[item.keyName].length"
                        v-model="form[item.keyName][num][key.keyName]"
                        @focus="choosePicker(key,form[item.keyName][num][key.keyName],num,item.keyName)"
                        :key="num"
                        :type="key.type"
                        :label="key.label"
                        :readonly="key.readonly"
                        :disabled="key.disabled"
                        :placeholder="key.placeholder">
                        <div class="unit" v-if="key.unit">{{key.unit}}</div>
                      </zl-input>
                      <zl-input
                        v-else-if="key.length !== form[item.keyName].length"
                        :key="num"
                        v-model="form[item.keyName][num][key.keyName]"
                        :type="key.type"
                        :label="key.label"
                        @input="listenInput(item.keyName)"
                        :placeholder="key.placeholder">
                        <div class="zl-button" v-if="key.button && item.children.length < 2"
                             @click="changeInput(slither,item.keyName,index,change)">
                          {{key.button}}
                        </div>
                        <div class="unit" v-if="item.unit">{{item.unit}}</div>
                      </zl-input>
                      <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
                    </div>
                  </div>
                </div>
                <!--普通输入框-->
                <div v-else>
                  <div class="items-center" v-if="item.keyName && item.moreString">
                    <label class="labelTitle">{{item.label}}</label>
                    <zl-input
                      v-if="item.moreString"
                      v-for="(string,num) in item.moreString"
                      :key="num"
                      v-model="form[string.keyName]"
                      :type="string.type"
                      :label="string.label"
                      @input="listenInput(string.keyName)"
                      :placeholder="string.placeholder">
                    </zl-input>
                  </div>
                  <div v-if="item.keyName && !item.moreString">
                    <zl-input
                      v-if="!item.hidden"
                      :key="index"
                      v-model="form[item.keyName]"
                      :type="item.type"
                      :label="item.label"
                      @input="listenInput(item.keyName)"
                      :placeholder="item.placeholder">
                      <div class="zl-confirmation" :class="[item.icon]"
                           v-if="item.button" @click="confirmation(item.icon)">
                        <i :class="item.icon" v-if="item.icon"></i>
                        {{item.button}}
                      </div>
                      <div class="unit" v-if="item.unit">{{item.unit}}</div>
                    </zl-input>
                  </div>
                  <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--底部按钮-->
      <div class="footer footerLeft" :class="{'footerStatic': keyUpStatus}" v-if="!queryData.revise">
        <div class="items-center">
          <span @click="saveReport(1)">草稿</span>
          <span @click="saveReport(2)" class="resetting">重置</span>
        </div>
      </div>
      <div class="footer footerRight" :class="{'footerStatic': keyUpStatus}">
        <span @click="saveReport(3)" v-if="queryData.revise">修改</span>
        <span @click="saveReport(0)" v-else>发布</span>
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
      <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
      <!--家电选择-->
      <Electrical :module="electricalModule" :form="form" :list="electricalList" @close="closeElectrical"></Electrical>
      <!--复选 非房东费用-->
      <check-choose :module="checksModule" :list="checksList" :form="form" :formData="formatData"
                    @close="onCheckChoose"></check-choose>
      <!--唯一标识码-->
      <float-button ref="code" :type="'payable'"></float-button>
      <!--备注条款-->
      <remark-terms :module="remarkTermsModule" :form="form" :formData="formatData"
                    @close="closeTermsModule"></remark-terms>
      <!--小区搜索-->
      <!--<search-village :module="searchModule" :config="searchConfig" @close="getVillage"></search-village>-->
      <!--员工搜索-->
      <!--<search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>-->
      <!--部门选择-->
      <!--<search-depart :module="searchDepartModule" @close="getDepartInfo"></search-depart>-->
    </div>
  </div>
</template>

<script>
  import Electrical from '../../common/electrical.vue'
  // import SearchVillage from '../../common/searchVillage.vue';
  import SearchStaff from '../../common/searchStaff.vue';
  import searchDepart from '../../common/searchDepart.vue';
  import NoPicker from '../../common/no-picker.vue';
  import CheckChoose from '../../common/checkChoose.vue';
  import RemarkTerms from './remarkTerms.vue';

  export default {
    name: "index",
    components: {Electrical, SearchStaff, searchDepart, NoPicker, CheckChoose, RemarkTerms},
    data() {
      return {
        slitherCss: {},
        mainWidth: {},

        album: {},                          //图片
        form: {},
        formatData: {},                     //DOM显示数据
        showData: {
          dateVal: '',                      //日期
          dateKey: '',                      //日期 字段名
          dateType: '',                     //日期类型 默认date 时分datetime
          dateIdx: '',                      //日期字段下标 变化情况使用
        },
        drawForm: [],                       //表单集合
        resetDrawing: {},                   //clone 重置使用
        drawSlither: {},

        remarkTermsModule: false,           //备注条款

        showCustomer: false,                //显示附属房东
        electricalModule: false,            //家电选择
        electricalList: [],                 //家具列表

        timeModule: false,                  //日期选择
        popupModule: false,                 //popup 模态框 下拉框 输入框
        popupStatus: '',                    //popup 模态框 属性名 匹配 显示
        noPickerModule: false,              //popup 模态框 只有输入框
        pickerModule: false,                //正常 select 下拉框
        pickers: {
          title: '',                        //picker标题
          type: '',                         //字典类型
          keyName: '',                      //字段名
          parentKey: '',                    //父级 字段名 变化有picker
          columns: [],                      //下拉框选择文本列表
          ids: [],                          //当前字典所有id
          index: '',                        //变化下标
        },
        // searchStaffModule: false,        //员工搜索
        // searchDepartModule: false,       //部门搜索
        searchConfig: {},

        mainTop: [],
        startClientX: 0,
        endClientX: 0,
        slither: 0,

        checksModule: false,            //复选 非房东费用
        checksList: [],

        electronicContractNumber: '',   //电子合同编号
        allReportNum: 0,//滑动列表数

        queryData: {},
        bulletinType: {},//报备类型
        bulletinDetail: {},//修改/重新发布
        taskDetail: {},//草稿
      }
    },
    activated() {
      this.bulletinType = JSON.parse(sessionStorage.bulletin_type || '{}');
      this.taskDetail = JSON.parse(sessionStorage.task_detail || '{}');
      this.bulletinDetail = JSON.parse(sessionStorage.bulletin_draft || '{}');
      this.bulletin_types(this.bulletinType);
      this.slither = 0;
      this.allReportNum = Object.keys(this.resetDrawing).length;
      let title = this.$refs.title.offsetHeight + 30;
      let main = this.$refs.main.offsetWidth + "px";
      this.mainWidth = {minWidth: main, maxWidth: main};
      this.slitherCss = this.mainListHeight(title);
      this.slitherCss.width = this.allReportNum + '00%';
      this.$prompt('正在加载...', 'send');
      let query = this.$route.query;
      this.queryData = query;
      if (query.revise) {
        this.getRevise();
      } else if (query.again) {
        this.againSave();
      } else {
        this.getDraft();
      }
    },
    watch: {
      'form.month'(val) {
        if (val && this.form.period_price_way_arr.length === 1) {
          this.form.period_price_way_arr[0].period = val;
        }
      },
    },
    computed: {
      keyUpStatus() {// 底部定位
        return this.$store.state.app.key_up_status;
      },
    },
    methods: {
      // 报备类型
      bulletin_types(type) {
        switch (type.bulletin) {
          case 'bulletin_collect_basic':
            this.mainTop = ['房屋信息', '物品信息', '客户信息', '合同信息'];
            this.resetDrawing = this.jsonClone(defineCollectReport);
            break;
          case 'bulletin_rent_basic':
            this.mainTop = ['租房报备'];
            this.resetDrawing = this.jsonClone(defineRentReport);
            break;
          case 'agency':
            this.mainTop = ['渠道费报备'];
            this.resetDrawing = this.jsonClone(defineRentReport);
            break;
        }
        this.resetting();
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
      // 获取电子合同
      electronicContract() {
        let data = {
          city_id: this.form.community.city,
          version: '1.1',
        };
        this.$httpZll.getElectronicContract(data).then(res => {
          this.electronicContractNumber = res.data.number || '';
          this.form.contract_number = this.electronicContractNumber;
        });
      },
      // 计算押金
      countPrice() {
        let bet = Number(this.form.pay_way_bet || 0);
        let price = Number(this.form.period_price_way_arr[0].month_unit_price || 0);
        this.form.deposit = bet * price;
      },
      // 日期计算
      listenInput(key) {
        let begin = this.form.begin_date;//合同开始日期
        switch (key) {
          case 'month':
          case 'day':
          case 'vacancy':
            this.contractEnd(begin);
            break;
          case 'period_price_way_arr':
            this.countPrice();
            this.countChangeDate(key);
            break;
        }
      },
      // 日期计算
      contractEnd(begin_date) {
        if (!begin_date) return;
        let begin = new Date(begin_date);//合同开始日期
        let month = Number(this.form.month || 0);//签约月数
        let day = Number(this.form.day || 0);//签约天数
        let vacancy = Number(this.form.vacancy || 0);//空置期天数
        //空置期结束日期
        this.form.end_date_vacant = this.myUtils.formatAddRem('dd', vacancy, begin);
        // 第一次打款日期
        this.form.pay_first_date = this.myUtils.formatAddRem('dd', 1, new Date(this.form.end_date_vacant));
        // 付款方式变化 日期
        this.changeDateCount(this.form.pay_first_date, this.form.period_price_way_arr, 'period_price_way_arr');
        //合同结束日期
        if (day) {
          let end = this.myUtils.dateAdd('mm', month, begin);
          let dayEnd = this.myUtils.dateAdd('dd', day, end);
          this.form.end_date = this.myUtils.formatDate(dayEnd);
        } else {
          this.form.end_date = this.myUtils.formatAddRem('mm', month, begin);
        }
      },
      // 付款方式变化 日期计算
      changeDateCount(val, arr, key) {
        let value = this.jsonClone(arr);
        value.forEach((item, index) => {
          let period = Number(item.period || 0);
          if (index > 0) {
            value[index].begin_date = value[index - 1].end_date;
          } else {
            value[index].begin_date = val;
          }
          let date = new Date(item.begin_date);
          if (item.begin_date) {
            item.end_date = this.myUtils.formatAddRem('mm', period, date);
          }
          for (let item of Object.keys(value[0])) {
            if (item !== 'pay_way') {
              this.formatData[key][index][item] = value[index][item];
            }
          }
        });
        this.form[key] = value;
        let form = this.form[key][0];
        let first = this.form.pay_first_date;
        if (!first) return;
        let date = new Date(first);
        let pay_way = Number(form.pay_way || 0);
        this.form.pay_second_date = this.myUtils.formatAddRem('mm', pay_way, date);
      },
      // 新增变化
      changeInput(slither, key, index, val) {
        this.drawSlither[slither][index].children.push(val);
        let value = {};
        for (let item of val) {
          value[item.keyName] = item.keyType;
        }
        this.form[key].push(value);
        this.formatData[key].push(value);
        if (key !== 'period_price_way_arr') return;
        this.countChangeDate(key);
      },
      // 删除变化
      removeChange(slither, key, index, num) {
        let draw = this.drawSlither[slither][index];
        if (draw.picker === 'changeCustomer' && draw.children.length === 1) {
          for (let item of Object.keys(this.form[key][num])) {
            this.form[key][num][item] = '';
            this.formatData[key][num][item] = '';
          }
          this.showCustomer = false;
          return;
        }
        this.form[key].splice(num, 1);
        this.formatData[key].splice(num, 1);
        draw.children.splice(num, 1);
        if (draw.picker === 'changeCustomer') return;
        this.countPrice();
        this.countChangeDate(key);
      },
      // 重置变化
      resetChange(key) {
        let value = this.drawSlither;
        for (let item of Object.keys(value)) {
          for (let val of value[item]) {
            if (val.keyName === key) {
              val.children.splice(1);
            }
          }
        }
        this.form[key].splice(1);
        this.formatData[key].splice(1);
        for (let keys of Object.keys(this.form[key][0])) {
          this.form[key][0][keys] = '';
          this.formatData[key][0][keys] = '';
        }
        if (key === 'subsidiary_customer') this.showCustomer = false;
      },
      // 计算日期 公共方法
      countChangeDate(key) {
        let change_end_date = this.form.pay_first_date;
        this.changeDateCount(change_end_date, this.form[key], key);
      },
      // // 员工搜索结果
      // getStaffInfo(val) {
      //   this.onCancel();
      //   if (val !== 'close') {
      //     for (let key of Object.keys(val)) {
      //       this.form[key] = val[key];
      //     }
      //   }
      // },
      // // 部门搜索结果
      // getDepartInfo(val) {
      //   this.onCancel();
      //   if (val !== 'close') {
      //     this.form.department_id = val.id;
      //     this.form.department_name = val.name;
      //   }
      // },
      // 身份认证
      // 认证
      confirmation(val) {
        switch (val) {
          case 'identity':
            let data = {};
            data.customer_name = this.form.customer_name;
            data.idcard = this.form.card_id;
            data.mobile = this.form.contact_phone;
            this.$httpZll.customerIdentity(data).then(res => {
              if (res) {
                if (res.data.fadada_user_id) {
                  this.form.signer = res.data;
                  this.certified();
                } else {
                  this.$ddSkip(res.data.data);
                  this.$dialog('认证', '认证是否完成?').then(res => {
                    if (res) {
                      this.confirmation('identity');
                    }
                  })
                }
              }
            });
            break;
          case 'bank':
            let params = {
              card: this.form.account,
              owner: this.form.account_name,
            };
            this.$httpZll.getBankNameAttestation(params).then(res => {
              this.form.bank = res.data || '';
            });
            break;
        }
      },
      // 已认证
      certified() {
        for (let slither of Object.keys(this.drawSlither)) {
          for (let key of this.drawSlither[slither]) {
            if (key.icon === 'identity') {
              key.button = '已认证';
              key.icon = '';
            }
            let data = ['customer_name', 'contact_phone', 'card_id'];
            if (data.includes(key.keyName)) {
              key.disabled = 'disabled';
            }
          }
        }
        this.form = Object.assign({}, this.form);
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
          if (val.dateKey === 'begin_date') this.contractEnd(val.dateVal);
          if (val.dateKey === 'pay_first_date') this.countChangeDate('period_price_way_arr');
        }
      },
      // show picker
      choosePicker(val, value, num = '', parentKey = '') {
        // show date
        if (val.status === 'date') {
          this.chooseTime(val, value);
          return;
        }
        // 搜索
        // if (val.picker.includes('search')) {
        //   switch (val.picker) {
        //     case 'searchStaff':
        //       this.searchStaffModule = true;
        //       break;
        //     case 'searchDepart':
        //       this.searchDepartModule = true;
        //       break;
        //   }
        //   return;
        // }
        this.popupStatus = val.picker;
        if (val.picker === 'picker') {
          this.pickerModule = true;
        } else if (val.picker === 'noPicker') {
          this.noPickerModule = true;
          return;
        } else if (val.picker === 'non_landlord_fee') {// 非房东费用
          this.checksList = val;
          this.checksModule = true;
          return;
        } else if (val.picker === 'remark_terms') {
          this.remarkTermsModule = true;
          return;
        } else {
          this.popupModule = true;
        }
        if (val.pickerRead) return;//弹窗内 可输入
        this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
      },
      // 确认下拉选择
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
          let name = this.pickers.keyName;
          // input 显示隐藏
          this.inputStatus(name, form);
          // 付款方式变化处理
          if (name === 'pay_way') this.countChangeDate('period_price_way_arr');
          if (name === 'pay_way_bet') this.countPrice();
        }
      },
      // input 显示隐藏
      inputStatus(name, form) {
        if (name === 'is_agency' || name === 'is_electronic_contract') {
          switch (name) {
            case 'is_electronic_contract':
              let num = Number(form['is_electronic_contract']);
              if (num === 0) {
                this.contractDis();
                this.form.contract_number = 'LJSF';
              } else {
                this.contractDis('disabled');
                this.form.contract_number = this.electronicContractNumber;
              }
              break;
            case 'is_agency':
              this.emptyAgencyInfo(form);
              break;
          }
        }
        if (name === 'signatory_identity') {
          this.showCustomer = Number(form[name]) === 2;
        }
      },
      // 合同编号 禁用
      contractDis(val = null) {
        for (let slither of Object.keys(this.drawSlither)) {
          for (let list of this.drawSlither[slither]) {
            if (list.keyName) {
              if (list.keyName === 'contract_number') {
                list.disabled = val;
              }
            }
          }
        }
      },
      // 清空中介信息
      emptyAgencyInfo(form) {
        for (let slither of Object.keys(this.drawSlither)) {
          for (let list of this.drawSlither[slither]) {
            if (list.keyName) {
              if (list.keyName.includes('agency_')) {
                let num = Number(form['is_agency']);
                if (num === 0) {
                  list.hidden = true;
                  this.form[list.keyName] = list.keyType;
                } else {
                  list.hidden = false;
                }
              }
            }
          }
        }
      },
      // 复选 非房东费用
      onCheckChoose(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
        }
      },
      // 家电 确认选择
      closeElectrical(val) {
        if (val !== 'close') {
          for (let key of Object.keys(val)) {
            this.form[key] = val[key];
          }
        }
        this.onCancel();
      },
      // 备注条款
      closeTermsModule(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
        }
      },
      // close Module
      onCancel() {
        // this.searchStaffModule = false;
        // this.searchDepartModule = false;
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.noPickerModule = false;
        this.electricalModule = false;
        this.checksModule = false;
        this.remarkTermsModule = false;
      },
      // 图片上传
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 发布
      saveReport(val) {
        this.form.is_draft = val;
        let bulletin = this.bulletinType;
        if (bulletin.type) {
          this.form.type = bulletin.type;
        }
        // 重置 附属房东变化
        if (this.form.signatory_identity == 1) {
          this.resetChange('subsidiary_customer');
        }
        switch (val) {
          case 0:// 发布
          case 1:// 草稿
            this.form.task_id = this.taskDetail.task_id;
            this.form.process_instance_id = this.taskDetail.process_instance_id;
            // this.form.spot_code = this.$refs.code.spot_code;
            this.form.spot_code = this.$refs.code.spot_code;
            this.$httpZll.submitReport(this.form, bulletin.to).then(res => {
              if (res) {
                if (val === 1) {
                  this.form.id = res.data.id;
                } else {
                  this.resetting();
                  this.$store.dispatch('approval_tabs', {tab: '2', status: 0});
                  this.routerReplace('/approvals');
                }
              }
            });
            break;
          case 2:// 重置
            this.$dialog('重置', '您确定要清空表单吗?').then(status => {
              if (status) {
                this.resetting();
                this.getPunchClockData();
              }
            });
            break;
          case 3:// 修改
            this.form.is_draft = 0;
            this.form.approved_level = this.bulletinDetail.variableName;
            this.form.task_id = this.bulletinDetail.task_id;
            this.form.process_instance_id = this.bulletinDetail.process_instance_id;
            this.$httpZll.putReviseReport(this.form, bulletin.to).then(res => {
              if (res) {
                this.resetting();
                this.$router.go(-1);
              }
            });
            break;
        }
      },
      // 草稿
      getDraft() {
        let params = {};
        params.task_id = this.taskDetail.task_id;
        for (let val of Object.keys(this.bulletinType)) {
          if (val !== 'bulletin') {
            params[val] = this.bulletinType[val];
          }
        }
        this.$httpZll.getBulletinDraft(params).then(data => {
          if (!data) {
            // this.handlePreFill(hhhhhhhhhhhh);
            this.getPunchClockData();
          } else {
            let res = data.data;
            this.form.id = '';//草稿ID
            // this.form = hhhhhhhhhhhh;
            this.handlePreFill(res);
          }
          this.electronicContract();
        });
      },
      // 修改
      getRevise() {
        let res = this.bulletinDetail;
        this.form.spot_code = '';//唯一识别码
        this.form.id = '';
        this.form.process_id = res.process_id || '';//修改ID
        this.handlePreFill(res.content);
      },
      // 重新发布
      againSave() {
        let res = this.bulletinDetail;
        this.form.id = '';
        this.handlePreFill(res.content, 'again');
        this.electronicContract();
      },
      // 获取待办信息
      getPunchClockData() {
        if (!Object.keys(this.taskDetail).length) return;
        let res = this.taskDetail.content;
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          switch (item) {
            case 'community':
              this.formatData[item] = res[item].village_name;
              break;
            case 'door_address'://门牌地址
              let door = this.jsonClone(res[item] || [1, 1, 1]);
              door[0] = door[0] ? door[0] + '栋' : '';
              door[1] = door[1] ? door[1] + '单元' : '';
              door[2] = door[2] ? door[2] : '';
              this.formatData[item] = door.join('');
              break;
            case 'house_type'://户型
              let house = this.jsonClone(res[item] || [1, 1, 1]);
              house[0] = house[0] ? house[0] + '室' : '';
              house[1] = house[1] ? house[1] + '厅' : '';
              house[2] = house[2] ? house[2] + '卫' : '';
              this.formatData[item] = house.join('');
              break;
            case 'decorate'://装修
            case 'direction'://朝向
            case 'property_type'://房屋类型
              this.formatData[item] = res[item].name;
              break;
            case 'floor':
            case 'floors':
              this.formatData.floors = res.floor + ' / ' + res.floors;
              break;
          }
        }
      },
      // 预填数据处理
      handlePreFill(res, status) {
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          switch (item) {
            case 'door_address'://门牌地址
              let door = this.jsonClone(res[item]);
              door[0] = door[0] ? door[0] + '栋' : '';
              door[1] = door[1] ? door[1] + '单元' : '';
              door[2] = door[2] ? door[2] : '';
              this.formatData[item] = door.join('');
              break;
            case 'community'://小区
              this.formatData[item] = res[item].village_name;
              break;
            case 'signer'://认证
              if (res[item]) {
                if (!status) {
                  this.certified();
                }
              }
              break;
            case 'house_type'://户型
              let house = this.jsonClone(res[item]);
              house[0] = house[0] ? house[0] + '室' : '';
              house[1] = house[1] ? house[1] + '厅' : '';
              house[2] = house[2] ? house[2] + '卫' : '';
              this.formatData[item] = house.join('');
              break;
            case 'decorate'://装修
            case 'property_type'://房屋类型
            case 'direction'://朝向
              this.formatData[item] = res[item].name;
              break;
            case 'floors':
              this.formatData.floors = res.floor + ' / ' + res.floors;
              break;
            case 'holding_documents_type'://持有证件
            case 'lock_type'://门锁类型
            case 'bed'://床和床垫的情况
            case 'wardrobe'://衣柜情况
            case 'curtain'://窗帘情况
            case 'is_fill'://家电是否补齐
            case 'is_lord_fill'://房东是否补齐
            case 'has_heater'://是否有暖气
            case 'has_gas'://是否有天然气
            case 'customer_sex'://性别
            case 'card_type'://证件类型
            case 'contact_way'://联系方式
            case 'is_elevator'://是否有电梯
            case 'is_clean'://卫生情况
            case 'is_electronic_contract'://是否电子合同
            case 'can_decorate'://可否装修
            case 'can_add_goods'://可否添加物品
            case 'signatory_identity'://签约人身份
            case 'position'://所属区域
              let num = this.myUtils.isNum(res[item]) ? Number(res[item]) : (res[item] || '');
              this.formatData[item] = dicties[item][num];
              break;
            case 'non_landlord_fee'://非房东费用
              let names = [];
              for (let name of this.form[item]) {
                names.push(dicties[item][name])
              }
              this.formatData[item] = names.join(',');
              break;
            case 'is_agency'://是否渠道
              let agency = this.myUtils.isNum(res[item]) ? Number(res[item]) : (res[item] || '');
              this.formatData[item] = dicties[item][agency];
              for (let slither of Object.keys(this.drawSlither)) {
                for (let list of this.drawSlither[slither]) {
                  if (list.keyName) {
                    if (list.keyName.includes('agency_')) {
                      if (agency === 1) {
                        list.hidden = false;
                      } else {
                        list.hidden = true;
                        this.form[list.keyName] = list.keyType;
                      }
                    }
                  }
                }
              }
              break;
            case 'remark_terms'://备注条款
              let terms = [];
              for (let name of this.form[item]) {
                terms.push(name + '、' + dicties[item][name]);
              }
              this.formatData[item] = terms.join(',');
              break;
            case 'subsidiary_customer'://附属房东
              if (res[item]) {
                let customer = ['customer_sex', 'card_type', 'contact_way'];
                this.formatData = this.changeHandle(res, item, customer, this.drawSlither, this.formatData);
                for (let val of res[item]) {
                  for (let value of Object.values(val)) {
                    if (value) {
                      this.showCustomer = true;
                    }
                  }
                }
              }
              break;
            case 'period_price_way_arr'://付款方式变化
              let pay_way = ['pay_way'];
              this.formatData = this.changeHandle(res, item, pay_way, this.drawSlither, this.formatData);
              break;
          }
        }
        if (res.album) {
          for (let pic of Object.keys(res.album)) {
            this.album[pic] = res.album[pic];
          }
        }
      },
      // 初始化数据
      resetting() {
        let allForm = [];
        let id = this.form.id;
        this.drawSlither = this.jsonClone(this.resetDrawing);
        for (let item of Object.keys(this.drawSlither)) {
          allForm = allForm.concat(this.drawSlither[item]);
        }
        this.drawForm = allForm;
        let all = this.initFormData(allForm, this.showData);
        this.form = all.form;
        this.formatData = all.formatData;
        this.album = all.album;
        this.electricalList = all.value;
        this.showCustomer = false;
        for (let item of all.value) {
          item.num = this.form[item.key];
        }
        this.form.id = id || '';
        this.form.signer = '';
        this.form.contract_number = this.electronicContractNumber;
        this.form.account = '6225212583158743';
        this.form.account_name = '贾少君';
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  @mixin bgBannerImg() {
    @for $i from 1 through 4 {
      .bgBanner-#{$i} {
        @include bgImage("../../../assets/image/collectReport/bgBanner#{$i}.png");
      }
    }
  }

  @include bgBannerImg;
  #collectReport {
    .collectReport {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: background .3s;

      .bulletinTitle {
        padding: .1rem .36rem 0;
        height: 1.2rem;
        @include flex('items-bet');

        label {
          font-size: .36rem;
          color: #4570FE;
          font-family: 'fangzhengjianti';
        }

        p {
          i {
            display: inline-block;
            width: .2rem;
            height: .2rem;
            margin-left: .16rem;
            @include radius(50%);
            background-color: #FFFFFF;
          }

          i.hover {
            width: .33rem;
            @include radius(1rem);
            background-color: #4570FE;
          }
        }
      }

      .mainRadius {
        margin: 0 .3rem;
        overflow: hidden;
        @include radius(.06rem);
        background-color: rgba(255, 255, 255, .88);

        .transition {
          @include transition(all .3s);
        }

        .slide0 {
          @include transform(translateX(0));
        }

        .main {
          height: 100%;
          padding: .15rem .15rem 2rem;
          @include scroll;

          .addCustomer {
            color: #4570FE;
            text-align: center;
            padding: .2rem 0 .4rem;
          }
        }
      }

      .mainRadius2 {
        .slide1 {
          @include transform(translateX(-50%));
        }
      }

      .mainRadius3 {
        .slide1 {
          @include transform(translateX(-33.33%));
        }

        .slide2 {
          @include transform(translateX(-66.33%));
        }
      }

      .mainRadius4 {
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

      .payWayChange {
        p {
          padding: .13rem .3rem;
          background-color: #FFFFFF;
          margin-left: -.2rem;
          border-radius: 0 1rem 1rem 0;
          color: #4570FE;
          margin-right: .2rem;
        }
      }

      /*单选 radio*/
      .commonRadio {
        div {
          background-color: #EEEDEE;
          color: #4A4A4A;
          margin-left: .3rem;
          padding: .15rem .3rem;
          @include radius(1rem);
        }

        .chooseRadio {
          background-color: rgba(69, 112, 254, .3);
          color: #4570FE;
        }
      }

      /*报备底部按钮*/
      .footer {
        position: fixed;
        bottom: 0;

        span {
          color: #FFFFFF;
          padding: .2rem 0
        }
      }

      .footerLeft {
        width: 2.6rem;
        height: 1.6rem;
        @include bgImage('../../../assets/image/footer/caogaochongzhi.png');
        left: 0;

        div {
          height: 100%;
          text-align: left;

          span {
            width: 30%;
          }

          .resetting {
            width: 40%;
            padding: .2rem 0;
            text-align: center;
            margin-top: 1rem
          }
        }
      }

      .footerRight {
        right: 0;
        width: 1.6rem;
        height: 1rem;
        line-height: 1rem;
        padding-left: .24rem;
        @include bgImage('../../../assets/image/footer/fabu.png');
      }
    }
  }
</style>
