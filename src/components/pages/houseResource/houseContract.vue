<template>
  <div id="houseContract">
    <div>
      <header class="flex-center">
        <a class="collect" :class="{'collect-active': params.contract_type === 1}" @click="handleCheckActive(1)"></a>
        <a class="rent" :class="{'rent-active': params.contract_type === 2}" @click="handleCheckActive(2)"></a>
      </header>
      <div class="main-content" ref="mainContract" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <div class="contract-item" v-for="(item,key) in contract_list" :key="key">
            <div class="header flex">
              <h4>{{ item.house_name }}</h4>
              <a class="contract-icon" :class="{'contract-item-icon': item.is_effective === 1 }">{{ item.is_effective === 1 ? '生效' : '结束'}}</a>
              <p>
                <a class="contract-icon-user"></a>
                {{ item.customer_info && item.customer_info.length > 0 && item.customer_info[0].name }}
              </p>
            </div>
            <div class="contract-time flex-center">
              <h2>{{ item.start_at }}</h2>
              <h3 class="flex-center">
                <a class="pointer"></a>
                <span></span>
                <a class="pointer"></a>
              </h3>
              <h2>{{ item.end_at }}</h2>
            </div>
            <div class="contract-info flex-center">
              <div>
                <h4>签约时长</h4>
                <span class="during">{{ item.sign_time }}</span>
              </div>
              <div>
                <h4>开单人</h4>
                <span>{{ item.sign_user_name }}</span>
              </div>
              <div>
                <h4>所属部门</h4>
                <span>{{ item.sign_org }}</span>
              </div>
            </div>
          </div>
          <div class="noMore" v-if="contract_list.length === paging && contract_list.length > 4">
            <span v-if="!fullLoading">没有更多了</span>
          </div>
          <div class="noData" v-if="!contract_list.length">
            <span v-if="!fullLoading">暂无相关数据...</span>
          </div>
        </scroll-load>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        fullLoading: false,
        params: {
          house_id: '',
          page: 1,
          limit: 12,
          contract_type: 1,
        },
        paging: 0,
        contract_list: [],
        mainHeight: {
          height: 0
        }
      }
    },
    mounted() {
      let top = this.$refs['mainContract'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      console.log(this.mainHeight);
      this.handleGetContractList();
    },
    watch: {},
    computed: {},
    methods: {
      handleGetContractList() {
        this.fullLoading = true;
        this.params.house_id = this.$route.query.id;
        this.$httpHs.getContractList(this.params,'加载中...').then(res => {
          this.fullLoading = false;
          for (let item of res.data) {
            this.contract_list.push(item);
          }
          this.paging = res.count;
        });
      },
      handleCheckActive(active) {
        this.params.contract_type = active;
        this.contract_list = [];
        this.handleGetContractList();
      },
      scrollLoad(val) {
        if (!val) {
          this.params.contract_type = 1;
          this.contract_list = [];
          this.handleGetContractList();
        } else {
          if(this.fullLoading) return;
          if (this.contract_list.length === this.paging) return;
          this.params.page++;
          this.handleGetContractList();
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";
  @mixin contractBg($m) {
    $url: '../../../assets/image/houseResource/' + $m;
    @include bgImage($url);
  }
  #houseContract {
    > div {
      border-top: 2px solid #F2F2F2;
      header {
        padding: .2rem 2rem;
        min-height: 1rem;
        justify-content: space-between;
        a {
          width: 23pt;
          height: 23pt;
          background-color: rebeccapurple;
        }
        a.collect {
          @include contractBg('shoufanghetong-h.png');
        }
        a.collect-active {
          @include contractBg('shoufanghetong.png');
        }
        a.rent {
          @include contractBg('zufanghetong.png');
        }
        a.rent-active {
          @include contractBg('zufanghetong-lan.png');
        }
      }
      .main-content {
        background-color: #F2F2F2;
        padding: .2rem;
        .contract-item {
          min-height: 3rem;
          background-color: white;
          border-radius: 8px;
          padding: .2rem .3rem;
          &:not(:last-child) {
            margin-bottom: .2rem;
          }
          div.header {
            position: relative;
            h4,a,p{
              font-family: 'dingzitiblod';
            }
            h4 {
              min-width: 2rem;
            }
            a.contract-icon {
              padding: 0 .2rem;
              font-size: .2rem;
              margin-left: .2rem;
              border-radius: .05rem;
              text-align: center;
              vertical-align: middle;
              line-height: 2;
              color: #F56031;
              background-color: #FEEDE8;
            }
            a.contract-item-icon {
              background-color: #F2F7EC;
              color: #71B672;
            }
            p {
              position: absolute;
              top: 0;
              right: 0;
              font-size: .25rem;
              a.contract-icon-user {
                display: inline-block;
                width: 10pt;
                height: 10pt;
                vertical-align: middle;
                @include contractBg('kehu.png');
                margin-right: .1rem;
              }
            }
          }
          div.contract-time {
            padding: .1rem .4rem;
            margin: .2rem 0;
            h2 {
              font-family: 'dingzitiblod';
              font-size: .4rem;
              color: #00ACC1;
            }
            h3 {
              min-width: .2rem;
              a.pointer {
                width: 3pt;
                height: 3pt;
                background-color: #00ACC1;
                border-radius: 50%;
                margin: 0 .2rem;
                vertical-align: middle;
              }
              span {
                width: .8rem;
                height: 1px;
                background-color: #00ACC1;
              }
            }
          }
          div.contract-info {
            padding: .1rem 0;
            > div {
              width: 100%;
              min-height: .8rem;
              text-align: center;
              &:nth-child(2) {
                border-left: 1px dashed #808080;
                border-right: 1px dashed #808080;
              }
              h4,span {
                font-family: 'dingzitiblod';
              }
              h4 {
                font-size: .2rem;
                color: #808080;
                text-align: center;
                margin-bottom: .1rem;
              }
              span {
                color: #5E5E5E;
                font-size: .25rem;
              }
              span.during {
                color: #4F77FE;
              }
            }
          }
        }
        .noMore,.noData {
          text-align: center;
        }
        .noData {
          margin-top: 2rem;
        }
      }
    }
  }
</style>
