<template>
  <div id="contractSearch" :style="mainListHeight()">
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
        <p v-if="!params.search" @click="$router.go(-1)">取消</p>
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
      <!--<scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">-->
      <!--  <li v-for="item in searchList">-->
      <!--    <div class="contract_content" @click="onConfirm(item)">-->
      <!--      <div class="top">-->
      <!--        <h1>-->
      <!--          <b>收</b>-->
      <!--          <span>{{item.house_name}}</span>-->
      <!--        </h1>-->
      <!--        <h2><span>生效中</span></h2>-->
      <!--      </div>-->
      <!--      <div class="main">-->
      <!--        <div>-->
      <!--          <h1>房东</h1>-->
      <!--          <h2 v-if="item.customer_info && item.customer_info[0].name">-->
      <!--            <span>{{item.customer_info[0].name}}</span>-->
      <!--          </h2>-->
      <!--          <h2 v-else>-->
      <!--            ******-->
      <!--          </h2>-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <h1>开单人</h1>-->
      <!--          <h2 v-if="item.sign_user && item.sign_user.name">-->
      <!--            <span>{{item.sign_user.name}}</span>-->
      <!--          </h2>-->
      <!--          <h2 v-else>-->
      <!--            ******-->
      <!--          </h2>-->
      <!--        </div>-->
      <!--        <div class="department">-->
      <!--          <h1>所属片区</h1>-->
      <!--          <h2 v-if="item.sign_org && item.sign_org.name">-->
      <!--            <span>{{item.sign_org.name}}</span>-->
      <!--          </h2>-->
      <!--          <h2 v-else>-->
      <!--            ******-->
      <!--          </h2>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </li>-->
      <!--  <li class="popupSearch" v-if="!searchList.length">-->
      <!--    <div class="flex-center">-->
      <!--      <span v-if="fullLoading">暂无相关数据...</span>-->
      <!--      <span v-if="!params.search && !fullLoading">请输入搜索内容...</span>-->
      <!--    </div>-->
      <!--  </li>-->
      <!--</scroll-load>-->
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
        params: {
          page: 1,
          limit: 50,
          status: 1,
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
      for (let item of this.cityList) {
        if (String(item.code) === String(this.personal.city_id)) {
          this.city_name = item.name;
          this.params.city_name = item.name + '市';
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
      // scrollLoad(val) {
      //   if (!val) {
      //     if (this.fullLoading) return;
      //     if (this.searchList.length === this.paging) return;
      //     this.params.page++;
      //     this.getToBeDoneList(this.params);
      //   }
      // },
      onSearch() {
        this.close_('no');
        this.$httpZll.getContractList(this.params).then(res => {
          this.fullLoading = true;
          if (res) {
            this.searchList = res.data;
          }
        })
      },
      onConfirm(item) {
        let data = {};
        data.house_id = item.house_id || '';
        data.contract_id = item.contract_id || '';
        data.address = item.house_name.name || '';
        sessionStorage.setItem('task_detail', JSON.stringify({content: data}));
        this.routerReplace('/collectReport');
      },
      close_(val) {
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
  @import "../../../assets/scss/common/searchHouse.scss";

  #contractSearch {
    @include flex('bet-column');

    .searchInput {
      padding: .2rem .3rem 0;
    }
  }
</style>
