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
      }
    },
    created() {
      this.getDict();
      dd.ui.webViewBounce.disable();
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
    computed: {
      personal() {
        return this.$store.state.app.personal;
      }
    },
    methods: {
      // 字典
      getDict() {
        // 楼层
        for (let i = -3; i < 101; i++) {
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
        this.loading = true;
        this.personalGet().then(res => {
          if (res) {
            // 所有省份
            // let h1 = this.$httpZll.getAllCityList();
            // 字典
            // let h2 = this.$httpZll.getAllDict();
            // 收款账户
            // let h3 = this.$httpZll.getFinancialAccount(this.personal.department_id);
            // 城市
            // let h4 = this.$httpZll.getCityList();
            // Promise.all([h1, h2, h3, h4]).then((result) => {
            //   this.handlerDict(result[0], 'h1');
            //   this.handlerDict(result[1], 'h2');
            //   this.handlerDict(result[2], 'h3');
            //   this.handlerDict(result[3], 'h4');
            //   this.loading = !res;
            // }).catch((error) => {
            //   console.log(2);
            //   console.log(error)
            // });
            // 字典
            let h0 = this.$httpZll.getAllDict();
            // 收款账户
            let h1 = this.$httpZll.getFinancialAccount(this.personal.department_id);
            Promise.all([h0, h1]).then((result) => {
              this.handlerDict(result[0], 'h0');
              this.handlerDict(result[1], 'h1');
              this.loading = !res;
            }).catch((error) => {
              console.log(2);
              console.log(error)
            });
          }
        });
      },
      // 字典赋值
      handlerDict(res, str) {
        switch (str) {
          case 'h0':
            let dict = res.data;
            dicties.decorate = dict[404];//装修
            dicties.card_type = dict[409];//证件类型
            dicties.property_type = dict[410];//房屋类型
            // dicties.property_type = dict[328];//退租类型
            break;
          case 'h1':
            if (res.data && res.data.length) {
              for (let item of res.data) {
                let account = item.account;
                dicties.remittance_account[account.id] = account.account_num + ' ' + account.account_owner + `<br>` + account.name;
              }
            }
            break;
          // case 'h1':
          //   if (res.data && res.data.length) {
          //     let data = {};
          //     for (let val of res.data) {
          //       data[val.province_id] = val.province_name;
          //     }
          //     dicties.province = data;
          //   }
          //   break;
          // case 'h2':
          //   let dict = res.data;
          //   dicties.decorate = dict[404];//装修
          //   dicties.card_type = dict[409];//证件类型
          //   dicties.property_type = dict[410];//房屋类型
          //   break;
          // case 'h3':
          //   if (res.data && res.data.length) {
          //     for (let item of res.data) {
          //       let account = item.account;
          //       dicties.remittance_account[account.id] = account.account_num + ' ' + account.account_owner + `<br>` + account.name;
          //     }
          //   }
          //   break;
          // case 'h4':
          //   this.$store.dispatch('all_city_list', res.data);
          //   break;
        }
      }
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
