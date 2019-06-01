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
            <div>
              <input type="text" v-model="params.search" @keyup.enter="onSearch" placeholder="输入房屋地址">
              <span v-if="params.search" @click="params.search = ''"></span>
            </div>
            <p v-if="params.search" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!params.search" @click="searchModule = false">取消</p>
          </div>
        </div>
        <div class="searchHouse">
          <ul v-if="searchList.length">
            <li v-for="item in searchList" @click="onConfirm(item)">
              <div class="content">
                <div>
                  <h1>
                    <b>收</b>
                    <span>东方航空萨菲航空是东方航空斯卡拉</span>
                  </h1>
                  <h2>
                    <span>生效中</span>
                  </h2>
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
        searchModule: true,
        fullLoading: false,
        searchList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        total: 0,
        onConfig: {},
        params: {},
      }
    },
    mounted() {
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
      }
    },
    methods: {
      onSearch() {
        this.fullLoading = false;
        this.$httpZll.searchHouseList(this.params).then(res => {
          this.fullLoading = true;
          if (res) {
            this.searchList = res.data.data;
            this.total = res.data.all_count;
          }
        })
      },
      onConfirm(item) {
        let form = {};
        form.house_id = item.id;
        form.contract_id = item.last_lord.id || '';
        form.address = item.name;
        this.$emit('close', form, this.onConfig);
      },
      close_() {
        this.fullLoading = false;
        this.searchList = [];
        this.total = 0;
        this.params = {
          city_id: '320100',
          search: '',
          page: 1,
          limit: 20,
          status: [1],
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #searchHouse {
    .searchHouse {
      @include scroll;
      height: 100%;
      padding: 0 .25rem;
      background-color: #A2A2A2;

      ul {

        li {
          padding: 0;
          margin-bottom: .3rem;

          .content {
            width: 100%;
            @include radius(.1rem);
            background-color: #FFFFFF;
            padding: .3rem 0 .3rem .3rem;

            div, h1, h2 {
              @include flex('items-bet');
            }

            div {
              h1 {
                b {
                  margin-right: .1rem;
                  width: .45rem;
                  height: .45rem;
                  text-align: center;
                  line-height: .45rem;
                  @include radius(.1rem);
                  color: #4570FE;
                  background-color: rgba(69, 112, 254, .2);
                }
              }

              h2 {

              }
            }
          }
        }
      }
    }
  }
</style>
