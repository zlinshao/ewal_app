<template>
  <div id="index">
    <div class="index" :style="mainListHeight()">
      <!--头部标签-->
      <div class="indexTop">
        <div>
          <p v-for="(item,index) in indexTop" :class="['p'+(index+1)]" @click="routerLink(item.url)">
            <img :src="item.icon">
          </p>
        </div>
      </div>
      <!--增加小区-->
      <div class="addVillage" @click="routerLink('/createdVillage')"></div>
      <!--空置房源-->
      <div class="vacancyHouse">
        <h1></h1>
        <div v-for="item in vacancyHouse">
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
      <p v-for="item in indexBottom" @click="tabsTag(item.id)">
        <img :src="item.icon">
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
        tabs: '1',
        indexTop: [
          {
            url: '/approvals',
            name: '审批',
            icon: ic_shenpi,
          }, {
            url: '',
            name: '合同',
            icon: ic_hetong,
          }, {
            url: '',
            name: '问卷',
            icon: ic_wenjuan,
          }, {
            url: '',
            name: '考试',
            icon: ic_kaoshi,
          }
        ],
        vacancyHouse: [
          {
            num: '7',
            scope: '小于7天',
          }, {
            num: '100',
            scope: '8-14天',
          }, {
            num: '45',
            scope: '15-21天',
          }, {
            num: '10',
            scope: '大于21天',
          },
        ],
        trans: [
          {
            num: '7',
            scope: '带看',
          }, {
            num: '7',
            scope: '资料',
          }, {
            num: '7',
            scope: '维保',
          }, {
            num: '7',
            class: 'lastRailroadCar',
            scope: '空置跟进',
          }
        ],
        indexBottom: [
          {
            id: '1',
            icon: tab_home_pre1,
          }, {
            id: '2',
            icon: tab_home2,
          }, {
            id: '3',
            icon: tab_home3,
          }, {
            id: '4',
            icon: tab_home4,
          },
        ],
      }
    },
    mounted() {
    },
    activated() {

    },
    watch: {},
    computed: {},
    methods: {
      tabsTag(val) {
        this.tabs = val;
        switch (val) {
          case '4':
            this.routerLink('/toBeDoneList', {status: 'noFinish'});
            break;
          case '3':
            this.routerLink('/houseResource');
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/index/index.scss';

</style>
