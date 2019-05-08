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
          <div class="detail">
            <div v-for="item in 5">
              <label>发生纠纷</label><span>发货的款式法律发的还是卡发生的卡拉</span>
            </div>
          </div>
          <div class="record">
            <h1>2019-03-12 12:40</h1>
            <div>
              <h2>
                <label>房产证照片</label>
                <span>
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                </span>
              </h2>
              <h2>
                <label>房产证照片</label>
                <span>
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                </span>
              </h2>
              <h2>
                <label>房产证照片</label>
                <span>
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                  <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">
                </span>
              </h2>
            </div>
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
        showForm: {},
        params: {},
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
        console.log(val);
        this.params = {
          bulletin_staff_id: val.bulletin_staff_id,
          house_name: val.house_address,
          task_id: val.task_id,
          contract_id: val.v3_contract_id,
        };
        // this.getDetail(val.bm_detail_request_url);
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
        if (!api) return;
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
      background-color: #4570FE;
      @include radius(.2rem 0 0 .2rem);
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
      label {
        white-space: nowrap;
        color: #9B9B9B;
        margin-right: .2rem;
      }
      .main {
        height: 100%;
        @include scroll;
        .detail {
          padding: .3rem .6rem;
          div {
            @include flex();
            margin-bottom: .2rem;
            span {
              line-height: .36rem;
            }
          }
        }
        .record {
          margin-top: 1rem;
          padding: 0 .3rem;
          h1 {
            color: #001A6E;
            padding: 0 0 .1rem .06rem;
          }
          div {
            background-color: #F8F8F8;
            @include radius(.1rem);
            h2 {
              padding: .2rem .1rem;
              @include flex('items-center');
              span {
                @include flex('items-center');
                flex-wrap: wrap;
                img {
                  margin: .1rem .1rem 0 0;
                  width: .8rem;
                  height: .8rem;
                  @include radius(.1rem);
                }
              }
            }
          }
        }
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
