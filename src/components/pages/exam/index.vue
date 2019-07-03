<template>
  <div id="exam">
    <div class="exam-container">
      <div ref="topBannerRef" class="top-banner">
        <div class="banner">
        </div>
        <div class="search-bar">
          <div class="searchInput">
            <div class="input">
              <div>
                <input type="text" placeholder="请输入考试名称/关键字" v-model="params.search" @keyup.enter="getExamList">
                <span v-if="params.title" @click="params.title = ''"></span>
              </div>
              <p class="searchBtn" @click="getExamList">搜索</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="listContainerRef" class="list-container scroll_bar" :style="mainListHeight(listHeight)">

        <scroll-load-paper @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <div class="my-exam">
            <div class="my-exam-top">
              <div class="icon-exam"></div>
              我的考试
            </div>
            <div class="my-exam-bottom">
              <div class="my-exam-item">
                <div class="item-top color212121">{{my_exam_count[0]}}</div>
                <div class="item-bottom">未开始</div>
              </div>
              <div class="my-exam-item">
                <div class="item-top color4570FE">{{my_exam_count[1]}}</div>
                <div class="item-bottom">进行中</div>
              </div>
              <div class="my-exam-item">
                <div class="item-top color8F8F8F">{{my_exam_count[2]}}</div>
                <div class="item-bottom">已结束</div>
              </div>
              <div class="my-exam-item">
                <div class="item-top colorFF6C00">{{my_exam_count[3]}}</div>
                <div class="item-bottom">缺考</div>
              </div>
            </div>
          </div>
          <div class="latest-exam">
            <div class="latest-exam-top">
              <div class="icon-latest-exam"></div>
              最新考试
            </div>
            <div class="latest-exam-bottom">
              <div v-if="latestExamList.length>0" v-for="item in latestExamList" class="latest-exam-item">
                <div class="item-badge"></div>

                <div class="item-center">
                  <div class="latest-exam-tip1">{{item.name}}</div>
                  <div class="latest-exam-tip2">{{item.bank.name}}</div>
                  <div class="latest-exam-tip3">{{item.start_time}}</div>
                  <div class="latest-exam-tip4"><span>{{item.duration}}</span>分钟</div>
                </div>

                <div v-if="item.status==0" class="item-badge-corner colorFED836">未开始</div>
                <div v-if="item.status==1" class="item-badge-corner colorFF6C00">进行中</div>

              </div>
              <div v-if="latestExamList.length==0" class="no-exam-tip">
                暂无最新考试...
              </div>
            </div>
          </div>

          <div class="exam-tabbar">
            <div @click="exam_active=item.id;params.status=item.value" :class="{checked:exam_active==item.id}"
                 v-for="item in exam_status_list" class="exam-tabbar-item">
              {{item.name}}
            </div>
          </div>


          <li v-for="item in examList" :key="JSON.stringify(item)">
            <van-swipe-cell v-if="hasAuthority" :right-width="sliderWidth" :on-close="onClose">
              <van-cell-group>
                <div class="item">
                  <div class="item-top">{{item.name}}</div>
                  <div class="item-middle">
                    <div class="item-middle-left">
                      <div v-if="item.status==0" class="item-middle-left__status status0">未开始</div>
                      <div v-if="item.status==1" class="item-middle-left__status status1">收集中</div>
                      <div v-if="item.status==2" class="item-middle-left__status status2">已结束</div>
                      <div class="item-middle-left__data">数据:{{item.reply_number}}</div>
                    </div>
                    <div class="item-middle-right">{{item.start_time}}</div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-edit">
                      <div class="icon icon-edit"></div>
                      <div class="item-icon-desc">编辑问卷</div>
                    </div>
                    <div class="item-view">
                      <div class="icon icon-view"></div>
                      <div class="item-icon-desc">查看数据</div>
                    </div>
                    <div class="item-more">
                      <div class="icon icon-more"></div>
                      <div class="item-icon-desc">更多</div>
                    </div>
                  </div>
                </div>
              </van-cell-group>
              <div class="item-operate" :style="{width:sliderWidth+'px'}" slot="right">
                <div class="operate-container">
                  <div>
                    <div class="icon icon-stop"></div>
                    <div class="icon-stop-desc">暂停收集</div>
                  </div>
                  <div>
                    <div class="icon icon-preview"></div>
                    <div class="icon-stop-preview">预览</div>
                  </div>
                  <div>
                    <div class="icon icon-delete"></div>
                    <div class="icon-stop-delete">删除</div>
                  </div>
                </div>
              </div>
            </van-swipe-cell>

            <van-swipe-cell v-if="!hasAuthority">
              <van-cell-group>
                <div class="item-no-authority">
                  <div class="item-top">{{item.name}}</div>
                  <div class="item-middle">
                    <div class="item-middle-inner">
                      <div v-if="item.status==0" class="item-middle-left__status status0">未开始</div>
                      <div v-if="item.status==1" class="item-middle-left__status status1">进行中</div>
                      <div v-if="item.status==2" class="item-middle-left__status status2">已结束</div>
                      <div class="latest-exam-tip2">{{item.bank.name}}</div>
                    </div>
                    <div class="item-middle-right"></div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-bottom-left">
                      {{item.start_time}}
                    </div>
                    <div @click="answer(item)" v-if="item.status==1 && (item.enroll[0].status==0||item.enroll[0].status==1)" class="item-bottom-right">
                      进入考试>
                    </div>
