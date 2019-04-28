<template>
  <div id="add_item">
    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container" :style="{height:screenHeight+'px'}">
        <div class="main-container">
          <div class="edit-container">
            <div class="paper-stem">
              <van-field @focus="clearTipContent" @blur="fixTipContent" v-model="paper_item.stem" placeholder="请输入题目名称" />
            </div>

            <div class="choose-list">
              <div v-for="(val,key,index) in paper_item.choice" :key="index" class="choose-item">
                <div class="choose-item-left">
                  <van-field v-model="paper_item.choice[key]" placeholder="点击编辑选项" />
                </div>
                <div class="choose-item-right">
                  <div class="right-btn-container">
                    <div class="icon-delete"></div>
                  </div>
                </div>

              </div>
            </div>
            <div @click="addChooseItem" class="add-item">
              <div class="icon-add"></div>
              <div class="icon-add-desc">添加选项</div>
            </div>
          </div>
<!--          <button @click="demo">
            测试
          </button>-->
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

  /*添加单个试题*/
  export default {
    name: "AddItem",
    props: {
      type: {
        default: 1,
      },
      visible: {
        required: true,
        default: false,
      }
    },
    watch: {
      visible: {
        handler(val,oldVal) {
          this.action_sheet_visible = val;
        },
        immediate:true,
      },
      action_sheet_visible: {
        handler(val,oldVal) {
          this.$emit('update:visible',this.action_sheet_visible);
        },
        immediate:true,
      },
    },
    data() {
      return {
        action_sheet_visible: false,
        paper_item:{
          stem:'点击编辑题目名称',//题干
          choice:{
            A: '',
            B: '',
          },
        },
      }
    },
    methods: {
      demo() {
        console.log(this.paper_item);
      },

      addChooseItem(index, type = 1) {
        /*if (type == 1) {
          this.paper_item[index].choice['z'] = '';
          let newChoice = {};
          let iter = 0;
          _.forEach(this.exam_form_list[index].choice, (o, oIndex) => {
            newChoice[this.exam_form_item_choose[iter++]] = o;
          });
          this.exam_form_list[index].choice = newChoice;
          this.$forceUpdate();
        }
        if (type == 3) {
          this.exam_form_list[index].answer.push('');
        }*/
      },
      cancelActionSheet() {
        this.action_sheet_visible = false
      },
      //清除提示文本
      clearTipContent() {
        if(this.paper_item.stem=='点击编辑题目名称') {
          this.paper_item.stem = '';
        }
      },
      //填充提示文本
      fixTipContent() {
        if(this.paper_item.stem=='') {
          this.paper_item.stem = '点击编辑题目名称';
        }
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
  @import "../../../assets/scss/common/paper/addItem";
</style>
