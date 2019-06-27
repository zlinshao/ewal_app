<template>
  <div id="contract">
    <div class="top-search" ref="topSearch">
      <div class="searchInput">
        <div class="input">
          <p @click="show_btn = !show_btn">
            {{contract_txt}}
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
          <p v-for="item in status_list" @click="chooseHouseProperty(item,'status')">
            <b :class="{'choose': params.status === item.id }">{{ item.val }}</b>
          </p>
        </div>
        <h4>合同剩余时长</h4>
        <div class="chooseBtn">
          <p v-for="item in remaining_list" @click="chooseHouseProperty(item,'remaining')">
            <b :class="{'choose': params.remaining === item.id }">{{ item.val }}</b>
          </p>
        </div>
        <div class="commonBtn">
          <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type)">
            {{item.label}}
          </p>
        </div>
      </div>
      <div v-if="current_filter === 2" class="house-type">
        <StaffDepartSearch :visible="staff_depart_visible" @close="handleGetInfo"></StaffDepartSearch>
      </div>
    </ExpandContainer>
    <!-- 列表 -->
    <div class="mainContent" ref="main-Content" :style="mainHeight">
      <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
        <li v-for="item in contract_list" v-if="contract_list.length">
          <div class="contract_content" @click="handleGoDetail(item)">
            <div class="top">
              <h1>
                <b>{{params.contract_type === 1 ? '收' : '租'}}</b>
                <span v-if="item.house_name ">{{item.house_name}}</span>
                <span v-else>******</span>
              </h1>
              <h2>
                <span v-for="status in status_list"  v-if="status.id==item.contract_status">{{status.val}}</span>
              </h2>
            </div>
            <div class="main">
              <div>
                <h1>{{params.contract_type === 1 ? '房东' : '租客'}}</h1>
                <h2 v-if="item.customer_info && item.customer_info[0].name">
                  <span>{{item.customer_info[0].name}}</span>
                </h2>
                <h2 v-else>******</h2>
              </div>
              <div>
                <h1>开单人</h1>
                <h2 v-if="item.sign_user">
                  <span>{{item.sign_user}}</span>
                </h2>
                <h2 v-else>******</h2>
              </div>
              <div class="department">
                <h1>所属片区</h1>
                <h2 v-if="item.sign_org ">
                  <span>{{item.sign_org}}</span>
                </h2>
                <h2 v-else>******</h2>
              </div>
            </div>
          </div>
        </li>
        <li class="noMore" v-if="contract_list.length === paging && contract_list.length > 4">
          <span v-if="!fullLoading">没有更多了</span>
        </li>
        <li class="noData" v-if="!contract_list.length">
          <span v-if="!fullLoading">暂无相关数据...</span>
        </li>
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
        current_filter: '',   //1合同搜索 2员工部门
        offset_top: 0,
        show_btn: false,
        fullLoading: false,
        mainHeight: {
          height: 0
        },
        //筛选条件
        filter_list: [
          {id: 1,val: '合同搜索'},
          {id: 2,val: '员工部门'},
        ],
        contract_type_list: [
          {id: 1,val: '收房'},
          {id: 2,val: '租房'},
        ],
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
        contract_txt:'收房',     //收租
        paging: 0,           //总条数
        contract_list: [],    //列表
        params: {
          search:'',          //搜索字段
          status:'' ,          //合同状态
          remaining:'',        //合同剩余时长
          signer: [],          //员工
          org: [],             //部门
          contract_type: 1,    //收租类型，默认收房
          page: 1,
          limit: 6,          //没有分页
          from:'mobile',        //mobile app端
          city_name:'',        //城市
        },
      }
    },
    created() {

    },
    mounted() {
    },
    activated(){
      this.resetParams();
      let top = this.$refs['main-Content'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      this.params.city_name=this.personal.city_name; //城市赋值
    },
    watch: {
      'params.search'(val) {
        this.params.search = val.replace(/\s+/g, '');
      },
    },
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      }
    },
    methods: {
      //选择收租类型
      chooseClickType(item) {
        this.params.contract_type = item.id;
        this.contract_txt = item.val;
        this.show_btn = false;
        this.params.page=1;
        this.contract_list = [];
        this.handleGetContractList();
      },
      //选择合同状态、剩余时长
      chooseHouseProperty(item,type) {
        this.params[type] = item.id;
      },
      //选择员工或部门
      handleGetInfo(val,type) {
        this.params.signer = [];
        this.params.org = [];
        if (val !== 'close') {
          let arr=[];
          for (let  item of val) {
            arr.push(item.id);
          }
          switch (type) {
            case 'staff':
              this.params.signer = arr;
              break;
            case 'depart':
              this.params.org = arr;
              break;
          }
        }
        this.params.page=1;
        this.contract_list = [];
        this.handleGetContractList();
        this.offset_top = 0;
        this.current_filter = '';
        this.staff_depart_visible = false;
      },
      //合同搜索的确定、重置按钮
      searchBtn(type) {
        switch (type) {
          case 'reset':
            this.params.status = '';
            this.params.remaining = '';
            break;
          case 'confirm':
            this.params.page=1;
            this.contract_list = [];
            this.handleGetContractList();
            this.offset_top = '';
            this.current_filter = '';
            break;
        }

      },
      //搜索按钮
      onSearch() {
        this.params.page=1;
        this.contract_list = [];
        this.show_btn = false;
        this.handleGetContractList();
      },
      //列表
      handleGetContractList() {
        this.fullLoading = true;
        this.$httpZll.getContractList(this.params).then(res => {
          this.fullLoading = false;
          for (let item of res.data) {
            this.contract_list.push(item);
          }
          this.paging = res.count;
        })
      },
      //分页
      scrollLoad(val) {
        if (!val) {
          this.params.page = 1;
          this.contract_list = [];
          this.handleGetContractList();
        } else {
          if(this.fullLoading) return;
          if (this.contract_list.length === this.paging) return;
          this.params.page++;
          this.handleGetContractList();
        }
      },
      //重置params
      resetParams() {
        this.params = {
          page: 1,
          limit: 6,          //没有分页
          contract_type: 1,    //收租类型，默认收房
          search:'',          //搜索字段
          status:'' ,          //合同状态
          remaining:'',        //合同剩余时长
          signer: [],          //员工
          org: [],             //部门
          from:'mobile',
          city_name:'',        //城市
        };
      },

      //房屋筛选
      handleFilterContract(tmp) {
        this.offset_top = this.current_filter === tmp.id ? 0 : 123;
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
      },

      //合同详情
      handleGoDetail(item) {
        let param={
          contract_id: item.contract_id,
          contract_type: this.params.contract_type
        }
        this.routerLink('/contract_detail',param);
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
    /*列表*/
    ul {
      background: transparent;
      li {
        padding: 0;
        margin-bottom: .15rem;
        .contract_content {
          width: 100%;
          @include radius(.1rem);
          background-color: #FFFFFF;
          padding: .3rem 0 .3rem .3rem;

          .top {
            @include flex('items-bet');
            width: 100%;

            h1, h2 {
              @include flex('items-bet');
            }

            h1 {
              overflow: hidden;

              b {
                margin-right: .1rem;
                min-width: .45rem;
                max-width: .45rem;
                height: .45rem;
                @include flex('flex-center');
                @include radius(.1rem);
                color: #4570FE;
                background-color: rgba(69, 112, 254, .2);
              }

              span {
                @include ellipsis;
              }
            }

            h2 {
              white-space: nowrap;
              padding: .1rem .2rem;
              color: #7BB242;
              @include radius(.1rem 0 0 .1rem);
              background-color: rgba(123, 178, 66, .2);
            }

            .status {

            }
          }

          .main {
            width: 100%;
            margin-top: .4rem;
            @include flex();

            div {
              padding: 0 .24rem;
              width: 30%;

              h1, h2 {
                text-align: center;
              }

              h1 {
                color: #D2D2D2;
              }

              h2 {
                margin-top: .2rem;
                font-size: .26rem;

                span {
                  font-size: .26rem;
                }
              }
            }

            div {
              border-right: 1px dashed #A2A2A2;
            }

            .department {
              width: 40%;
              border-right: none;
            }
          }
        }
      }
      .noMore, .noData {
        @include flex('flex-center');
        width: 100%;
        padding: .2rem;
        background: transparent;
      }
      .noData {
        height: 8rem;
      }
    }
    .mainContent {
      //@include scroll;
      /*height: 100%;*/
      /*padding: 0 .25rem;*/
      background-color: #F2F2F2;
      padding: .2rem .3rem 0;
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

    }
  }
</style>
