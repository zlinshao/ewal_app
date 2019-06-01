<template>
  <div id="searchHouse">
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="searchModule" position="bottom"
               :overlay="true">
      <div class="searchModule" :style="mainListHeight(88)">
        <div class="popupTop">
          <p>请选择房屋</p>
          <h3></h3>
        </div>
        <div class="searchInput">
          <div class="input">
            <p @click="chooseClickCity()">
              {{city_name}}
              <i></i>
            </p>
            <div>
              <input type="text" v-model="params.search" @keyup.enter="onSearch" placeholder="输入房屋地址">
              <span v-if="params.search" @click="params.search = ''"></span>
            </div>
            <p v-if="params.search" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!params.search" @click="searchModule = false">取消</p>
          </div>
          <div class="chooseBtn" v-if="chooseCity">
            <p v-for="item in cityList" @click="chooseClickCity(item)">
              <b :class="{'choose': city_name === item.name}">{{item.name}}</b>
            </p>
          </div>
        </div>
        <div class="searchHouse">
          <ul v-if="searchList.length">
            <li v-for="item in searchList" @click="onConfirm(item)">
              <div class="contract_content">
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
          </ul>
          <div class="popupSearch" v-else>
            <div class="flex-center">
              <span v-if="fullLoading">暂无相关数据...</span>
              <span v-if="!params.search && !fullLoading">请输入搜索内容...</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-house",
    props: ['module', 'config'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        searchList: [],
        onConfig: {},
        params: {
          page: 1,
          limit: 20,
          search: '',
          city_id: '',
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
    },
    watch: {
      'params.search'(val) {
        this.params.search = val.replace(/\s+/g, '');
        if (!this.params.search) this.close_();
      },
      module(val) {
        this.searchModule = val;
      },
      config(val) {
        this.onConfig = val;
      },
      searchModule(val) {
        this.close_();
        if (!val) {
          this.$emit('close', 'close');
        }
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
      onSearch() {
        this.fullLoading = false;
        this.$httpZll.getContractList(this.params).then(res => {
          this.fullLoading = true;
          if (res) {
            // this.searchList = res.data.data;
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
        let form = {};
        form.house_id = item.id;
        form.contract_id = item.last_lord.id || '';
        form.address = item.name;
        this.$emit('close', form, this.onConfig);
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
  @import "../../assets/scss/common/searchHouse.scss";
</style>
