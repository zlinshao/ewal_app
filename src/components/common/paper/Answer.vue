<template>
  <div id="answer">
    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container" :style="{height:screenHeight+'px'}">
        <div class="main-container">
          答题
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
  export default {
    name: "Answer",
    data() {
      return {
        action_sheet_visible:false,
      }
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
  @import "../../../assets/scss/common/paper/Answer";
</style>
