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
      <div :style="slitherCss" class="transition" :class="['transition'+allReportNum]">
        <div class="slide justify-around" :class="['slide' + slither]">
          <ul :style="mainWidth" v-for="slither in Object.keys(drawSlither)">
            <!--显示formatData -->
            <li v-if="item.showForm === 'formatData'" v-for="(item,index) in drawSlither[slither]">
              <!--select 下拉选择-->
              <div v-if="(item.picker && item.readonly) || item.disabled">
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
            </li>
            <!--显示form -->
            <li v-else>
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
                  <div class="zl-button" v-if="item.button">{{item.button}}</div>
                  <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </zl-input>
              </div>
              <!--上传-->
              <div v-else-if="item.picker === 'upload' && item.value" class="uploadForm">
                <div v-for="upload in item.value" class="flex">
                  <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>
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
                    <div class="zl-button" v-if="item.button">{{item.button}}</div>
                    <div class="unit" v-if="item.unit">{{item.unit}}</div>
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
                    <div class="zl-button" v-if="item.button">{{item.button}}</div>
                    <div class="unit" v-if="item.unit">{{item.unit}}</div>
                  </zl-input>
                </div>
                <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--有input picker-->
    <picker-slot :module="popupModule" :pickers="pickers" :drawing="drawForm" :postData="form" :formData="formatData"
                 :popup="popupStatus" @close="onConfirm"></picker-slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        startClientX: 0,
        endClientX: 0,
        slither: 0,
        allReportNum: 0,
        popupStatus: '',
        pickerModule: false,
        popupModule: false,
        pickers: {
          title: '',                        //picker标题
          type: '',                         //字典类型
          keyName: '',                      //字段名
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
        drawSlither: {}
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
      choosePicker(val, value, num = '', parentKey = '') {
        // show date
        if (val.status === 'date') {
          this.chooseTime(val, value);
          return;
        }
        this.popupStatus = val.picker;
        if (val.picker === 'picker') {
          this.pickerModule = true;
        } else {
          this.popupModule = true;
        }
        if (val.pickerRead) return;//弹窗内 可输入
        this.pickers = this.inputSelect(this.pickers, val, num, parentKey);
      },
      // 确认选择
      onConfirm(form, show) {
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
      },
      // 图片
      getImgData(val) {

      },
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
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  @mixin deliveryImg($n) {
    @include bgImage('../../../assets/image/deliveryReceipt/'+$n+'.png');
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
      @include flex();
      .transition {
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
          @include transform(translateX(50%));
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
    }
  }
</style>
