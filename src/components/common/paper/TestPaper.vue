<template>
  <div id="test_paper">
    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container" :style="{height:screenHeight+'px'}">
        <div class="main-container">
          <div class="banner-top">

          </div>
          <div class="exam-container">

          </div>
        </div>
        <div class="btn-container">
          <div @click="cancelActionSheet" class="btn-cancel">取消</div>
          <div @click="cancelActionSheet" class="btn-confirm">确认</div>
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


        exam_total_score:0,//总分值
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
        }
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
      questionnaireData: {//问卷详情里的数据
      },
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
          if(val) {
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
          }
        },
        immediate: true,
      },
    },
    methods: {
      cancelActionSheet() {
        this.action_sheet_visible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .van-cell.van-field {
    border-radius: 5px;
  }

  .van-actionsheet {
    max-height: 100%;
  }

  .van-popup.van-popup--bottom {
    border-radius: 0;
  }
</style>

<style scoped lang="scss">
  @import "../../../assets/scss/common/paper/TestPaper";
</style>
