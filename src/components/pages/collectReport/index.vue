<template>
  <div id="collectReport" :style="mainListHeight()">
    <div class="collectReport" :class="['bgBanner-' + (slither + 1)]">
      <div class="bulletinTitle">
        <label>{{bulletinTitle[slither]}}</label>
        <p v-if="allReportNum > 1">
          <i v-for="(num,idx) in allReportNum" :class="{'hover': idx === slither}" @click="slither = idx"></i>
        </p>
      </div>
      <div class="mainRadius" :class="['mainRadius' + allReportNum]" ref="mainRadius"
           @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
        <div class="justify-around transition" :class="['slide' + slither]" :style="{'width':allReportNum + '00%'}">
          <div class="list" :style="mainWidth" v-for="slither in Object.keys(drawSlither)">
            <ul>
              <li v-for="(item,index) in drawSlither[slither]">
                <div v-if="item.showForm === 'formatData' || (item.picker && item.readonly)">
                  <zl-input
                    v-model="formatData[item.keyName]"
                    @focus="choosePicker(item,form[item.keyName])"
                    :key="index1"
                    :type="item.type"
                    :label="item.label"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder">
                    <div class="zl-button" v-if="item.button">{{item.button}}</div>
                    <div class="unit" v-if="item.unit">{{item.unit}}</div>
                  </zl-input>

                  <div v-if="item.showList">
                    <zl-input
                      v-if="!show.hidden"
                      v-for="(show,num) in item.showList"
                      :key="num"
                      v-model="form[show.keyName]"
                      :type="show.type"
                      :label="show.label"
                      :placeholder="show.placeholder">
                    </zl-input>
                  </div>
                </div>
                <!--变化 隐藏所有子元素-->
                <div class="changeHiddenAll"
                     v-else-if="item.picker === 'changeHiddenAll' && !changeHiddenAll && !item.keyName"
                     @click="changeHiddenAll = true">{{item.changeBtn}}
                </div>
                <!--变化-->
                <div v-else-if="item.keyName && item.picker && item.picker.includes('change')">
                  <div v-for="(change,num) in item.children"
                       v-if="item.picker.includes('Default') || changeHiddenAll">
                    <div class="addChange" v-if="item.children.length > 1 || item.picker === 'changeHiddenAll'">
                      <div class="items-center">
                        <p>{{item.label}}{{(myUtils.DX(num+1))}}</p>
                        <van-icon name="cross" color="#4570FE" size=".36rem"
                                  @click='removeChange(slither,item.keyName,index1,num)'/>
                      </div>
                      <div class="zl-button" @click="changeInput(slither,item.keyName,index1,item.children[0])"
                           v-if="num === item.children.length - 1">
                        {{item.changeBtn}}
                      </div>
                    </div>
                    <div v-for="(key,idx) in change">
                      <div v-if="key.showForm === 'formatData'">
                        <zl-input
                          v-model="formatData[item.keyName][num][key.keyName]"
                          @focus="choosePicker(key,form[item.keyName][num][key.keyName],num,item.keyName)"
                          :key="idx"
                          :type="key.type"
                          :label="key.label"
                          :readonly="key.readonly"
                          :disabled="key.disabled"
                          :placeholder="key.placeholder">
                          <div class="unit" v-if="item.unit">{{item.unit}}</div>
                          <div class="zl-button"
                               v-if="key.changeBtn && item.children.length < 2"
                               @click="changeInput(slither,item.keyName,index1,change)">
                            {{key.changeBtn}}
                          </div>
                        </zl-input>
                      </div>
                      <div v-else>
                        <zl-input
                          v-if="key.length !== form[item.keyName].length"
                          :key="idx"
                          v-model="form[item.keyName][num][key.keyName]"
                          :type="key.type"
                          :label="key.label"
                          :disabled="key.disabled"
                          @input="listenInput(item.keyName)"
                          :placeholder="key.placeholder">
                          <div class="zl-button" v-if="key.changeBtn && item.children.length < 2"
                               @click="changeInput(slither,item.keyName,index1,change)">
                            {{key.changeBtn}}
                          </div>
                          <div class="zl-confirmation" :class="[key.icon]"
                               v-if="key.button" @click="confirmation(key.icon)">
                            <i :class="key.icon" v-if="key.icon"></i>
                            {{key.button}}
                          </div>
                          <div class="unit" v-if="item.unit">{{item.unit}}</div>
                        </zl-input>
                      </div>
                      <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
                    </div>
                  </div>
                </div>
                <!--家电-->
                <div v-else-if="item.lists" class="flex electrical">
                  <label class="labelTitle">{{item.label}}</label>
                  <div class="justify-around">
                    <div v-for="(list,index) in item.lists">
                      <h1 @click="electricalModule = true">
                        <span :class="['electrical-' + (index1 + 1)]"></span>
                      </h1>
                      <p>{{form[list.key]}}</p>
                    </div>
                  </div>
                </div>
                <!--备注条款-->
                <div v-else-if="item.picker === 'remark_terms'" class="flex remark_terms">
                  <zl-input
                    :key="index1"
                    v-model="formatData[item.keyName]"
                    @focus="choosePicker(item)"
                    :type="item.type"
                    :label="item.label"
                    readonly="readonly"
                    :placeholder="item.placeholder">
                  </zl-input>
                </div>
                <!--上传-->
                <div v-else-if="item.photos" class="uploadForm">
                  <div v-for="upload in item.photos" class="flex">
                    <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>
                  </div>
                </div>
                <!--普通输入框-->
                <div v-else>
                  <div v-if="item.keyName">
                    <div class="items-center" v-if="item.moreString">
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
                    <div v-else-if="item.disabled">
                      <zl-input
                        :key="index1"
                        v-model="form[item.keyName]"
                        :type="item.type"
                        :disabled="item.disabled"
                        :label="item.label"
                        :placeholder="item.placeholder">
                        <div class="unit" v-if="item.unit">{{item.unit}}</div>
                        <div class="zl-confirmation" v-if="item.button">{{item.button}}</div>
                      </zl-input>
                    </div>
                    <div v-else>
                      <zl-input
                        :key="index1"
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
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer" :class="{'footerStatic': keyUpStatus}" v-if="queryData.revise !== 'revise'">
        <p class="p1" @click="saveReport(1)">
          <span class="writingMode">草稿</span>
        </p>
        <p class="p2" @click="saveReport(2)">
          <span>重置</span>
        </p>
        <p class="p3" @click="saveReport(0)">
          <span>发布</span>
        </p>
      </div>
      <div class="footer" :class="{'footerStatic': keyUpStatus}" v-else>
        <p class="p3" @click="saveReport(3)">
          <span>修改</span>
        </p>
      </div>
    </div>
    <!--唯一标识码-->
    <float-button ref="code" :type="'payable'"></float-button>
    <!--房屋搜索-->
    <search-house :module="searchHouseModule" :config="bulletinType" @close="hiddenHouse"></search-house>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--有input 分类选择-->
    <picker-slot :module="popupModule" :pickers="pickers" :drawing="drawForm" :postData="form" :formData="formatData"
                 :popup="popupStatus" @close="onConfirm"></picker-slot>
    <!--家电选择-->
    <Electrical :module="electricalModule" :form="form" :list="electricalList" @close="closeElectrical"></Electrical>
    <!--复选 非房东费用-->
    <check-choose :module="checksModule" :list="checksList" :form="form" :formData="formatData"
                  @close="onCheckChoose"></check-choose>
    <!--备注条款-->
    <remark-terms :module="remarkTermsModule" :form="form" :formData="formatData"
                  @close="closeTermsModule"></remark-terms>
  </div>
