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
                    :key="index"
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
                     @click="showListBtn(slither,item.status,(index + 1))">{{item.changeBtn}}
                </div>
                <!--变化-->
                <div v-else-if="item.keyName && item.picker && item.picker.includes('change')">
                  <div v-for="(change,num) in item.children"
                       v-if="item.picker.includes('Default') || changeHiddenAll">
                    <div class="addChange" v-if="item.children.length > 1 || item.picker === 'changeHiddenAll'">
                      <div class="items-center">
                        <p>{{item.label}}{{(myUtils.DX(num+1))}}</p>
                        <van-icon name="cross" color="#4570FE" size=".36rem"
                                  @click='removeChange(slither,item.keyName,index,num)'/>
                      </div>
                      <div class="zl-button" @click="changeInput(slither,item.keyName,index,item.children[0])"
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
                               @click="changeInput(slither,item.keyName,index,change)">
                            {{key.changeBtn}}
                          </div>
                        </zl-input>
                      </div>
                      <div v-else>
                        <zl-input
                          v-if="key.length !== form[item.keyName].length && !key.hidden"
                          :key="idx"
                          v-model="form[item.keyName][num][key.keyName]"
                          :type="key.type"
                          :label="key.label"
                          :disabled="key.disabled"
                          @input="listenInput(item.keyName,slither,index, key.keyName)"
                          :placeholder="key.placeholder">
                          <div class="zl-button" v-if="key.changeBtn && item.children.length < 2"
                               @click="changeInput(slither,item.keyName,index,change)">
                            {{key.changeBtn}}
                          </div>
                          <div class="zl-confirmation" :class="[key.icon]"
                               v-if="key.button" @click="confirmation(key.icon,item.keyName,num)">
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
                        <span :class="['electrical-' + (index + 1)]"></span>
                      </h1>
                      <p>{{form[list.key]}}</p>
                    </div>
                  </div>
                </div>
                <!--备注条款-->
                <div v-else-if="item.picker === 'remark_terms'" class="flex remark_terms">
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
                        :disabled="item.disabled"
                        :label="string.label"
                        @input="listenInput(string.keyName)"
                        :placeholder="string.placeholder">
                      </zl-input>
                    </div>
                    <div v-else-if="item.disabled">
                      <zl-input
                        :key="index"
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
    <search-house :module="searchHouseModule" :config="searchConfig" @close="hiddenHouse"></search-house>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>
    <!--部门搜索-->
    <search-depart :module="searchDepartModule" @close="getDepartInfo"></search-depart>
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
  import SearchStaff from '../../common/searchStaff.vue';
  import SearchDepart from '../../common/searchDepart.vue';
  import Electrical from '../../common/electrical.vue'
  import NoPicker from '../../common/no-picker.vue';
  import SearchHouse from '../../common/searchHouse.vue';
  import CheckChoose from '../../common/checkChoose.vue';
  import RemarkTerms from './remarkTerms.vue';

  export default {
    name: "index",
    components: {SearchHouse, SearchStaff, SearchDepart, Electrical, NoPicker, CheckChoose, RemarkTerms},
    data() {
      return {

        bulletinTitle: [],
        slither: 0,                         //模块切换记录
        allReportNum: 0,                    //表单模块数
        startClientX: 0,                    //滑动距离
        endClientX: 0,                      //滑动距离
        mainWidth: {},                      //列表宽度

        queryData: {},
        bulletinType: {},                   //报备类型
        taskDetail: {},                     //任务详情

        album: {},                          //图片预填
        drawSlither: {},                    //遍历表单
        drawForm: [],                       //表单集合
        form: {},
        formatData: {},
        showData: {
          dateVal: '',                      //日期
          parentKey: '',                    //父级 字段名 变化有picker
          dateKey: '',                      //日期 字段名
          dateType: '',                     //日期类型 默认date 时分datetime
          dateIdx: '',                      //日期字段下标 变化情况使用
        },
        pickers: {},
        popupStatus: '',                    //picker分类
        pickerModule: false,                //正常 select 下拉框
        popupModule: false,                 //分类 select 下拉框
        timeModule: false,                  //日期选择
        searchHouseModule: false,           //房屋搜索
        searchConfig: {},                   //搜索配置
        searchStaffModule: false,           //员工搜索
        searchDepartModule: false,          //部门搜索
        noPickerModule: false,              //模态框 只有输入框
        checksList: {},                     //非房东费用
        checksModule: false,                //非房东费用
        remarkTermsModule: false,           //备注条款

        electricalList: [],                 //家电
        changeHiddenAll: false,             //隐藏所有变化子元素

        electronicContractNumber: '',       //电子合同编号

        electricalModule: false,            //家电家具
        allChildren: {},                    //附属租客

        isGetTake: false,                   //尾款
        noTaskId: false,                   //不需要task_id
        noContractInfo: false,             //不预填合同
        allResetting: {},
        photoUploadStatus: true,

        bulletinSlither: [],
      }
    },
    created() {
    },
    activated() {
      this.bulletinType = JSON.parse(sessionStorage.bulletin_type || '{}');
      this.taskDetail = JSON.parse(sessionStorage.task_detail || '{}');
      console.log(this.taskDetail);
      if (this.taskDetail.content) {
        this.taskDetail.content.id = '';
      }
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
        if (val && this.form.period_price_way_arr && this.form.period_price_way_arr.length === 1) {
          this.form.period_price_way_arr[0].period = val;
        }
      },
      'form.money_sum'(val) {
        if (val && this.form.current_pay_info && this.form.current_pay_info.length === 1) {
          this.form.current_pay_info[0].money_sep = val;
          let bulletin = this.bulletinType.bulletin;
          let pay_first = new Date(this.form.begin_date);
          this.changeDateCount('period_price_way_arr', pay_first, bulletin);//付款方式变化 日期计算
        }
      },
    },
    computed: {
      keyUpStatus() {// 底部定位
        return this.$store.state.app.key_up_status;
      },
      personal() {
        return this.$store.state.app.personalDetail;
      }
    },
    methods: {
      // 报备类型
      bulletin_types(type) {
        let bulletinData = this.$bulletinType(type.bulletin, this.taskDetail.finish_RWC);
        let data = [
          //不需要电子合同
          ['bulletin_retainage', 'bulletin_agency', 'bulletin_rent_RWC', 'bulletin_special', 'bulletin_special_collect', 'bulletin_special_rent', 'bulletin_checkout'],
          //不需要task_id
          ['bulletin_rent_trans', 'bulletin_change'],
          // 不预填
          ['bulletin_collect_continued', 'bulletin_rent_continued', 'bulletin_change', 'bulletin_rent_trans'],
        ];
        this.isGetTake = data[0].includes(type.bulletin);
        this.noTaskId = data[1].includes(type.bulletin);
        this.noContractInfo = data[2].includes(type.bulletin);
        this.bulletinTitle = bulletinData.title;
        this.drawSlither = this.jsonClone(bulletinData.data);
        this.bulletinSlither = this.jsonClone(bulletinData.data);
        this.resetting();
        this.distinguishForm(type.bulletin);
        if (type.bulletin === 'bulletin_agency') {
          let type = this.taskDetail.bulletin === 'bulletin_collect_basic' ? 0 : 1;
          this.form.collect_or_rent = type;
          this.formatData.collect_or_rent = dicties['collect_or_rent'][type];
        }
      },
      // 区分报备类型参数
      distinguishForm(type) {
        if (type !== 'bulletin_collect_basic' && type !== 'bulletin_rent_RWC') {
          this.form.house_id = this.taskDetail.house_id || '';
          this.form.contract_id = this.taskDetail.contract_id || '';
        }
        if (type === 'bulletin_rent_basic' || type === 'bulletin_booking_renting') {
          this.form.is_sign = '';
        }
        switch (type) {
          case 'bulletin_rent_basic':
            this.form.is_sign = '';
            let query = this.$route.query;
            if (query.result) {
              this.form.is_sign = query.result;
            }
            break;
          case'bulletin_change':
            this.form.house_id_rent = this.taskDetail.house_id;
            this.form.contract_id_rent = this.taskDetail.contract_id;
            this.form.old_address = this.taskDetail.address;
            this.formatData.house_id_rent = this.taskDetail.address;
            break;
          case 'bulletin_rent_continued':
            this.form.is_sign = 1;
            break;
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
        if (start - end > 100) {
          if ((this.allReportNum - 1) > this.slither > 0) {
            this.slither++;
          }
        }
        if (start - end < -100) {
          if (this.slither > 0) {
            this.slither--;
          }
        }
      },
      // 搜索员工结果
      getStaffInfo(val) {
        this.onCancel();
        if (val !== 'close') {
          let config = this.searchConfig;
          if (config.status === 'objName') {
            this.form[config.keyName].id = val.staff_id;
            this.form[config.keyName].name = val.staff_name;
            this.formatData[config.keyName] = val.staff_name;
            this.form[config.department].id = val.department_id;
            this.form[config.department].name = val.department_name;
            this.formatData[config.department] = val.department_name;
          } else {
            this.form[config.keyName] = val.staff_id;
            this.formatData[config.keyName] = val.staff_name;
            this.form[config.department] = val.department_id;
            this.formatData[config.department] = val.department_name;
          }
        }
      },
      // 搜索部门结果
      getDepartInfo(val) {
        this.onCancel();
        if (val !== 'close') {
          let config = this.searchConfig;
          if (config.status === 'objName') {
            this.form[config.keyName] = {};
            this.form[config.keyName].id = val.id;
            this.form[config.keyName].name = val.name;
            this.formatData[config.keyName] = val.name;
          } else {
            this.form[config.keyName] = val.id;
            this.formatData[config.keyName] = val.name;
          }
        }
      },
      // 房屋搜索结果
      hiddenHouse(val, config) {
        this.onCancel();
        if (val !== 'close') {
          for (let item of Object.keys(val)) {
            this.form[item] = val[item];
          }
          this.formatData[config.keyName] = val.address;
          //获取特殊事项的房屋详情
          if (config.bulletinType.bulletin.includes('bulletin_special')) {
            this.getBulletinDetailFun(val.contract_id);
          }
        }
      },
      // 日期选择
      chooseTime(val, date, num, parentKey) {
        this.timeModule = true;
        this.formatData.dateKey = val.keyName;
        this.formatData.dateType = val.picker;
        this.formatData.dateVal = date;
        this.formatData.dateIdx = num;
        this.formatData.parentKey = parentKey;
      },
      // 确认时间
      onConTime(val) {
        this.onCancel();
        if (val !== 'close') {
          if (val.parentKey) {
            this.setFormDate(val.parentKey, val.dateVal, val.dateKey, val.dateIdx);
          } else {
            this.setFormDate(val.dateKey, val.dateVal);
          }
          if (val.dateKey === 'begin_date') this.contractDateCount(val.dateVal);
          if (val.dateKey === 'pay_first_date') this.moreChangeDateCount('period_price_way_arr');
        }
      },
      // 日期赋值
      setFormDate(key, date, child, index) {
        if (child) {
          this.form[key][index][child] = date;
          this.formatData[key][index][child] = date;
        } else {
          this.form[key] = date;
          this.formatData[key] = date;
        }
      },
      // 监听输入变化
      listenInput(key, slither, index, child) {
        switch (key) {
          case 'customer_name':
          case 'card_id':
          case 'contact_phone':
            if (slither) {
              this.certified('change', slither, index);
            } else {
              this.certified('change');
            }
            break;
          case 'month':
          case 'day':
          case 'vacancy':
            this.contractDateCount(this.form.begin_date);//合同结束日期计算
            break;
          case 'period_price_way_arr':
            if (child === 'month_unit_price') {
              this.countPrice('pay_way_bet');//押金计算
            }
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
        if (bulletin === 'bulletin_collect_basic' || bulletin === 'bulletin_collect_continued') {
          ddEnd = this.myUtils.dateAdd('dd', (vacancy + day - 1), mmEnd);//合同结束日期
          let vacant = this.myUtils.dateAdd('dd', vacancy, newBegin);//空置期结束日期
          let pay_first = this.myUtils.dateAdd('dd', 1, vacant);//第一次打款日期
          this.setFormDate('end_date_vacant', this.myUtils.formatDate(vacant));//空置期结束日期
          this.setFormDate('pay_first_date', this.myUtils.formatDate(pay_first));//第一次打款日期
          this.changeDateCount('period_price_way_arr', pay_first, bulletin);//付款方式变化 日期计算
        } else {
          ddEnd = this.myUtils.dateAdd('dd', day, mmEnd);//合同结束日期
          this.changeDateCount('period_price_way_arr', begin, bulletin);//付款方式变化 日期计算
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
          if (index > 0) {
            value[index].begin_date = value[index - 1].end_date;
          } else {
            value[index].begin_date = val;
          }
          let begin_date = new Date(item.begin_date);
          item.end_date = this.myUtils.formatAddRem('mm', period, begin_date);
          if (bulletin === 'bulletin_collect_basic') {
            this.sePaySecondDate();
          }
        })
      },
      // 第二次打款日期
      sePaySecondDate() {
        let date = this.form.pay_first_date || '';
        if (!date) return;
        let val = new Date(date);
        let pay_way = Number(this.form.period_price_way_arr[0].pay_way || 1);
        let pay_second = this.myUtils.formatAddRem('mm', pay_way, val);
        this.setFormDate('pay_second_date', pay_second)
      },
      // 计算押金
      countPrice(val) {
        if (val === 'pay_way_bet') {
          let bet = this.form.pay_way_bet;
          if (bet || bet === 0) {
            bet = Number(bet);
          } else {
            bet = 1;
          }
          let price = Number(this.form.period_price_way_arr[0].month_unit_price || 0);
          this.form.deposit = bet * price;
        } else {
          this.sePaySecondDate();
        }
      },
      // 输入变化周期计算日期
      moreChangeDateCount(key) {
        let bulletin = this.bulletinType.bulletin;
        let date = '';
        if (bulletin === 'bulletin_collect_basic') {
          date = this.form.pay_first_date;
        } else {
          date = this.form.begin_date;
        }
        if (!date) return;
        this.changeDateCount(key, new Date(date));
      },
      // 附属租客/房东
      showListBtn(slither, child, index) {
        this.changeHiddenAll = true;
        this.allChildren[child] = this.jsonClone(this.drawSlither[slither][index].children[0]);
      },
      // 新增变化
      changeInput(slither, key, index, val) {
        let child;
        if (this.drawSlither[slither][index].picker === 'changeHiddenAll') {
          child = this.jsonClone(this.allChildren[key]);
        } else {
          child = this.jsonClone(val);
        }
        this.drawSlither[slither][index].children.push(child);
        let value = {};
        for (let item of child) {
          value[item.keyName] = item.keyType;
        }
        this.form[key].push(value);
        this.formatData[key].push(value);
        if (key !== 'period_price_way_arr') return;
        this.moreChangeDateCount(key);
      },
      // 删除变化
      removeChange(slither, key, index, num) {
        let draw = this.drawSlither[slither][index];
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
        if (draw.children.length === 1) {
          if (draw.keyName === 'period_price_way_arr') {
            this.form[draw.keyName][0].period = this.form.month;
          }
          if (draw.keyName === 'current_pay_info') {
            this.form[draw.keyName][0].money_sep = this.form.money_sum;
          }
        }
        if (draw.status !== 'countDate') return;
        this.countPrice('pay_way_bet');
        this.moreChangeDateCount(key);
      },
      // 下拉框筛选
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
          case 'datetime':
            this.chooseTime(val, value, num, parentKey);
            break;
          case 'searchHouse':
            this.searchConfig = val;
            this.searchConfig.bulletinType = this.bulletinType;
            //特殊事项
            if (!this.bulletinType.bulletin.includes('bulletin_special')) {
              this.searchHouseModule = true;
            } else {
              this.specialSearchHouseFun();
            }
            break;
          case 'deliveryReceipt'://交接单
            this.taskDetail.content = this.form;
            sessionStorage.setItem('task_detail', JSON.stringify(this.taskDetail));
            this.routerLink('deliveryReceipt');
            break;
          case 'searchStaff':
            this.searchConfig = val;
            this.searchStaffModule = true;
            break;
          case 'searchDepart':
            this.searchConfig = val;
            this.searchDepartModule = true;
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
            this.inputSelect(val, num, parentKey).then(picker => {
              this.pickers = picker;
            });
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
          if (picker.controlShow || name === 'is_electronic_contract') {
            this.inputStatus(name, form);
          }
          // 付款方式变化处理
          if (parentKey === 'period_price_way_arr') {
            this.moreChangeDateCount(parentKey);
            this.sePaySecondDate();
          }
          if (name === 'pay_way_bet') this.countPrice(name);
          if (name === 'pay_way') this.countPrice(name);
          if (name === 'check_type') this.checkoutHandler(form.check_type, 'change');
          //特殊事项变化处理
          this.specialPickerFun(form, show, picker);
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
        switch (name) {
          case 'is_electronic_contract':
            let num = Number(form['is_electronic_contract']);
            if (num) {
              this.contractDis('disabled');
              this.form.contract_number = this.electronicContractNumber;
            } else {
              this.contractDis(false);
              this.form.contract_number = 'LJSF';
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
            if (list.controlShow && list.keyName === name) {
              let formNum = Number(form[name]);
              let listNum = Number(list.controlShow);
              for (let child of list.showList) {
                if (formNum === listNum) {
                  child.hidden = false;
                } else {
                  child.hidden = true;
                  this.form[child.keyName] = child.keyType;
                }
              }
            }
          }
        }
      },
      // 获取电子合同编号
      electronicContract() {
        let arrSF = ['bulletin_collect_basic', 'bulletin_collect_continued'];  //收房
        // let arrZF=['bulletin_rent_continued'];  //租房
        let version = '';
        // let version = this.bulletinType.bulletin === 'bulletin_collect_basic' ? '1.1' : '1.2';
        if (arrSF.includes(this.bulletinType.bulletin)) {
          version = '1.1';
        } else {
          version = '1.2';
        }
        let data = {
          city_id: this.personal.city_id,
          version: version,
        };
        this.$httpZll.getElectronicContract(data).then(res => {
          this.electronicContractNumber = res.data.number || '';
          this.form.contract_number = this.electronicContractNumber;
        });
      },
      // 身份认证 银行认证
      confirmation(val, parentKey, index) {
        let params = {};
        switch (val) {
          case 'identity':
            if (parentKey) {
              params = {
                customer_name: this.form[parentKey][index].customer_name,
                idcard: this.form[parentKey][index].card_id,
                mobile: this.form[parentKey][index].contact_phone,
              };
            } else {
              params = {
                customer_name: this.form.customer_name,
                idcard: this.form.card_id,
                mobile: this.form.contact_phone,
              };
            }
            this.$httpZll.customerIdentity(params).then(res => {
              if (res) {
                if (res.data.fadada_user_id) {
                  if (parentKey) {
                    this.form[parentKey][index].fadada_user_id = res.data.fadada_user_id;
                  } else {
                    this.form.signer = res.data;
                  }
                  this.certified('', parentKey, index);
                } else {
                  this.$ddSkip(res.data.data);
                  this.$dialog('认证', '认证是否完成?').then(res => {
                    if (res) {
                      this.confirmation('identity', parentKey, index);
                    }
                  })
                }
              }
            });
            break;
          case 'bank':
            if (parentKey) {
              params = {
                card: this.form[parentKey][index].account,
                owner: this.form[parentKey][index].account_name,
              };
            } else {
              params = {
                card: this.form.account,
                owner: this.form.account_name,
              };
            }
            this.$httpZll.getBankNameAttestation(params).then(res => {
              if (parentKey) {
                this.form[parentKey][index][val] = res.data || '';
              } else {
                this.form[val] = res.data || '';
              }
            });
            break;
        }
      },
      // 已认证
      certified(change, parentKey, index) {
        for (let slither of Object.keys(this.drawSlither)) {
          for (let key of this.drawSlither[slither]) {
            if (parentKey) {
              if (key.keyName === parentKey) {
                for (let children of key.children[index]) {
                  if (children.icon === 'identity') {
                    if (change) {
                      children.button = '身份识别';
                    } else {
                      children.button = '已认证';
                    }
                  }
                }
                return;
              }
            } else {
              if (key.icon === 'identity') {
                if (change) {
                  key.button = '身份识别';
                } else {
                  key.button = '已认证';
                }
              }
            }
          }
        }
        this.form = Object.assign({}, this.form);
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
        this.searchHouseModule = false;
        this.searchStaffModule = false;
        this.searchDepartModule = false;
      },
      // 图片上传
      getImgData(val) {
        this.form[val[0]] = val[1];
        this.photoUploadStatus = val[2];
      },
      // 发布
      saveReport(val) {
        console.log(this.form);
        if (val !== 1 && val !== 2) {
          // if (this.$attestationKey(this.drawForm)) return;
        }
        if (val === 1) {
          if (!this.photoUploadStatus) {
            this.$prompt('图片上传中...');
            return;
          }
        }
        this.form.is_draft = val;
        let bulletin = this.bulletinType;
        this.saveReportHandler(bulletin);
        this.handlerSaveReport();
        switch (val) {
          case 0:// 发布
          case 1:// 草稿
            if (!this.noTaskId) {
              this.form.task_id = this.taskDetail.task_id || '';
              this.form.process_instance_id = this.taskDetail.process_instance_id || '';
            }
            this.form.spot_code = this.$refs.code.spot_code;
            this.$httpZll.submitReport(this.form, bulletin.to).then(res => {
              if (res) {
                if (val === 1) {
                  let data = res.data;
                  this.form.id = data.id;
                  //特殊事项
                  if (data.task_id) {
                    this.taskDetail.task_id = data.task_id;
                  }
                  if (data.process_instance_id) {
                    this.taskDetail.process_instance_id = data.process_instance_id;
                  }
                } else {
                  this.bulletin_types(bulletin);
                  this.$store.dispatch('approval_tabs', {tab: '2', status: 0});
                  this.routerReplace('/approvals');
                }
              }
            });
            break;
          case 2:// 重置
            this.$dialog('重置', '您确定要清空表单吗?').then(status => {
              if (status) {
                if (!this.isGetTake) {
                  if ((!bulletin.bulletin.includes('bulletin_special')) && bulletin.bulletin !== 'bulletin_rent_RWC') {
                    if (this.noContractInfo) {
                      this.disabledDefaultValueHandler(this.allResetting);
                    } else {
                      this.getPunchClockData();
                    }
                  } else {
                    this.bulletin_types(bulletin);
                  }
                } else {
                  this.childBulletin(this.taskDetail.content);
                }
              }
            });
            break;
          case 3:// 修改
            this.form.is_draft = 0;
            this.form.approved_level = this.taskDetail.variableName;
            this.form.task_id = this.taskDetail.task_id;
            this.form.process_instance_id = this.taskDetail.process_instance_id;
            this.$httpZll.putReviseReport(this.form, bulletin.to).then(res => {
              if (res) {
                this.bulletin_types(bulletin);
                this.$router.go(-1);
              }
            });
            break;
        }
      },
      // 提交前 数据处理
      saveReportHandler(bulletin) {
        if (bulletin.type) {
          if (this.taskDetail.finish_RWC) {
            this.form.type = 1;
          } else {
            this.form.type = bulletin.type;
          }
        }
        if (bulletin.bulletin === 'bulletin_rent_basic' || bulletin.bulletin === 'bulletin_booking_renting') {
          let query = this.$route.query;
          if (query.result || query.result === 0) {
            this.form.is_sign = query.result;
          }
        }
      },
      // 附属房东/租客 处理
      handlerSaveReport() {
        for (let slither of Object.keys(this.drawSlither)) {
          this.drawSlither[slither].forEach((item, idx) => {
            if (item.picker === 'changeHiddenAll') {
              let key = item.keyName;
              if (!this.changeHiddenAll) return;
              if (!key) return;
              let customer = this.form[key];
              let formCus = [];
              let formatCus = [];
              let children = this.jsonClone(this.drawSlither[slither][idx].children[0]);
              this.drawSlither[slither][idx].children = [];
              customer.forEach((data, index) => {
                for (let value of Object.keys(data)) {
                  if (data[value]) {
                    formCus.push(data);
                    formatCus.push(this.formatData[key][index]);
                    return;
                  }
                }
              });
              if (formCus.length) {
                this.form[key] = formCus;
                this.formatData[key] = formatCus;
                formCus.forEach(_ => {
                  this.drawSlither[slither][idx].children.push(children);
                });
              } else {
                this.changeHiddenAll = false;
                this.drawSlither[slither][idx].children.push(children);
                let obj = {};
                let child = [];
                for (let i of children) {
                  obj[i.keyName] = i.keyType;
                }
                child.push(obj);
                this.form[key] = child;
                this.formatData[key] = this.jsonClone(child);
              }
            }
          })
        }
      },
      // 草稿
      getDraft() {
        let params = {}, type = '';
        params.task_id = this.taskDetail.task_id;
        for (let val of Object.keys(this.bulletinType)) {
          if (val !== 'bulletin') {
            params[val] = this.bulletinType[val];
          } else {
            type = this.bulletinType[val];
          }
        }
        let key = this.taskDetail.taskDefinitionKey;
        this.$httpZll.getBulletinDraft(params).then(data => {
          // this.form = collectBulletinDraft;//收房预填
          // this.form = rentBulletinDraft;//租房预填
          let arr = [];
          if (type === 'bulletin_collect_continued' || type === 'bulletin_rent_continued') {
            arr = ['address', 'house_id', 'contract_id', 'contract_number'];
            this.disabledDefaultValue('slither0', arr);
          } else if (type === 'bulletin_change') {
            arr = ['house_id_rent', 'contract_id', 'contract_number'];
            this.disabledDefaultValue('slither0', arr);
          } else if (type === 'bulletin_rent_trans') {
            arr = [];
            this.disabledDefaultValue('slither1', arr);
          }
          if (!data) {
            if (type !== 'bulletin_rent_RWC') {
              if (!this.isGetTake) {
                //续收、续租预填数据
                if (this.noContractInfo) {
                  this.handlePreFill(this.taskDetail.content);
                  this.disabledDefaultValueHandler(this.allResetting);
                } else {
                  this.getPunchClockData();
                }
              } else {
                if (!type.includes('bulletin_special')) {
                  if (type.includes('bulletin_checkout')) {
                    this.checkoutContent(this.taskDetail.content);
                    this.checkoutHandler(this.form.check_type);
                  } else {
                    this.childBulletin(this.taskDetail.content);
                  }
                }
              }
            } else {
              if (this.taskDetail.finish_RWC) {
                this.handlePreFill(this.taskDetail.content);
              }
            }
          } else {
            this.form.id = '';//草稿ID
            let res = data.data;
            this.childBulletin(res, 'draft');
            this.handlePreFill(res);
          }
          if (((!this.isGetTake) && key !== 'RentBooking') || this.taskDetail.finish_RWC) {
            this.electronicContract();
          }
        });
      },
      // 修改
      getRevise() {
        let res = this.taskDetail;
        this.form.spot_code = '';//唯一识别码
        this.form.id = '';
        this.form.process_id = res.process_id || '';//修改ID
        this.handlePreFill(res.content);
      },
      // 重新发布
      againSave() {
        let res = this.taskDetail;
        this.form.id = '';
        this.handlePreFill(res.content, 'again');
        let key = this.taskDetail.taskDefinitionKey;
        if (((!this.isGetTake) && key !== 'RentBooking') || this.taskDetail.finish_RWC) {
          this.electronicContract();
        }
      },
      // 退租
      checkoutContent(res, change) {
        for (let item of Object.keys(this.form)) {
          if (item !== 'check_type') {
            this.form[item] = res[item] || this.form[item];
          }
          switch (item) {
            case 'house_id':
              this.form.house_address = res.house_address || '';
              this.formatData.house_id = res.house_address || '';
              break;
            case 'collect_or_rent':
              this.formatData[item] = dicties[item][res[item]] || '0';
              break;
            case 'check_type':
              if (!change) {
                this.form[item] = res[item] || this.form[item];
                this.formatData[item] = res[item].name;
              }
              break;
            case 'handover_staff':
            case 'handover_department':
            case 'checkout_transact_staff':
            case 'checkout_transact_department':
              if (res[item]) {
                this.formatData[item] = res[item].name || '';
              } else {
                this.formatData[item] = '';
              }
              break;
            default:
              this.pickerDefaultValue(this.form, item);
              break;
          }
        }
      },
      // 退租表单字段切换
      checkoutHandler(val, change) {
        let slither = defineCheckoutReport.slither0.concat(checkoutTypeChange[val.id]);
        this.drawSlither.slither0 = this.jsonClone(slither);
        this.resetting();
        this.form.house_id = '';
        this.form.contract_id = '';
        this.form.customer_fdd_user_id = '';
        this.form.customer_phone = '';
        this.form.customer_idcard = '';
        this.form.check_type = val;
        this.formatData.check_type = val.name;
        this.checkoutContent(this.taskDetail.content, change);
      },
      // 尾款待办信息 / 渠道
      childBulletin(res, draft) {
        for (let item of Object.keys(this.form)) {
          switch (item) {
            case 'month':
            case 'address':
            case 'house_address':
            case 'customer_name':
              this.form[item] = res[item] || this.form[item];
              break;
            case 'house_id':
              this.form[item] = res[item] || this.form[item];
              this.formatData.house_id = res.address || this.form.address;
              break;
            case 'agency_infos':
              if (draft) {
                this.form[item] = res[item];
              } else {
                for (let info of this.form[item]) {
                  for (let key of Object.keys(info)) {
                    if (key.includes('agency_')) {
                      info[key] = res[key]
                    }
                  }
                }
              }
              break;
            case 'price':
              let str = [], price = [];
              if (res.period_price_way_arr) {
                price = res.period_price_way_arr;
              } else {
                price = res[item];
              }
              this.form[item] = price || this.form[item];
              this.formatData[item] = '';
              for (let key of price) {
                str.push(`${key.begin_date}至${key.end_date}:${key.month_unit_price}元`);
              }
              this.formatData[item] = str.join(' ; ');
              break;
          }
        }
        if (this.taskDetail.completion_amount) {
          this.form.balance = this.taskDetail.completion_amount;
        }
      },
      // 获取待办信息
      getPunchClockData() {
        if (!Object.keys(this.taskDetail).length) return;
        let res = this.taskDetail.content;
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          switch (item) {
            case 'house_id':
              this.formatData.house_id = res.address;
              break;
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
            case 'current_pay_info'://付款方式变化
              if (res[item]) {
                this.$changeHandle(res, item, [], this.drawSlither, this.formatData);
              }
              break;
            default:
              this.pickerDefaultValue(this.form, item);
              break;
          }
        }
        this.setAlbumDraft(res);
      },
      // 预填数据处理
      handlePreFill(res, status) {
        for (let item of Object.keys(this.form)) {
          this.form[item] = res[item] || this.form[item];
          switch (item) {
            case 'old_address':
              this.formatData['house_id_rent'] = res[item];
              break;
            case 'house_id':
              this.form.address = res.address || '';
              this.formatData.house_id = res.address || '';
              break;
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
              if (!status) {
                if (res[item] && res[item].fadada_user_id && !Array.isArray(res[item])) {
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
                if (name === 6 || name === '6') {
                  names.push(res.other_fee_name);
                  this.form.other_fee_name = res.other_fee_name;
                } else {
                  names.push(dicties[item][name])
                }
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
              let customer = ['customer_sex', 'card_type', 'contact_way'];
              this.allChildren[item] = [];
              this.$changeHandle(res, item, customer, this.drawSlither, this.formatData, this.allChildren);
              this.form[item].forEach((child, index) => {
                for (let value of Object.values(child)) {
                  if (value) {
                    this.changeHiddenAll = true;
                    return;
                  }
                }
                if (!status) {
                  if (!Array.isArray(res[item])) {
                    if (child.fadada_user_id) {
                      this.certified('', item, index);
                    } else {
                      this.certified();
                    }
                  }
                }
              });
              break;
            case 'price':
              let str = [], price = res[item];
              this.form[item] = price || this.form[item];
              this.formatData[item] = '';
              for (let key of price) {
                str.push(`${key.begin_date}至${key.end_date}:${key.month_unit_price}元`);
              }
              this.formatData[item] = str.join(' ; ');
              break;
            case 'period_price_way_arr'://付款方式变化
              this.$changeHandle(res, item, ['pay_way'], this.drawSlither, this.formatData);
              break;
            case 'current_pay_info'://付款方式变化
              this.$changeHandle(res, item, [], this.drawSlither, this.formatData);
              break;
            default:
              this.pickerDefaultValue(this.form, item);
              break;
          }
        }
        this.setAlbumDraft(res);
      },
      // 图片预填
      setAlbumDraft(res) {
        if (res.album) {
          for (let pic of Object.keys(res.album)) {
            if (res.album[pic] && res.album[pic].length) {
              if (typeof res.album[pic][0] !== 'object') {
                this.$httpZll.getUploadUrl(res.album[pic], 'close').then(res => {
                  this.album[pic] = res.data;
                  this.album = Object.assign({}, this.album);
                })
              } else {
                this.album[pic] = res.album[pic];
              }
            }
          }
        }
      },
      // 下拉框 匹配字典
      pickerDefaultValue(res, item) {
        let objInt = [], date = [];
        for (let picker of this.drawForm) {
          if (picker.status === 'objInt' || picker.status === 'arr') {
            objInt.push(picker.keyName);
          }
          if (picker.picker === 'date') {
            date.push(picker.keyName);
          }
        }
        if (objInt.includes(item)) {
          let num = this.myUtils.isNum(res[item]) ? Number(res[item]) : res[item];
          this.formatData[item] = dicties[item][num];
        }
        if (date.includes(item)) {
          this.formatData[item] = res[item];
        }
      },
      // 禁止预填 字段
      disabledDefaultValue(slither, arr) {
        let all = this.initFormData(this.bulletinSlither[slither], this.showData);
        this.allResetting = this.jsonClone(all);
        this.allResetting.noEmpty = arr;
      },
      // 禁止预填 清空处理
      disabledDefaultValueHandler(all) {
        this.drawSlither = this.jsonClone(this.bulletinSlither);
        for (let item of Object.keys(all.form)) {
          if (!all.noEmpty.includes(item)) {
            this.form[item] = all.form[item];
          }
        }

        for (let item of Object.keys(all.formatData)) {
          if (!all.noEmpty.includes(item)) {
            this.formatData[item] = all.formatData[item];
          }
        }
        for (let item of Object.keys(all.album)) {
          this.album[item] = all.album[item];
        }
      },
      // 初始化数据
      resetting() {
        this.slither = 0;
        let id = this.form.id || '';
        this.photoUploadStatus = true;
        let allForm = [];
        for (let item of Object.keys(this.drawSlither)) {
          allForm = allForm.concat(this.drawSlither[item]);
        }
        this.drawForm = allForm;
        let all = {};
        if (this.bulletinType.bulletin === 'bulletin_checkout') {
          all = this.initFormData(allForm, this.showData, 'noStaff');
        } else {
          all = this.initFormData(allForm, this.showData);
        }
        this.form = all.form;
        this.form.id = id;
        this.formatData = all.formatData;
        this.album = this.jsonClone(all.album);
        this.electricalList = all.value;
        for (let item of all.value) {
          item.num = this.form[item.key];
        }
        this.changeHiddenAll = false;
        if (all.formatData.identity === 'identity') {
          this.form.signer = {};
        }
        if (!this.isGetTake) {
          this.form.contract_number = this.electronicContractNumber;
        }
        // this.form.account = '6225212583158743';
        // this.form.account_name = '贾少君';
      },
      //获取详情数据（特殊事项ll）
      getBulletinDetailFun(contract_id) {
        let data = {};
        this.$httpZll.getBulletinDetail(contract_id).then(res => {
          if (res) {
            data.content = res.content.draft_content;
            this.childBulletin(data.content);
          }
        });
      },
      //特殊事项报备:选择收租类型时，清空其他数据(ll)
      specialPickerFun(form, show, picker) {
        if (this.bulletinType.bulletin.includes('bulletin_special')) {
          if (picker.keyName === 'collect_or_rent') {
            this.resetting();
            this.form.collect_or_rent = form.collect_or_rent;
            this.formatData.collect_or_rent = show.collect_or_rent;
          }
        }
      },
      //特殊事项报备:选择房屋地址，处理合同类型
      specialSearchHouseFun() {
        if (this.form.collect_or_rent === '') {
          this.$prompt('请选择收租类型');
          return;
        }
        switch (this.form.collect_or_rent) {  //0-收房，1-租房
          case '0':
            this.searchConfig.contract_type = 1;
            break;
          case '1':
            this.searchConfig.contract_type = 2;
            break;
        }
        //重新赋值，房屋搜所组件才能监测到searchConfig值的变化
        this.searchConfig = this.jsonClone(this.searchConfig);
        this.searchHouseModule = true;
      },
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
          z-index: 1;
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
