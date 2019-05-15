<template>
  <div id="deliveryReceipt" :style="this.mainListHeight()">
    <div class="top" ref="top">
      <div>
        <p></p>
        <p></p>
        <h2>客厅</h2>
      </div>
      <h1></h1>
    </div>
    <div class="mainTouch" ref="main" @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
      <div :style="slitherCss" class="transition" :class="['transition' + allReportNum]">
        <div class="slide justify-around" :class="['slide' + slither]">
          <ul :style="mainWidth" v-for="slither in Object.keys(drawSlither)">
            <!--显示formatData -->
            <!--家电家具-->
            <li v-if="item.status === 'child'" v-for="(item,index) in drawSlither[slither]">
              <!--select 下拉选择-->
              <div v-for="child in item.children">
                <div v-if="child.type">
                  <div v-if="child.showForm === 'formatData'">
                    <zl-input
                      v-model="formatData[slither][child.keyName]"
                      @focus="choosePicker(item,slither,child)"
                      :key="index"
                      :type="child.type"
                      :label="child.label"
                      :readonly="child.readonly"
                      :disabled="child.disabled"
                      :placeholder="child.placeholder">
                      <div class="zl-button" v-if="child.button">{{child.button}}</div>
                      <div class="unit" v-if="child.unit">{{child.unit}}</div>
                    </zl-input>
                  </div>
                  <div v-else>
                    <div class="items-center">
                      <zl-input
                        v-model="form[slither][child.keyName]"
                        :key="index"
                        :type="child.type"
                        :label="child.label"
                        @input="listenInput(slither,item.keyName)"
                        :placeholder="child.placeholder">
                        <div class="zl-button" v-if="child.button">{{child.button}}</div>
                        <div class="unit" v-if="child.unit">{{child.unit}}</div>
                      </zl-input>
                    </div>
                  </div>
                  <div class="prompts" v-if="child.prompts">{{child.prompts}}</div>
                </div>
                <div v-else>
                  <Upload :file="child" :getImg="album[child.keyName]" @success="getImgDataObj"></Upload>
                </div>
              </div>
            </li>
            <!--显示form -->
            <!--            <li v-else>-->
            <!--              &lt;!&ndash;select 下拉选择&ndash;&gt;-->
            <!--              <div v-if="(item.picker && item.readonly) || item.disabled">-->
            <!--                <zl-input-->
            <!--                  :key="index"-->
            <!--                  v-model="form[item.keyName]"-->
            <!--                  @focus="choosePicker(item,form[item.keyName])"-->
            <!--                  :type="item.type"-->
            <!--                  :label="item.label"-->
            <!--                  :readonly="item.readonly"-->
            <!--                  :disabled="item.disabled"-->
            <!--                  :placeholder="item.placeholder">-->
            <!--                  <div class="zl-button" v-if="item.button">{{item.button}}</div>-->
            <!--                  <div class="unit" v-if="item.unit">{{item.unit}}</div>-->
            <!--                </zl-input>-->
            <!--              </div>-->
            <!--              &lt;!&ndash;上传&ndash;&gt;-->
            <!--              <div v-else-if="item.picker === 'upload' && item.value" class="uploadForm">-->
            <!--                <div v-for="upload in item.value" class="flex">-->
            <!--                  <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              &lt;!&ndash;普通输入框&ndash;&gt;-->
            <!--              <div v-else>-->
            <!--                <div class="items-center" v-if="item.keyName && item.moreString">-->
            <!--                  <label class="labelTitle">{{item.label}}</label>-->
            <!--                  <zl-input-->
            <!--                    v-if="item.moreString"-->
            <!--                    v-for="(string,num) in item.moreString"-->
            <!--                    :key="num"-->
            <!--                    v-model="form[string.keyName]"-->
            <!--                    :type="string.type"-->
            <!--                    :label="string.label"-->
            <!--                    @input="listenInput(string.keyName)"-->
            <!--                    :placeholder="string.placeholder">-->
            <!--                    <div class="zl-button" v-if="item.button">{{item.button}}</div>-->
            <!--                    <div class="unit" v-if="item.unit">{{item.unit}}</div>-->
            <!--                  </zl-input>-->
            <!--                </div>-->
            <!--                <div v-if="item.keyName && !item.moreString">-->
            <!--                  <zl-input-->
            <!--                    v-if="!item.hidden"-->
            <!--                    :key="index"-->
            <!--                    v-model="form[item.keyName]"-->
            <!--                    :type="item.type"-->
            <!--                    :label="item.label"-->
            <!--                    @input="listenInput(item.keyName)"-->
            <!--                    :placeholder="item.placeholder">-->
            <!--                    <div class="zl-button" v-if="item.button">{{item.button}}</div>-->
            <!--                    <div class="unit" v-if="item.unit">{{item.unit}}</div>-->
            <!--                  </zl-input>-->
            <!--                </div>-->
            <!--                <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>-->
            <!--              </div>-->
            <!--            </li>-->
          </ul>
        </div>
        <footer :class="['footer'+allReportNum]">
          <div class="commonBtn" :style="mainWidth" :class="['hover'+slither]">
            <p class="btn reset">重置</p>
            <p class="btn deliver">草稿</p>
            <p class="btn" @click="saveReport">发布</p>
          </div>
        </footer>
      </div>
    </div>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></choose-time>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--有input picker-->
    <picker-slot :module="popupModule" :pickers="pickers" :drawing="drawForm" :postData="form" :formData="formatData"
                 :popup="popupStatus" @close="onConfirm"></picker-slot>
    <!--分类选择-->
    <delivery-picker :module="deliveryModule" :pickers="pickers" :form="form" :formData="formatData"></delivery-picker>
  </div>
