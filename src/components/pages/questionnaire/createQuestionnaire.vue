<template>
  <div id="create_questionnaire">
    <div class="create-container scroll_bar" :style="mainListHeight(offsetListHeight)">
      <div class="create-container-main">
        <div class="title-tip">问卷标题</div>
        <van-field v-model="questionnaire_form.title" placeholder="请输入问卷标题"/>
        <div class="title-tip">问卷内容</div>
        <van-field v-model="questionnaire_form.content" placeholder="请输入问卷内容"/>

        <div @click="addTopic" class="add-questionnaire">
          <div>
            <div class="icon-add"></div>
            <div class="icon-add-desc">点击添加题目</div>
          </div>
        </div>
      </div>
    </div>


    <div ref="commonBtnRef" class="commonBtn">
      <p @click="cancel" class="btn back">取消</p>
      <p class="btn reset">预览</p>
      <p class="btn">发布</p>
    </div>



    <van-actionsheet v-model="action_sheet_visible">
      <div class="action-sheet-container" :style="{height:screenHeight/2+'px'}">
        <div @click="action_sheet_visible2 = true" class="btn-container">
          <div class="btn-item">
            <div class="icon-single"></div>
            <div class="icon-single-desc">选择题</div>
          </div>
          <div class="btn-item">
            <div class="icon-judge"></div>
            <div class="icon-judge-desc">判断题</div>
          </div>
          <div class="btn-item">
            <div class="icon-short"></div>
            <div class="icon-short-desc">简答题</div>
          </div>

        </div>
        <div class="cancel-container">
          <div @click="cancelActionSheet" class="btn-cancel">取消</div>
        </div>
      </div>
    </van-actionsheet>

    <!--<van-actionsheet v-model="action_sheet_visible2">
      <div class="action-sheet-container" :style="{height:screenHeight+'px'}">
        <div class="btn-container">
          <div class="btn-item">
            <div class="icon-single"></div>
            <div class="icon-single-desc">选择题</div>
          </div>
          <div class="btn-item">
            <div class="icon-judge"></div>
            <div class="icon-judge-desc">判断题</div>
          </div>
          <div class="btn-item">
            <div class="icon-short"></div>
            <div class="icon-short-desc">简答题</div>
          </div>

        </div>
        <div class="cancel-container">
          <div @click="cancelActionSheet2" class="btn-cancel">取消</div>
        </div>
      </div>
    </van-actionsheet>-->
    <add-item :visible.sync="action_sheet_visible2"></add-item>

  </div>




</template>

<script>
  import AddItem from '../../common/paper/AddItem';

  export default {
    name: "createQuestionnaire",
    components:{
      AddItem,
    },
    data() {
      return {
        offsetListHeight: 0,
        questionnaire_form: {
          title:'',
          content:'',
          list:[],
        },
        action_sheet_visible:false,
        action_sheet_visible2:false,
      }
    },
    methods: {
      cancel() {
        history.go(-1);
      },
      cancelActionSheet() {
        this.action_sheet_visible = false;
      },
      cancelActionSheet2() {
        this.action_sheet_visible2 = false;
      },
      //添加题目
      addTopic() {
        this.action_sheet_visible = true;
      },

    },

    mounted() {
      this.offsetListHeight = this.$refs['commonBtnRef'].offsetHeight;
    }
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
  @import "../../../assets/scss/questionnaire/createQuestionnaire";

</style>
