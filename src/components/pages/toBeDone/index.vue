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
      <scroll-load :remHeight="remHeight" @getLoadMore="scrollLoad" :disabled="!fullLoading">
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
            <p v-else></p>
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
            icon: icon_wofaqide,
            text: '我发起的',
          }, {
            id: '2',
            icon: icon_woshenpide,
            text: '我审批的',
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
        remHeight: '',//头部高度
        params: {
          title: '',
          page: 1,
        },
        toBeDoneList: [],
        detail_request_url: '',
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.toBeDoneTop.offsetHeight;
        this.remHeight = top;
        this.mainHeight = this.mainListHeight(top);
      })
    },
    activated() {
      this.onSearch();
    },
    watch: {
      'params.title'(val) {
        this.params.title = val.replace(/\s+/g, '');
      },
    },
    computed: {},
    methods: {
      scrollLoad(val) {
        if (!val) {
          this.params.page = 1;
          this.onSearch();
        } else {
          if(this.fullLoading) return;
          if (this.toBeDoneList.length === this.paging) return;
          this.params.page++;
          this.onSearch();
        }
      },
      // 搜索
      onSearch() {
        this.getToBeDoneList(this.params);
      },
      // 待办  历史带看
      getToBeDoneList(val) {
        this.fullLoading = true;
        this.$httpZll.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          this.paging = res.total;
          if (this.params.page === 1) {
            this.toBeDoneList = this.punchClockHandlerData(res.data);
          } else {
            let data = this.punchClockHandlerData(res.data);
            for (let item of data) {
              this.toBeDoneList.push(item);
            }
          }
        })
      },
      // 动态按钮
      goOperates(val) {
        if (val.task_action !== 'punchClock') {
          if (this.detail_request_url === val.ctl_detail_request_url) {
            this.routerLink(val.task_action);
            return;
          }
          this.detail_request_url = val.ctl_detail_request_url;
          this.$httpZll.get(val.ctl_detail_request_url).then(res => {
            if (res.success) {
              let data = {};
              data.content = res.data.content;
              data.task_id = val.task_id;
              this.$store.dispatch('bulletin_draft', data);
              this.routerLink(val.task_action);
            }
          })
        } else {
          this.routerLink(val.task_action, val);
        }
      },
      // 底部模态框 按钮
      tabsTag(val) {
        this.tabsModule = false;
        switch (val) {
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
