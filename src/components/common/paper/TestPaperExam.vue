<template>
  <div id="test_paper_exam">

    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container">
        <div class="main-container ">
          <div @click="paper_dialog_visible = true" class="banner-top">
            <div class="exam-banner">
              <div class="exam-banner-top">
                <div class="icon-tip"></div>
                <div>{{examData.name}}</div>
              </div>
              <div class="exam-banner-middle">
                <div class="exam-banner-middle-post">
                  {{examData.bank && examData.bank.name}}
                </div>
                <div class="exam-banner-middle-timestamp">
                  <div class="icon-clock"></div>
                  <div class="time-remain">
                    <count-down :datetime="examData.end_time"></count-down>
                  </div>
                </div>
              </div>
              <div class="exam-banner-bottom">
                <div class="exam-banner-bottom-tip">按总时长计时 按试卷顺序作答</div>
              </div>
            </div>
            <div class="bottom-tip">
              <div class="bottom-tip-item">
                <div class="icon-left-time"></div>
                <div class="bottom-tip-content">
                  {{examData.duration}}分钟
                  <!--                  <count-down :datetime="examData.start_time"></count-down>-->
                </div>
              </div>
              <div class="bottom-tip-item">
                <div class="icon-exam-count"></div>
                <div class="bottom-tip-content">{{examData.question_count}}题</div>
              </div>
              <div class="bottom-tip-item">
                <div class="icon-exam-score"></div>
                <div class="bottom-tip-content">{{examData.score}}分</div>
              </div>
            </div>
          </div>

          <div class="exam-container">
            <div class="exam-single">
              <div class="single-title">一、单选题（共{{exam_category_list.single.exam_list.length}}题）</div>
              <div class="single-container">

                <div v-for="(item,index) in exam_category_list.single.exam_list" class="exam-single-item">
                  <div class="single-item-stem">{{index+1}}、{{item.stem}}<span v-if="type==1">（{{item.score}}分）</span>
                  </div>
                  <div class="single-item-choice">

                    <van-radio-group v-model="item.user_answer">
                      <van-radio v-for="(subVal,subKey,subIndex) in item.choice" :key="subIndex" :name="subKey">
                        {{subKey}}.{{subVal}}
                      </van-radio>
                    </van-radio-group>

                  </div>
                </div>


              </div>
            </div>
            <div class="exam-judge">
              <div class="judge-title">二、判断题（共{{exam_category_list.judge.exam_list.length}}题）</div>
              <div class="judge-container">

                <div v-for="(item,index) in exam_category_list.judge.exam_list" class="exam-judge-item">
                  <div class="judge-item-stem">{{index+1}}、{{item.stem}}<span v-if="type==1">（{{item.score}}分）</span>
                  </div>
                  <div class="judge-item-choice">

                    <van-radio-group v-model="item.user_answer">
                      <van-radio name="A">对</van-radio>
                      <van-radio name="B">错</van-radio>
                    </van-radio-group>

                  </div>
                </div>

              </div>
            </div>
            <div class="exam-short">
              <div class="short-title">三、简答题（共{{exam_category_list.short.exam_list.length}}题）</div>
              <div class="short-container">

                <div v-for="(item,index) in exam_category_list.short.exam_list" class="exam-short-item">
                  <div class="short-item-stem">{{index+1}}、{{item.stem}}<span v-if="type==1">（{{item.score}}分）</span>
                  </div>
                  <div class="short-item-choice">
                    <!--                    <el-input type="textarea" v-model="item.user_answer"
                                                  :autosize="{ minRows: 8, maxRows: 10}"></el-input>-->
                    <van-field
                      v-model="item.user_answer"
                      type="textarea"
                      placeholder="请输入简答内容"
                      rows="3"
                      autosize
                    />

                  </div>
                </div>
              </div>
            </div>

            <div class="end-tip">
              <span>感谢您能来参加本次答题， </span>
              <span>您的意见对我们非常宝贵，谢谢参与！</span>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <div @click="cancelActionSheet" class="btn-cancel">取消</div>
          <div @click="submitExam" class="btn-confirm">提交</div>
        </div>
      </div>
    </van-actionsheet>


    <paper-dialog :visible.sync="paper_dialog_visible" :params="paper_dialog_params" @view="handlePaperDialogView" @close="handlePaperDialogClose"></paper-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';
  import PaperDialog from '../../common/paper/PaperDialog';
  import CountDown from './CountDown';
  //考试试卷
  export default {
    name: "TestPaperExam",
    components: {
      CountDown,
      PaperDialog,
    },
    data() {
      return {
        paper_dialog_visible:false,
        paper_dialog_params:{
          score:null,//分数
        },

        url: globalConfig.server_hr,
        action_sheet_visible: false,

        exam_total_score: 0,//总分值
        exam_category_list: {
          single: {
            exam_list: [],
          },//单选题
          judge: {
            exam_list: [],
          },//判断题
          short: {
            exam_list: [],
          },//简答题
        },

        /*问卷调查banner数据*/
        exam_banner: {
          title: '',
          user_name: '',
          post: '',
          user_photo: '',
          content: '',
          datetime: '',
        },
      }
    },
    props: {
      type: {
        default: 1,//一为考试 2为问卷调查
      },
      visible: {
        required: true,
        default: false,
      },
      examData: {},//问卷详情里的数据
    },
    watch: {
      visible: {
        handler(val, oldVal) {
          this.action_sheet_visible = val;
        },
        immediate: true,
      },
      action_sheet_visible: {
        handler(val, oldVal) {
          this.$emit('update:visible', this.action_sheet_visible);
        },
        immediate: true,
      },
      examData: {
        handler(val, oldVal) {
          if (val) {
            this.clearData();
            //考试导航栏内容填充
            this.exam_banner = {
              title: val.name || '-',
              user_name: val.user.name,
              post: val.user.org[0].name,
              user_photo: val.user.avatar,
              content: val.desc || '暂无详细描述...',
              datetime: val.start_time || '-',
            };

            //考试题目遍历
            _.forEach(val.question_set, (value, key) => {
              _.forEach(value, (subValue) => {
                subValue.category = parseInt(key);
              });
            });
            let questionSet = _.flattenDeep(_.values(val.question_set));
            _.forEach(questionSet, (item, index) => {
              this.exam_total_score += item.score || 0;
              switch (item.category) {
                case 1:
                  this.exam_category_list.single.exam_list.push(item);
                  break;
                case 2:
                  this.exam_category_list.judge.exam_list.push(item);
                  break;
                case 3:
                  this.exam_category_list.short.exam_list.push(item);
              }
            });
            //console.log(this.exam_category_list);
          }
        },
      },
    },
    methods: {

      //清除数据
      clearData() {
        this.exam_category_list = {
          single: {
            exam_list: [],
          },//单选题
          judge: {
            exam_list: [],
          },//判断题
          short: {
            exam_list: [],
          },//简答题
        };
        this.exam_banner = {
          title: '',
          user_name: '',
          post: '',
          user_photo: '',
          content: '',
          datetime: '',
        };
      },

      cancelActionSheet() {
        this.$dialog.confirm({title: '确定要取消本次考试作答吗？', message: '若确定则此次考试的作答将不计入 本次考试题当中'}).then(() => {
          this.action_sheet_visible = false;
          this.clearData();
        });

      },

      submitExam() {
        this.$dialog.confirm({title: '确认提交吗?', message: '提交之后将无法重新作答'})
          .then(() => {
            let id = this.examData.id;//id
            let exam_id = this.examData.exam_id;
            let newArr = _.flatten([this.exam_category_list.single.exam_list, this.exam_category_list.judge.exam_list, this.exam_category_list.short.exam_list]);
            //判断是否有漏答题目
            for (let mItem of newArr) {
              if (!mItem.user_answer) {
                this.$prompt('有漏答题目,请检查', 'warning');
                return;
              }
            }
            newArr = _.map(newArr, (o) => {
              if(o.category!==3) {
                o.answer = [o.user_answer];
              }else {
                o.answer = o.user_answer;
              }
              delete o.stem;
              delete o.user_answer;
              delete o.choice;
              delete o.score;
              delete o.choice_count;
              return o;
            });

            let answer = {
              1: [],
              2: [],
              3: [],
            };
            _.map(newArr, (o) => {
              answer[o.category].push(o);
            });

            let params = {
              answer
            };
            this.$httpTj.submitExam(exam_id, params).then(res => {
              debugger
              console.log(res);
              if (res.code.endsWith('0')) {
                this.paper_dialog_params.score = res.data.score;

                this.paper_dialog_visible = true;
                //this.action_sheet_visible = false;
              }
            });
            /*this.$http.put(`${this.url}train/exam/set/${id}`, params).then(res => {
              console.log(res);
              debugger
            });*/
          });
      },
      handlePaperDialogView() {
        alert('查看试卷');
      },
      handlePaperDialogClose() {
        this.action_sheet_visible = false;
      },
    },
  }
</script>

<style lang="scss">

  .exam-container {
    .van-icon {
      border-radius: 0 !important;
    }

    .exam-single {
      .van-radio-group {
        .van-radio {
          display: flex;
        }
      }
    }

    .exam-judge {
      .exam-judge-item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .van-radio-group {
          display: flex;

          .van-radio {
            padding: 0 .1rem;
          }
        }
      }


    }

    .exam-short {
      .exam-short-item {
        .van-field {
          border: 1px solid #D2D2D2;
        }
      }
    }
  }

</style>


<style lang="scss" scoped>
  .van-cell.van-field {
    border-radius: 5px;
  }

  .van-actionsheet {
    max-height: 100%;
  }

  .van-popup.van-popup--bottom {
    border-radius: 0;
    top: 0;
  }

  //问卷调查 或 考试 样式修改
  .exam-container {
    .van-radio {
      padding: .1rem 0;
    }

    .van-radio__icon--round .van-icon {
      border-radius: 0;
    }

  }

</style>

<style scoped lang="scss">
  @import "../../../assets/scss/common/paper/TestPaperExam";
</style>
