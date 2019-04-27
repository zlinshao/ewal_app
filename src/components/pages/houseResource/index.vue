<template>
  <div id="houseResource">
    <div class="houseResource" :style="mainListHeight()">
      <!--顶部筛选-->
      <div class="top-search" ref="topSearch">
        <div class="searchInput">
          <div class="input">
            <p @click="chooseClickCity(params.city)">
              {{city_name}}
              <i></i>
            </p>
            <div>
              <input type="text" placeholder="请输入搜索内容" v-model="params.search" @keyup.enter="onSearch()">
              <span v-if="params.search" @click="params.search = ''"></span>
            </div>
            <p class="searchBtn" @click="onSearch()">搜索</p>
          </div>
          <div class="chooseBtn" v-if="chooseCity">
            <p v-for="item in cityList" @click="chooseClickCity(item)">
              <b :class="{'choose': city_name === item.name}">{{item.name}}</b>
            </p>
          </div>
        </div>
        <div class="search-type flex-center">
          <span v-for="tmp in filter_list" :key="tmp.id" @click="handleFilterHouse(tmp)">
            {{ tmp.val }}
            <van-icon name="arrow-down" v-show="!tmp.active"></van-icon>
            <van-icon name="arrow-up" v-show="tmp.active"></van-icon>
          </span>
        </div>
      </div>
      <ExpandContainer :offset-top="offset_top" @close="handleCloseExpand">
        <div class="filter-content">
          <div class="chooseBtn">
            <p v-for="item in house_status" @click="chooseHouseStatus(item)">
              <b :class="{'choose': status_choose === item.id}">{{ item.val }}</b>
            </p>
          </div>
        </div>
      </ExpandContainer>
      <!--中间房源列表-->
      <div class="main-house-list" :style="mainHeight">
        <scroll-load :remHeight="remHeight" @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <div class="house flex" v-for="(item,key) in house_list" :key="key">
            <div class="leftPic">
              <img src="./house.jpg" alt="">
              <!--<a class="writingMode status1">{{ item.house_status_name }}</a>-->
              <a class="writingMode status2">未出租</a>
            </div>
            <div class="rightInfo">
              <h2>{{ item.name }} <a class="notice notice1" :class="['notice' + item.warning_status]"></a></h2>
              <div class="info flex">
                <a>{{ item.area }}㎡</a><i v-if="item.area"></i>
                <a>15/30</a><i></i>
                <a>{{ item.hk }}</a><i v-if="item.hk"></i>
                <a>南</a><i></i>
                <a>{{ item.decorate }}</a>
              </div>
              <div class="flex tag">
                <a class="tag1">余1年5月12天</a>
                <a class="tag2" v-if="item.quality === 1">低质量</a>
              </div>
              <div class="bottom flex">
                <a></a>
                <h3>已空置15天</h3>
                <span>{{ item.suggest_price }}</span>
              </div>
            </div>
          </div>
          <div class="noMore" v-if="house_list.length === paging && house_list.length > 4">
            <span v-if="!fullLoading">没有更多了</span>
          </div>
          <div class="noData" v-if="!house_list.length">
            <span v-if="!fullLoading">暂无相关数据...</span>
          </div>
        </scroll-load>
      </div>
    </div>
    <div class="commonFooterTag">
      <p v-for="item in 4" :class="['p-'+item]" @click="footerTag(item)"></p>
    </div>
  </div>
</template>

<script>
  import ExpandContainer from './expand-container.vue';

  export default {
    name: "index",
    components: { ExpandContainer },
    data() {
      return {
        server: globalConfig.server_market,
        offset_top: 0,

        mainHeight: '',
        paging: 0,
        remHeight: 0,
        fullLoading: false,

        //房屋筛选
        filter_list: [
          {id: 1,val: '房屋状态',active: false},
          {id: 2,val: '房屋熟悉',active: false},
          {id: 3,val: '部门员工',active: false},
          {id: 4,val: '筛选',active: false},
        ],
        house_status: [
          {id: 1,val: '不限'},
          {id: 2,val: '未出租'},
          {id: 3,val: '已预订'},
          {id: 4,val: '已出租'},
          {id: 5,val: '待入住'},
          {id: 6,val: '已结束'},
        ],
        status_choose: '',
        //城市选择
        cityList: [],
        chooseCity: false,
        city_name: '',
        searchList: [],

        params: {
          page: 1,
          limit: 12,
          search: '',
          name: '',
          city: [],
        },
        house_list: [], //房屋列表
      }
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.topSearch.offsetHeight;
        this.remHeight = top;
        this.mainHeight = this.mainListHeight(top + 50);
      });
      this.$http.getCityList().then(res => {
        this.cityList = res.data;
        this.getBeforeCity(res.data).then(res => {
          this.params.city = res.city;
          this.city_name = res.name;
        })
      });
      this.handleGetHouseResource();
    },
    watch: {},
    computed: {},
    methods: {
      //选择房屋状态
      chooseHouseStatus(tmp) {
        this.status_choose = tmp.id;
      },
      handleCloseExpand() {
        this.offset_top = 0;
        for (var item of this.filter_list) {
          item.active = false;
        }
      },
      //搜索
      onSearch() {
        this.handleGetHouseResource(this.params);
      },
      //获取房源列表
      handleGetHouseResource() {
        this.$http.get(this.server + 'v1.0/market/house',this.params,'加载中...').then(res => {
          console.log(res);
          if (res.code === 200) {
            this.house_list = res.data.data;
          } else {
            this.house_list = [];
          }
        })
      },
      //滚动
      scrollLoad(val) {
        console.log(val);
        if (!val) {
          this.params.page = 1;
          this.handleGetHouseResource();
        } else {
          if (this.house_list.length === this.paging) return;
          this.params.page++;
          this.handleGetHouseResource();
        }
      },
      //房屋筛选
      handleFilterHouse(tmp) {
        this.filter_list[tmp.id - 1].active = this.offset_top <= 0;
        switch (tmp.id) {
          case 1:
            break;
        }
        this.offset_top = this.offset_top <= 0 ? 117 : 0;
      },
      // 选择城市
      chooseClickCity(item) {
        this.chooseCity = !this.chooseCity;
        if (this.params.city === item) return;
        this.params.city = [];
        if (Array.isArray(item.code)) {
          this.params.city = item.code;
        } else {
          this.params.city.push(item.code);
        }
        this.city_name = item.name;
        this.searchList = [];
      },
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.routerLink('/index');
            break;
          case 4:
            this.routerLink('/toBeDoneList', {status: 'noFinish'});
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/houseResource/index.scss";

</style>
