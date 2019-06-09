<template>
  <div id="searchDepart">
    <van-popup overlay-class="overlay-color" v-model="searchModule" position="bottom" :overlay="true">
      <div class="searchModule" :style="mainListHeight(150)">
        <div class="popupTop">
          <p>请选择部门</p>
        </div>
        <div class="searchInput crumbs">
          <span v-for="(item,index) in crumbs" @click="crumbsList(item.id)"
                :class="{'colorChoose': index === crumbs.length - 1}">{{item.name}}<b
            v-if="index !== crumbs.length - 1">-</b></span>
        </div>
        <div class="popupSearch depart">
          <ul v-if="departList.length">
            <li v-for="item in departList" :class="{'chooseDepart': department.id === item.id}">
              <p>
                <i @click="chooseDepart(item)">
                  <b></b>
                </i>
                <span class="line-clamp1" @click="clickDepart(item, 'prompt')">{{item.name}}</span>
              </p>
              <div>{{departList.length}}</div>
            </li>
          </ul>
          <div class="flex-center" v-else>
            <span v-if="fullLoading">暂无相关数据...</span>
          </div>
        </div>
        <div class="commonBtn searchFoot">
          <p class="btn back" @click="close_">清空</p>
          <p class="btn" @click="sureDepart">确定</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-depart",
    props: ['module'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        departList: [],
        department: {
          id: '',
          name: '',
        },
        crumbs: [
          {
            id: 1,
            name: '乐伽商业管理有限公司',
          },
        ],
      }
    },
    mounted() {
      this.getList(1);
    },
    activated() {
    },
    watch: {
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
      getList(org = 1, status) {
        return new Promise(resolve => {
          this.departList = [];
          this.fullLoading = false;
          this.$httpZll.getOrganization(org, status).then(res => {
            this.fullLoading = true;
            if (res.code.endsWith('0')) {
              this.departList = res.data.data;
            }
          });
          resolve(true);
        })
      },
      // 下级事件
      clickDepart(val, status) {
        this.getList(val.id, status).then(_ => {
          this.crumbs.push(val);
        });
      },
      // 面包屑
      crumbsList(val) {
        let crumbs = this.crumbs;
        crumbs.forEach((res, index) => {
          if (res.id === val) {
            if (crumbs[crumbs.length - 1].id !== val) {
              this.getList(val).then(_ => {
                crumbs.splice(index + 1, crumbs.length - 1);
              });
            }
          }
        });
      },
      chooseDepart(item) {
        this.department.id = item.id;
        this.department.name = item.name;
      },
      sureDepart() {
        if (this.department.id) {
          this.$emit('close', this.department);
        } else {
          this.searchModule = false;
        }
      },
      close_() {
        this.department.id = '';
        this.department.name = '';
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
