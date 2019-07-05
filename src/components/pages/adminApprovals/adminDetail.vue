<template>
  <div id="adminDetail">
    <van-popup overlay-class="overlay-color" v-model="adminDetailModule" position="right" :overlay="true"
               class="adminDetail">
      <main>
        <header>

        </header>
        <div class="mainLog">
          <ul>
            <li class="detail">
              <img :src="bulletinUser.avatar" v-if="bulletinUser.avatar" alt="">
              <img src="../../../assets/image/common/noHead.png" alt="" v-else>
              <div class="content">
                <div class="top">
                  <div>
                    <h1>{{bulletinUser.name}}</h1>
                    <h2>审批中</h2>
                  </div>
                  <p>{{personalDetail.name}}审批中</p>
                </div>
                <div class="main">
                  <div v-for="item in formatData">
                    <h1>{{item.title}}</h1>
                    <h2>{{item.value}}</h2>
                  </div>
                </div>
              </div>
            </li>
            <li class="hr"></li>
            <li class="log">
              <div class="history_content">
                <div class="contentMain">
                  <span class="startApply">发起申请</span>
                  <ul class="list">
                    <li v-for="item in historyProList">
                      <div class="process">
                        <!-- 审批 -->
                        <div v-if="item.type === 'approval'" class="approval">
                          <div class="header_info">
                            <span>
                              <img :src="personal.avatar" alt="">
                              <span>{{item.user ? item.user.name : '******'}}（{{item.result ? item.result : '审批中'}}）</span>
                            </span>
                            <span class="date">{{item.time ? item.time : nowDate}}</span>
                          </div>
                          <div class="content_info" :class="[item.result ? '' : 'noBorder']">
                            <span class="info_span">
                              <span class="right">
                                {{item.result ? '耗时' : '等待'}}:&nbsp;{{item.duration}}分钟
                              </span>
                            </span>
                          </div>
                        </div>
                        <!--修改的result为数组多条,修改的内容里有图片-->
                        <div v-if="item.type === 'modify'" class="modify  approval">
                          <div class="header_info">
                            <span>
                              <span class="icon"></span>
                              <span class="user_name">{{item.user ? item.user.name : "******"}}—{{item.name}}</span>
                            </span>
                            <span class="date">{{item.time}}</span>
                          </div>
                          <div class="content_info">
                            <div v-if='item.result.length > 0' v-for="(result,index) in item.result">
                              <p class="modify_message" v-if='result.new'>
                                <span>  {{result.name}}修改为：</span>
                                <span v-if="typeof(result.new)=='string'">{{result.new}}</span>
                              </p>
                              <p class="modify_photo" v-if="typeof(result.new) !== 'string' ">
                                <img :src="photo.uri" v-for="(photo,index) in result.new" alt=""
                                     @click="$bigPhoto(result.new, photo.uri)">
                              </p>
                            </div>
                          </div>
                        </div>
                        <!--评论：result为对象,评论的内容里有图片 -->
                        <div v-if="item.type === 'comment'" class="modify approval">
                          <div class="header_info">
                            <span>
                                <span class="icon"></span>
                              <span class="user_name">{{item.user ? item.user.name : "******"}}—{{item.name}}</span>
                            </span>
                            <span class="date">{{item.time}}</span>
                          </div>
                          <div class="content_info">
                            <div v-if='item.result'>
                              <p class="modify_message">{{item.result.message}}</p>
                              <p class="modify_photo" v-if='item.result.attachments.length > 0'>
                                <img :src="photo.uri" v-for="photo in  item.result.attachments" alt=""
                                     @click="$bigPhoto(item.result.attachments, photo.uri)">
                              </p>
                            </div>
                          </div>
                        </div>
                        <!-- 抄送 : result为数组-->
                        <div v-if="item.type === 'cc'" class="cc approval">
                          <div class="header_info">
                            <span>
                              <img src="../../../assets/image/approvals/detail/cc_process.png" alt="">
                              <span>{{item.result.length > 0 ? item.result.length : '0'}}人&nbsp;({{item.name}})&nbsp;</span>
                            </span>
                          </div>
                          <div class="content_info">
                            <span v-for='result in item.result'>
                              <img :src="result.avatar" alt="" v-if="result.avatar">
                              <img src="../../../assets/image/common/noHead.png" alt="" v-else>
                              <span class="cc_name"> {{result.name}}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
      <footer>
        <ul v-if="operates.outcomeOptions.length">
          <li v-for="item in operates.outcomeOptions" :class="item.route" @click="clickBtn(item,operates.variableName)">
            <span class="writingMode">{{item.title}}</span>
          </li>
          <li v-for="item in buttons" :class="item.route" @click="clickBtn(item,operates.variableName)">
            <span class="writingMode">{{item.title}}</span>
          </li>
        </ul>
        <div class="commonBtn" v-else>
          <p v-for="item in buttons" class="btn" :class="item.route" @click="clickBtn(item)">{{item.title}}</p>
        </div>
      </footer>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "admin-detail",
    props: ['module', 'content'],
    data() {
      return {
        adminDetailModule: false,
        operates: {
          outcomeOptions: []
        },
        buttons: [],
        formatData: [],
        historyProList: [],
        personalDetail: {},
        bulletinUser: {},
        nowDate: '',
      }
    },
    watch: {
      module(val) {
        this.adminDetailModule = val;
      },
      adminDetailModule(val) {
        if (!val) {
          this.$emit('close');
        }
      },
      content(val) {
        this.detailData = val;
        this.setOperates(val);
        this.getApprovalDetail(val);
        this.$httpZll.getHistoryProcess(val.process_id).then(res => {
          if (res) {
            this.historyProList = res;
            // 图片id获取图片地址
            this.historyProList.forEach((element, index) => {
              // 评论的result是对象
              if (element.type === 'comment') {
                if (element.result.attachments.length > 0) {
                  this.$httpZll.getUploadUrl(element.result.attachments, 'close').then(res => {
                    this.historyProList[index].result.attachments = res.data;
                  })
                }
              }
              // 修改的result是数组
              if (element.type === 'modify') {
                if (element.result.length > 0) {
                  element.result.forEach((item, i) => {
                    if (item.new.indexOf('[') !== -1 && item.new.indexOf(']') !== -1) {
                      let photo = JSON.parse(item.new);
                      this.$httpZll.getUploadUrl(photo, 'close').then(res => {
                        this.historyProList[index].result[i].new = res.data;
                      })
                    }
                  })
                }
              }
            })
          }
        });
        this.$httpZll.getUserIdStaffDetail({staff: 1}, val.assignee).then(res => {
          if (res) {
            this.personalDetail = res.data;
          } else {
            this.personalDetail = {};
          }
        })
      }
    },
    activated() {
      this.nowDate = this.myUtils.startTime();
      setInterval(_ => {
        this.nowDate = this.myUtils.startTime();
      }, 1000);
    },
    computed: {
      tabs() {
        return this.$store.state.app.adminTab;
      },
      personal() {
        return this.$store.state.app.personalDetail;
      }
    },
    methods: {
      // 获取审批详情
      getApprovalDetail(val) {
        this.$httpZll.get(val.detail_request_url).then(res => {
          if (res.data.code.endsWith('0')) {
            let data = {}, result = res.data.data;
            this.bulletinUser = result.user;
            if (val.flow_type === 'personnel_demand') {
              data = result.data.detail[0];
            } else {
              data = result.data;
            }
            this.changerFormatData(val, data);
          } else {
            this.$prompt(res.data.msg);
          }
        });
      },
      changerFormatData(val, content) {
        let form = adminApprovalsData[val.flow_type];
        this.formatData = [];
        for (let item of form) {
          let obj = {};
          obj.title = item.label;
          if (item.status === 'objInt') {
            obj.value = dicties[item.keyName][content[item.keyName]];
          } else if (item.moreObject) {
            let arr = [];
            for (let child of item.moreObject) {
              arr.push(content[item.keyName][child.keyName]);
            }
            obj.value = arr.join('-') + item.unit;
          } else if (item.status === 'objName') {
            obj.value = content[item.keyName].name;
          } else {
            obj.value = content[item.keyName];
          }
          this.formatData.push(obj);
        }
      },
      // 操作按钮
      setOperates(val) {
        let {tab, status} = this.tabs;
        this.operates = {outcomeOptions: []};
        if (tab === '1') {
          if (status === 0) {
            if (val.outcome) {
              this.operates = JSON.parse(val.outcome);
            }
            this.buttons = [
              {
                action: true,
                route: "deliver",
                title: '转交',
              },
              {
                action: true,
                route: "suspend",
                title: '暂缓',
              },
              {
                action: true,
                route: "comment",
                title: '评论',
              },
            ]
          } else if (status === 1) {
            this.buttons = [
              {
                action: true,
                route: "back",
                title: '取消',
              },
              {
                action: true,
                route: "comment",
                title: '评论',
              },
            ]
          }
        } else {
        }
      },
      clickBtn(action = {}, name = '') {
        let detail = this.detailData;
        let msg = {suspend: '暂缓', urge: '催办', cancel: '撤销'};
        switch (action.route) {
          case "back":
            this.$emit('close');
            break;
          case 'comment':// 评论

            break;
          case'suspend'://暂缓
          case'urge'://催办
          case'cancel'://撤销
            this.$httpZll.putActionTask(detail.process_id, {action: action.route}).then(_ => {
              this.$prompt((msg[action.route] + '成功'), 'success');
              if (action.route === 'suspend' || action.route === 'cancel') {
                setTimeout(_ => {
                  if (action.route === 'suspend') {
                    this.$store.dispatch('admin_approval_tabs', {tab: '4'});
                  } else {
                    this.$store.dispatch('admin_approval_tabs', {tab: '2', status: 3});
                  }
                }, 500);
              }
            });
            break;
          default:
            let postData = {};
            postData.action = 'complete';
            postData.variables = [{
              name: name,
              value: action.action,
            }];
            this.$httpZll.finishBeforeTask(detail.task_id, postData).then(res => {
              if (res) {
                this.$prompt('审核成功！', 'success');
                setTimeout(_ => {
                  if (this.tabs.tab === '4') {
                    this.$store.dispatch('admin_approval_tabs', {tab: '1', status: 1});
                  }
                  this.$router.go(-1);
                }, 500);
              }
            });
            break;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common.scss";

  @mixin detailImg($n) {
    @include bgImage('../../../assets/image/approvals/detail/' + $n + '.png');
  }

  #adminDetail {
    .adminDetail {
      left: 1rem;
      right: 0;
      height: 100%;
      @include flex('bet-column');

      main {
        height: 100%;
        @include scroll;

        header {

        }

        .mainLog {
          ul {
            .detail {
              @include flex();
              padding: .3rem 0 .3rem .3rem;

              img {
                margin: 0 .2rem;
                width: .8rem;
                height: .8rem;
                @include radius(50%);
              }

              .content {
                .top {
                  padding: 0 .3rem .3rem 0;
                  border-bottom: 1px solid #D8D8D8;
                  @include flex('justify-bet');

                  h2 {
                    margin-top: .1rem;
                    font-size: .24rem;
                    color: #4A4A4A;
                  }

                  p {
                    color: #F4511E;
                  }
                }

                .main {
                  padding: .3rem .3rem 0 0;

                  div {
                    padding: .06rem 0;
                    @include flex();

                    h1 {
                      min-width: 2.1rem;
                      text-align: right;
                      padding-right: .2rem;
                      color: #686874;
                    }

                    h2 {
                      color: #4A4A4A;
                    }
                  }
                }
              }
            }

            .hr {
              border: 2px solid rgba(216, 216, 216, .2);
            }
          }
        }
      }

      footer {
        overflow: hidden;

        .commonBtn {
          padding: .3rem;
        }

        ul {
          padding: .3rem .3rem 0;
          @include flex('justify-around');
          flex-direction: row-reverse;

          li {
            height: 1.6rem;
            width: .6rem;
            padding-top: .4rem;
            text-align: center;
            background-color: #4A74FE;
          }


          /*拒绝*/
          .refuse {
            @include detailImg('jujue');
          }

          /*暂缓 / 评论 / 转交*/
          .suspend, .comment, .deliver {
            color: #FFFFFF;
            @include detailImg('zanhuan');
          }

          /*通过*/
          .publish {
            color: #FFFFFF;
            @include detailImg('tongguo');
          }
        }
      }
    }

    .history_content {
      height: 100%;
      @include flex('bet-column');
      // 审批内容
      .contentMain {
        height: 100%;
        @include scroll;
        // 发起申请
        .startApply {
          display: inline-block;
          margin: .2rem 0 .2rem 1rem;
          font-size: .22rem;
          padding: .1rem .3rem;
          @include radius(1rem);
          background: rgba(69, 112, 254, .2);
          color: #4570FE;
        }

        .list {
          margin-left: .2rem;

          .process {
            //审批
            .approval {
              .header_info {
                margin: .1rem .2rem .1rem 0;
                @include flex('items-bet');
                align-items: center;

                > span {
                  img {
                    vertical-align: middle;
                    width: .6rem;
                    height: .6rem;
                    @include radius(50%);
                  }

                  span {
                    font-size: .28rem;
                    color: #4A4A4A;
                    margin-left: .1rem;
                  }

                  i {
                    position: absolute;
                    @include flex('flex-center');
                    @include radius(50%);
                    bottom: -.04rem;
                    left: .36rem;
                    width: .3rem;
                    height: .3rem;
                    padding: .025rem;
                    background-color: #FFFFFF;

                    b {
                      width: 100%;
                      height: 100%;
                      background: #fd9007;
                      @include radius(50%);
                    }
                  }
                }

                .date {
                  color: #9B9B9B;
                  font-size: .24rem;
                }
              }

              .content_info {
                border-left: 1px solid #9B9B9B;
                padding: 0 .3rem .15rem .3rem;
                margin-left: .3rem;

                .info_span {
                  display: flex;
                  justify-content: space-between;

                  img {
                    width: 1.1rem;
                    height: .7rem;
                    border-radius: .1rem;
                  }

                  .right {
                    font-size: .24rem;
                    color: rgba(244, 81, 30, 1);
                    flex: 1;
                    text-align: right;
                  }
                }
              }

              .noBorder {
                border: none;
              }
            }

            // 修改、评论
            .modify {
              .header_info {
                display: flex;
                justify-content: space-between;

                > span {
                  margin-left: .25rem;
                  @include flex('items-center');

                  .icon {
                    width: .1rem;
                    height: .1rem;
                    @include radius(50%);
                    background-color: #4570FE;
                    margin-left: 0;
                  }

                  .user_name {
                    margin-left: 0.24rem;
                  }
                }
              }

              .content_info {
                > div {
                  .modify_message {
                    color: #4570FE;
                    font-size: .26rem;
                    padding-bottom: .2rem;

                    span {
                      font-size: .26rem;
                    }
                  }

                  .modify_photo {
                    margin-bottom: 0.1rem;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    margin-left: -10px;

                    img {
                      width: 1.1rem;
                      height: .7rem;
                      border-radius: .1rem;
                    }
                  }

                  .modify_photo::after {
                    content: "";
                    flex: auto;
                  }

                  .modify_photo > img {
                    margin-left: 10px;
                    margin-bottom: 10px;
                    width: -webkit-calc((100% - 10px * 4) / 4);
                    width: calc((100% - 10px * 4) / 4);
                  }
                }
              }
            }

            //抄送
            .cc {
              .header_info {
                > span {
                  img {
                    border-radius: 0;
                  }
                }
              }

              .content_info {
                display: flex;
                justify-content: flex-start;
                flex-direction: row;
                flex-wrap: wrap;

                > span {
                  display: block;
                  margin: 0 .3rem .3rem 0;
                  text-align: center;

                  img {
                    vertical-align: middle;
                    width: .6rem;
                    height: .6rem;
                    @include radius(50%);
                  }

                  .cc_name {
                    display: block;
                    font-size: .24rem;
                    color: #4A4A4A;
                    margin-top: 0.1rem;
                  }
                }
              }
            }
          }
        }
      }

      .commonBtn {
        margin-top: .2rem;
        padding: .36rem;
        border-top: 1px solid rgba(216, 216, 216, .5);
      }
    }
  }
</style>
