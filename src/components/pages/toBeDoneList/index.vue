<template>
  <div id="toBeDoneList">
    <!--<div style="position: fixed;top: 0;bottom: 8rem;left: 0;right: 0;z-index: 1;" class="justify-around">-->
    <!--<div v-for="item in 3" style="height: 100%;border-left: 1px solid #000;"></div>-->
    <!--</div>-->
    <div>
      <div class="listTop" ref="listTop" @dblclick="goToTop">
        <div>
          <p @click="changeTop(item.id)" v-for="item in finishTop"
             :style="{'color': tabs === item.id ? '#FED836' : ''}">
            {{item.text}}&nbsp;<span v-if="item.id === '1'">{{total['total1']}}</span>
          </p>
        </div>
        <div class="topSearch" @click="searchHigh = !searchHigh"></div>
      </div>
      <div class="main" :style="mainHeight">
        <!--未完成-->
        <div class="noFinish" v-if="tabs === '1'">
          <scroll-load :name="'flex-warp'" @getLoadMore="scrollLoad" :disabled="!fullLoading['load1']">
            <li class="noFinishMain" v-for="(item,index) in finishList['list1']" @click="goOperates(item,'polishing')">
              <div :class="['main-'+index,listLength.includes(index)?'mainTransform':'']">
                <p>{{item.title}}</p>
                <div class="toBeDoneType">{{item.name}}</div>
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
            <li class="noMore" v-if="finishList['list1'].length === total['total1'] && finishList['list1'].length > 6">
              <span v-if="!fullLoading['load1']">没有更多了</span>
            </li>
            <li class="noData" v-if="!finishList['list1'].length">
              <span v-if="!fullLoading['load1']">暂无相关数据...</span>
            </li>
          </scroll-load>
        </div>
        <!--已完成-->
        <div class="finish" v-if="tabs === '2'">
          <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading['load2']">
            <li class="finishMain" v-for="item in finishList['list2']" @click="goOperates(item,'goSign')">
              <!--@click="clickBtn(item.task_id)"-->
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
            <li class="noMore" v-if="finishList['list2'].length === total['total2'] && finishList['list2'].length > 3">
              <span v-if="!fullLoading['load2']">没有更多了</span>
            </li>
            <li class="noData" v-if="!finishList['list2'].length">
              <span v-if="!fullLoading['load2']">暂无相关数据...</span>
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
            <input type="text" v-model="highParams.title" @keyup.enter="getFinishList(tabs)" placeholder="请输入搜索内容">
            <span v-if="highParams.title" @click="highParams.title = ''"></span>
          </div>
          <p v-if="highParams.title" class="searchBtn" @click="getFinishList(tabs)">搜索</p>
          <p v-if="!highParams.title" @click="searchHigh = false">取消</p>
        </div>
      </div>
      <div class="scroll_bar">
        <div class="radioChecksLabel" v-for="item of Object.keys(highList)">
          <label>{{highList[item].title}}</label>
          <div class="radioChecks">
            <div v-for="val in highList[item].value" class="contents">
              <p @click="checkChoose(val,item)" v-if="highList[item].type === 'check'"
                 :class="{'chooseCheck': highParams[item].includes(val.id)}">
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
    <!--是否去签约-->
    <go-sign-contract :module="goSignModule" :detail="moduleDetail" @close="hiddenGoSign"></go-sign-contract>
    <!--补齐物品报备-->
    <Polishing :module="polishingModule" :detail="polishingDetail" @close="hiddenPolishing"></Polishing>
  </div>
</template>

