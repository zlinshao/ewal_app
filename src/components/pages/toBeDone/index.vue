<template>
  <div id="toBeDone">
    <div class="toBeDoneTop" ref="toBeDoneTop">
      <div class="searchInput">
        <div class="input">
          <div>
            <input type="text" placeholder="请输入搜索内容" v-model="params.title" @keyup.enter="onSearch()">
            <span v-if="params.title" @click="emptyTitle"></span>
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
            <p @click="clickBtn({action:'finishTask'},item)"><i></i></p>
          </div>
          <p class="statusBtn">
            <span>{{item.name}}</span>
          </p>
          <div class="handleBtn">
            <!--合同修改 / 签署-->
            <div v-if="item.outcome && !item.task_action" class="contract">
              <p v-for="btn in item.outcome.outcomeOptions" @click="clickBtn(btn,item)">
                <i><img :src="changeOperates[btn.action]" alt=""></i>
                <span>{{btn.title}}</span>
              </p>
            </div>
            <!--转交/代签-->
            <div v-for="btn in normalOperates" :class="btn.action" v-else>
              <b @click="clickBtn(btn,item)">
                <i><img :src="btn.icon" alt=""></i>
                <span>{{btn.text}}</span>
              </b>
            </div>
            <!--去打卡 / 去签约-->
            <div v-if="item.task_title" :class="item.task_action">
              <b @click="goOperates(item)">
                <i><img :src="changeOperates[item.task_action]" alt=""></i>
                <span>{{item.task_title}}</span>
              </b>
            </div>
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
    <!--代签/转交-->
    <deliver :module="deliverPopup" :config="deliverConfig" @close="deliverPopup = false"></deliver>
    <!--新建待办任务-->
    <div class="addToBeDone" @click="showAddPopup = true" v-if="showRightAdd"></div>
    <div class="addToBeDone newAdd" @click="addBulletin(bulletin_type.bulletin)" v-if="addType"><span>+</span></div>
    <van-popup v-model="showAddPopup" overlay-class="overlay-color" position="right" :overlay="true"
               class="showAddPopup">
      <p class="addTitle">
        <span class="writingMode">新建</span>
      </p>
      <div class="mainModule">
        <div class="module" :class="['module'+(index+1)]" v-for="(item,index) in addShowList"
             @click="addRouterLink(item.url, item)">
          <div>
            <i></i>
            <p>{{item.text}}</p>
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
    <van-popup overlay-class="overlay-color" v-model="tabsModule" position="bottom" :overlay="true" class="tabsModule">
      <div class="modules">
        <div v-for="item in modules" @click="tabsTag(item.id)">
          <i><img :src="item.icon" alt=""></i>
          <span class="writingMode">{{item.text}}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Deliver from './deliver.vue'
  import icon_daiqian from '@/assets/image/toBeDone/daiqian.png'
  import icon_zhuanjiao from '@/assets/image/toBeDone/zhuanjiao.png'
  import icon_qudaka from '@/assets/image/toBeDone/qudaka.png'
  import icon_quqianyue from '@/assets/image/toBeDone/quqianyue.png'
  import icon_wofaqide from '@/assets/image/toBeDone/wofaqide.png'
  import icon_woshenpide from '@/assets/image/toBeDone/woshenpide.png'
  import icon_hetongmoban from '@/assets/image/toBeDone/hetongmoban.png'
  import icon_shoujiqianshu from '@/assets/image/approvals/detail/kehushoujiqianshu.png'
  import icon_hetongxiugai from '@/assets/image/approvals/xiugaihetong.png'
  import icon_bendiqianshu from '@/assets/image/approvals/detail/bendiqianshu.png'

  export default {
    name: "index",
    components: {Deliver},
    data() {
      return {
        mainHeight: '',
        fullLoading: true,
        //正常操作 按钮
        operates: {},//状态变更操作
        defineDeliver: [
          [
            {
              label: '代签人',
              readonly: 'readonly',
              type: 'text',
              keyName: 'assignee',
              placeholder: '必填 请选择',
            },
            {
              label: '部门',
              type: 'text',
              disabled: 'disabled',
              keyName: 'department_name',
              placeholder: '已禁用',
            },
          ],
          [
            {
              label: '转交人',
              readonly: 'readonly',
              type: 'text',
              keyName: 'assignee',
              placeholder: '必填 请选择',
            },
            {
              label: '部门',
              type: 'text',
              disabled: 'disabled',
              keyName: 'department_name',
              placeholder: '已禁用',
            },
          ]
        ],
        deliverIndex: 0,
        deliverPopup: false,//代签/转交
        deliverConfig: {},//代签/转交
        form: {},
        formatData: {},
        // 自定义按钮
        normalOperates: [
          // {
          //   icon: icon_daiqian,
          //   text: '代签',
          //   action: 'allograph',
          // }, {
          //   icon: icon_zhuanjiao,
          //   text: '转交',
          //   action: 'deliver',
          // }
        ],
        // 状态变化按钮
        changeOperates: {
          punchClock: icon_qudaka,
          collectReport: icon_quqianyue,
          deliveryReceipt: icon_quqianyue,
          phone: icon_shoujiqianshu,
          success: icon_bendiqianshu,
          modify: icon_hetongxiugai,
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
            icon: icon_hetongmoban,
            text: '租房合同模板',
          }, {
            id: '4',
            icon: icon_hetongmoban,
            text: '收房合同模板',
          },
        ],
        // 右侧栏
        showAddPopup: false,//新建待办任务
        addShowList: [],
        paging: 0,
        params: {
          title: '',
          page: 1,
          assignee: '',
        },
        toBeDoneList: [],
        variableName: '',
        bulletin_type: {},//报备类型
        addType: false,
        showRightAdd: false,//显示新增
        searchStaffModule: false,
        contractMoulds: {},
      }
    },
    created() {
    },
    mounted() {
      this.getContract();// 合同模板
      this.$nextTick(_ => {
        let top = this.$refs.toBeDoneTop.offsetHeight;
        this.mainHeight = this.mainListHeight(top);
      })
    },
    activated() {
      this.bulletin_type = JSON.parse(sessionStorage.bulletin_type);
      let type = this.bulletin_type.bulletin;
      let types = ['bulletin_change', 'bulletin_rent_trans', 'bulletin_special', 'bulletin_special_collect', 'bulletin_special_rent'];
      this.addType = types.includes(type);
      if (type === 'bulletin_rent_RWC' || type === 'bulletin_booking_renting' || type === 'bulletin_rent_continued') {
        this.bulletin_type = bulletinRouterStatus.bulletin_rent_basic;
        sessionStorage.setItem('bulletin_type', JSON.stringify(this.bulletin_type));
      }
      if (type === 'bulletin_collect_continued') {
        this.bulletin_type = bulletinRouterStatus.bulletin_collect_basic;
        sessionStorage.setItem('bulletin_type', JSON.stringify(this.bulletin_type));
      }
      this.fullLoading = true;
      this.showRightAdd = false;
      this.toBeDoneList = [];
      this.popupOperate();
    },
    watch: {
      'params.title'(val) {
        this.params.title = val.replace(/\s+/g, '');
      },
    },
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      },
    },
    methods: {
      addBulletin(type) {
        if (type.includes('bulletin_special')) {
          sessionStorage.setItem('task_detail', '{}');
          this.routerLink('/collectReport');
        } else {
          this.routerLink('/contractSearch');
        }
      },
      addRouterLink(url, item) {
        if (item.status) {
          sessionStorage.setItem('bulletin_type', JSON.stringify(item.status));
          this.$httpZll.postOpenOneProcess(this.personal.staff_id).then(res => {
            let obj = {root_id: ''};
            obj.root_id = res.id;
            this.$getTaskList(obj).then(data => {
              let detail = {};
              detail.content = {};
              detail.task_id = data.id;
              detail.bulletin = data.bulletin_type;
              detail.process_instance_id = data.processInstanceId;
              sessionStorage.setItem('task_detail', JSON.stringify(detail));
              this.routerLink(url, item);
            });
          })
        } else {
          this.routerLink(url, item);
        }
      },
      // 获取合同模板
      getContract() {
        this.$httpZll.getContractMould({scene_depart: this.personal.city_name}).then(res => {
          if (res) {
            for (let item of res.data.data) {
              if (item.pdf_scene === 1) {//收房
                this.contractMoulds['4'] = item.contract_template_url;
              } else {//租房
                this.contractMoulds['3'] = item.contract_template_url;
              }
            }
          }
        });
      },
      // 右侧弹窗操作
      popupOperate() {
        let type = this.bulletin_type.bulletin;
        switch (type) {
          case 'bulletin_collect_basic':
            this.showRightAdd = true;
            this.addShowList = [
              {
                url: '/createdTask',
                id: 'CollectTakeLook',
                text: '收房带看',
              },
              // {
              //   url: '/supplyAgreement',
              //   text: '补充协议',
              // }
            ];
            break;
          case 'bulletin_rent_basic':
            this.showRightAdd = true;
            this.addShowList = [
              {
                url: '/createdTask',
                id: 'RentTakeLook',
                text: '租房带看',
              },
              {
                url: '/supplyAgreement',
                text: '补充协议',
              },
              {
                url: '/collectReport',
                status: bulletinRouterStatus.bulletin_rent_RWC,
                text: '未收先租',
              }
            ];
            break;
        }
      },
      // 去打卡 去签约
      goOperates(val) {
        switch (val.task_action) {
          case 'punchClock':
            sessionStorage.setItem('punchClock', JSON.stringify(val));
            this.routerLink(val.task_action);
            break;
          case 'collectReport':
          case 'deliveryReceipt':
            let type = this.bulletin_type.bulletin;
            let result, bulletin;
            let routes = this.$router.options.routes, all = {};
            if (val.bulletin_type) {
              all = this.$bulletinTitles(val.bulletin_type);
            } else {
              all = this.$bulletinTitles(type);
            }
            for (let value of routes) {
              if (value.path === '/collectReport') {
                value.meta.title = all.bulletin;
              }
            }
            if (val.bulletin_type === 'bulletin_rent_RWC') {
              bulletin = bulletinRouterStatus.bulletin_rent_RWC;
              sessionStorage.setItem('bulletin_type', JSON.stringify(bulletin));
            }
            if (!val.finish_RWC) {
              if (val.new_RWC) {
                this.routerLink(val.task_action);
              }
            }
            this.againTaskDetail(val).then(_ => {
              if (val.bm_detail_request_url) {
                let status = true;
                let types = ['bulletin_retainage', 'bulletin_agency', 'bulletin_rent_RWC'];
                for (let key of Object.keys(val)) {
                  if (key.includes('_approved')) {
                    status = false;
                  }
                }
                if (types.includes(type) || status) {
                  this.againDetailRequest(val);
                } else {
                  this.againDetailRequest(val, 'again');
                }
              } else {
                if (val.finish_RWC !== 'bulletin_rent_RWC') {
                  if (val.tk_result) {
                    bulletin = val.tk_result === 'bulletin' ? bulletinRouterStatus.bulletin_rent_basic : bulletinRouterStatus.bulletin_booking_renting;
                    result = val.tk_result === 'bulletin' ? '1' : '0';
                    if (val.book_url) {
                      bulletin = bulletinRouterStatus.bulletin_rent_basic;
                      result = '1';
                    }
                    this.routerLink(val.task_action, {result: result});
                  } else {
                    if (val.bulletin_type) {
                      bulletin = bulletinRouterStatus[val.bulletin_type];
                    } else {
                      bulletin = bulletinRouterStatus.bulletin_collect_basic;
                    }
                    this.routerLink(val.task_action);
                  }
                  sessionStorage.setItem('bulletin_type', JSON.stringify(bulletin));
                } else {
                  if (val.finish_RWC) {
                    this.routerLink(val.task_action, {result: '1'});
                  } else {
                    this.routerLink(val.task_action);
                  }
                }
              }
            });
            break;
        }
      },
      // 变更 签署 转交 代签 结束任务
      clickBtn(action = {}, item = {}) {
        let user_id = '';
        switch (action.action) {
          case 'success'://本地签署
            if (item.bulletin_type.includes('bulletin_collect')) {
              user_id = this.$getFadadaUserId(item);
              this.handlerSign(item, user_id, 2, item.signer.name);
            } else {
              this.$httpZll.getElectronicContractSinger(item.executionId).then(res => {
                let value = JSON.parse(res.value || '{}');
                if (value.fadada_user_id) {
                  this.handlerSign(item, value.fadada_user_id, 2, value.name);
                }
              });
            }
            break;
          case 'phone'://客户手机签署
            if (item.bulletin_type.includes('bulletin_collect')) {
              user_id = this.$getFadadaUserId(item);
              this.handlerSign(item, user_id, 1, item.signer.name);
            } else {
              this.$httpZll.getElectronicContractSinger(item.executionId).then(res => {
                let value = JSON.parse(res.value || '{}');
                if (value.fadada_user_id) {
                  this.handlerSign(item, value.fadada_user_id, 1, value.name);
                }
              });
            }
            break;
          case 'allograph'://代签
          case 'deliver'://转交
            let data = {};
            data.name = action.action;
            data.id = item.task_id;
            this.deliverConfig = Object.assign({}, data);
            this.deliverPopup = true;
            break;
          case 'finishTask'://结束任务
            this.$dialog('结束任务', '是否结束该任务？').then(status => {
              if (status) {
                this.$httpZll.finishToBeDoneTask(item.root_id, {deleteReason: '结束'}).then(_ => {
                  this.getToBeDoneList(this.params)
                })
              }
            });
            break;
          default://合同修改
            this.$reviseContract(action, item.outcome.variableName, item);
            break
        }
      },
      // 获取fadadaId
      getFadadaUserId(item) {
        return item.signer && item.signer.fadada_user_id || this.$prompt('用户ID不存在！');
      },
      onCancel() {
        this.deliverPopup = false;
      },
      // 签署
      handlerSign(item, user_id, type, name = '') {
        let title = [];
        let params = {
          customer_id: user_id,
          type: type,
          index: 0,
        };
        if (item.taskDefinitionKey === 'CollectReceiptSign') {
          params.index = 2;
          title = ['收据', '是否确认签署收据?'];
        } else {
          params.index = 1;
          let content = type === 2 ? `客户姓名：${name}<br>是否确认签署电子合同?` : `客户姓名：${name}<br>是否确认发送客户签署电子合同?`;
          title = ['电子合同', content];
        }
        this.$signPostApi(item, params, title).then(res => {
          if (res) {
            this.$ddSkip(res);
            this.$dialog('签署', '签署是否完成?').then(res => {
              this.$prompt('正在处理..', 'send');
              setTimeout(_ => {
                this.onSearch();
              }, 2000)
            })
          }
        });
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
      // 清空搜索内容
      emptyTitle() {
        this.params.title = '';
        this.onSearch();
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
        let type = this.bulletin_type.bulletin;
        let obj = this.bulletinStatus(type);
        val.rootProcessDefinitionKeyIn = obj.type;
        val.assignee = this.personal.staff_id;
        val.taskDefinitionKeyIn = approvalSearch[obj.status].join(',') + ',SignEC';
        this.$httpZll.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          if (res) {
            this.paging = res.total;
            let data = this.groupHandlerListData(res.data);
            this.handlerOperates(data);
            if (this.params.page === 1) {
              this.toBeDoneList = data;
            } else {
              for (let item of data) {
                this.toBeDoneList.push(item);
              }
            }
          }
        })
      },
      bulletinStatus(type) {
        let obj = {};
        switch (type) {
          case "bulletin_collect_basic":
            obj.status = 'toBeDoneCollect';
            obj.type = 'MarketCollect,MarketCollectRenew';
            break;
          case "bulletin_rent_basic":
            obj.status = 'toBeDoneRent';
            obj.type = 'MarketRent,MarketRentRenew';
            break;
          case "bulletin_retainage":
            obj.status = 'toBeDoneRetainage';
            obj.type = 'MarketRent,MarketRentRenew';
            break;
          case "bulletin_agency":
            obj.status = 'toBeDoneAgency';
            obj.type = 'MarketCollect,MarketRent';
            break;
          case "bulletin_checkout":
            obj.status = 'bulletinCheckout';
            obj.type = 'Market-CollectWithdrawal,Market-RentWithdrawal';
            break;
          case "bulletin_change":
            obj.status = 'toBeDoneChange';
            obj.type = 'Market-ChangeRentHouse';
            break;
          case "bulletin_rent_trans":
            obj.status = 'toBeDoneChange';
            obj.type = 'Market-ChangeRentCustomer';
            break;
          case "bulletin_special":
          case "bulletin_special_collect":
          case "bulletin_special_rent":
            obj.status = 'toBeDoneChange';
            obj.type = 'Market-Special-collect,Market-Special-rent';
            break;
        }
        // Market-CollectWithdrawal 收房退租
        // Market-RentWithdrawal 租房退租
        return obj;
      },
      // 更多操作按钮
      handlerOperates(data) {
        for (let btn of data) {
          if (btn.outcome) {
            let data = [];
            if (btn.taskDefinitionKey === 'SignEC') {
              data = [{
                title: '客户手机签署',
                action: 'phone',
              }];
            }
            btn.outcome = JSON.parse(btn.outcome);
            btn.oldOutcome = this.jsonClone(btn.outcome);
            btn.outcome.outcomeOptions = btn.outcome.outcomeOptions.concat(data);
          } else {
            // 签收据
            if (btn.taskDefinitionKey === 'CollectReceiptSign') {
              btn.outcome = {
                outcomeOptions: [
                  {
                    title: '本地签署',
                    action: 'success',
                  },
                  {
                    title: '客户手机签署',
                    action: 'phone',
                  }
                ],
              };
            }
          }
        }
      },
      // 底部模态框 按钮
      tabsTag(val) {
        this.tabsModule = false;
        switch (val) {
          case '1'://我发起的
          case '2'://我审批的
            let tabs = {};
            tabs.tab = val;
            tabs.status = 0;
            this.$store.dispatch('approval_tabs', tabs);
            this.routerLink('/approvals');
            break;
          case '3'://租房
          case '4'://收房
            this.$ddSkip(this.contractMoulds[val]);
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDone/index.scss";
</style>
