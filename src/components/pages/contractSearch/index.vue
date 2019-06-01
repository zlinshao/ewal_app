<template>
  <div id="contractSearch" :style="mainListHeight()">
    <div class="searchInput">
      <div class="input">
        <p @click="chooseClickCity()">{{city_name}}<i></i></p>
        <div>
          <input type="text" v-model="params.search" @keyup.enter="onSearch" placeholder="输入房屋地址">
          <span v-if="params.search" @click="params.search = ''"></span>
        </div>
        <p v-if="params.search" class="searchBtn" @click="onSearch">搜索</p>
        <p v-if="!params.search" @click="$router.go(-1)">取消</p>
      </div>
      <div class="chooseBtn" v-if="chooseCity">
        <p v-for="item in cityList" @click="chooseClickCity(item)">
          <b :class="{'choose': city_name === item.name}">{{item.name}}</b>
        </p>
      </div>
    </div>
    <div class="searchHouse">
      <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
        <li v-for="item in searchList">
          <div class="contract_content" @click="onConfirm(item)">
            <div class="top">
              <h1>
                <b>收</b>
                <span>东方航空萨菲航空是东方航范德萨富士达空斯卡拉</span>
              </h1>
              <h2><span>生效中</span></h2>
            </div>
            <div class="main">
              <div><h1>房东</h1>
                <h2>冯宝宝</h2>
              </div>
              <div>
                <h1>开单人</h1>
                <h2>亮亮</h2>
              </div>
              <div class="department">
                <h1>所属片区</h1>
                <h2>南京马群一区</h2>
              </div>
            </div>
          </div>
        </li>
        <li class="popupSearch" v-if="!searchList.length">
          <div class="flex-center">
            <span v-if="fullLoading">暂无相关数据...</span>
            <span v-if="!params.search && !fullLoading">请输入搜索内容...</span>
          </div>
        </li>
      </scroll-load>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contract-search",
    data() {
      return {
        fullLoading: false,
        searchList: [],
        onConfig: {},
        paging: 0,
        params: {
          page: 1,
          limit: 20,
          search: '',
          city_id: '',
          contract_type: 1,
        },
        chooseCity: false,
        city_name: '',
      }
    },
    mounted() {
      for (let item of this.cityList) {
        if (String(item.code) === String(this.personal.city_id)) {
          this.city_name = item.name;
          this.params.city_id = item.code;
        }
      }
    },
    activated() {
      this.close_();
      this.bulletin_type = JSON.parse(sessionStorage.bulletin_type || {});
    },
    watch: {
      'params.search'(val) {
        this.params.search = val.replace(/\s+/g, '');
        if (!this.params.search) this.close_();
      },
    },
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      },
      cityList() {
        return this.$store.state.app.allCityList;
      }
    },
    methods: {
      scrollLoad(val) {
        if (!val) {
          if (this.fullLoading) return;
          if (this.searchList.length === this.paging) return;
          this.params.page++;
          this.getToBeDoneList(this.params);
        }
      },
      onSearch() {
        this.params.page = 1;
        this.searchList = [];
        this.fullLoading = false;
        this.$httpZll.getContractList(this.params).then(res => {
          this.fullLoading = true;
          if (res) {
            // this.searchList = res.data.data;
            // this.paging = res.data.count;
          }
        })
      },
      // 选择城市
      chooseClickCity(item) {
        this.chooseCity = !this.chooseCity;
        if (item) {
          if (item.name === this.city_name) return;
          this.city_name = item.name;
          this.params.city_id = item.code;
          this.close_();
        }
      },
      onConfirm(item) {
        console.log(item);
        this.routerLink('/collectReport');
      },
      close_() {
        this.params.page = 1;
        this.params.search = '';
        this.fullLoading = false;
        this.searchList = [];
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common/searchHouse.scss";

  #contractSearch {
    @include flex('bet-column');

    .searchInput {
      padding: .2rem .3rem 0;
    }
  }
</style>
