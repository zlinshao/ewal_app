<template>
  <div id="app">
    <div v-if="!loading">
      <transition :name="transitionName">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app",
    data() {
      return {
        loading: false,
        transitionName: '',
        personal: {},
      }
    },
    created() {
      let data = {};
      data.staff_id = '69';
      data.staff_name = '张琳琳';
      data.department_id = '134';
      data.department_name = '南京马群组';
      data.city_id = '320100';
      data.city_name = '南京市';
      this.personal = data;
      this.$store.dispatch('personal_storage', JSON.stringify(data));
      dd.ui.webViewBounce.disable();
      // this.loading = true;
      // this.personalGet().then(res => {
      //   this.loading = !res;
      // });
      this.getDict();
      dd.biz.navigation.setRight({show: false});
      sessionStorage.setItem('windowHeight', String(window.innerHeight));
      sessionStorage.setItem('windowWidth', String(window.innerWidth));
    },
    mounted() {

    },
    activated() {
    },
    watch: {
      // 使用watch 监听$router的变化
      $route(to, from) {
        // 页面高度
        if (to.path === '/') {
          this.closeDD();
          window.close();
        }
        // 如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > 0) {
          if (to.meta.index < from.meta.index) {
            this.transitionName = 'slide-right';
          } else {
            this.transitionName = 'slide-left';
          }
        } else if (to.meta.index === 0 && from.meta.index > 0) {
          this.transitionName = 'slide-right';
        }
        // 当然，如果你没有需要设置索引值为0的页面可以直接用着一段
        // if (to.meta.index < from.meta.index) {
        //   this.transitionName = 'slide-right';
        // } else {
        //   this.transitionName = 'slide-left';
        // }
      }
    },
    computed: {},
    methods: {
      // 字典
      getDict() {
        // 楼层
        for (let i = -3; i < 41; i++) {
          // 第几层
          if (i !== 0) {
            dicties.floors.value_0.push('第 ' + i + ' 层');
          }
          // 共多少层
          if (i > 0) {
            dicties.floors.value_1.push('共 ' + i + ' 层');
          }
        }
        // 建筑年限
        let year = [];
        for (let i = 1970; i < 2100; i++) {
          year.push(i);
        }
        dicties.built_year = year;
        // 所有城市
        this.$httpZll.getAllCityList().then(res => {
          let data = {};
          for (let val of res.data) {
            data[val.province_id] = val.province_name;
          }
          dicties.province = data;
        });
        // 字典
        this.$httpZll.getAllDict().then(res => {
          let dict = res.data;
          dicties.decorate = dict[404];//装修
          dicties.card_type = dict[409];//证件类型
          dicties.property_type = dict[410];//房屋类型
        });
        // 收款账户
        this.$httpZll.getFinancialAccount(this.personal.department_id).then(res => {
          if (res) {
            for (let item of res.data) {
              let account = item.account;
              dicties.remittance_account[account.id] = account.account_num + ' ' + account.account_owner + `<br>` + account.name;
            }
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all .3s;
    position: absolute;
    width: 100%;
    left: 0;
  }

  .slide-right-enter {
    transform: translateX(-100%);
  }

  .slide-right-leave-active {
    transform: translateX(100%);
  }

  .slide-left-enter {
    transform: translateX(100%);
  }

  .slide-left-leave-active {
    transform: translateX(-100%);
  }
</style>
