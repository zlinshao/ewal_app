<template>
  <div id="approvals">
    <div ref="approvalTop" class="approvalTop">
      <div class="top1">
        <p class="p1"></p>
        <p class="p2"></p>
      </div>
      <ul class="items-around">
        <li v-for="item in approvalTerm" @click="changeApproval(item)">
          <p><img :src="item.icon" alt=""></p>
          <h1 :class="[item.id === tabs.tab ? 'hover' : '']">{{item.text}}</h1>
        </li>
      </ul>
    </div>
    <div class="main">
      <div ref="mainTop" class="mainTop items-bet">
        <div class="flex">
          <p v-for="item in buttons['tab'+tabs.tab]" @click="tabsTag(item.value)"
             :class="[twoLevel['tab'+tabs.tab] === item.value ? 'hover' : '']">
            {{item.text}}<span class="numberFont" v-if="!item.value">{{paging['paging'+tabs.tab]}}</span>
          </p>
        </div>
        <i></i>
      </div>
      <div class="mainContent" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="fullLoading['load'+tabs.tab]">
          <li v-for="item in approvalList['list'+tabs.tab]['data'+twoLevel['tab'+tabs.tab]]">
            <div class="contentList">
              <div class="listUp" :class="[task_ids.includes(item.task_id) ? 'leftShift' : '']"
                   @click="routerLinkDetail(item)">
                <div class="listTitle">{{item.house_address}}</div>
                <div class="listMiddle">
                  <p v-if="item.status.length">{{item.status[0]}}</p>
                  <p v-else>{{item.name}}</p>
                  <div>
                    <b>
                      <img :src="item.bulletin_staff_avatar" v-if="item.bulletin_staff_avatar">
                      <img src="../../../assets/image/common/noHead.png" v-else>
                    </b>
                    <span v-if="item.bulletin_staff_name">{{item.bulletin_staff_name}}</span>
                    <span v-else>---</span>
                  </div>
                </div>
                <div class="listBottom">
                  <div>
                    <i class="icon-1"></i>
                    <span>待产管审核</span>
                  </div>
                  <div>
                    <i class="icon-2"></i>
                    <span>以等待{{item.duration}}分钟</span>
                  </div>
                </div>
                <div class="approvalStatus publish" v-if="tabs.tab === '2' && tabs.status === 1"></div>
                <div class="moreOperate" @click.stop="moreOperates(item.task_id)"
                     v-if="tabs.tab === '2' && tabs.status !== 0"></div>
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
  </div>
</template>

