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
            <p @click="clickBtn({action:'finishTask'},item)"><i></i></p>
          </div>
          <p class="statusBtn">
            <span>{{item.name}}</span>
            <!--<label>密码 506231</label>-->
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
    <van-popup v-model="deliverPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}" :overlay="true"
               class="deliverPopup">
      <div class="deliverTitle">
        {{deliverIndex?'转交':'代签'}}
      </div>
      <div class="deliver">
        <div v-for="item in defineDeliver[deliverIndex]" :class="item.type">
          <label>{{item.label}}</label>
          <input
            v-if="item.type !== 'textarea'"
            type="text"
            v-model="formatData[item.keyName]"
            :readonly="item.readonly"
            :disabled="item.disabled"
            @focus="choosePicker(item)"
            :placeholder="item.placeholder">
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="onCancel">取消</p>
        <p class="btn" @click="saveDeliver(deliverIndex)">确定</p>
      </div>
    </van-popup>
    <!--新建待办任务-->
    <div class="addToBeDone" @click="showAddPopup = true"></div>
    <van-popup v-model="showAddPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="showAddPopup">
      <p class="addTitle">
        <span class="writingMode">新建</span>
      </p>
      <div class="mainModule">
        <div class="module" :class="['module'+(index+1)]" v-for="(item,index) in addShowList"
             @click="routerLink(item.url, item)">
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
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="tabsModule" position="bottom"
               :overlay="true" class="tabsModule">
      <div class="modules">
        <div v-for="item in modules" @click="tabsTag(item.id)">
          <i><img :src="item.icon" alt=""></i>
          <span class="writingMode">{{item.text}}</span>
        </div>
      </div>
    </van-popup>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>
  </div>
</template>

