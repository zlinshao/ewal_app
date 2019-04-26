<template>
  <div id="toBeDoneList">
    <div>
      <div class="listTop" ref="listTop">
        <div>
          <p @click="changeTop('noFinish')" :style="{'color': tabs === 'noFinish' ? '#FED836' : ''}">
            未完成&nbsp;{{total}}</p>
          <p @click="changeTop('finish')" :style="{'color': tabs === 'finish' ? '#FED836' : ''}">已完成</p>
        </div>
        <div class="topSearch" @click="searchToBeDone"></div>
      </div>

      <div class="main" :style="mainHeight">
        <!--未完成-->
        <div class="noFinish" v-if="tabs === 'noFinish'">
          <scroll-load :name="'flex-warp'" :remHeight="remHeight" @getLoadMore="scrollLoad" :disabled="!fullLoading">
            <li class="noFinishMain" v-for="(item,index) in noFinishList">
              <div :class="['main-'+index,listLength.includes(index)?'mainTransform':'']">
                <p>发货的是卡了和卡拉恢复扩大分开了</p>
                <div class="toBeDoneType">物品补给跟进</div>
                <div class="progress">
                  <div :style="{'height': '30%'}">
                    <span>30<b>%</b></span>
                  </div>
                </div>
                <div class="surplus">剩余</div>
                <div>
                  <span class="unit">24<b>h</b></span>
                  <span class="unit">45<b>m</b></span>
                </div>
              </div>
            </li>
            <li class="noMore" v-if="noFinishList.length === paging && noFinishList.length > 6">
              <span v-if="!fullLoading">没有更多了</span>
            </li>
            <li class="noData" v-if="!noFinishList.length">
              <span v-if="!fullLoading">暂无相关数据...</span>
            </li>
          </scroll-load>
        </div>
        <!--已完成-->
        <div class="finish" v-if="tabs === 'finish'">
          <scroll-load :remHeight="remHeight" @getLoadMore="scrollLoad" :disabled="fullLoading">
            <li class="finishMain" v-for="(item,index) in finishList" @click="goOperates(item)">
              <div>
                <div class="finish1">
                  <h1>{{item.title}}</h1>
                  <span></span>
                </div>
                <div class="finish2">
                  <p><span>{{item.name}}</span></p>
                  <div>
                    <h2>完成时间</h2>
                    <h3>2019-03-05 18:45</h3>
                  </div>
                </div>
              </div>
            </li>
            <li class="noMore" v-if="finishList.length === paging && finishList.length > 4">
              <span v-if="!fullLoading">没有更多了</span>
            </li>
            <li class="noData" v-if="!finishList.length">
              <span v-if="!fullLoading">暂无相关数据...</span>
            </li>
          </scroll-load>
        </div>
      </div>
    </div>
    <div class="commonFooterTag">
      <p v-for="item in 4" :class="['p-'+item]" @click="footerTag(item)"></p>
    </div>
    <!--右侧栏-->
    <div class="addToBeDone" @click="showAddPopup = true"></div>
    <van-popup v-model="showAddPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="showAddPopup">
      <p class="addTitle">
        <span class="writingMode">新建任务</span>
      </p>
      <div class="mainModule">
        <div class="module" :class="[' module'+(index+1)]" v-for="(item,index) in addShowList">
          <div @click="routerLink(item.url)">
            <i></i>
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
      <div class="popupBottom"></div>
    </van-popup>
    <!--搜索-->
    <van-popup v-model="searchHigh" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="top" :overlay="true" class="searchHigh" :style="mainListHeight(80)">
      <div class="searchInput">
        <div class="input">
          <div>
            <input type="text" v-model="highParams.title" @keyup.enter="onSearch(tabs)" placeholder="请输入搜索内容">
            <span v-if="highParams.title" @click="highParams.title = ''"></span>
          </div>
          <p v-if="highParams.title" class="searchBtn" @click="onSearch(tabs)">搜索</p>
          <p v-if="!highParams.title" @click="searchHigh = false">取消</p>
        </div>
      </div>
      <div class="scroll_bar">
        <div class="radioChecksLabel" v-for="item of Object.keys(highList)">
          <label>{{highList[item].title}}</label>
          <div class="radioChecks">
            <div v-for="val in highList[item].value" class="contents">
              <p @click="checkChoose(val,item)" v-if="highList[item].type === 'check'"
                 :class="{'chooseCheck': highParams[item].includes(val)}">
                {{val.text}}
              </p>
              <p @click="checkChoose(val,item)" :class="{'chooseCheck': highParams[item] === val.id}" v-else>
                {{val.text}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="commonBtn radioChecksFoot">
        <p :class="['btn ' + item.type || '']" v-for="item of searchObj.buttons" @click="searchBtn(item.type)">
          {{item.label}}
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        tabs: 'noFinish',
        fullLoading: false,//加载是否结束
        mainHeight: '',
        remHeight: 0,
        // 未完成
        total: 0,
        noFinishList: [],
        listLength: [],//中间上移 index
        noParams: {},
        // 已完成
        finishList: [],
        paging: 0,
        params: {
          title: '',
          page: 1,
          taskDefinitionKey: 'CollectReportConfirm',
        },
        //右侧栏
        showAddPopup: false,
        addShowList: [
          {
            url: '/createdTask',
            title: '收房带看',
            icon: ''
          }, {
            url: '',
            title: '租房带看',
            icon: ''
          }, {
            url: '',
            title: '保洁任务',
            icon: ''
          }, {}, {
            url: '',
            title: '维修任务',
            icon: ''
          },
        ],
        // 筛选
        searchHigh: false,
        // 条件搜索
        highParams: {},
        highList: {
          finish: {
            title: '是否完成',
            type: 'radio',
            keyType: '',
            value: [
              {
                id: 1,
                text: '未完成',
              },
              {
                id: 2,
                text: '已完成',
              }
            ],
          },
          status: {
            title: '待办类型',
            type: 'check',
            keyType: [],
            value: [
              {
                id: 1,
                text: '带看打卡',
              }, {
                id: 2,
                text: '资料补齐',
              }, {
                id: 3,
                text: '尾款跟进',
              }, {
                id: 4,
                text: '房源跟进',
              }, {
                id: 5,
                text: '资料补齐',
              }, {
                id: 6,
                text: '贴条换锁',
              }, {
                id: 7,
                text: '房屋交接',
              }, {
                id: 8,
                text: '退租交接',
              }, {
                id: 9,
                text: '续约合同',
              }, {
                id: 10,
                text: '其它',
              },
            ],
          },
          times: {
            title: '剩余时间',
            type: 'radio',
            keyType: '',
            value: [
              {
                id: 1,
                text: '少于1 h',
              }, {
                id: 2,
                text: '1-6 h',
              }, {
                id: 3,
                text: '6-12 h',
              }, {
                id: 4,
                text: '12-24 h',
              }, {
                id: 5,
                text: '24 h以上',
              },
            ],
          },
        },
        searchObj: {
          buttons: [
            {
              label: '取消',
              type: 'back'
            },
            {
              label: '重置',
              type: 'reset'
            },
            {
              label: '确定',
            },
          ]
        },
      }
    },
    created() {
      this.noParams = this.jsonClone(this.params);
      this.resetting();
    },
    mounted() {
    },
    activated() {
      this.tabs = this.$route.query.status || 'finish';
      let listTop = this.$refs.listTop.offsetHeight;
      this.remHeight = listTop;
      this.mainHeight = this.mainListHeight(listTop);
      this.onSearch('finish');
      this.onSearch('noFinish');
    },
    watch: {},
    computed: {},
    methods: {
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.routerLink('/index');
            break;
        }
      },
      // 滚动加载
      scrollLoad(val) {
        if (this.tabs === 'noFinish') {
          if (!val) {
            this.noParams.page = 1;
          } else {
            if (this.noFinishList.length === this.total) return;
            this.noParams.page++;
          }
          this.onSearch(this.tabs);
        } else {
          if (!val) {
            this.params.page = 1;
          } else {
            if (this.finishList.length === this.paging) return;
            this.params.page++;
          }
          this.onSearch(this.tabs);
        }
      },
      onSearch(val) {
        if (val === 'noFinish') {
          this.getNoFinishList(this.noParams);
        } else {
          this.getFinishList(this.params);
        }
      },
      // 未完成
      getNoFinishList(val) {
        this.fullLoading = true;
        this.$http.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          this.total = res.total;
          let data = this.punchClockHandlerData(res.data);
          if (this.noParams.page === 1) {
            this.noFinishList = data;
          } else {
            for (let item of data) {
              this.noFinishList.push(item);
            }
          }
          this.listLength = [];
          let index = 1;
          for (let i of this.noFinishList) {
            this.listLength.push(index);
            index = index + 3;
          }
        })
      },
      // 已完成
      getFinishList(val) {
        this.fullLoading = true;
        this.$http.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          this.paging = res.total;
          let data = this.punchClockHandlerData(res.data);
          if (this.params.page === 1) {
            this.finishList = data;
          } else {
            for (let item of data) {
              this.finishList.push(item);
            }
          }
        })
      },
      changeTop(val) {
        this.tabs = val;
      },
      // 搜索待办
      searchToBeDone() {
        this.searchHigh = !this.searchHigh;
      },
      // 筛选条件
      checkChoose(val, key) {
        let type = this.highList[key];
        if (type.type === 'radio') {
          this.highParams[key] = this.highParams[key] === val.id ? '' : val.id;
        } else {
          this.checkChooseCommon(val, this.highParams[key]);
        }
        this.highParams = Object.assign({}, this.highParams);
      },
      goOperates(val) {
        this.routerLink(val.task_action, val);
      },
      // 搜索按钮
      searchBtn(val) {
        switch (val) {
          case 'cancel':
            this.searchHigh = false;
            break;
          case 'reset':
            this.resetting();
            break;
          default:
            this.onSearch();
            this.searchHigh = false;
            break;
        }
      },
      // 重置搜索
      resetting() {
        let list = this.jsonClone(this.highList);
        for (let item of Object.keys(list)) {
          this.highParams[item] = list[item].keyType;
        }
        this.highParams.title = '';
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDoneList/index.scss";
</style>
