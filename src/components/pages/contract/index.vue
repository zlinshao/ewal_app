<template>
  <div id="contract">
    <div class="top-search" ref="topSearch">
      <div class="searchInput">
        <div class="input">
          <p @click="show_btn = !show_btn">
            {{params.contract_txt}}
            <i></i>
          </p>
          <div>
            <input type="text" placeholder="请输入搜索内容" v-model="params.search">
            <span v-if="params.search" @click="params.search = ''"></span>
          </div>
          <p class="searchBtn" @click="onSearch">搜索</p>
        </div>
        <div class="chooseBtn" v-if="show_btn">
          <p v-for="item in contract_type_list" @click="chooseClickType(item)">
            <b :class="{'choose': params.contract_type === item.id}">{{item.val}}</b>
          </p>
        </div>
      </div>
      <div class="search-type flex-center">
          <span v-for="tmp in filter_list" :key="tmp.id" @click="handleFilterContract(tmp)">
            {{ tmp.val }}
            <van-icon name="arrow-down"></van-icon>
          </span>
      </div>
    </div>
    <ExpandContainer :offset-top="offset_top">
      <div v-if="current_filter === 1" class="house-type">
        <h4>合同状态</h4>
        <div class="chooseBtn">
          <p v-for="item in status_list" @click="chooseHouseProperty(item,'remaining')">
            <b :class="{'choose': params.remaining === item.id }">{{ item.val }}</b>
          </p>
        </div>
        <h4>合同剩余时长</h4>
        <div class="chooseBtn">
          <p v-for="item in remaining_list" @click="chooseHouseProperty(item,'status')">
            <b :class="{'choose': params.status === item.id }">{{ item.val }}</b>
          </p>
        </div>
        <div class="commonBtn radioChecksFoot">
          <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type)">
            {{item.label}}
          </p>
        </div>
      </div>
      <div v-if="current_filter === 2" class="house-type">
        <StaffDepartSearch :visible="staff_depart_visible" @close="handleGetInfo"></StaffDepartSearch>
      </div>
    </ExpandContainer>
    <div class="main-content" ref="mainContent" :style="mainHeight">
      <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
        <div class="contract-item" v-for="(item,key) in contract_list" :key="key" @click="handleGoDetail(item)">
          <a class="status" :class="['status' + item.is_effective ]">{{ item.is_effective === 1 ? '生效中' : item.is_effective === 2 ? '快到期' : item.is_effective === 3 ? '已过期' : '已结束'}}</a>
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
  import ExpandContainer from '../houseResource/expand-container.vue';
  import StaffDepartSearch from '../../common/staff-depart-search.vue';

  export default {
    name: "index",
    components: { ExpandContainer ,StaffDepartSearch},
    data() {
      return {
        staff_depart_visible: false,

        buttons: [
          {
            label: '重置',
            type: 'reset'
          },
          {
            label: '确定',
            type: 'confirm'
          },
        ],
        //房屋筛选
        filter_list: [
          {id: 1,val: '合同搜索'},
          {id: 2,val: '员工部门'},
        ],
        current_filter: '',
        offset_top: 0,

        contract_type_list: [
          {id: 1,val: '收房'},
          {id: 2,val: '租房'},
        ],
        params: {
          page: 1,
          limit: 12,
          contract_type: 1,
          contract_txt: '收房',
          search: '',
          status: '',
          remaining: '',
          signer: [],
          org: []
        },
        status_list: [
          {id: 0,val: '不限'},
          {id: 1,val: '生效中'},
          {id: 2,val: '快到期'},
          {id: 3,val: '已过期'},
          {id: 4,val: '已结束'},
        ],
        remaining_list: [
          {id: 0,val: '不限'},
          {id: 1,val: '一年以下'},
          {id: 2,val: '1-2年'},
          {id: 3,val: '2年以上'},
        ],
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
      //合同详情
      handleGoDetail(item) {
        this.routerLink('/contract_detail',{contract_id: item.contract_id,contract_type: this.params.contract_type});
      },
      handleGetInfo(val,type) {
        console.log(val,type);
        if (val !== 'close') {
          switch (type) {
            case 'staff':
              this.params.signer = [];
              for (var staff of val) {
                this.params.signer.push(staff.id);
              }
              break;
            case 'depart':
              this.params.org = [];
              for (var depart of val) {
                this.params.org.push(depart.id);
                break;
              }
          }
          this.contract_list = [];
          this.handleGetContractList();
        }
        this.offset_top = 0;
        this.current_filter = '';
        this.staff_depart_visible = false;
      },
      searchBtn(type) {
        switch (type) {
          case 'reset':
            this.params.status = '';
            this.params.remaining = '';
            break;
          case 'confirm':
            this.contract_list = [];
            this.handleGetContractList();
            this.offset_top = '';
            this.current_filter = '';
            break;
        }
      },
      //选择
      chooseHouseProperty(item,type) {
        this.params[type] = item.id;
      },
      //房屋筛选
      handleFilterContract(tmp) {
        this.offset_top = this.current_filter === tmp.id ? 0 : 123;
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
      },
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
        this.contract_list = [];
        this.show_btn = false;
        this.handleGetContractList();
      },
      chooseClickType(item) {
        this.params.contract_type = item.id;
        this.params.contract_txt = item.val;
        this.show_btn = false;
        this.contract_list = [];
        this.handleGetContractList();
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
      .search-type {
        text-align: center;
        border-top: 1px solid #F4F4F4;
        margin-top: 10px;
        padding: .2rem .3rem 0 .3rem;
        span {
          width: 100%;
          .van-icon {
            vertical-align: middle;
            font-size: 12px;
          }
          &:not(:last-child) {
            margin-right: 4px;
          }
        }
      }
    }
    .chooseBtn {
      @include flex('items-center');
      flex-wrap: wrap;
      p {
        margin-top: .2rem;
        padding: 0 .1rem;
        width: 25%;
        @include flex('flex-center');
        b {
          width: 100%;
          padding: .2rem 0;
          text-align: center;
          @include radius(1rem);
          background-color: #EEEDEE;
        }
        div.van-cell,div.van-field {
          width: 100%;
          padding: .1rem 0;
          padding-left: .2rem;
          text-align: center;
          @include radius(1rem);
          background-color: #EEEDEE;
        }
        .choose {
          background-color: rgba(69, 112, 254, .1);
          color: #4570FE;
        }
      }
    }
    .house-type {
      > div {
        margin-bottom: 10px;
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
          min-width: 1.5rem;
          padding: .1rem .15rem;
          border-radius: .1rem 0 0 .1rem;
          text-align: center;
          font-size: .25rem;
        }
        a.status1 {
          color: #84B74F;
          background-color: #E5F0D9;
        }
        a.status2 {
          color: #FEA434;
          background-color: #FFE9CE;
        }
        a.status3 {
          color: #A7A7A7;
          background-color: #E6E6E6;
        }
        a.status4 {
          color: #F66E44;
          background-color: #FDDCD2;
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
