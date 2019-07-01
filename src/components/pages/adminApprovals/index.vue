<template>
  <div id="adminApprovals">
    <div ref="approvalTop" class="approvalTop">
      <div class="top1">
        <p class="p1" @click="routerReplace('/approvals')"></p>
        <p class="p2" @click="changeApproval('')"></p>
      </div>
      <ul class="items-around">
        <li v-for="item in approvalTerm" @click="changeApproval(item)">
          <p><img :src="item.icon" alt=""></p>
          <h1 :class="[item.id === tabs.tab ? 'hover' : '']">{{item.text}}</h1>
        </li>
      </ul>
    </div>
    <div class="main">
      <div ref="mainTop" class="mainTop" v-show="tabs.tab">
        <div class="flex">
          <p v-for="item in buttons['tab'+tabs.tab]" @click="tabsTag(item.value)"
             :class="[twoLevel['tab'+tabs.tab] === item.value ? 'hover' : '']">
            {{item.text}}
            <span class="numberFont" v-if="!item.value">{{paging['paging'+tabs.tab]}}</span>
          </p>
        </div>
        <i></i>
      </div>
      <div class="mainContent" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="fullLoading['load'+tabs.tab]" v-if="tabs.tab">
          <li v-for="item in approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]]">
            <div class="contentList">
              11111111111
            </div>
          </li>
          <li class="noMore"
              v-if="approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length === total['total'+tabs.tab] &&
                    approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length > 4">
            <div v-if="!fullLoading['load'+tabs.tab]">没有更多了</div>
          </li>
          <li class="noData"
              v-if="!approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length">
            <div v-if="!fullLoading['load'+tabs.tab]">暂无相关数据...</div>
          </li>
        </scroll-load>
      </div>
    </div>
  </div>
</template>

<script>
  import wofaqide from '../../../assets/image/approvals/wofaqide.png'
  import woshenpide from '../../../assets/image/approvals/woshenpide.png'
  import chaosongwode from '../../../assets/image/approvals/chaosongwode.png'
  import zanbuchuli from '../../../assets/image/approvals/zanbuchuli.png'

  export default {
    name: "admin-approvals",
    components: {},
    data() {
      return {
        mainHeight: {},
        //加载是否结束
        fullLoading: {
          load1: true,
          load2: true,
          load3: true,
          load4: true,
        },
        // 头部切换
        approvalTerm: [
          {
            id: '1',
            text: '我审批的',
            icon: woshenpide,
          },
          {
            id: '2',
            text: '我发起的',
            icon: wofaqide,
          },
          {
            id: '3',
            text: '抄送我的',
            icon: chaosongwode,
          },
          {
            id: '4',
            text: '暂不处理',
            icon: zanbuchuli,
          },
        ],
        // 二级切换
        buttons: {
          tab1: [
            {
              text: '待审批的',
              value: 0,
            },
            {
              text: '已审批的',
              value: 1,
            },
            {
              text: '转交给我的',
              value: 2,
            }
          ],
          tab2: [
            {
              text: '未完成',
              value: 0,
            },
            {
              text: '已完成',
              value: 1,
            },
          ],
          tab3: [
            {
              text: '未读',
              value: 0,
            },
            {
              text: '已读',
              value: 1,
            }
          ],
          tab4: [],
        },
        // 数据列表
        approvalList: {
          list1: {
            data0: [],
            data1: [],
            data2: [],
          },
          list2: {
            data0: [],
            data1: [],
          },
          list3: {
            data0: [],
            data1: [],
          },
          list4: {
            data0: [],
            data1: [],
          }
        },
        // 筛选条件
        urlApi: '',// 接口
        params: {
          params1: {},
          params2: {},
          params3: {},
          params4: {
            page: 1,
            suspended: true,
          },
        },
        // 二级切换 状态
        twoLevel: {
          tab1: 0,
          tab2: 0,
          tab3: 0,
          tab4: 0,
        },
        // 总条数
        total: {
          total1: 0,
          total2: 0,
          total3: 0,
          total4: 0,
        },//判断
        paging: {
          paging1: 0,
          paging2: 0,
          paging3: 0,
          paging4: 0,
        },// 显示
        // 更多操作
        moreOperate: {
          more1: [
            {
              id: '1',
              text: '合同预览',
            },
            {
              id: '2',
              text: '发送电子合同',
            },
          ],
          more2: [
            {
              id: '1',
              text: '合同预览',
            },
            {
              id: '4',
              text: '本地签署',
            },
            {
              id: '5',
              text: '客户手机签署',
            },
            {
              id: '6',
              text: '修改合同',
            },
          ],
          more3: [
            {
              id: '7',
              text: '重新提交',
            },
          ]
        },
      }
    },
    mounted() {
    },
    activated() {
      this.countListHeight();
    },
    computed: {
      tabs() {
        return this.$store.state.app.adminTab;
      },
      personal() {
        return this.$store.state.app.personal;
      },
    },
    watch: {},
    methods: {
      // 计算 列表高度
      countListHeight() {
        this.$nextTick(_ => {
          let approvalTop = this.$refs.approvalTop.offsetHeight;
          let mainTop = this.$refs.mainTop.offsetHeight;
          let top = approvalTop + mainTop;
          if (this.tabs.tab) {
            this.mainHeight = this.mainListHeight(top);
          } else {
            this.mainHeight = this.mainListHeight(approvalTop);
          }
        });
      },
      // 滚动加载
      scrollLoad(val) {
        let tab = this.tabs.tab;
        let status = this.tabs.status;
        this.twoLevel['tab' + tab] = status;
        if (!val) {
          this.paramsHandle(tab, status);
        } else {
          if (this.fullLoading['load' + tab]) return;
          let length = this.approvalList['list' + tab]['data' + this.twoLevel['tab' + tab]].length;
          if (length === this.total['total' + tab]) return;
          this.params['params' + tab].page++;
          this.getApprovalList(this.urlApi, this.params['params' + tab], tab);
        }
      },
      // 请求参数配置
      paramsHandle() {

      },
      // 审批列表
      getApprovalList(url, params, tab) {

      },
      // 头部切换
      changeApproval(val) {
        this.countListHeight();
        let tab = val.id;
        let status = this.twoLevel['tab' + tab];
        this.tabs.tab = tab;
        this.tabs.status = status;
        this.$store.dispatch('admin_approval_tabs', this.tabs);
        this.countListHeight();
      },
      // 二级切换
      tabsTag() {

      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/approvals/index.scss";
</style>
