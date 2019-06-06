<template>
  <div id="supplyAgreement">
    <div class="supplyAgreement" :style="mainListHeight()">
      <div class="title">协议内容</div>
      <div class="main">
        <div class="content">
          <div v-for="(item,index) in drawSlither">
            <div v-if="item.showForm === 'formatData' || (item.picker && item.readonly)">
              <zl-input
                v-model="formatData[item.keyName]"
                :key="index"
                :type="item.type"
                @focus="choosePicker(item,form[item.keyName])"
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
                :key="index"
                v-model="form[item.keyName]"
                :type="item.type"
                :label="item.label"
                :disabled="item.disabled"
                :placeholder="item.placeholder">
                <div class="zl-confirmation" :class="[item.icon]" v-if="item.button" @click="confirmation(item.icon)">
                  <i :class="item.icon" v-if="item.icon"></i>
                  {{item.button}}
                </div>
              </zl-input>
            </div>
          </div>
        </div>
        <div class="commonBtn">
          <p class="btn back" @click="$router.go(-1)">取消</p>
          <p class="btn" @click="saveAgreement">确定</p>
        </div>
      </div>
    </div>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--房屋搜索-->
    <search-house :module="searchHouseModule" :config="searchConfig" @close="hiddenHouse"></search-house>
  </div>
</template>

<script>
  import SearchHouse from '../../common/searchHouse.vue';

  export default {
    name: "index",
    components: {SearchHouse},
    data() {
      return {
        drawSlither: [],
        bulletinType: {},

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
        popupStatus: '',
        searchConfig: {},
        timeModule: false,
        popupModule: false,
        pickerModule: false,
        searchHouseModule: false,
      }
    },
    mounted() {
    },
    activated() {
      let type = JSON.parse(sessionStorage.bulletin_type || '{}');
      this.bulletinType = type;
      this.bulletin_types(type);
    },
    watch: {},
    computed: {},
    methods: {
      bulletin_types(type) {
        let agreementType;
        switch (type.bulletin) {
          case "bulletin_collect_basic":
            agreementType = 1;
            break;
          case "bulletin_rent_basic":
            agreementType = 4;
            break;
        }
        this.resetting(agreementType);
      },
      hiddenHouse(val, config) {
        this.searchHouseModule = false;
        if (val !== 'close') {
          for (let item of Object.keys(val)) {
            this.form[item] = val[item];
          }
        }
      },
      // 下拉框筛选
      choosePicker(val, value) {
        this.popupStatus = val.picker;
        switch (val.picker) {
          case 'picker':
            this.pickerModule = true;
            this.inputSelect(val).then(picker => {
              this.pickers = picker;
            });
            break;
          case 'date':
          case 'datetime':
            this.chooseTime(val, value);
            break;
          case 'searchHouse':
            this.searchHouseModule = true;
            this.searchConfig = val;
            this.searchConfig.bulletinType = this.bulletinType;
            break;
          default:
            this.popupModule = true;
            this.inputSelect(val).then(picker => {
              this.pickers = picker;
            });
            break;
        }
      },
      // 日期选择
      chooseTime(val, date) {
        this.timeModule = true;
        this.formatData.dateKey = val.keyName;
        this.formatData.dateType = val.picker;
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
      // 确认下拉选择
      onConfirm(form, show, config) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
          if (config.keyName === 'pact_type') {
            this.resetting(Number(form[config.keyName]));
          }
        }
      },
      // close Module
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
        this.searchHouseModule = false;
      },
      // 身份认证 银行认证
      confirmation(val) {
        let params = {};
        switch (val) {
          case 'identity':
            params = {
              customer_name: this.form.customer_name,
              idcard: this.form.card_id,
              mobile: this.form.contact_phone,
            };
            this.$httpZll.customerIdentity(params).then(res => {
              if (res) {
                this.form.fdd_user_id = res.data.fadada_user_id || '';
                if (this.form.fdd_user_id) {
                  this.certified();
                }
              }
            });
            break;
          case 'bank':
            params = {
              card: this.form.account,
              owner: this.form.account_name,
            };
            this.$httpZll.getBankNameAttestation(params).then(res => {
              this.form[val] = res.data || '';
            });
            break;
        }
      },
      // 已认证
      certified() {
        let data = ['customer_name', 'contact_phone', 'card_id'];
        for (let key of this.drawSlither) {
          if (key.icon === 'identity') {
            key.button = '已认证';
            key.icon = '';
          }
          if (data.includes(key.keyName)) {
            key.disabled = 'disabled';
          }
        }
      },
      // 提交
      saveAgreement() {
        this.form.is_draft = 1;
        let type = this.form.pact_type === 4 ? 'rent' : 'collect';
        this.$httpZll.postSupplyAgreement(this.form, type).then(res => {

        })
      },
      // 重置
      resetting(num) {
        this.drawSlither = this.jsonClone(defineSupplyAgreement[num - 1]);
        let allForm = this.drawSlither;
        let all = this.initFormData(allForm, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        if (num === 4) {
          this.formatData.pact_type = '延长租房时长'
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common";

  #supplyAgreement {
    .supplyAgreement {
      padding: .3rem .3rem .5rem;
      margin-top: .1rem;
      @include flex('bet-column');
      background: linear-gradient(135deg, rgba(137, 164, 255, 1) 0%, rgba(69, 112, 254, 1) 100%);

      .title {
        color: #FFFFFF;
        padding-bottom: .3rem;
      }

      .main {
        padding-top: .2rem;
        height: 100%;
        background-color: #FFFFFF;
        @include flex('bet-column');
        @include radius(.06rem);

        .content {
          padding: 0 .2rem;
          @include scroll;
          height: 100%;
        }

        .commonBtn {
          margin-top: .2rem;
          border-top: 1px dashed #C6CAD8;
          padding: .3rem;
        }
      }
    }
  }

</style>
