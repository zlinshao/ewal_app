<template>
  <div id="searchHouse">
    <van-popup overlay-class="overlay-color" v-model="searchModule" position="bottom" :overlay="true">
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
            <li v-for="item in searchList">
              <div class="contract_content" @click="onConfirm(item)">
                <div class="top">
                  <h1>
                    <b>收</b>
                    <span v-if="item.house_name && item.house_name.name">{{item.house_name.name}}</span>
                    <span v-else>******</span>
                  </h1>
                  <h2><span>生效中</span></h2>
                </div>
                <div class="main">
                  <div>
                    <h1>房东</h1>
                    <h2 v-if="item.customer_info && item.customer_info[0].name">
                      <span>{{item.customer_info[0].name}}</span>
                    </h2>
                    <h2 v-else>
                      ******
                    </h2>
                  </div>
                  <div>
                    <h1>开单人</h1>
                    <h2 v-if="item.sign_user && item.sign_user.name">
                      <span>{{item.sign_user.name}}</span>
                    </h2>
                    <h2 v-else>
                      ******
                    </h2>
                  </div>
                  <div class="department">
                    <h1>所属片区</h1>
                    <h2 v-if="item.sign_org && item.sign_org.name">
                      <span>{{item.sign_org.name}}</span>
                    </h2>
                    <h2 v-else>
                      ******
                    </h2>
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
          limit: 50,
          status: 1,// 1-生效中，2-快到期，3-已过期， 4-已结束
          contract_type: 1,
          city_name: '',
          from: 'task',
          search: '',
        },
        chooseCity: false,
        city_name: '',
      }
    },
    mounted() {
    },
    activated() {
      for (let item of this.cityList) {
        if (String(item.code) === String(this.personal.city_id)) {
          this.city_name = item.name;
          this.params.city_name = item.name + '市';
        }
      }
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
        } else {
          this.paramsReset();
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
        this.close_('no');
        this.$httpZll.getContractList(this.params).then(res => {
          this.fullLoading = true;
          if (res) {
            this.searchList = res.data;
          }
        })
      },
      // 确认选择
      onConfirm(item) {
        let form = {};
        form.house_id = item.house_id || '';
        form.contract_id = item.contract_id || '';
        form.address = item.house_name.name || '******';
        this.$emit('close', form, this.onConfig);
      },
      close_(val) {
        this.chooseCity = false;
        this.params.page = 1;
        this.fullLoading = false;
        this.searchList = [];
        if (val === 'no') return;
        this.params.search = '';
      },
      // 选择城市
      chooseClickCity(item) {
        this.chooseCity = !this.chooseCity;
        if (item) {
          if (item.name === this.city_name) return;
          this.city_name = item.name;
          this.params.city_name = item.name + '市';
          this.close_();
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common/searchHouse.scss";
</style>
