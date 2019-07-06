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
                    <h2 v-if="Array.isArray(item.value)">
                      <span v-for="val in item.value">
                         <!--图片-->
                        <img :src="val.uri" :alt="val.uri" v-if="val.info.ext.includes('image')"
                             @click="$bigPhoto(item.value,val.uri)">
                        <!--视频-->
                        <!--@click="videoPlay($event)" 播放事件-->
                        <img src="../../../assets/image/file/video.png" @click="videoPlay($event)"
                             v-else-if="val.info.ext.includes('video')" :alt="val.uri">
                        <!--其它类型-->
                        <img src="../../../assets/image/file/xls.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('xls')" @click="$openFiles($event)">
                        <img src="../../../assets/image/file/doc.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('doc')" @click="$openFiles($event)">
                        <img src="../../../assets/image/file/txt.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('text')" @click="$openFiles($event)">
                        <img src="../../../assets/image/file/pdf.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('pdf')" @click="$openFiles($event)">
                        <img src="../../../assets/image/file/file.png" :alt="val.uri" v-else
                             @click="$openFiles($event)">
                      </span>
                    </h2>
                    <h2 v-else>{{item.value}}</h2>
                  </div>
                </div>
              </div>
            </li>
            <li class="hr"></li>
            <!--历史审批流程-->
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
    <!--视频播放-->
    <div id="videoId" :class="['video-' + phoneType()]" v-show="videoSrc !== ''">
      <video id="video" :src="videoSrc" muted controls autoplay></video>
      <div class="items-center close">
        <span class="flex-center" @click="videoPlay()">
          <img src="../../../assets/image/file/closeBtn.png" alt="">
        </span>
      </div>
    </div>
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
        videoSrc: '',
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
      // 查看文件
      $openFiles(event) {
        let url = event.target.alt;
        this.$ddSkip(url);
      },
      // 视频播放
      videoPlay(event = '') {
        if (event && event.target.alt.includes(globalConfig.domain)) {
          this.videoSrc = event.target.alt;
        } else {
          this.videoSrc = '';
          // alert('不支持的视频文件！');
        }
      },
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
            this.changerFormatData(val, data, result);
          } else {
            this.$prompt(res.data.msg);
          }
        });
      },
      changerFormatData(val, content, result) {
        let form = adminApprovalsData[val.flow_type];
        this.formatData = [];
        for (let item of form) {
          let obj = {};
          if (item.picker !== 'upload') {
            obj.title = item.label;
          }
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
          } else if (item.picker === 'upload') {
            for (let pic of item.photos) {
              obj.title = pic.label;
              obj.value = result[pic.keyName];
            }
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
  @import "../../../assets/scss/approvals/detail.scss";

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

        .mainLog {
          ul {
            .detail {
              @include flex();
              padding: .3rem 0 .3rem .3rem;

              > img {
                margin: 0 .2rem;
                @include radius(50%);
              }

              img {
                width: .8rem;
                height: .8rem;
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

                  img {
                    margin: 0 .1rem .1rem 0;
                    @include radius(.1rem);
                  }

                  div {
                    padding: .1rem 0;
                    @include flex();

                    h1 {
                      font-size: .27rem;
                      min-width: 2rem;
                      text-align: right;
                      padding-right: .2rem;
                      color: #686874;
                    }

                    h2 {
                      font-size: .27rem;
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
  }
</style>
