<template>
  <div id="test_paper">
    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container">
        <div class="main-container">
          <div class="banner-top">
            <div v-if="type==2" class="questionnaire-banner">
              <div class="banner-title">
                {{questionnaire_banner.title}}
              </div>
              <div class="banner-user-info">
                <div class="info-left">
                  <img :src="questionnaire_banner.user_photo">
                  <div :title="questionnaire_banner.user_name" class="user-name">{{questionnaire_banner.user_name}}
                  </div>
                </div>
                <div class="info-right">{{questionnaire_banner.post}}</div>
              </div>
              <div class="banner-content">
                {{questionnaire_banner.content}}
              </div>
              <div class="banner-datetime">{{questionnaire_banner.datetime}}</div>
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
          <div @click="submitQuestionnaire" class="btn-confirm">提交</div>
        </div>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "TestPaper",
    data() {
      return {
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
        questionnaire_banner: {
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
      questionnaireData: {},//问卷详情里的数据
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
      questionnaireData: {
        handler(val, oldVal) {
          if (val) {
            //问卷头部导航栏内容填充
            this.questionnaire_banner = {
              title: val.name || '-',
              user_name: val.user.name,
              post: val.user.org[0].name,
              user_photo: val.user.avatar,
              content: val.desc || '暂无详细描述...',
              datetime: val.start_time || '-',
            };

            //问卷题目遍历
            _.forEach(val.question_set, (item, index) => {
              /*if(item.category==1) {
                this.exam_category_list.single.exam_list.push(item);
              }*/
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
            console.log(this.exam_category_list);
          }
        },
        //immediate: true,
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
        this.questionnaire_banner = {
          title: '',
          user_name: '',
          post: '',
          user_photo: '',
          content: '',
          datetime: '',
        };
      },

      cancelActionSheet() {
        this.$dialog.confirm({title: '确认取消吗?', message: '取消之后还可以重新作答'}).then(()=> {
          this.action_sheet_visible = false;
          this.clearData();
        });

      },

      submitQuestionnaire() {
        this.$dialog.confirm({title: '确认提交吗?', message: '提交之后将无法重新作答'})
          .then(() => {
            let id = this.questionnaireData.id;//问卷id
            let newArr = _.flatten([this.exam_category_list.single.exam_list, this.exam_category_list.judge.exam_list, this.exam_category_list.short.exam_list]);
            //判断是否有漏答题目
            for (let mItem of newArr) {
              if(!mItem.user_answer) {
                this.$prompt('有漏答题目,请检查','warning');
                return;
              }
            }
            let answer = _.map(newArr, (o) => {
              o.answer = o.user_answer;
              return o;
            });
            let params = {
              id,answer
            };
            this.$httpTj.submitQuestionnaire(params).then(res=> {
              if(res.code.endsWith('0')) {
                this.action_sheet_visible = false;
              }
              console.log(res);
            });
          });
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
  @import "../../../assets/scss/common/paper/TestPaper";
</style>
