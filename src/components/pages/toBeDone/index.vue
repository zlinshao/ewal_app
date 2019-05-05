<template>
  <div id="toBeDone">
    <div class="toBeDoneTop" ref="toBeDoneTop">
      <div class="searchInput">
        <div class="input">
          <div>
            <input type="text" placeholder="请输入搜索内容" v-model="params.title" @keyup.enter="onSearch()">
            <span v-if="params.title" @click="params.title = ''"></span>
          </div>
          <p class="searchBtn" @click="onSearch()">搜索</p>
        </div>
      </div>
    </div>
    <div class="main" :style="mainHeight">
      <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
        <li v-for="item in toBeDoneList">
          <div class="mainTitle">
            <label>{{item.title}}</label>
            <p><i></i></p>
          </div>
          <p class="statusBtn">
            <span>{{item.name}}</span>
            <!--<label>密码 506231</label>-->
          </p>
          <div class="handleBtn">
            <p v-for="btn in normalOperates" :class="btn.class">
              <i><img :src="btn.icon"></i>
              <span>{{btn.text}}</span>
            </p>
            <p @click="goOperates(item)" v-if="item.task_title" :class="item.task_action">
              <i><img :src="changeOperates[item.task_action]"></i>
              <span>{{item.task_title}}</span>
            </p>
            <p v-for="btn in item.outcome" v-if="item.outcome" @click="clickBtn(btn,item)">
              <i><img :src="changeOperates[item.task_action]"></i>
              <span>{{btn.title}}</span>
              <!--<h1 v-for="(item,idx) in operates.outcomeOptions" class="btn" :class="item.route || ''"-->
              <!--@click="clickBtn(operates.variableName, item)">-->
              <!--<span class="writingMode">{{item.title}}</span>-->
              <!--</h1>-->

            </p>
          </div>
        </li>
        <li class="noMore" v-if="toBeDoneList.length === paging && toBeDoneList.length > 4">
          <span v-if="!fullLoading">没有更多了</span>
        </li>
        <li class="noData" v-if="!toBeDoneList.length">
          <span v-if="!fullLoading">暂无相关数据...</span>
        </li>
      </scroll-load>
    </div>

    <!--新建待办任务-->
    <div class="addToBeDone" @click="showAddPopup = true"></div>
    <van-popup v-model="showAddPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="showAddPopup">
      <p class="addTitle">
        <span class="writingMode">新建</span>
      </p>
      <div class="mainModule">
        <div class="module" :class="[' module'+(index+1)]" v-for="(item,index) in addShowList"
             @click="routerLink(item.url)">
          <div>
            <i></i>
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
      <div class="popupBottom"></div>
    </van-popup>

    <!--底部操作-->
    <div class="showTabsModule" :class="[tabsModule ? 'hiddenTabsModule' : '']">
      <div @click="tabsModule = true">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="tabsModule" position="bottom"
               :overlay="true" class="tabsModule">
      <div class="modules">
        <div v-for="item in modules" @click="tabsTag(item.id)">
          <i><img :src="item.icon"></i>
          <span class="writingMode">{{item.text}}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import icon_daiqian from '@/assets/image/toBeDone/daiqian.png'
  import icon_zhuanjiao from '@/assets/image/toBeDone/zhuanjiao.png'
  import icon_qudaka from '@/assets/image/toBeDone/qudaka.png'
  import icon_quqianyue from '@/assets/image/toBeDone/quqianyue.png'
  import icon_wofaqide from '@/assets/image/toBeDone/wofaqide.png'
  import icon_woshenpide from '@/assets/image/toBeDone/woshenpide.png'
  import icon_lishidaikan from '@/assets/image/toBeDone/lishidaikan.png'
  import icon_hetongmoban from '@/assets/image/toBeDone/hetongmoban.png'

  export default {
    name: "index",
    data() {
      return {
        mainHeight: '',
        fullLoading: false,
        //正常操作 按钮
        operates: {},//状态变更操作
        normalOperates: [
          {
            id: 1,
            icon: icon_daiqian,
            text: '代签',
            class: 'allograph',
          }, {
            id: 2,
            icon: icon_zhuanjiao,
            text: '转交',
            class: 'deliver',
          }
        ],
        // 状态变化按钮
        changeOperates: {
          punchClock: icon_qudaka,
          collectReport: icon_quqianyue,
        },
        // 底部module
        tabsModule: false,//底部操作
        modules: [
          {
            id: '1',
            icon: icon_woshenpide,
            text: '我审批的',
          }, {
            id: '2',
            icon: icon_wofaqide,
            text: '我发起的',
          }, {
            id: '3',
            icon: icon_lishidaikan,
            text: '历史带看',
          }, {
            id: '4',
            icon: icon_hetongmoban,
            text: '收房合同模板',
          },
        ],
        // 右侧栏
        showAddPopup: false,//新建待办任务
        addShowList: [
          {
            url: '/createdTask',
            title: '带看',
            icon: ''
          }, {
            url: '',
            title: '补充协议',
            icon: ''
          }
        ],

        paging: 0,
        params: {
          title: '',
          page: 1,
        },
        toBeDoneList: [],
        detail_request_url: '',
        variableName: '',
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.toBeDoneTop.offsetHeight;
        this.mainHeight = this.mainListHeight(top);
      })
    },
    activated() {
      this.getToDoneType();
      this.onSearch();
    },
    watch: {
      'params.title'(val) {
        this.params.title = val.replace(/\s+/g, '');
      },
    },
    computed: {},
    methods: {
      // 去打卡 去签约
      goOperates(val) {
        switch (val.task_action) {
          case 'punchClock':
            this.routerLink(val.task_action, val);
            break;
          case 'collectReport':
            this.againTaskDetail(val).then(_ => {
              if (val.bm_detail_request_url) {
                this.againDetailRequest(val, 'again');
              } else {
                this.routerLink(val.task_action);
              }
            });
            break;
        }
      },
      // 变更 签署
      clickBtn(action = {}, item) {
        let postData = {};
        postData.action = 'complete';
        postData.variables = [{
          name: this.variableName,
          value: action.action,
        }];
        this.$httpZll.finishBeforeTask(item.task_id, postData).then(_ => {
          if (action.action === 'success') {
            this.$prompt('签署成功！');
            this.routerLink(action.route);
          } else {
            let params = {
              taskDefinitionKey: 'InputBulletinData',
              rootProcessInstanceId: item.root_id,
            };
            this.$httpZll.getNewTaskId(params).then(res => {
              let query = {};
              let task = res.data[0];
              query.task_id = task.id;
              query.task_action = action.route;
              for (let v of task.variables) {
                if (v.name === 'ctl_detail_request_url' || v.name === 'bm_detail_request_url') {
                  query[v.name] = v.value || '';
                }
              }
              if (urls.bm_detail_request_url) {
                this.againTaskDetail(query).then(_ => {
                  this.againDetailRequest(query, 'again');
                });
              }
            });
          }
        });
      },
      // 待办类型
      getToDoneType() {
        let query = this.$route.query;
        switch (query.type) {
          case 'nweCollect':

            break;
          case 'nweRent':

            break;
        }
      },
      // 滚动加载
      scrollLoad(val) {
        if (!val) {
          this.onSearch();
        } else {
          if (this.fullLoading) return;
          if (this.toBeDoneList.length === this.paging) return;
          this.params.page++;
          this.getToBeDoneList(this.params);
        }
      },
      // 搜索
      onSearch() {
        this.params.page = 1;
        this.toBeDoneList = [];
        this.getToBeDoneList(this.params);
      },
      // 待办列表
      getToBeDoneList(val) {
        this.fullLoading = true;
        this.$httpZll.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          this.paging = res.total;
          let task = ['title', 'flow_type', 'task_title', 'task_action', 'ctl_detail_request_url', 'outcome', 'bm_detail_request_url'];
          let data = this.groupHandlerListData(res.data, task);
          for (let btn of data) {
            if (btn.outcome) {
              let outcome = JSON.parse(btn.outcome);
              btn.outcome = outcome.outcomeOptions;
              this.variableName = outcome.variableName;
            }
          }
          console.log(data);
          if (this.params.page === 1) {
            this.toBeDoneList = data;
          } else {
            for (let item of data) {
              this.toBeDoneList.push(item);
            }
          }
        })
      },
      // 底部模态框 按钮
      tabsTag(val) {
        this.tabsModule = false;
        switch (val) {
          case '1'://我发起的
          case '2':// 我审批的
            let tabs = {};
            tabs.tab = val;
            tabs.status = 0;
            this.$store.dispatch('approval_tabs', tabs);
            this.routerLink('/approvals');
            break;
          case '3':// 历史带看
            this.$store.dispatch('done_tabs', '2');
            this.routerLink('/toBeDoneList');
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDone/index.scss";
</style>