</template>

<script>
  import Electrical from '../../common/electrical.vue'
  import NoPicker from '../../common/no-picker.vue';
  import SearchHouse from '../../common/searchHouse.vue';
  import CheckChoose from '../../common/checkChoose.vue';
  import RemarkTerms from './remarkTerms.vue';

  export default {
    name: "index",
    components: {SearchHouse, Electrical, NoPicker, CheckChoose, RemarkTerms},
    data() {
      return {
        bulletinTitle: ['房屋信息', '物品信息', '客户信息', '合同信息'],
        slither: 0,                         //模块切换记录
        allReportNum: 0,                    //表单模块数
        startClientX: 0,                    //滑动距离
        endClientX: 0,                      //滑动距离
        mainWidth: {},                      //列表宽度

        queryData: {},
        bulletinType: {},                   //报备类型
        bulletinDetail: {},                 //修改/重新发布
        taskDetail: {},                     //草稿

        album: {},                          //图片预填
        drawSlither: {},                    //遍历表单
        drawForm: [],                       //表单集合
        form: {},
        formatData: {},
        showData: {
          dateVal: '',                      //日期
          dateKey: '',                      //日期 字段名
          dateType: '',                     //日期类型 默认date 时分datetime
          dateIdx: '',                      //日期字段下标 变化情况使用
        },
        pickers: {
          title: '',                        //picker标题
          type: '',                         //字典类型
          keyName: '',                      //字段名
          parentKey: '',                    //父级 字段名 变化有picker
          columns: [],                      //下拉框选择文本列表
          ids: [],                          //当前字典所有id
          index: '',                        //变化下标
        },
        popupStatus: '',                    //picker分类
        pickerModule: false,                //正常 select 下拉框
        popupModule: false,                 //分类 select 下拉框
        timeModule: false,                  //日期选择
        searchHouseModule: false,           //房屋搜索
        searchConfig: {},                   //搜索配置

        noPickerModule: false,              //模态框 只有输入框
        checksList: {},                     //非房东费用
        checksModule: false,                //非房东费用
        remarkTermsModule: false,           //备注条款

        electricalList: [],                 //家电
        changeHiddenAll: false,             //隐藏所有变化子元素

        electronicContractNumber: '',       //电子合同编号

        electricalModule: false,            //家电家具
      }
    },
    created() {
    },
    activated() {
      this.bulletinType = JSON.parse(sessionStorage.bulletin_type || '{}');
      this.taskDetail = JSON.parse(sessionStorage.task_detail || '{}');
      this.bulletinDetail = JSON.parse(sessionStorage.bulletin_draft || '{}');
      this.drawSlither = this.jsonClone(defineCollectReport);
      this.bulletin_types(this.bulletinType);
      this.allReportNum = Object.keys(this.drawSlither).length;
      let main = this.$refs.mainRadius.offsetWidth + "px";//一个 ul 宽度
      this.mainWidth = {minWidth: main, maxWidth: main};
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
            this.bulletinTitle = ['房屋信息', '物品信息', '客户信息', '合同信息'];
            this.drawSlither = this.jsonClone(defineCollectReport);
            break;
          case 'bulletin_rent_basic':
            this.bulletinTitle = ['租房报备'];
            this.drawSlither = this.jsonClone(defineRentReport);
            break;
          case 'agency':
            this.bulletinTitle = ['渠道费报备'];
            this.drawSlither = this.jsonClone(defineRentReport);
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
      // 房屋搜索结果
      hiddenHouse(val) {
        this.searchHouseModule = false;
        if (val !== 'close') {
          console.log(val);
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
          this.setFormDate(val.dateKey, val.dateVal);
          if (val.dateKey === 'begin_date') this.contractDateCount(val.dateVal);
          if (val.dateKey === 'pay_first_date') this.moreChangeDateCount('period_price_way_arr');
        }
      },
      // 日期赋值
      setFormDate(key, date, child, index) {
        if (child) {
          this.form[key][index1][child] = date;
          this.formatData[key][index1][child] = date;
        } else {
          this.form[key] = date;
          this.formatData[key] = date;
        }
      },
      // 监听 输入 计算日期
      listenInput(key) {
        switch (key) {
          case 'month':
          case 'day':
          case 'vacancy':
            this.contractDateCount(this.form.begin_date);//合同结束日期计算
            break;
          case 'period_price_way_arr':
            this.countPrice();//押金计算
            this.moreChangeDateCount(key);//变化日期计算
            break;
        }
      },
      // 合同结束计算
      contractDateCount(date) {
        if (!date) return;
        let bulletin = this.bulletinType.bulletin;
        let begin = new Date(date);
        let newBegin = new Date(date);
        let month = Number(this.form.month || 0);//签约月数
        let day = Number(this.form.day || 0);//签约天数
        let vacancy = Number(this.form.vacancy || 0);//空置期天数
        let mmEnd = this.myUtils.dateAdd('mm', month, begin);
        let ddEnd;//合同结束日期
        if (bulletin === 'bulletin_collect_basic') {
          ddEnd = this.myUtils.dateAdd('dd', (vacancy + day - 1), mmEnd);//合同结束日期
          let vacant = this.myUtils.dateAdd('dd', vacancy, newBegin);//空置期结束日期
          let pay_first = this.myUtils.dateAdd('dd', 1, vacant);//第一次打款日期
          this.setFormDate('end_date_vacant', this.myUtils.formatDate(vacant));//空置期结束日期
          this.setFormDate('pay_first_date', this.myUtils.formatDate(pay_first));//第一次打款日期
          this.changeDateCount('period_price_way_arr', pay_first, bulletin);//付款方式变化 日期计算
        } else {
          ddEnd = this.myUtils.dateAdd('dd', day, mmEnd);//合同结束日期
        }
        this.setFormDate('end_date', this.myUtils.formatDate(ddEnd));//合同结束日期
      },
      // 付款方式变化 日期计算
      changeDateCount(key, date) {
        let bulletin = this.bulletinType.bulletin;
        let val = this.myUtils.formatDate(date);
        let value = this.form[key];
        value.forEach((item, index) => {
          let period = Number(item.period || 0);
          if (index1 > 0) {
            value[index1].begin_date = value[index1 - 1].end_date;
          } else {
            value[index1].begin_date = val;
          }
          let begin_date = new Date(item.begin_date);
          item.end_date = this.myUtils.formatAddRem('mm', period, begin_date);
          if (bulletin === 'bulletin_collect_basic') {
            this.sePaySecondDate(key, val);
          }
        })
      },
      // 第二次打款日期
      sePaySecondDate(key, date) {
        if (!date) return;
        let val = new Date(date);
        let pay_way = Number(this.form[key][0].pay_way || 0) * 30;
        let pay_second = this.myUtils.formatAddRem('dd', pay_way, val);
        this.setFormDate('pay_second_date', pay_second)
      },
      // 计算押金
      countPrice() {
        let bet = Number(this.form.pay_way_bet || 0);
        let price = Number(this.form.period_price_way_arr[0].month_unit_price || 0);
        this.form.deposit = bet * price;
      },
      // 新增变化
      changeInput(slither, key, index, val) {
        this.drawSlither[slither][index1].children.push(val);
        let value = {};
        for (let item of val) {
          value[item.keyName] = item.keyType;
        }
        this.form[key].push(value);
        this.formatData[key].push(value);
        if (key !== 'period_price_way_arr') return;
        this.moreChangeDateCount(key);
      },
      // 输入变化周期计算日期
      moreChangeDateCount(key) {
        let date = this.form.pay_first_date;
        if (!date) return;
        this.changeDateCount(key, new Date(date));
      },
      // 删除变化
      removeChange(slither, key, index, num) {
        let draw = this.drawSlither[slither][index1];
        if (draw.picker === 'changeHiddenAll' && draw.children.length === 1) {
          for (let item of Object.keys(this.form[key][num])) {
            this.form[key][num][item] = '';
            this.formatData[key][num][item] = '';
          }
          this.resetChange(key);
          return;
        }
        this.form[key].splice(num, 1);
        this.formatData[key].splice(num, 1);
        draw.children.splice(num, 1);
        if (draw.picker === 'changeHiddenAll') return;
        this.countPrice();
        this.countChangeDate(key);
      },
      // 下拉框筛选
      choosePicker(val, value, num = '', parentKey = '') {
        this.popupStatus = val.picker;
        switch (val.picker) {
          case 'picker':
            this.pickerModule = true;
            this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
            break;
          case 'date':
            this.chooseTime(val, value);
            break;
          case 'searchHouse':
            this.searchHouseModule = true;
            this.searchConfig = val;
            break;
          case 'noPicker':
            this.noPickerModule = true;
            break;
          case 'non_landlord_fee':
            this.checksList = val;
            this.checksModule = true;
            break;
          case 'remark_terms':
            this.remarkTermsModule = true;
            break;
          default:
            this.popupModule = true;
            this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
            break;
        }
      },
      // 确认下拉选择
      onConfirm(form, show, picker) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
          let name = picker.keyName;
          let parentKey = picker.parentKey || '';
          // input 显示隐藏
          this.inputStatus(name, form);
          // 付款方式变化处理
          if (parentKey === 'period_price_way_arr') {
            this.moreChangeDateCount(parentKey);
            this.sePaySecondDate(parentKey, this.form.pay_first_date || '');
          }
          if (name === 'pay_way_bet') this.countPrice();
        }
      },
      // 隐藏变化数据 重置
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
        this.changeHiddenAll = false;
      },
      // input 显示隐藏
      inputStatus(name, form) {
        // let keys = ['rental_use', 'is_other_fee', 'is_agency', 'is_electronic_contract', 'signatory_identity'];
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
          case 'signatory_identity':
            this.changeHiddenAll = Number(form[name]) === 2;
            break;
          default:
            this.showHiddenInput(form, name);
            break;
        }
      },
      // 清空中介信息
      showHiddenInput(form, name) {
        for (let slither of Object.keys(this.drawSlither)) {
          for (let list of this.drawSlither[slither]) {
            if (list.controlShow) {
              let formNum = Number(form[name]);
              let listNum = Number(list.controlShow);
              for (let child of list.showList) {
                if (formNum === listNum) {
                  child.hidden = true;
                  this.form[child.keyName] = child.keyType;
                } else {
                  child.hidden = false;
                }
              }
            }
          }
        }
      },
      // 获取电子合同
      electronicContract() {
        let data = {
          city_id: this.form.community && this.form.community.city || '320100',
          version: '1.1',
        };
        this.$httpZll.getElectronicContract(data).then(res => {
          this.electronicContractNumber = res.data.number || '';
          this.form.contract_number = this.electronicContractNumber;
        });
      },
      // 身份认证 银行认证
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
      // 已认证
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
      // 家电 确认选择
      closeElectrical(val) {
        this.onCancel();
        if (val !== 'close') {
          for (let key of Object.keys(val)) {
            this.form[key] = val[key];
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
        switch (val) {
          case 0:// 发布
          case 1:// 草稿
            this.form.task_id = this.taskDetail.task_id;
            this.form.process_instance_id = this.taskDetail.process_instance_id;
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
            this.getPunchClockData();
          } else {
            let res = data.data;
            this.form.id = '';//草稿ID
            this.handlePreFill(res, 'new');
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
              door[0] = door[0] ? door[0] + '-' : '';
              door[1] = door[1] ? door[1] + '-' : '';
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
        let objInt = [], date = [];
        for (let picker of this.drawForm) {
          if (picker.status === 'objInt') {
            objInt.push(picker.keyName);
          }
          if (picker.picker === 'date') {
            date.push(picker.keyName);
          }
        }
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          switch (item) {
            case 'door_address'://门牌地址
              let door = this.jsonClone(res[item]);
              door[0] = door[0] ? door[0] + '-' : '';
              door[1] = door[1] ? door[1] + '-' : '';
              door[2] = door[2] ? door[2] : '';
              this.formatData[item] = door.join('');
              break;
            case 'house_type'://户型
              let house = this.jsonClone(res[item]);
              house[0] = house[0] ? house[0] + '室' : '';
              house[1] = house[1] ? house[1] + '厅' : '';
              house[2] = house[2] ? house[2] + '卫' : '';
              this.formatData[item] = house.join('');
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
            case 'decorate'://装修
            case 'property_type'://房屋类型
            case 'direction'://朝向
              this.formatData[item] = res[item].name;
              break;
            case 'floor':
            case 'floors':
              this.formatData.floors = res.floor + ' / ' + res.floors;
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
              this.showHiddenInput(this.form, item);
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
              }
              break;
            case 'period_price_way_arr'://付款方式变化
              let pay_way = ['pay_way'];
              this.formatData = this.changeHandle(res, item, pay_way, this.drawSlither, this.formatData);
              break;
            default:
              if (objInt.includes(item)) {
                let num = this.myUtils.isNum(res[item]) ? Number(res[item]) : (res[item] || '');
                this.formatData[item] = dicties[item][num];
              }
              if (date.includes(item)) {
                this.formatData[item] = res[item];
              }
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
        this.slither = 0;
        let allForm = [], id = this.form.id || '';
        for (let item of Object.keys(this.drawSlither)) {
          allForm = allForm.concat(this.drawSlither[item]);
        }
        this.drawForm = allForm;
        let all = this.initFormData(allForm, this.showData);
        this.form = all.form;
        this.formatData = all.formatData;
        this.album = all.album;
        this.electricalList = all.value;
        this.changeHiddenAll = false;
        for (let item of all.value) {
          item.num = this.form[item.key];
        }
        this.form.id = id;
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

  /*滑动背景图*/
  @mixin bgBannerImg() {
    @for $i from 1 through 4 {
      .bgBanner-#{$i} {
        @include bgImage("../../../assets/image/collectReport/bgBanner#{$i}.png");
      }
    }
  }

  /*滑动表单过渡效果*/
  @mixin slides($n) {
    $num: 100% / $n;
    @for $i from 1 through $n {
      .mainRadius#{$n} {
        .slide#{$i} {
          @include transform(translateX(-($num*$i)));
        }
      }
    }
  }

  @include bgBannerImg;
  #collectReport {
    .collectReport {
      height: 100%;
      padding: .3rem;
      @include flex('bet-column');
      @include transition(all .3s);
      /*头部部分*/
      .bulletinTitle {
        @include flex('items-bet');

        label {
          color: #4570FE;
          font-size: .36rem;
          font-family: 'fangzhengjianti';
        }

        p {
          @include flex('items-center');

          i {
            width: .2rem;
            height: .2rem;
            margin-left: .16rem;
            @include radius(50%);
            background-color: #FFFFFF;
          }

          i.hover {
            width: .3rem;
            @include radius(1rem);
            background-color: #4570FE;
          }
        }
      }

      /*表单部分*/
      .mainRadius {
        height: 100%;
        overflow: hidden;
        margin: .2rem 0 .3rem;
        @include radius(.06rem);
        background-color: rgba(255, 255, 255, .88);

        .transition {
          height: 100%;
          @include transition(all .3s);

          .list {
            @include scroll;
            width: 100%;
            height: 100%;
            padding: .2rem .2rem 3rem .1rem;

            .changeHiddenAll {
              color: #4570FE;
              text-align: center;
              padding: .2rem 0 .4rem;
            }

            .addChange {
              @include flex('items-bet');

              p {
                padding: .13rem .3rem;
                background-color: #FFFFFF;
                margin-left: -.2rem;
                border-radius: 0 1rem 1rem 0;
                color: #4570FE;
                margin-right: .2rem;
              }
            }
          }
        }

        .slide0 {
          @include transform(translateX(0));
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

      .footer {
        position: fixed;
        width: 100%;
        bottom: 0;

        p {
          @include flex('flex-center');
          color: #FFFFFF;
          position: absolute;
          bottom: 0;
        }

        .p1 {
          left: -.3rem;
          width: 1rem;
          height: 1.6rem;
          padding-right: .3rem;
          @include bgImage('../../../assets/image/footer/footercaogao.png');
        }

        .p2 {
          width: 2.5rem;
          height: .8rem;
          padding-top: .2rem;
          @include bgImage('../../../assets/image/footer/footerchongzhi.png');
        }

        .p3 {
          right: 0;
          width: 1.6rem;
          height: 1rem;
          padding-right: .42rem;
          @include bgImage('../../../assets/image/footer/footerfabu.png');
        }
      }
    }
  }

</style>
