<template>
  <div id="adminDetail">
    <van-popup overlay-class="overlay-color" v-model="adminDetailModule" position="right" :overlay="true"
               class="adminDetail">
      <main>
        <header>

        </header>
        <div class="mainLog">
          <ul>
            <li v-for="item in 100">{{item}}</li>
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
        this.$httpZll.get(val.detail_request_url).then(res => {
          console.log(res.data);
        });
        this.$httpZll.getHistoryProcess(val.process_id).then(res => {
          console.log(res);
        })
      }
    },
    computed: {
      tabs() {
        return this.$store.state.app.adminTab;
      }
    },
    methods: {
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