</template>

<script>
  import DeliveryPicker from './deliveryPicker.vue'

  export default {
    name: "index",
    components: {DeliveryPicker},
    data() {
      return {
        startClientX: 0,
        endClientX: 0,
        slither: 0,
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
          childKey: '',                     //字段名
          parentKey: '',                    //父级 字段名 变化有picker
          columns: [],                      //下拉框选择文本列表
          ids: [],                          //当前字典所有id
          index: '',                        //变化下标
        },
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

        childPhoto: [],
      }
    },
    created() {
      this.resetDrawing = this.jsonClone(defineArticleReceipt);
      this.resetting();
    },
    mounted() {
    },
    activated() {
      this.allReportNum = Object.keys(this.drawSlither).length;
      let top = this.$refs.top.offsetHeight + 30;
      let main = this.$refs.main.offsetWidth + "px";
      this.mainWidth = {minWidth: main, maxWidth: main};
      this.slitherCss = this.mainListHeight(top);
      this.slitherCss.width = this.allReportNum + '00%';
    },
    watch: {},
    computed: {},
    methods: {
      getParentKey(slither, key) {
        this.childPhoto[0] = slither;
        this.childPhoto[1] = key;
        console.log(this.childPhoto);
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
      // 下拉选择
      choosePicker(val, parentKey, child) {
        console.log(val);
        // show date
        if (val.status === 'date') {
          // this.chooseTime(val, value);
          return;
        }
        // this.popupStatus = val.picker;
        let dict = dicties[val.keyName];
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
        this.pickers.keyName = parentKey;
        this.deliveryModule = true;
        // this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
      },
      // 确认选择
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
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
        if (val.dateKey === 'begin_date') this.contractEnd(val.dateVal);
        if (val.dateKey === 'pay_first_date') this.countChangeDate('period_price_way_arr');
      },
      // close Module
      onCancel() {
        this.timeModule = false;
        this.pickerModule = false;
        this.popupModule = false;
      },
      // 图片
      getImgDataObj(val, file) {
        let key = file.slither;
        this.form[key[0]][key[1]][val[0]] = val[1];
      },
      saveReport() {
        console.log(this.form);
      },
      resetting() {
        this.drawSlither = this.jsonClone(this.resetDrawing);
        for (let item of Object.keys(this.drawSlither)) {
          for (let key of this.drawSlither[item]) {
            if (key.status === 'child') {
              this.form[item] = {};
              this.formatData[item] = {};
              this.form[item][key.keyName] = key.keyType;
              this.formatData[item][key.keyName] = key.keyType;
              for (let val of key.children) {
                this.form[item][key.keyName][val.keyName] = val.keyType;
                this.formatData[item][key.keyName][val.keyName] = val.keyType;
              }
            } else {
              this.form[key.keyName] = key.keyType;
              this.formatData[key.keyName] = key.keyType;
            }
          }
        }
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

      ul {
        @include scroll;
      }

      footer {
        .commonBtn {
          padding: .3rem .1rem .1rem;
          @include transition(all .3s);
        }
      }

      .footer2 {
        .commonBtn {
          transform: translateX(100%);
        }

        .hover1 {
          transform: translateX(0);
        }
      }

      .footer3 {
        .commonBtn {
          transform: translateX(200%);
        }

        .hover1 {
          transform: translateX(100%);
        }

        .hover2 {
          transform: translateX(0);
        }
      }

      .footer4 {
        .commonBtn {
          transform: translateX(300%);
        }

        .hover1 {
          transform: translateX(200%);
        }

        .hover2 {
          transform: translateX(100%);
        }

        .hover3 {
          transform: translateX(0);
        }
      }
    }
  }
</style>