<script>
  import SearchStaff from '../../common/searchStaff.vue';

  import icon_daiqian from '@/assets/image/toBeDone/daiqian.png'
  import icon_zhuanjiao from '@/assets/image/toBeDone/zhuanjiao.png'
  import icon_qudaka from '@/assets/image/toBeDone/qudaka.png'
  import icon_quqianyue from '@/assets/image/toBeDone/quqianyue.png'
  import icon_wofaqide from '@/assets/image/toBeDone/wofaqide.png'
  import icon_woshenpide from '@/assets/image/toBeDone/woshenpide.png'
  import icon_lishidaikan from '@/assets/image/toBeDone/lishidaikan.png'
  import icon_hetongmoban from '@/assets/image/toBeDone/hetongmoban.png'
  import icon_shoujiqianshu from '@/assets/image/approvals/detail/kehushoujiqianshu.png'
  import icon_hetongxiugai from '@/assets/image/approvals/xiugaihetong.png'
  import icon_bendiqianshu from '@/assets/image/approvals/detail/bendiqianshu.png'

  export default {
    name: "index",
    components: {SearchStaff},
    data() {
      return {
        mainHeight: '',
        fullLoading: true,
        task_id: '',
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
        form: {},
        formatData: {},
        normalOperates: [
          {
            icon: icon_daiqian,
            text: '代签',
            action: 'allograph',
          }, {
            icon: icon_zhuanjiao,
            text: '转交',
            action: 'deliver',
          }
        ],

        // 状态变化按钮
        changeOperates: {
          punchClock: icon_qudaka,
          collectReport: icon_quqianyue,
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
        addShowList: [],
        paging: 0,
        params: {
          title: '',
          page: 1,
        },
        toBeDoneList: [],
        variableName: '',
        bulletin_type: {},//报备类型
        searchStaffModule: false,
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(_ => {
        let top = this.$refs.toBeDoneTop.offsetHeight;
        this.mainHeight = this.mainListHeight(top);
      })
    },
    activated() {
      this.bulletin_type = JSON.parse(sessionStorage.bulletin_type);
      this.fullLoading = true;
      this.toBeDoneList = [];
      this.popupOperate();
    },
    watch: {
      'params.title'(val) {
        this.params.title = val.replace(/\s+/g, '');
      },
    },
    computed: {},
    methods: {
      // 结束任务
      shutDown() {

      },
      // 人员/部门/时间
      choosePicker(val) {
        if (val.keyName === 'assignee') this.searchStaffModule = true;
      },
      // 员工搜索结果
      getStaffInfo(val) {
        this.searchStaffModule = false;
        if (val !== 'close') {
          this.form.assignee = val.staff_id;
          this.formatData.assignee = val.staff_name;
          this.formatData.department_name = val.department_name;
        }
      },
      onCancel() {
        this.deliverPopup = false;
      },
      // 右侧弹窗操作
      popupOperate() {
        let type = this.bulletin_type.bulletin;
        switch (type) {
          case 'bulletin_collect_basic':
            this.addShowList = [
              {
                url: '/createdTask',
                id: 'CollectTakeLook',
                text: '收房带看',
              }, {
                url: '/supplyAgreement',
                text: '补充协议',
              }
            ];
            break;
          case 'bulletin_rent_basic':
            this.addShowList = [
              {
                url: '/createdTask',
                id: 'RentTakeLook',
                text: '租房带看',
              }, {
                url: '',
                text: '补充协议',
              }, {
                url: '/collectReport',
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
            let result;
            this.againTaskDetail(val).then(_ => {
              if (val.bm_detail_request_url) {
                this.againDetailRequest(val, 'again');
              } else {
                if (val.tk_result) {
                  result = val.tk_result === 'bulletin' ? '1' : '0';
                  this.routerLink(val.task_action, {result: result});
                } else {
                  this.routerLink(val.task_action);
                }
              }
            });
            break;
        }
      },
      // 转交 / 代签
      saveDeliver(val) {
        this.form.changeOwner = Boolean(val);
        if (!this.form.assignee) {
          let msg = '请选择' + (val ? '转交' : '代签') + '人';
          this.$prompt(msg, 'fail');
          return;
        }
        this.$httpZll.postToBeDoneDeliver(this.task_id, this.form, val).then(_ => {
          this.onCancel();
        })
      },
      // 变更 签署 转交 代签 结束任务
      clickBtn(action = {}, item = {}) {
        this.task_id = item.task_id || '';
        let user_id = '';
        switch (action.action) {
          case 'success'://本地签署
            user_id = this.getFadadaUserId(item);
            this.handlerSign(item, user_id, 2);
            break;
          case 'phone'://客户手机签署
            user_id = this.getFadadaUserId(item);
            this.handlerSign(item, user_id, 1);
            break;
          case 'allograph'://代签
            this.resetting(0);
            this.deliverPopup = true;
            break;
          case 'deliver'://转交
            this.resetting(1);
            this.deliverPopup = true;
            break;
          case 'finishTask'://结束任务
            this.$dialog('结束任务', '是否结束该任务？').then(status => {
              if (status) {
                // this.$httpZll.finishToBeDoneTask(task_id).then(res => {
                //
                // })
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
      // 签署
      handlerSign(item, user_id, type) {
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
          title = ['电子合同', '是否确认签署电子合同?'];
        }
        this.$signPostApi(item, params, title).then(res => {
          if (res) {
            this.$ddSkip(res);
            this.$dialog('签署', '签署是否完成?').then(res => {
              if (res) {
                this.$prompt('正在处理..', 'send');
                setTimeout(_ => {
                  this.onSearch();
                }, 1000)
              } else {
                this.onSearch();
              }
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
        let status = type === 'bulletin_collect_basic' ? 'toBeDoneCollect' : 'toBeDoneRent';
        val.rootProcessDefinitionKey = type === 'bulletin_collect_basic' ? 'MarketCollect' : 'MarketRent';
        val.taskDefinitionKeyIn = approvalSearch[status].join(',');
        this.$httpZll.getToBeDoneApi(val).then(res => {
          this.fullLoading = false;
          this.paging = res.total;
          let data = this.groupHandlerListData(res.data);
          this.handlerOperates(data, type);
          if (this.params.page === 1) {
            this.toBeDoneList = data;
          } else {
            for (let item of data) {
              this.toBeDoneList.push(item);
            }
          }
        })
      },
      // 更多操作按钮
      handlerOperates(data, type) {
        for (let btn of data) {
          if (btn.outcome) {
            let data = [];
            switch (type) {
              case 'bulletin_collect_basic':
              case 'bulletin_rent_basic':
                data = [{
                  title: '客户手机签署',
                  action: 'phone',
                }];
                break;
            }
            btn.outcome = JSON.parse(btn.outcome);
            btn.outcome.outcomeOptions = btn.outcome.outcomeOptions.concat(data);
          } else {
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
          case '3'://历史带看
            this.$store.dispatch('done_tabs', '2');
            this.routerLink('/toBeDoneList');
            break;
        }
      },
      // 转交/代签
      resetting(val) {
        this.deliverIndex = val;
        this.formatData = {
          assignee: '',
          department_name: '',
        };
        this.form = {
          assignee: '',
          action: 'transfer',
          changeOwner: true
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDone/index.scss";

  .deliverPopup {
    @include radius(.2rem);
    padding: .3rem;

    .deliverTitle {
      font-size: .33rem;
      padding: 0 0 .5rem .2rem;
    }

    .deliver {
      > div {
        @include flex('items-center');
        min-height: .88rem;

        label {
          min-width: 1.5rem;
          max-width: 1.5rem;
          text-align: right;
          margin-right: .3rem;
        }
      }
    }

    .commonBtn {
      padding: .5rem 0 .2rem;
    }
  }
</style>
