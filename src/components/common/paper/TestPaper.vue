<template>
  <div id="test_paper">
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
        paper_item:{
          stem:'点击编辑题目名称',//题干
          choice:{
            A: '',
            B: '',
          },
        },
      }
    },
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
  }
</script>

<style scoped>

</style>
