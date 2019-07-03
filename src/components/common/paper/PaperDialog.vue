<template>
    <div @click.self="handleClose" id="paper_dialog" v-if="paper_dialog_visible">
      <div class="paper-dialog-inner">
        <div class="inner-top">
          <div class="inner-top-img"></div>
          <div class="inner-top-content">
            <div class="content1">恭喜您,提交成功!</div>
            <div class="content2">您的本次成绩是{{params.score}}分</div>
          </div>
        </div>
        <div @click="handleViewExam" class="inner-bottom">
          <!--查看试卷-->
          感谢参与
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "PaperDialog",
    props:{
      //显示隐藏
      visible: {
        required:true,
        default:false,
      },
      params:{
        default() {
          return {
            score: 0,
          }
        }
      },
    },
    data() {
      return {
        paper_dialog_visible:false,
      }
    },
    watch: {
      visible: {
        handler(val) {
          this.paper_dialog_visible = val;
        },
        immediate:true,
      },
      paper_dialog_visible: {
        handler(val) {
          this.$emit('update:visible',val);
        },
        immediate:true
      },
    },
    methods: {
      handleViewExam() {
        //this.$emit('view');
      },
      handleClose() {
        this.paper_dialog_visible = false;
        this.$emit('close');
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common/paper/PaperDialog";
</style>
