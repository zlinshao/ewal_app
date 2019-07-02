<template>
  <div id="approvals">
    <div ref="approvalTop" class="approvalTop">
      <div class="top1">
        <p class="p1"></p>
        <p class="p2" @click="routerReplace('/adminApprovals')"></p>
        <!---->
      </div>
      <ul class="items-around">
        <li v-for="item in approvalTerm" @click="changeApproval(item)">
          <p><img :src="item.icon" alt=""></p>
          <h1 :class="[item.id === tabs.tab ? 'hover' : '']">{{item.text}}</h1>
        </li>
      </ul>
    </div>
    <div class="main">
      <div ref="mainTop" class="mainTop">
        <div class="flex">
          <p v-for="item in buttons['tab'+tabs.tab]" @click="tabsTag(item.value)"
             :class="[twoLevel['tab'+tabs.tab] === item.value ? 'hover' : '']">
            {{item.text}}
            <span class="numberFont" v-if="!item.value">{{paging['paging'+tabs.tab]}}</span>
          </p>
        </div>
        <i @click="approvalModule = true"></i>
      </div>
      <div class="mainContent" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="fullLoading['load'+tabs.tab]">
          <li v-for="item in approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]]">
            <div class="contentList">
              <div class="listUp" :class="[ids.includes(item.id) ? 'leftShift' : '']"
                   @click="routerLinkDetail(item)">
                <div class="listTitle">{{item.title || '******'}}</div>
                <div class="listMiddle">
                  <p>{{item.bulletin_name}}</p>
                  <div>
                    <b>
                      <img :src="item.bulletin_staff_avatar" v-if="item.bulletin_staff_avatar" alt="">
                      <img src="../../../assets/image/common/noHead.png" alt="" v-else>
                    </b>
                    <span v-if="item.bulletin_staff_name">{{item.bulletin_staff_name}}</span>
                    <span v-else>******</span>
                  </div>
                </div>
                <div class="listBottom">
                  <div v-if="showStatus">
                    <i class="icon-1"></i>
                    <span v-if="item.status.length">{{item.status[0]}}</span>
                    <span v-else>{{item.name}}</span>
                  </div>
                  <div>
                    <i class="icon-2"></i>
                    <span v-if="showStatus">已等待{{item.duration}}分钟</span>
                    <span v-else>耗时{{item.duration}}分钟</span>
                  </div>
                </div>
                <div class="approvalStatus finish" v-if="tabs.tab === '3'"></div>
                <div class="approvalStatus" :class="[item.approvedStatus ? 'publish': 'reject']"
                     v-if="(tabs.tab === '1' && tabs.status === 1) || (tabs.tab === '2' && tabs.status === 1)"></div>
                <div class="moreOperate" @click.stop="moreOperates(item.id)"
                     v-if="tabs.tab === '2' && tabs.status !== 0 && item.bulletin_type !== 'bulletin_agency'"></div>
              </div>
              <div class="listDown" v-if="item.outcome">
                <div v-for="more in item.outcome.outcomeOptions"
                     :class="item.outcome.outcomeOptions.length>2?'':'listDown2'"
                     @click="onMoreOperates(more,item.outcome.variableName,item)">
                  <i :class="['icon-'+more.action]"></i>
                  <span>{{more.title}}</span>
                </div>
              </div>
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
    <!-- 搜索 -->
    <van-popup :overlay-style="{'top': '3.68rem'}" overlay-class="overlay-color" v-model="approvalModule"
               position="right" :overlay="true">
      <div class="searchApproval">
        <div class="searchInput">
          <div class="input">
            <div>
              <input type="text" v-model="highParams.title" @keyup.enter="searchBtn()" placeholder="请输入搜索内容">
              <span v-if="highParams.title" @click="highParams.title = ''"></span>
            </div>
            <p v-if="highParams.title" class="searchBtn" @click="searchBtn()">搜索</p>
            <p v-if="!highParams.title" @click="showOnSearch()">取消</p>
          </div>
        </div>
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
        <div class="commonBtn">
          <p :class="['btn ' + item.type || '']" v-for="item of buttonFoot" @click="searchBtn(item.type)">
            {{item.label}}
          </p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="customerUsersModule" class="customerUsersModule">
      <h1>发送电子合同</h1>
      <ul>
        <li v-for="item of customer_users">
          <div @click="sendContract(item.fadada_user_id)">
            {{item.name}}
          </div>
        </li>
        <li v-for="item in customer_users">
          <div @click="sendContract(item.fadada_user_id)">
            {{item.name}}
          </div>
        </li>
        <li v-for="item in customer_users">
          <div @click="sendContract(item.fadada_user_id)">
            {{item.name}}
          </div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
  import wofaqide from '../../../assets/image/approvals/wofaqide.png'
  import woshenpide from '../../../assets/image/approvals/woshenpide.png'
  import chaosongwode from '../../../assets/image/approvals/chaosongwode.png'
  import zanbuchuli from '../../../assets/image/approvals/zanbuchuli.png'

  export default {
    name: "index",
    data() {
      return {
        leftShift: false,
        showStatus: false,
        approvalModule: false,
        mainHeight: {},
        moduleHeight: {},
        contract_number: '',
        customer_users: [],
        customerUsersModule: false,
        // 搜索 审批类型
        highParams: {},
        newHighParams: {},
        highList: {
          rootProcessDefinitionKeyIn: {
            title: '待办类型',
            type: 'check',
            keyType: [],
            value: [
              {
                id: 'MarketCollect',
                text: '收房报备',
              }, {
                id: 'MarketRent ',
                text: '租房报备',
              }
              // , {
              //   id: 3,
              //   text: '补充协议',
              // }, {
              //   id: 4,
              //   text: '租房预定',
              // }, {
              //   id: 5,
              //   text: '租房签约',
              // }, {
              //   id: 6,
              //   text: '续租签约',
              // }, {
              //   id: 7,
              //   text: '转租调租',
              // }, {
              //   id: 8,
              //   text: '退租报备',
              // }, {
              //   id: 9,
              //   text: '房屋款项',
              // }, {
              //   id: 10,
              //   text: '中介报备',
              // }, {
              //   id: 11,
              //   text: '其他',
              // },
            ],
          },
        },
        buttonFoot: [
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
        ],
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
            {
              text: '待签署',
              value: 2,
            },
            {
              text: '待重签',
              value: 3,
            }
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
          },
          list2: {
            data0: [],
            data1: [],
            data2: [],
            data3: [],
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
        urlApi: '',
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
        ids: [],
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
    },
    activated() {
      this.resetting();
      let approvalTop = this.$refs.approvalTop.offsetHeight;
      let mainTop = this.$refs.mainTop.offsetHeight;
      let top = approvalTop + mainTop;
      this.mainHeight = this.mainListHeight(top);
      this.moduleHeight = this.mainListHeight(top + 40);
    },
    watch: {
      'highParams.title'(val) {
        this.highParams.title = val.replace(/\s+/g, '');
      },
    },
    computed: {
      // 1我审批的 2我发起的 3抄送我的 4暂不处理
      tabs() {
        return this.$store.state.app.approvalTab;
      },
      personal() {
        return this.$store.state.app.personal;
      },
    },
    methods: {
      showOnSearch() {
        this.approvalModule = false;
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
            this.showOnSearch();
            break;
          case 'reset':
            this.resetting();
            break;
          default:
            this.onSearch(this.tabs.tab);
            break;
        }
      },
      // 显示 更多操作
      moreOperates(id) {
        if (this.ids.includes(id)) {
          let index = this.ids.indexOf(id);
          this.ids.splice(index, 1);
        } else {
          this.ids.push(id);
        }
      },
      // 点击更多 操作
      onMoreOperates(action, name = '', item = {}) {
        let params = {}, user_id = '';
        switch (action.action) {
          case 'preview'://合同预览
            if (!item.contract_view_url) {
              this.$prompt('合同地址不存在！');
              return;
            }
            this.$ddSkip(item.contract_view_url);
            break;
          case 'again'://重新提交
            this.$handleBulletinType(item);
            item.task_action = action.route;
            this.againSave(item);
            break;
          case 'modify'://合同修改
            this.$handleBulletinType(item);
            this.$reviseContract(action, name, item);
            break;
          case 'success'://本地签署
            if (item.bulletin_type.includes('bulletin_collect')) {
              user_id = this.$getFadadaUserId(item);
              this.$handlerSign(item, user_id, 2, item.signer.name).then(_ => {
                this.onSearch(this.tabs.tab);
              });
            } else {
              this.$httpZll.getElectronicContractSinger(item.executionId).then(res => {
                let value = JSON.parse(res.value || '{}');
                if (value.fadada_user_id) {
                  this.$handlerSign(item, value.fadada_user_id, 2, value.name).then(_ => {
                    this.onSearch(this.tabs.tab);
                  });
                }
              });
            }
            break;
          case 'phone'://客户手机签署
            if (item.bulletin_type.includes('bulletin_collect')) {
              user_id = this.$getFadadaUserId(item);
              this.$handlerSign(item, user_id, 1, item.signer.name).then(_ => {
                this.onSearch(this.tabs.tab);
              });
            } else {
              this.$httpZll.getElectronicContractSinger(item.executionId).then(res => {
                let value = JSON.parse(res.value || '{}');
                if (value.fadada_user_id) {
                  this.$handlerSign(item, value.fadada_user_id, 1, value.name).then(_ => {
                    this.onSearch(this.tabs.tab);
                  });
                }
              });
            }
            break;
          case 'contract'://发送电子合同
            this.contract_number = item.contract_number;
            if (item.signers) {
              let signers = JSON.parse(item.signers || '[]');
              if (signers.length) {
                if (signers.length > 1) {
                  this.customer_users = signers;
                  this.customerUsersModule = true;
                } else {
                  user_id = signers[0].fadada_user_id;
                  this.sendContract(user_id);
                }
              } else {
                this.$prompt('用户ID不存在！')
              }
            } else {
              user_id = this.$getFadadaUserId(item);
              this.sendContract(user_id);
            }
            break;
        }
      },
      sendContract(user_id) {
        this.$dialog('电子合同', '是否确认发送电子合同?').then(res => {
          if (res) {
            this.customerUsersModule = false;
            let params = {
              fdd_user_id: user_id,
              is_number: 1,
            };
            this.$httpZll.sendElectronicContract(this.contract_number, params).then(_ => {
            });
          }
        });
      },
      // 重新提交
      againSave(val) {
        this.againTaskDetail(val).then(_ => {
          this.againDetailRequest(val, 'again');
        });
      },
      // 数据列表
      onSearch(num) {
        let tab = String(num);
        let status = Number(this.tabs.status);
        this.twoLevel['tab' + tab] = status;
        this.approvalList['list' + tab]['data' + status] = [];
        this.paramsHandle(tab, status);
      },
      // 报备详情
      routerLinkDetail(item) {
        sessionStorage.setItem('approvalDetail', JSON.stringify(item));
        this.routerLink('/approvalDetail', this.tabs);
      },
      // 接口配置
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
              case 2:
              case 3:
                this.urlApi = 'runtime/tasks';
                break;
            }
            break;
          case '3'://抄送我的
              this.urlApi = 'history/process-instances';
            break;
          case '4'://暂不处理
            this.urlApi = 'runtime/process-instances';
            break;
        }
      },
      // params 配置
      paramsHandle(tab, status) {
        this.showOnSearch();
        this.showStatus = (tab === '1' && !status) || (tab === '2' && !status) || tab === '4';
        this.setApiHandle(tab, status);
        switch (tab) {
          case '1':
            this.params['params' + tab] = {
              page: 1,
              taskDefinitionKeyIn: approvalSearch.approvals1.join(','),
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
                  processDefinitionKeys: approvalSearch.processDefinitionKeys.join(','),
                  finished: Boolean(status),
                  taskCategory: 'approval',
                };
                if (status === 1) {
                  let keys = this.params['params' + tab].processDefinitionKeys;
                  this.params['params' + tab].processDefinitionKeys = keys + ',Agency-Supervision'
                }
                this.params['params' + tab].taskOwner = this.personal.staff_id;
                break;
              case 2:
                this.params['params' + tab] = {
                  page: 1,
                  taskDefinitionKeyIn: approvalSearch.approvals22.join(','),
                };
                this.params['params' + tab].assignee = this.personal.staff_id;
                break;
              case 3:
                this.params['params' + tab] = {
                  page: 1,
                  cancelled: true,//待重签
                  taskDefinitionKeyIn: approvalSearch.approvals23.join(','),
                  active: true,
                };
                this.params['params' + tab].assignee = this.personal.staff_id;
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
        this.newHighParams = this.jsonClone(this.highParams);
        //待办类型由数组转化为字符串
        let root = this.highParams.rootProcessDefinitionKeyIn;
        if (root && root.length > 0) {
          this.newHighParams.rootProcessDefinitionKeyIn = root.join(',');
        }
        this.getApproval(this.urlApi, this.params['params' + tab], tab);
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
          this.getApproval(this.urlApi, this.params['params' + tab], tab);
        }
      },
      // 列表
      getApproval(url, params, tab) {
        // 搜索的参数
        params = Object.assign({}, params, this.newHighParams);
        this.ids = [];
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
            this.outcomes(data, this.tabs);
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
      // 操作按钮处理
      outcomes(data, tabs) {
        if (tabs.tab === '2') {
          for (let item of data) {
            if (tabs.status === 1) {
              item.outcome = {
                outcomeOptions: [{
                  title: '合同预览',
                  action: 'preview',
                }, {
                  title: '发送电子合同',
                  action: 'contract',
                }],
              };
            }
            if (tabs.status === 2) {
              if (item.outcome) {
                let data = [
                  {
                    title: '合同预览',
                    action: 'preview',
                  },
                  {
                    title: '客户手机签署',
                    action: 'phone',
                  },
                ];
                item.outcome = JSON.parse(item.outcome);
                item.outcome.outcomeOptions = data.concat(item.outcome.outcomeOptions);
              }
            }
            if (tabs.status === 3) {
              item.outcome = {
                outcomeOptions: [{
                  title: '重新提交',
                  action: 'again',
                  route: item.task_action,
                }],
              };
            }
          }
        }
      },
      // 头部切换
      changeApproval(val) {
        this.ids = [];
        let tab = val.id;
        let status = this.twoLevel['tab' + tab];
        this.tabs.tab = tab;
        this.tabs.status = status;
        this.$store.dispatch('approval_tabs', this.tabs);
        if (tab === '4') {
          this.urlApi = 'runtime/process-instances';
        }
        this.approvalList['list' + tab]['data' + status] = [];
        this.resetting();//清除搜索参数
        this.paramsHandle(tab, status);
      },
      // 二级切换
      tabsTag(status) {
        let tab = this.tabs.tab;
        if (this.tabs.status === status) return;
        this.tabs.status = status;
        this.twoLevel['tab' + tab] = status;
        this.$store.dispatch('approval_tabs', this.tabs);
        this.resetting();//清除搜索参数
        this.onSearch(tab);
      },
      // 重置搜索
      resetting() {
        let list = this.jsonClone(this.highList);
        for (let item of Object.keys(list)) {
          this.highParams[item] = list[item].keyType;
        }
        this.highParams.title = '';
        this.highParams = Object.assign({}, this.highParams);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/approvals/index.scss";
</style>
