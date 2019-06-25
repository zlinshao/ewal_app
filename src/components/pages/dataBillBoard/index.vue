<template>
  <div id="dataBillBoard">
    <div class="dataBillBoard" :style="mainListHeight()">
      <!--  顶部切换的条件   -->
      <div class="tabs_list"   ref="topSearch">
        <div class="left_calendarDate" @click="chooseDate">
          <img src="../../../assets/image/dataBillBoard/rili@3x.png">
          <span >{{calendarDate}}</span>
        </div>
        <div class="right_name">
          <span @click="getList">数据分析</span>
          <span @click="getList">业绩工资</span>
        </div>
      </div>
      <!--滚动部分-->
      <div class="main_list" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <!--卡片和图表    -->
          <div class="data_card">
            <div class="card_bg">
              <span>总收益</span>
              <span class="numberFont">{{45978990000}}</span>
            </div>
            <div id="myEcharts" ></div>
          </div>
          <!-- 数据列表-->
          <div class="lists">
            <div class="list"  v-for="(item,key) in listData" :key="key" @click="handleDetail(item)">
              <div class="base_info">
                <span>{{item.name}}</span>
                <span>{{item.typeName}}</span>
              </div>
              <div class="data_info">
                <div class="left_data">
                  <span class="duty">
                    <span>认责</span>
                    <span class="label_val numberFont">{{item.aa}}</span>
                  </span>
                  <span class="perform">
                    <span>业绩</span>
                    <span class="label_val numberFont">{{item.bb}}</span>
                  </span>
                </div>
                <span class="right_data">
                  <span class="earnings_name">收益</span>
                  <span class="label_val numberFont">{{item.cc}}</span>
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
        //列表
        listData:[
          {name:'仙居雅苑仙居雅苑1-101',typeName:'新收',type:'1',aa:'76000',bb:'344597600',cc:'3445976000'},
          {name:'仙居雅苑仙居雅苑1-101',typeName:'新租',type:'2',aa:'76000',bb:'344597600',cc:'3445976000'},
          {name:'仙居雅苑仙居雅苑1-101',typeName:'续收',type:'3',aa:'76000',bb:'344597600',cc:'3445976000'},
          {name:'仙居雅苑仙居雅苑1-101',typeName:'续租',type:'4',aa:'76000',bb:'344597600',cc:'3445976000'},
          {name:'仙居雅苑仙居雅苑1-101',typeName:'二次出租',type:'5',aa:'76000',bb:'344597600',cc:'3445976000'},
        ],
        timeModule: false,                  //日期选择
        calendarDate:'',                    //日期
        formatData: {                      //传给日期组件的字段
          dateType: 'date',
          dateKey: '',  //字段名
          dateVal: ''  //日期回显时
        },
        //图表参数
        option :{  //图表
          grid : { //距离容器边界间距
            top : 0,
            bottom: 0,
            left:0,
            right:0
          },
          xAxis: {
            type: 'category',
            show:false,
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
            show:false,
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
            smooth: true,
            symbol:'none',  //去掉点的
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0,172,193,1)'
            }, {
              offset: 1,
              color: 'rgba(156,224,84,1)'
            }])
          }]
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
        server: globalConfig.server_market,
        mainHeight: '',
        paging: 0,
        fullLoading: false,
        //传参
        params: {
          page: 1,
          // limit: 12,
          limit: 5,
          search: '',
          name: '',
          status: [],
          is_org_user: 0,
          org_user_id: [],
        },
      }
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.topSearch.offsetHeight;
        this.mainHeight = this.mainListHeight(top + 50);
      });
      //日期
      this.calendarDate=this.datetoLocaleString();
      //绘制图表
      this.drawEcharts();
    },

    activated() {
    },

    deactivated() {
      this.resetParams();
    },

    watch: {},
    computed: {
      // personal() {
      //   return this.$store.state.app.personalDetail;
      // },
    },
    methods: {
      //日期
      chooseDate(val) {
        this.timeModule = true;
        this.formatData.dateKey = 'calendarDate';
        this.formatData.dateVal = this.calendarDate;
      },
      // 日期组件的事件
      onConTime(val) {
        this.timeModule = false;
        if (val !== 'close') {
          this.calendarDate = val.dateVal;
        }
      },

      //绘制图表
      drawEcharts(){
        let myEcharts=this.$echarts.init(document.getElementById('myEcharts'));
        myEcharts.setOption(this.option);
      },


      //重置params
      resetParams() {
        this.params = {
          page: 1,
          limit: 12,
          search: '',
          name: '',
          status: [],
          is_org_user: 0,
          org_user_id: [],
          city_id:'',
        };

      },
      //滚动
      scrollLoad(val) {
        console.log(val);
        if (!val) {
          this.params.page = 1;
          //this.handleGetList();
        } else {
          if (this.fullLoading) return;
          if (this.listData.length === this.paging) return;
          this.params.page++;
          this.handleGetList();
        }
      },
      /*
    * 获取列表
    * params: cleanData  是否清除列表 默认false
    * */
      handleGetList(cleanData = false) {
        if(cleanData) {
          this.listData = [];
        }
        this.fullLoading = true;
        this.getList();
        let newParams = this.parseParams(this.params);
        console.log(newParams)
        //  this.$httpZll.get(this.server + 'v1.0/market/house', newParams, '加载中...').then(res => {
        //   this.fullLoading = false;
        //   if (res.code === 200) {
        //     _.forEach(res.data.data,(o)=> {
        //       this.listData.push(o);
        //     })
        //     this.paging = res.data.all_count;
        //   } else {
        //     this.listData = [];
        //   }
        // })
      },
      getList(){
       let arr=[
         {name:'仙居雅苑仙居雅苑1-101',typeName:'新收',type:'1',aa:'76000',bb:'344597600',cc:'3445976000'},
         {name:'仙居雅苑仙居雅苑1-101',typeName:'新租',type:'2',aa:'76000',bb:'344597600',cc:'3445976000'},
         {name:'仙居雅苑仙居雅苑1-101',typeName:'续收',type:'3',aa:'76000',bb:'344597600',cc:'3445976000'},
         {name:'仙居雅苑仙居雅苑1-101',typeName:'续租',type:'4',aa:'76000',bb:'344597600',cc:'3445976000'},
         {name:'仙居雅苑仙居雅苑1-101',typeName:'二次出租',type:'5',aa:'76000',bb:'344597600',cc:'3445976000'},
       ]
        this.listData.push(arr);
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
