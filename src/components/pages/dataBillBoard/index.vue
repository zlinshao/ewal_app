<template>
  <div id="dataBillBoard">
    <div class="dataBillBoard" :style="mainListHeight()">
      <!--  顶部切换的条件   -->
      <div class="tabs_list"   ref="topSearch">
        <div class="left_calendarDate" >
          <img src="../../../assets/image/dataBillBoard/rili@3x.png">
          <span @click="chooseDate()">{{params.date}}</span>
        </div>
        <div class="right_name">
          <span v-for="item in tabsTitle" :class="{ 'activeTabs':tabsId === item.id}" @click="tabsClick(item.id)">{{item.name}}</span>
        </div>
      </div>
      <!--滚动部分-->
      <div class="main_list" ref="main-Content" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <!--卡片和图表    -->
          <div class="data_card">
            <div class="card_bg">
              <span>总收益</span>
              <span class="numberFont">{{billBoardData.real_salary_all || '--'}}</span>
            </div>
            <div class="myEcharts" :style="{height:echartsHeight+'px'}">
              <span  :class="[billBoardData.real_achievement_all<=billBoardData.overflow_achv_all ? 'echart_info1' : 'echart_info2']">
                <span class="label">实际业绩</span>
                <span class="info numberFont">
                  <img src="../../../assets/image/dataBillBoard/shij@3x.png" >
                  <span class="span_num1">{{billBoardData.real_achievement_all|| '--'}}</span>
                </span>
              </span>
              <span :class="[billBoardData.real_achievement_all<billBoardData.overflow_achv_all ? 'echart_info2' : 'echart_info1',{'echart_info3':billBoardData.real_achievement_all===billBoardData.overflow_achv_all}]">
                <span class="label">溢出业绩</span>
                <span class="info numberFont">
                  <img src="../../../assets/image/dataBillBoard/yichu@3x.png" alt="">
                  <span class="span_num2">{{billBoardData.overflow_achv_all|| '--'}}</span>
                </span>
              </span>
            </div>
          </div>
          <!-- 数据列表-->
          <div class="lists">
            <div class="list"  v-for="(item,key) in listData" :key="key" @click="handleDetail(item)">
              <div class="base_info">
                <span>{{item.rent_house_name}}</span>
                <span>{{item.achv_type === 1 ? '新收新租':'二次出租'}}</span>
              </div>
              <div class="data_info">
                <div class="left_data">
                  <span class="duty">
                    <span>认责</span>
                    <span class="label_val numberFont">{{item.vacancy_duty || '--'}}</span>
                  </span>
                  <span class="perform">
                    <span>业绩</span>
                    <span class="label_val numberFont">{{item.real_money || '--'}}</span>
                  </span>
                </div>
                <span class="right_data">
                  <span class="earnings_name">收益</span>
                  <span class="label_val numberFont">{{item.real_achievement || '--'}}</span>
                </span>
              </div>
            </div>
            <div class="noMore" v-if="listData.length === paging && listData.length > 4">
              <span v-if="!fullLoading">没有更多了</span>
            </div>
            <div class="noData" v-if="!listData.length">
              <span v-if="!fullLoading">暂无相关数据...</span>
            </div>
          </div>
        </scroll-load>
      </div>
    </div>
   <!-- 底部切换   -->
    <div class="commonFooterTag">
      <p v-for="item in indexBottom" :class="item.icon" @click="footerTag(item.id)"></p>
    </div>
    <!--日历-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
  </div>
</template>

<script>
 import echarts from 'echarts';
  export default {
    name: "index",
    data() {
      return {
        billBoardData:{},
        listData:[],        //列表数据
        tabsTitle:[
          // {id:1,name:'数据分析'},
          {id:2,name:'业绩工资'},
        ],
        tabsId: 2,
        paging: 0,                         //总条数
        timeModule: false,                  //日期选择
        formatData: {                      //传给日期组件的字段
          dateType: 'year-month',
          dateKey: 'date',  //字段名
          dateVal: ''  //日期回显时
        },
        fullLoading: false,
        mainHeight: '',
        echartsHeight:0,
        //传参
        params: {
          page: 1,
          limit: 12,
          uid: '',          //当前登录的用户id
          date:'',          //日期
        },
        // 底部切换
        indexBottom: [
          {
            id: 1,
            icon: 'p-1',
          },
          {
            id: 2,
            icon: 'p-2',
          },
          {
            id: 3,
            icon: 'p-3',
          },
          {
            id: 4,
            icon: 'p-4',
          },
        ],
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.topSearch.offsetHeight;
        this.mainHeight = this.mainListHeight(top + 50);
        this.echartsHeight=this.screenWidth*205/750;  //图表的高度设置，用于定位
      });
    },
    activated(){
      this.params.date=this.datetoLocaleString();   //日期
      this.params.uid=this.personal.staff_id;        //登陆人id
    },
    watch: {},
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      },
    },
    methods: {
      //数据分析、业绩工资进行切换
      tabsClick(val){
        this.tabsId=val;
      },
      //日期
      chooseDate() {
        this.timeModule = true;
        this.formatData.dateVal = this.params.date;
      },
      // 日期组件的事件
      onConTime(val) {
        this.timeModule = false;
        if (val !== 'close') {
          this.params[val.dateKey] = val.dateVal;
          this.handleGetList();
        }
      },

      //获取列表
      handleGetList(){
        this.fullLoading = true;
        this.$httpZll.getPersonalList(this.params).then(res => {
          this.fullLoading = false;
          this.listData = res.data.data;
          this.billBoardData=res.data;
          this.paging = this.listData.length;
        })
      },
      //分页
      scrollLoad(val) {
        if (!val) {
          this.params.page = 1;
          this.billBoardData = {};
          this.listData=[]
          this.handleGetList();
        }
      },

      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 4:
            this.routerReplace('/toBeDoneList');
            break;
          case 3:
            this.routerReplace('/houseResource');
            break;
          case 1:
            this.routerReplace('/index');
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/dataBillBoard/index.scss";

</style>