<!--                    <div class="item-exam-score" v-if="parseInt(item.enroll[0].score)"><span>{{item.enroll[0].score}}</span><span>分</span></div>-->
                    <div class="item-exam-score" v-if="item.enroll[0].status==2"><span>{{item.enroll[0].score}}</span><span>分</span></div>
                  </div>
                  <div v-if="item.missExam" class="miss-exam"></div>
                </div>
              </van-cell-group>
            </van-swipe-cell>
          </li>
          <li class="noMore" v-if="examList.length === paging && examList.length > 4">
            <span v-if="!fullLoading">拼一把,让明天的你感谢今天的自己!</span>
          </li>
          <li class="noData" v-if="!examList.length">
            <span v-if="!fullLoading">暂无相关数据...</span>
          </li>
          <!--填充70px 防止滚动条滑动不到底部-->
          <div class="fix-block"></div>
        </scroll-load-paper>

      </div>
      <div @click="routerLink('/createExam')" v-if="hasAuthority" class="add-button-circle"></div>
    </div>

    <van-tabbar v-model="active">
      <van-tabbar-item>
        <span>我的考试</span>
        <!--<img
          style="width: .6rem;height: .5rem"
          slot="icon"
          slot-scope="props"
          :src="props.active ? iconLeft.active : iconLeft.normal"
        >-->
        <img
          style="width: .6rem;height: .5rem"
          slot="icon"
          slot-scope="props"
          :src="iconLeft.normal"
        >
      </van-tabbar-item>
      <!--<van-tabbar-item>
        <span>在线报名</span>
        <img
          style="width: .6rem;height: .5rem"
          slot="icon"
          slot-scope="props"
          :src="props.active ? iconRight.active : iconRight.normal"
        >
      </van-tabbar-item>-->
    </van-tabbar>
    <test-paper-exam :exam-data="exam_data" :visible.sync="test_paper_visible"></test-paper-exam>


  </div>
</template>

