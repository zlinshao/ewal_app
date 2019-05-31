<template>
  <div id="supplyAgreement">
    <div class="supplyAgreement" :style="mainListHeight()">
      <div class="title">协议内容</div>
      <div class="main">
        <div class="content">
          <div v-for="(item,index) in drawSlither[agreementType]">
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
                <div class="zl-confirmation" :class="[item.icon]"
                     v-if="item.button" @click="confirmation(item.icon)">
                  <i :class="item.icon" v-if="item.icon"></i>
                  {{item.button}}
                </div>
              </zl-input>
            </div>
          </div>
        </div>
        <div class="commonBtn">
          <p class="btn back" @click="$router.go(-1)">取消</p>
          <p class="btn">确定</p>
        </div>
      </div>
    </div>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        drawSlither: {},
        agreementType: 'collect',

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
        popupModule: false,
        pickerModule: false,
        searchHouseModule: false,
      }
    },
    mounted() {
    },
    activated() {
      this.drawSlither = defineSupplyAgreement;
    },
    watch: {},
    computed: {},
    methods: {
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
            this.searchHouseModule = true;
            this.searchConfig = val;
            this.searchConfig.bulletinType = this.bulletinType;
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
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
        }
      },
      // close Module
      onCancel() {
        this.pickerModule = false;
        this.popupModule = false;
        this.searchHouseModule = false;
      },
      // 身份认证 银行认证
      confirmation(val, parentKey, index) {

      },
      resetting() {
        let allForm = this.drawSlither[this.agreementType];
        let all = this.initFormData(allForm, this.showData);
        this.form = all.form;
        this.formatData = all.formatData;
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
