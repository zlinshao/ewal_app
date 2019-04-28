<template>
  <div id="searchVillage">
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="searchModule" position="bottom"
               :overlay="true">
      <div class="searchModule" :style="mainListHeight(150)">
        <div class="popupTop">
          <p>请选择小区</p>
        </div>
        <div class="searchInput">
          <div class="input">
            <p @click="chooseClickCity(params.city)">
              {{city_name}}
              <i></i>
            </p>
            <div>
              <input type="text" v-model="params.name" @keyup.enter="onSearch" placeholder="请输入搜索内容">
              <span v-if="params.name" @click="params.name = ''"></span>
            </div>
            <p v-if="params.name" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!params.name" @click="searchModule = false">取消</p>
          </div>
          <div class="chooseBtn" v-if="chooseCity">
            <p v-for="item in cityList" @click="chooseClickCity(item)">
              <b :class="{'choose': city_name === item.name}">{{item.name}}</b>
            </p>
          </div>
        </div>
        <div class="popupSearch">
          <ul v-if="searchList.length ">
            <li v-for="item in searchList" @click="onConfirm(item)">{{item.address}}</li>
          </ul>
          <div class="flex-center" v-else>
            <span v-if="fullLoading">暂无相关数据...</span>
            <span v-if="!params.name && !fullLoading">请输入搜索内容...</span>
          </div>
        </div>
        <div class="commonBtn searchFoot">
          <p class="btn" @click="routerLink('/createdVillage')">新增小区</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-village",
    props: ['module', 'config'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        chooseCity: false,
        searchList: [],
        cityList: [],
        city_name: '',
        params: {
          name: '',
          city: [],
        },
      }
    },
    mounted() {
      this.$httpZll.getCityList().then(res => {
        this.cityList = res.data;
        this.getBeforeCity(res.data).then(res => {
          this.params.city = res.city;
          this.city_name = res.name;
        })
      });
    },
    activated() {
    },
    watch: {
      'params.name'(val) {
        this.params.name = val.replace(/\s+/g, '');
        if (!this.params.name) this.close_();
      },
      module(val) {
        this.searchModule = val;
      },
      searchModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
    },
    computed: {},
    methods: {
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
      // 搜索
      onSearch() {
        if (!this.params.name) return;
        this.fullLoading = false;
        this.$httpZll.searchVillageList(this.params).then(res => {
          this.fullLoading = true;
          this.searchList = res.data.data;
        });
      },
      onConfirm(val) {
        let data = {};
        data.id = val.id;
        data.name = val.village_name;
        this.params = {
          name: '',
          city: [],
        };
        this.searchList = [];
        this.$emit('close', data, val);
      },
      close_() {
        this.searchList = [];
        this.fullLoading = true;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
