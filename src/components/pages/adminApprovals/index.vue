<template>
  <div id="adminApprovals">
    <div ref="approvalTop" class="approvalTop">
      <div class="top1">
        <p class="p3" @click="routerReplace('/approvals')"></p>
        <p class="p4" @click="changeApproval('')"></p>
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
      <div class="allChecks" ref="allChecks" v-show="tabs.tab">
        <label>全选</label>
        <p>
          <i class="i1"></i>
          <i class="i2"></i>
          <i class="i3"></i>
          <i class="i4"></i>
        </p>
      </div>
      <div class="mainContent" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="fullLoading['load'+tabs.tab]" v-if="tabs.tab">
          <li v-for="item in approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]]">
            <div class="contentList adminList">
              <i class="adminCheck" :class="[checkIds.includes(item.id) ? 'hover' : '']"
                 @click="adminChecked(item)"></i>
              <div class="adminMain">
                <ul>
                  <li>
                    <img :src="personal.avatar" v-if="personal.avatar" alt="">
                    <img src="../../../assets/image/common/noHead.png" alt="" v-else>
                    <div class="adminInfo" @click="detailModule = true">
                      <div class="adminTitle">
                        <h1>王啸啸提交的调休审批</h1>
                        <span>2019-04-11 12:48</span>
                      </div>
                      <h2>
                        <span>应休开始时间</span>
                        <span>2019-04-11 09:00</span>
                      </h2>
                      <h2>
                        <span>应休结束时间</span>
                        <span>2019-04-11 09:00</span>
                      </h2>
                      <h2>
                        <span>审批紧急程度</span>
                        <span></span>
                      </h2>
                      <div class="approvalStatus">
                        <h1>王佳怡审核中</h1>
                        <span><i></i></span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="noMore"
              v-if="approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length === total['total'+tabs.tab] &&
                    approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length > 3">
            <div v-if="!fullLoading['load'+tabs.tab]">没有更多了</div>
          </li>
          <li class="noData"
              v-if="!approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]].length">
            <div v-if="!fullLoading['load'+tabs.tab]">暂无相关数据...</div>
          </li>
        </scroll-load>
      </div>
    </div>
    <admin-detail :module="detailModule" @close="detailModule = false"></admin-detail>
  </div>
</template>

<script>
  import wofaqide from '../../../assets/image/approvals/wofaqide.png'
  import woshenpide from '../../../assets/image/approvals/woshenpide.png'
  import chaosongwode from '../../../assets/image/approvals/chaosongwode.png'
  import zanbuchuli from '../../../assets/image/approvals/zanbuchuli.png'
  import AdminDetail from './adminDetail.vue'

  export default {
    name: "admin-approvals",
    components: {AdminDetail},
    data() {
      return {
        mainHeight: {},
        detailModule: false,
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
        checkIds: [],
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
        return this.$store.state.app.personalDetail;
      },
    },
    watch: {},
    methods: {
      // 计算 列表高度
      countListHeight() {
        this.$nextTick(_ => {
          let approvalTop = this.$refs.approvalTop.offsetHeight;
          let mainTop = this.$refs.mainTop.offsetHeight;
          let allChecks = this.$refs.allChecks.offsetHeight;
          let top = approvalTop + mainTop + allChecks;
          if (this.tabs.tab) {
            this.mainHeight = this.mainListHeight(top);
          } else {
            this.mainHeight = this.mainListHeight(approvalTop);
          }
        });
      },
      // 搜索
      onSearch(num) {
        let tab = String(num);
        let status = Number(this.tabs.status);
        this.twoLevel['tab' + tab] = status;
        this.approvalList['list' + tab]['data' + status] = [];
        this.paramsHandle(tab, status);
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
      paramsHandle(tab, status) {
        this.setApiHandle(tab, status);
        switch (tab) {
          case '1':
            this.params['params' + tab] = {
              page: 1,
              category: 'approval',
              finished: Boolean(status),
              active: true,
            };
            this.params['params' + tab].assignee = this.personal.staff_id;
            break;
          case '2':
            switch (status) {
              case 0:
              case 1:
                this.params['params' + tab] = {
                  page: 1,
                  finished: Boolean(status),
                  taskCategory: 'approval',
                };
                this.params['params' + tab].taskOwner = this.personal.staff_id;
                break;
            }
            break;
          case '3':
            this.params['params' + tab] = {
              page: 1,
              category: 'cc',
              finished: Boolean(status),
            };
            this.params['params' + tab].assignee = this.personal.staff_id;
            break;
          case '4':
            this.params['params' + tab].taskAssignee = this.personal.staff_id;
            break;
        }
        // 搜索的参数处理
        if (!tab) return;
        this.params['params' + tab].tenantId = 'hr';
        this.getApprovalList(this.urlApi, this.params['params' + tab], tab);
      },
      // 接口匹配
      setApiHandle(tab, status) {
        switch (tab) {
          case '1'://我审批的
            this.urlApi = status === 1 ? 'history/tasks' : 'runtime/tasks';
            break;
          case '2'://我发起的
            switch (status) {
              case 0:
                this.urlApi = 'runtime/process-instances';
                break;
              case 1:
                this.urlApi = 'history/process-instances';
                break;
            }
            break;
          case '3'://抄送我的
            if (status === 0) {
              this.urlApi = 'runtime/tasks';
            } else {
              this.urlApi = 'history/tasks';
            }
            break;
          case '4'://暂不处理
            this.urlApi = 'runtime/process-instances';
            break;
        }
      },
      // 审批列表
      getApprovalList(url, params, tab) {
        this.fullLoading['load' + tab] = true;
        this.$httpZll.getMeInitiate(url, params).then(res => {
          this.fullLoading['load' + tab] = false;
          if (res) {
            let twoLevel = this.twoLevel['tab' + tab];
            this.total['total' + tab] = res.total;
            if (!twoLevel) {
              this.paging['paging' + tab] = res.total;
            }
            let data = this.groupHandlerListData(res.data, url);
            if (this.params['params' + tab].page === 1) {
              this.approvalList['list' + tab]['data' + twoLevel] = data;
            } else {
              for (let item of data) {
                this.approvalList['list' + tab]['data' + twoLevel].push(item);
              }
            }
          }
        });
      },
      // 头部切换
      changeApproval(val) {
        this.countListHeight();
        this.checkIds = [];
        let tab = val.id;
        let status = this.twoLevel['tab' + tab];
        this.tabs.tab = tab;
        this.tabs.status = status;
        this.$store.dispatch('admin_approval_tabs', this.tabs);
        this.paramsHandle(tab, status);
        this.countListHeight();
      },
      // 二级切换
      tabsTag(status) {
        let tab = this.tabs.tab;
        if (this.tabs.status === status) return;
        this.tabs.status = status;
        this.twoLevel['tab' + tab] = status;
        this.$store.dispatch('admin_approval_tabs', this.tabs);
        this.onSearch(tab);
      },
      // 多选
      adminChecked(item) {
        if (this.checkIds.includes(item.id)) {
          let index = this.checkIds.indexOf(item.id);
          this.checkIds.splice(index, 1);
        } else {
          this.checkIds.push(item.id);
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/approvals/index.scss";
</style>
