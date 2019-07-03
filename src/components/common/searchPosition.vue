<template>
  <div id="searchStaff">
    <van-popup overlay-class="overlay-color" v-model="searchModule" position="bottom" :overlay="true">
      <div class="searchModule" :style="mainListHeight(150)">
        <div class="popupTop">
          <p>请选择岗位</p>
        </div>
        <div class="searchInput">
          <div class="input">
            <div>
              <input type="text" v-model="keywords" @keyup.enter="onSearch" placeholder="输入岗位名称">
              <span v-if="keywords" @click="keywords = ''"></span>
            </div>
            <p v-if="keywords" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!keywords" @click="searchModule = false">取消</p>
          </div>
        </div>
        <div class="popupSearch">
          <ul v-if="searchList.length">
            <li v-for="item in searchList" @click="pickChoose(item)">
              <p class="position">{{item.name}}</p>
              <div v-if="config.org_name" class="department">
                {{config.org_name}}
              </div>
              <div v-else>---</div>
            </li>
          </ul>
          <div class="flex-center" v-else>
            <span v-if="fullLoading">暂无相关数据...</span>
            <span v-if="!keywords && !fullLoading">请输入搜索内容...</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-staff",
    props: ['module', 'config'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        keywords: '',
        searchList: [],
        positionList: {
          id: [],
          name: '',
        },
        staffOldValue: [],
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      keywords(val) {
        this.keywords = val.replace(/\s+/g, '');
        if (!this.keywords) this.close_();
      },
      module(val) {
        this.searchModule = val;
      },
      searchModule(val) {
        if (!val) {
          this.$emit('close', 'close');
          this.fullLoading = false;
        }
      },
    },
    computed: {},
    methods: {
      onSearch() {
        let keywords = this.keywords;
        if (!keywords) return;
        this.searchStaff(keywords);
      },
      // 部门人员
      searchStaff(val = '') {
        this.fullLoading = false;
        this.searchList = [];
        let params = {
          search: val,
          org_id: this.config.org_id,
        };
        this.$httpZll.searchPositionList(params).then(res => {
          this.fullLoading = true;
          this.searchList = res.data.data;
        })
      },
      // 确认选择岗位
      pickChoose(val) {
        let data = {};
        data.id = val.id || '';
        data.name = val.name || '';
        this.cancel(data, val);
      },
      cancel(data, val) {
        this.$emit('close', data, val);
        this.keywords = '';
      },
      // 清空
      close_() {
        this.searchList = [];
        this.fullLoading = false;
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #searchStaff {
    .position {
      white-space: nowrap;
    }

    .department {
      @include ellipsis;
      padding-left: .3rem;
      white-space: nowrap;
      color: #A9A9A9;
    }
  }
</style>
