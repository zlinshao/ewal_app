<template>
  <div id="polishing">
    <van-popup v-model="popupModule" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="popupModule">
      <div class="moduleTop">
        <h1>
          {{taskDefinitionKey[allQuery.taskDefinitionKey]}}
        </h1>
        <h2>
          <span class="numberFont">54<b>%</b></span>
          <i style="height: 54%;"></i>
        </h2>
      </div>
      <div class="moduleMain">
        <div class="main">
          <div>
            <label></label>
            <span></span>
          </div>
        </div>
        <div class="commonBtn">
          <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="addRecord('/datumRecord')">
            {{item.label}}
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "polishing",
    props: ['module', 'detail'],
    data() {
      return {
        popupModule: false,
        allQuery: {},
        allDetail: {},
        buttons: [
          {
            label: '转交',
            type: 'deliver'
          },
          {
            label: '增加跟进记录',
            type: 'confirm'
          },
        ],
        moduleType: '',//弹窗类型
        taskDefinitionKey: {
          CompleteData: '业务员补齐资料',
          CompleteAsset: '补齐物品报备',
          InputHandoverOrder: '填写交接信息',
          CollectReceiptSign: '签署收据'
        },
        showForm: {}
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.popupModule = val;
      },
      detail(val) {
        this.allQuery = val;
        this.getDetail(val.bm_detail_request_url);
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close');
        }
      }
    },
    computed: {},
    methods: {
      // 获取任务详情
      getDetail(api) {
        this.$httpZll.get(api, {}, 'prompt').then(res => {
          if (res.success) {
            this.allDetail = res.data;
          }
        })
      },
      addRecord(url) {
        this.routerLink(url);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  @mixin polishImg($n) {
    @include bgImage('../../../../assets/image/toBeDoneList/goSignContract/' + $n + '.png');
  }

  #polishing {
    .popupModule {
      right: 0;
      left: 1.8rem;
      height: 100%;
      @include radius(.2rem 0 0 .2rem);
      background-color: #4570FE;
      @include flex('bet-column');
    }
    .moduleTop {
      height: 2.6rem;
      padding-bottom: .6rem;
      @include flex('justify-center');
      align-items: flex-end;
      h1 {
        color: #FFFFFF;
        margin-right: .1rem;
      }
      h2 {
        position: relative;
        width: 1rem;
        height: 1rem;
        overflow: hidden;
        @include radius(50%);
        background-color: rgba(255, 255, 255, .1);
        @include flex('flex-center');
        span {
          z-index: 2;
          position: absolute;
          font-size: .42rem;
          b {
            position: absolute;
            top: -.05rem;
            right: -.12rem;
          }
        }
        i {
          position: absolute;
          background-color: #FFFFFF;
          width: 100%;
          bottom: 0;
          z-index: 1;
        }
      }
    }
    .moduleMain {
      height: 100%;
      padding-top: .2rem;
      @include flex('bet-column');
      background-color: #FFFFFF;
      @include radius(.2rem .2rem 0 0);
      .main {
        height: 100%;
      }
      .commonBtn {
        padding: .3rem;
        .confirm {
          padding: .2rem;
        }
      }
    }
  }
</style>