<script>
  import GoSignContract from './components/goSignContract.vue';
  import Polishing from './components/polishing.vue';

  export default {
    name: "index",
    components: {GoSignContract, Polishing},
    data() {
      return {
        //加载是否结束
        fullLoading: {
          load1: false,
          load2: false,
        },
        mainHeight: '',// 滚动 部分高度
        listLength: [],//中间上移 index
        finishTop: [
          {
            id: '1',
            text: "未完成"
          }, {
            id: '2',
            text: "已完成"
          },
        ],
        // 列表
        finishList: {
          list1: [],
          list2: [],
        },
        // 筛选条件
        params: {
          params1: {
            title: '',
            page: 1,
          },
          params2: {
            title: '',
            page: 1,
            // finished: true,
          },
        },
        // 总条数
        total: {
          total1: 0,
          total2: 0,
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
        //是否去签约
        goSignModule: false,
        moduleDetail: {},
        // 补齐
        polishingModule: false,
        polishingDetail: {},
        path: '',
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
      this.tabs === '1' ? this.getFinishList('2') : this.getFinishList('1');
    },
    activated() {
      let listTop = this.$refs.listTop.offsetHeight;
      this.mainHeight = this.mainListHeight(listTop);
      this.path = this.$route.query.path || '';
      let tab = this.tabs;
      this.close_(tab);
      this.getFinishList(tab);
    },
    watch: {},
    computed: {
      tabs() {
        return this.$store.state.app.doneTab;
      }
    },
    methods: {
      getQueryDetail() {
        let query = this.$route.query;
      },
      // 生成电子收据
      clickBtn(task_id) {
        let postData = {};
        postData.action = 'complete';
        postData.variables = [{
          name: key,
          value: action.action,
        }];
        this.$httpZll.finishBeforeTask(task_id, postData).then(_ => {
          this.onSearch();
        });
      },
      // 已完成 / 未完成 切换
      changeTop(val) {
        this.goToTop();
        if (this.tabs === val) return;
        this.resetting();
        this.$store.dispatch('done_tabs', val);
        // this.finishList['list' + val] = [];
        // this.params['params' + val].page = 1;
        // this.getFinishList(val);
      },
      // 清空 列表
      close_(tab) {
        this.params['params' + tab].page = 1;
        this.finishList['list' + tab] = [];
      },
      // 滚动加载
      scrollLoad(val) {
        let tab = this.tabs;
        if (!val) {
          this.params['params' + tab].page = 1;
        } else {
          if (this.fullLoading['load' + tab]) return;
          if (this.finishList['list' + tab].length === this.total['total' + tab]) return;
          this.params['params' + tab].page++;
        }
        this.getFinishList(this.tabs);
      },
      // 请求列表
      getFinishList(tab) {
        let url = '', search = [];
        for (let item of Object.keys(approvalSearch)) {
          for (let val of approvalSearch[item]) {
            search = search.concat(val);
          }
        }
        search = this.myUtils.arrayWeight(search).join(',');
        this.fullLoading['load' + tab] = true;
        let params = this.params['params' + tab];
        params.taskDefinitionKeyNotIn = search;
        if (tab === '1') {
          url = 'runtime/tasks'
        } else {
          url = 'history/tasks';
          // params.finished = true;
        }
        this.$httpZll.getToBeDoneListApi(url, params).then(res => {
          this.fullLoading['load' + tab] = false;
          this.total['total' + tab] = res.total || 0;
          let task = ['title', 'flow_type', 'task_title', 'task_action', 'ctl_detail_request_url', 'rtl_detail_request_url', 'outcome'];
          let data = this.groupHandlerListData(res.data, task);
          if (params.page === 1) {
            this.finishList['list' + tab] = data;
          } else {
            for (let item of data) {
              this.finishList['list' + tab].push(item);
            }
          }
          if (tab === '1') {
            this.listLength = [];
            let index = 1;
            for (let i of this.finishList['list1']) {
              this.listLength.push(index);
              index = index + 3;
            }
          }
        })
      },
      // 列表事件
      goOperates(val, type) {
        switch (type) {
          case 'goSign':
            switch (val.taskDefinitionKey) {
              case 'CollectReceiptSign'://签署收据

                break;
              case 'CompleteAsset'://补齐物品报备

                break;
            }
            this.goSignModule = true;
            this.moduleDetail = val;
            break;
          case 'polishing':
            this.polishingModule = true;
            this.polishingDetail = val;
            break;
        }
      },
      // 是否签约
      hiddenGoSign(val) {
        this.cancel();
        if (val === 'again') {
          this.scrollLoad(false);
        }
      },
      // 补齐
      hiddenPolishing(val) {
        this.cancel();
        if (val !== 'close') {

        }
      },
      // 取消
      cancel() {
        this.searchHigh = false;
        this.goSignModule = false;
        this.polishingModule = false;
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
      // 搜索按钮
      searchBtn(val) {
        switch (val) {
          case 'back':
            this.cancel();
            break;
          case 'reset':
            this.resetting();
            break;
          default:
            this.getFinishList(this.tabs);
            this.cancel();
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
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.$router.go(-1);
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDoneList/index.scss";
</style>