<script>
  import ScrollLoadPaper from '../../common/paper/scrollLoadPaper';

  import tabbarLeft from '../../../assets/image/exam/wodekaoshi@3x.png';
  import tabbarLeftActive from '../../../assets/image/exam/zongfen@3x.png';
  import tabbarRight from '../../../assets/image/exam/wodekaoshi@3x.png';
  import tabbarRightActive from '../../../assets/image/exam/zaixianbaoming@3x.png';

  import TestPaperExam from '../.././common/paper/TestPaperExam';

  export default {
    name: "exam",
    components: {
      TestPaperExam,
      ScrollLoadPaper,
    },
    data() {
      return {
        url: globalConfig.server_hr,
        params: {
          page: 1,
          limit: 6,
          search: '',
          status: null
        },
        remHeight: 0,
        paging: 0,
        fullLoading: false,
        examList: [],//考试列表
        latestExamList: [],//最新考试列表
        listHeight: 0,
        sliderWidth: 0,
        hasAuthority: false,//是否有权限
        test_paper_visible: false,
        exam_data: {},


        //底部导航栏
        active: 0,
        iconLeft: {
          normal: tabbarLeft,
          active: tabbarLeftActive
        },
        iconRight: {
          normal: tabbarRight,
          active: tabbarRightActive
        },
        //我的考试
        my_exam_count: [0, 0, 0, 0],

        /*考试状态tabbar*/
        exam_active: 1,
        exam_status_list: [
          {
            id: 1,
            name: '全部',
            value: null,
          },
          {
            id: 2,
            name: '未开始',
            value: 0,
          },
          {
            id: 3,
            name: '进行中',
            value: 1,
          },
          {
            id: 4,
            name: '已结束',
            value: 2,
          }
        ],

      }
    },

    computed: {
      personal() {
        return this.$store.state.app.personal;
      }
    },

    watch: {
      'params.status': {
        handler(val, oldVal) {
          this.params.page = 1;
          this.getExamList();
        },
      },
      test_paper_visible: {
        handler(val, oldVal) {
          if (!val) {
            this.getExamList();
          }
        },
      },
    },
    methods: {

      //答题 => 生成试卷
      answer(item) {
        this.$httpTj.getExamDetail(item.id).then(res => {
          this.exam_data = res.data;
          return res;
        }).then(res => {
          if (res.code.endsWith('0')) {
            let params = {
              user_id: this.personal.staff_id,
              type: res.data.type,//试卷类型 1.入职 2培训 3问卷 3在此页面暂且用不到 分离出单独的问卷模块 在问卷页面
            };
            this.$httpTj.generateExam(res.data.id, params).then(res => {
              if (res.code.endsWith('0')) {
                //debugger
                this.test_paper_visible = true;
                if(res.data && res.data.question_set) {
                  this.exam_data.exam_id = res.data.id;//考试id  传到TestPaperExam组件中 用来提交考试
                  this.exam_data.question_set = res.data.question_set;
                }
              } else {
                this.myUtils.prompt(res.msg);
              }
            });
          } else {
            this.myUtils.prompt(res.msg);
          }
        });

      },


      scrollLoad(val) {
        if (!val) {
          this.params.page = 1;
        } else {
          if (this.fullLoading) return;
          if (this.examList.length === this.paging) return;
          this.params.page++;

        }
        this.getExamList();
      },

      //获取考试列表
      getExamList(isFirstInvoke = false) {
        let params = {
          user_id: 'self',
          ...this.params,
          all: 1,
        };
        this.fullLoading = true;
        this.$httpTj.getExamList(params).then(res => {
          this.fullLoading = false;
          if (!res) {
            this.examList = [];
            return;
          }
          this.paging = res.data.count;
          if (this.params.page === 1) {
            this.examList = res.data.data;
          } else {
            for (let item of res.data.data) {
              this.examList.push(item);
            }
          }
          //遍历是否缺考
          _.forEach(this.examList, (o) => {
            if (o.status == 0) {//未开始
              //
            } else if (o.status == 1) {
              //
            } else if (o.status == 2) {
              let isExam = o.enroll && o.enroll[0].status==2;
              if (!isExam) {
                o.missExam = true;
                //
              }
            }
          });

          //计算我的考试数据及最新考试
          if (isFirstInvoke) {
            this.latestExamList = [];
            this.my_exam_count= [0, 0, 0, 0];
            _.forEach(this.examList, (o) => {
              if (o.status != 2) {
                this.latestExamList.push(o);
              }

              //计算考试数据
              if (o.status == 0) {//未开始
                this.my_exam_count[0]++;
              } else if (o.status == 1) {
                this.my_exam_count[1]++;
              } else if (o.status == 2) {
                let isExam = o.enroll && o.enroll[0].status;
                if (isExam == 0) {
                  this.my_exam_count[3]++;
                }
                this.my_exam_count[2]++;
              }
            });
          }
        });
      },


      onClose(clickPosition, instance) {
        switch (clickPosition) {
          case 'left':
          case 'cell':
          case 'outside':
            instance.close();
            break;
          case 'right':
            alert('删除');
            instance.close();
            /*Dialog.confirm({
              message: '确定删除吗？'
            }).then(() => {
              instance.close();
            });*/
            break;
        }
      },
    },
    mounted() {
      this.remHeight = this.$refs['listContainerRef'].offsetTop;
      this.listHeight = this.$refs['listContainerRef'].offsetTop;
      this.sliderWidth = this.screenWidth >> 1;
      this.getExamList(true);
    }
  }
</script>

<style lang="scss">
  #exam {
    .van-tabbar {
      height: 60px;
    }
  }
</style>


<style scoped lang="scss">
  @import "../../../assets/scss/exam/index";
</style>
