<template>
  <div id="index">
    <div class="index" :style="mainListHeight()">
      <!--头部标签-->
      <div class="indexTop">
        <div>
          <p v-for="(item,index) in indexTop" :class="['p'+(index+1)]" @click="topTabsTag(item.url)">
            <img :src="item.icon" alt="">
          </p>
        </div>
      </div>
      <!--增加小区-->
      <div class="addVillage" @click="routerLink('/createdVillage')"></div>
      <!--空置房源-->
      <div class="vacancyHouse">
        <h1></h1>
        <div @click="redirectHouseResource(item)" v-for="item in vacancyHouse">
          <i></i>
          <p>
            <b>{{item.num}}</b>
            <span>{{item.scope}}</span>
          </p>
        </div>
        <h2></h2>
      </div>
      <!--摩天轮-->
      <CirclePanel class="circle"></CirclePanel>
      <!--小火车-->
      <div class="smallTrain">
        <h1></h1>
        <div :class="[item.class?item.class:'railroadCar']" v-for="item in trans">
          <i></i>
          <p class="p1">
            <b>{{item.num}}</b>
            <span>{{item.scope}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="indexBottom">
      <p v-for="item in indexBottom" @click="bottomTabsTag(item.id)">
        <img :src="item.icon" alt="">
      </p>
    </div>
    <!--<audio src="../assets/image/circlePanel/kaka.mp3" preload="auto"/>-->
  </div>
</template>

<script>
  import CirclePanel from './circlePanel.vue'
  import ic_shenpi from '@/assets/image/home/ic_shenpi.png'
  import ic_hetong from '@/assets/image/home/ic_hetong.png'
  import ic_wenjuan from '@/assets/image/home/ic_wenjuan.png'
  import ic_kaoshi from '@/assets/image/home/ic_kaoshi.png'
  import tab_home_pre1 from '@/assets/image/home/tab_home_pre1.png'
  import tab_home2 from '@/assets/image/home/tab_home2.png'
  import tab_home3 from '@/assets/image/home/tab_home3.png'
  import tab_home4 from '@/assets/image/home/tab_home4.png'

  export default {
    name: "index",
    components: {CirclePanel},
    data() {
      return {
        indexTop: [
          {
            url: '/approvals',
            name: '审批',
            icon: ic_shenpi,
          }, {
            // url: '/contract',
            url: '',
            name: '合同',
            icon: ic_hetong,
          }, {
            // url: '/questionnaire',
            url: '',
            name: '问卷',
            icon: ic_wenjuan,
          }, {
            // url: '/exam',
            url: '',
            name: '考试',
            icon: ic_kaoshi,
          }
        ],
        vacancyHouse: [
          {
            num: '0',
            id:1,
            scope: '小于7天',
            params: {
              kong:{min:0,max:7}
            },
          }, {
            num: '0',
            id:2,
            scope: '8-14天',
            params: {
              kong:{min:8,max:14}
            },
          }, {
            num: '0',
            id:3,
            scope: '15-21天',
            params: {
              kong:{min:15,max:21}
            },
          }, {
            num: '0',
            id:4,
            scope: '大于21天',
            params: {
              kong:{min:22,max:100}
            },
          },
        ],
        trans: [
          {
            num: '0',
            scope: '带看',
          }, {
            num: '0',
            scope: '资料',
          }, {
            num: '0',
            scope: '维保',
          }, {
            num: '0',
            class: 'lastRailroadCar',
            scope: '空置跟进',
          }
        ],
        indexBottom: [
          {
            id: '1',
            icon: tab_home_pre1,
          },
          // {
          //   id: '2',
          //   icon: tab_home2,
          // },
          {
            id: '3',
            icon: tab_home3,
          },
          {
            id: '4',
            icon: tab_home4,
          },
        ],
      }
    },
    mounted() {
      this.getEmptyHouseData();//获取空置房源信息
    },
    activated() {
      sessionStorage.setItem('task_detail', '{}');
    },
    watch: {},
    computed: {},
    methods: {
      // 头部
      topTabsTag(url) {
        if (!url) return;
        this.routerLink(url);
      },
      // 底部
      bottomTabsTag(val) {
        switch (val) {
          case '4':
            this.routerLink('/toBeDoneList');
            break;
          case '3':
            this.routerLink('/houseResource');
            break;
        }
      },

      /**
       * 路由跳转到房源管理页面
       * @param item item内部携带请求参数
       */
      redirectHouseResource(item) {
        this.routerLink('houseResource', {kong: item.params.kong});
      },

      /**
       * 获取空置房源信息
       */
      getEmptyHouseData() {
        let city_id = this.$store.state.app.personalDetail.city_id;
        let params = {city_name: city_id};
        this.$httpHs.getEmptyHouse(params).then(res => {
          if (Number(res.code) === 200) {
            _.forEach(res.data, (val, key) => {
              let endChar = key.charAt(key.length - 1);
              _.find(this.vacancyHouse, {id: parseInt(endChar)}).num = val;
            });
          }
        });
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/index/index.scss';

</style>
