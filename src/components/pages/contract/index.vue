<template>
  <div id="contract">
    <div class="top-search flex-center" ref="topSearch">
      <div class="searchInput">
        <div class="input">
          <p @click="show_btn = !show_btn">
            {{params.contract_txt}}
            <i></i>
          </p>
          <div>
            <input type="text" placeholder="请输入搜索内容" v-model="params.search" @keyup.enter="onSearch()">
            <span v-if="params.search" @click="params.search = ''"></span>
          </div>
          <p class="searchBtn" @click="onSearch()">搜索</p>
        </div>
        <div class="chooseBtn" v-if="show_btn">
          <p v-for="item in contract_type_list" @click="chooseClickType(item)">
            <b :class="{'choose': params.contract_type === item.id}">{{item.val}}</b>
          </p>
        </div>
      </div>
    </div>
    <div class="main-content" ref="mainContent" :style="mainHeight">
      <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
        <div class="contract-item" v-for="(item,key) in contract_list" :key="key">
          <a class="status">生效中</a>
          <h2>
            <a class="type-icon icon-collect" v-if="params.contract_type === 1">收</a>
            <a class="type-icon icon-rent" v-if="params.contract_type === 2">租</a>
            {{ item.house_name || '/' }}
          </h2>
          <div class="contract-info flex-center">
            <div>
              <h4>房东</h4>
              <span class="during">{{ item.customer_info && item.customer_info.length > 0 && item.customer_info[0].name || '/'}}</span>
            </div>
            <div>
              <h4>开单人</h4>
              <span>{{ item.sign_user || '/'}}</span>
            </div>
            <div>
              <h4>所属部门</h4>
              <span>{{ item.sign_org || '/'}}</span>
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
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        contract_type_list: [
          {id: 1,val: '收房'},
          {id: 2,val: '租房'},
        ],
        params: {
          page: 1,
          limit: 12,
          contract_type: 1,
          contract_txt: '收房',
          search: ''
        },
        show_btn: false,
        mainHeight: {
          height: 0
        },

        paging: 0,
        fullLoading: false,
        contract_list: [],
      }
    },
    mounted() {
      var top = this.$refs['mainContent'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      this.handleGetContractList();
    },
    watch: {},
    computed: {},
    methods: {
      handleGetContractList() {
        this.fullLoading = true;
        this.$httpHs.ContractList(this.params,'加载中...').then(res => {
          this.fullLoading = false;
          for (var item of res.data) {
            this.contract_list.push(item);
          }
          this.paging = res.count;
        })
      },
      scrollLoad(val) {
        console.log(val);
        if (!val) {
          this.contract_list = [];
          this.handleGetContractList();
        } else {
          if(this.fullLoading) return;
          if (this.contract_list.length === this.paging) return;
          this.params.page++;
          this.handleGetContractList();
        }
      },
      onSearch() {
        this.show_btn = false;
      },
      chooseClickType(item) {
        this.params.contract_type = item.id;
        this.params.contract_txt = item.val;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #contract {
    .top-search {
      padding: .3rem 0;
      border-top: .1rem solid #F4F4F4;
      border-bottom: .1rem solid #F4F4F4;
      .searchInput {
        padding:0 .3rem;
        margin-top: .1rem;
      }
    }
    .main-content {
      background-color: #F2F2F2;
      padding: .2rem .3rem;
      .contract-item {
        min-height: 2.5rem;
        background-color: white;
        border-radius: 8px;
        position: relative;
        padding: .2rem;
        &:not(:last-child) {
          margin-bottom: .2rem;
        }
        a.status {
          position: absolute;
          top: .2rem;
          right: 0;
          background-color: #E5F0D9;
          min-width: 1.5rem;
          padding: .1rem .15rem;
          border-radius: .1rem 0 0 .1rem;
          text-align: center;
          color: #84B74F;
          font-size: .25rem;
        }
        a.type-icon {
          width: 8pt;
          height: 8pt;
          padding: .05rem;
          font-size: .25rem;
          border-radius: .08rem;
          margin-right: .1rem;
        }
        a.icon-collect {
          background-color: #ECF0FF;
          color: #6589FF;
        }
        a.icon-rent {
          background-color: #FFE9CE;
          color: #FE9E26;
        }
        a,h2{
          font-family: 'dingzitiblod';
        }
        div.contract-info {
          padding: .1rem 0;
          margin-top: .5rem;
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
</style>