<script>
  import wofaqide from '../../../assets/image/approvals/wofaqide.png'
  import woshenpide from '../../../assets/image/approvals/woshenpide.png'
  import chaosongwode from '../../../assets/image/approvals/chaosongwode.png'
  import zanbuchuli from '../../../assets/image/approvals/zanbuchuli.png'
  import {Dialog} from 'vant'

  export default {
    name: "index",
    data() {
      return {
        leftShift: false,
        mainHeight: '',
        //加载是否结束
        fullLoading: {
          load1: false,
          load2: false,
          load3: false,
          load4: false,
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
        task_ids: [],
      }
    },
    mounted() {
      for (let i = 1; i < 5; i++) {
        if (this.tabs.tab !== String(i)) {
          this.onSearch(i);
        }
      }
    },
    activated() {
      let approvalTop = this.$refs.approvalTop.offsetHeight;
      let mainTop = this.$refs.mainTop.offsetHeight;
      this.mainHeight = this.mainListHeight((approvalTop + mainTop));
      // this.onSearch(this.tabs.tab);
    },
    watch: {},
    computed: {
      // 1我审批的 2我发起的 3抄送我的 4暂不处理
      tabs() {
        return this.$store.state.app.approvalTab;
      },
    },
    methods: {
      // 显示 更多操作
      moreOperates(id) {
        if (this.task_ids.includes(id)) {
          let index = this.task_ids.indexOf(id);
          this.task_ids.splice(index, 1);
        } else {
          this.task_ids.push(id);
        }
      },
      // 点击更多 操作
      onMoreOperates(action, name = '', item = {}) {
        let params = {}, user_id = '';
        user_id = item.signer && item.signer.fadada_user_id || this.$prompt('用户ID不存在！');
        switch (action.action) {
          case 'preview'://合同预览
            if (!item.contract_view_url) {
              this.$prompt('合同地址不存在！');
              return;
            }
            this.$ddSkip(item.contract_view_url);
            break;
          case 'again'://重新提交
            this.handleBulletinType(item);
            item.task_action = action.route;
            this.againSave(item);
            break;
          case 'modify'://合同修改
            this.handleBulletinType(item);
            this.$reviseContract(action, name, item);
            break;
          case 'success'://本地签署
            this.handlerSign(item, user_id, 2);
            break;
          case 'phone'://客户手机签署
            this.handlerSign(item, user_id, 1);
            break;
          case 'contract'://发送电子合同
            this.$dialog('电子合同', '是否确认发送电子合同?').then(res => {
              if (res) {
                params = {
                  fdd_user_id: user_id,
                  is_number: 1,
                };
                this.$httpZll.sendElectronicContract(item.contract_number, params).then(data => {

                })
              }
            });
            break;
        }
      },
      // 签署
      handlerSign(item, user_id, type) {
        let title = ['电子合同', ''];
        let params = {
          customer_id: user_id,
          type: type,
          index: 1,
        };
        title[1] = type === 2 ? '是否确认签署电子合同?' : '是否确认发送客户签署电子合同?';
        this.$signPostApi(item, params, title, '/toBeDone');
      },
      // 报备类型
      handleBulletinType(item) {
        switch (item.bulletin_type) {
          case 'bulletin_collect_basic':
            this.$store.dispatch('bulletin_type', bulletinRouterStatus.newCollect);
            break;
          case '':
            break;
        }
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
        this.$store.dispatch('bulletin_type', {bulletin: item.bulletin_type});
        this.routerLink('/approvalDetail', item);
      },
      // 接口配置
      apiHandle(tab, status) {
        switch (tab) {
          case '1':
            this.urlApi = status === 1 ? 'history/tasks' : 'runtime/tasks';
            break;
          case '2':
            switch (status) {
              case 0:
                this.urlApi = 'runtime/process-instances';
                break;
              case 1:
                this.urlApi = 'history/process-instances';
                break;
              case 2:
                this.urlApi = 'runtime/tasks';
                break;
              case 3:
                this.urlApi = 'runtime/tasks';
                break;
            }
            break;
          case '3':
            if (status === 0) {
              this.urlApi = 'runtime/tasks';
            } else {
              this.urlApi = 'history/tasks';
            }
            break;
          case '4':
            this.urlApi = 'runtime/process-instances';
            break;
        }
      },
      // params 配置
      paramsHandle(tab, status, req) {
        this.apiHandle(tab, status);
        switch (tab) {
          case '1':
            this.params['params' + tab] = {
              page: 1,
              // assignee: '69',//登陆人
              taskDefinitionKeyIn: approvalSearch.approvals1.join(','),
              category: 'approval',
              finished: Boolean(status)
            };
            break;
          case '2':
            switch (status) {
              case 0:
              case 1:
                this.params['params' + tab] = {
                  page: 1,
                  // taskOwner: '69',//登陆人
                  processDefinitionKey: 'MG-BulletinApproval',
                  // processInstanceName: 'Collect',//区分报备类型
                  finished: Boolean(status),
                };
                break;
              case 2:
                this.params['params' + tab] = {
                  page: 1,
                  // assignee: '69',//登陆人
                  taskDefinitionKeyIn: approvalSearch.approvals22.join(','),
                  // processInstanceName: 'Collect',//区分报备类型
                };
                break;
              case 3:
                this.params['params' + tab] = {
                  page: 1,
                  cancelled: true,//待重签
                  taskDefinitionKeyIn: approvalSearch.approvals23.join(','),
                  active: true,
                  // processInstanceName: 'Collect',//区分报备类型
                };
                break;
            }
            break;
          case '3':
            this.params['params' + tab] = {
              page: 1,
              // assignee: '69',//登陆人
              category: 'cc',
              finished: Boolean(status),
            };
            break;
        }
        if (req) return;
        this.getApproval(this.urlApi, this.params['params' + tab], tab);
      },
      // 滚动加载
      scrollLoad(val) {
        let tab = this.tabs.tab;
        let status = this.tabs.status;
        this.paramsHandle(tab, status, 'break');
        if (!val) {
          this.params['params' + tab].page = 1;
        } else {
          if (this.fullLoading['load' + tab]) return;
          let length = this.approvalList['list' + tab]['data' + this.twoLevel['tab' + tab]].length;
          if (length === this.total['total' + tab]) return;
          this.params['params' + tab].page++;
        }
        this.getApproval(this.urlApi, this.params['params' + tab], tab);
      },
      // 列表
      getApproval(url, params, tab) {
        this.task_ids = [];
        this.fullLoading['load' + tab] = true;
        this.$httpZll.getMeInitiate(url, params).then(res => {
          this.fullLoading['load' + tab] = false;
          let twoLevel = this.twoLevel['tab' + tab];
          this.total['total' + tab] = res.total;
          if (!twoLevel) {
            this.paging['paging' + tab] = res.total;
          }
          let data = this.groupHandlerListData(res.data);
          this.outcomes(data, this.tabs);
          if (this.params['params' + tab].page === 1) {
            this.approvalList['list' + tab]['data' + twoLevel] = data;
          } else {
            for (let item of data) {
              this.approvalList['list' + tab]['data' + twoLevel].push(item);
            }
          }
        })
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
        this.task_ids = [];
        let tab = val.id;
        let status = this.twoLevel['tab' + tab];
        this.tabs.tab = tab;
        this.tabs.status = status;
        this.$store.dispatch('approval_tabs', this.tabs);
        if (tab === '4') {
          this.urlApi = 'runtime/process-instances';
        }
        this.approvalList['list' + tab]['data' + status] = [];
        this.paramsHandle(tab, status);
      },
      // 二级切换
      tabsTag(status) {
        let tab = this.tabs.tab;
        if (this.tabs.status === status) return;
        this.tabs.status = status;
        this.twoLevel['tab' + tab] = status;
        this.$store.dispatch('approval_tabs', this.tabs);
        this.onSearch(tab);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  @mixin approvalsImg($n) {
    @include bgImage('../../../assets/image/approvals/' + $n + '.png');
  }

  #approvals {
    .approvalTop {
      background: #E6F4F9;
      border-top: .16rem solid #F8F8F8;

      .top1 {
        padding-left: .3rem;
        @include flex();

        p {
          margin-top: -.06rem;
          width: 1.4rem;
          height: .5rem;
        }

        .p1 {
          @include approvalsImg('yewulei');
        }

        .p2 {
          @include approvalsImg('xingzhenglei');
        }
      }

      ul {
        padding: .3rem .2rem;

        li {
          @include flex('flex-center');
          flex-direction: column;

          p {
            width: 1rem;
            height: 1rem;
            margin-bottom: .15rem;
          }
        }
      }
    }

    .main {
      .mainTop {
        padding: .2rem .36rem;

        p {
          position: relative;
          margin-right: .36rem;

          span {
            position: absolute;
            top: -.15rem;
            right: -.15rem;
            width: .3rem;
            height: .3rem;
            font-size: .24rem;
            color: #FFFFFF;
            text-align: center;
            line-height: .3rem;
            @include radius(50%);
            background-color: #F4511E;
          }
        }

        i {
          width: .5rem;
          height: .5rem;
          @include bgImage('../../../assets/image/common/searchblue.png');
        }
      }

      .mainContent {
        background: #f8f8f8;

        .contentList {
          position: relative;
          margin: .2rem .3rem;
          @include radius(.06rem);
          overflow: hidden;

          .leftShift {
            transform: translateX(-60%);
          }

          .listUp {
            position: relative;
            z-index: 2;
            padding: .3rem;
            background-color: #FFFFFF;
            @include transition(transform .3s);

            .listTitle {
              @include ellipsis;
            }

            .listMiddle {
              margin: .12rem 0 .48rem;
              @include flex('items-bet');

              p {
                font-size: .26rem;
                padding: .12rem .2rem;
                @include radius(1rem);
                color: #4570FE;
                background-color: rgba(69, 112, 254, .1);
              }

              div {
                @include flex('items-center');

                b {
                  width: .54rem;
                  height: .54rem;

                  img {
                    @include radius(50%);
                  }
                }

                span {
                  margin-left: .12rem;
                  font-size: .28rem;
                  color: #686874;
                }
              }
            }

            .listBottom {
              @include flex('items-around');

              div {
                width: 100%;
                @include flex('items-center');

                i {
                  width: .4rem;
                  height: .4rem;
                  margin-right: .1rem;
                  background-color: #CF2E33;

                  img {
                    @include radius(50%);
                  }
                }

                .icon-1 {
                  @include approvalsImg('daishenhe');
                }

                .icon-2 {
                  @include approvalsImg('yidenghou');
                }
              }
            }

            .moreOperate {
              position: absolute;
              top: 0;
              right: 0;
              width: .6rem;
              height: .57rem;
              @include approvalsImg('gengduocaozuo');
              background-size: 114% 100%;
              background-position: center left;
            }

            .approvalStatus {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 1.3rem;
              height: 1.3rem;
            }

            .publish {
              @include approvalsImg('yitongguo');
            }

            .reject {
              @include approvalsImg('yijujue');
            }
          }

          .listDown {
            position: absolute;
            z-index: 1;
            top: 0;
            bottom: 0;
            right: 0;
            left: 40%;
            padding: .2rem;
            @include flex('flex-center');
            background-color: #D8D8D8;
            flex-wrap: wrap;

            div {
              width: 50%;
              @include flex('items-center');

              i {
                min-width: .33rem;
                max-width: .33rem;
                height: .33rem;
                margin-right: .1rem;
              }

              .icon-preview {
                @include approvalsImg('hetongyulan');
              }

              .icon-success {
                @include approvalsImg('bendiqianshu');
              }

              .icon-phone {
                @include approvalsImg('kehushoujiqianshu');
              }

              .icon-modify {
                @include approvalsImg('xiugaihetong');
              }

              .icon-again {
                @include approvalsImg('chongxintijiao');
              }

              .icon-contract {
                @include approvalsImg('fasongdianzihetong');
              }

              span {
                white-space: nowrap;
                font-size: .24rem;
              }
            }

            .listDown2 {
              width: 100%;
              padding-left: 30%;
            }
          }
        }
      }

      .noMore, .noData {
        @include flex('flex-center');
        width: 100%;
        padding: .2rem 0;
      }

      .noData {
        height: 8rem;
      }
    }

    .hover {
      color: #4570FE;
    }

    @keyframes manger {
      from {
        @include transform(scale(6));
      }
      to {
        @include transform(scale(1));
      }
    }

    @-moz-keyframes manger {
      from {
        @include transform(scale(6));
      }
      to {
        @include transform(scale(1));
      }
    }

    @-webkit-keyframes manger {
      from {
        @include transform(scale(6));
      }
      to {
        @include transform(scale(1));
      }
    }

    @-o-keyframes manger {
      from {
        @include transform(scale(6));
      }
      to {
        @include transform(scale(1));
      }
    }

  }
</style>
