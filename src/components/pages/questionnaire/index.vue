<template>
  <div id="questionnaire">
    <div class="questionnaire-container">
      <div ref="topBannerRef" class="top-banner">
        <div class="banner">

        </div>
        <div class="search-bar">
          <div class="searchInput">
            <div class="input">
              <div>
                <input type="text" placeholder="请输入搜索内容" v-model="params.search" @keyup.enter="getQuestionnaireList">
                <span v-if="params.title" @click="params.title = ''"></span>
              </div>
              <p class="searchBtn" @click="getQuestionnaireList">搜索</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="listContainerRef" class="list-container scroll_bar" :style="mainListHeight(listHeight)">
        <!--<div  class="item">

        </div>-->
        <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <li v-for="item in questionnaireList" :key="JSON.stringify(item)">
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
                    <div class="item-middle-left">
                      <div v-if="item.status==0" class="item-middle-left__status status0">未开始</div>
                      <div v-if="item.status==1" class="item-middle-left__status status1">收集中</div>
                      <div v-if="item.status==2" class="item-middle-left__status status2">已结束</div>
                      <div class="item-middle-left__data">数据:{{item.reply_number}}</div>
                    </div>
                    <div class="item-middle-right"></div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-bottom-left">
                      {{item.start_time}}
                    </div>
                    <div v-if="item.status==1" class="item-bottom-right">
                      去回答>
                    </div>
                  </div>
                </div>
              </van-cell-group>
            </van-swipe-cell>
          </li>
          <li class="noMore" v-if="questionnaireList.length === paging && questionnaireList.length > 4">
            <span v-if="!fullLoading">拼一把,让明天的你感谢今天的自己!</span>
          </li>
          <li class="noData" v-if="!questionnaireList.length">
            <span v-if="!fullLoading">暂无相关数据...</span>
          </li>
        </scroll-load>


        <!--        <div class="bottom-tip">拼一把,让明天的你感谢今天的自己!</div>-->
      </div>

      <div @click="routerLink('/createQuestionnaire')" v-if="hasAuthority" class="add-button-circle"></div>
    </div>
  </div>
</template>

<script>
  import TestPaper from '../.././common/paper/TestPaper';

  export default {
    name: "questionnaire",
    components: {
      TestPaper,
    },
    data() {
      return {
        url: globalConfig.server_hr,
        params: {
          page: 1,
          limit: 6,
          search: '',
        },
        remHeight: 0,
        paging: 0,
        fullLoading: false,
        questionnaireList: [],
        listHeight: 0,
        sliderWidth: 0,
        hasAuthority: true,//是否有权限



      }
    },
    methods: {
      scrollLoad(val) {
        if (!val) {
          this.params.page = 1;
        } else {
          if (this.fullLoading) return;
          if (this.questionnaireList.length === this.paging) return;
          this.params.page++;

        }
        this.getQuestionnaireList();
      },

      //获取问卷列表
      getQuestionnaireList() {
        let params = {
          ...this.params,
          all: 1,
        };
        this.fullLoading = true;
        this.$httpTj.getQuestionnaireList(params).then(res=>{

        });
        /*this.$http.get(`${this.url}questionnaire`, params, 'prompt').then(res => {
          if (res.code.endsWith('0')) {
            this.fullLoading = false;
            this.paging = res.data.count;
            if (this.params.page === 1) {
              this.questionnaireList = res.data.data;
            } else {
              for (let item of res.data.data) {
                this.questionnaireList.push(item);
              }
            }
          }
        });*/
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
      this.getQuestionnaireList();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/questionnaire/index";
</style>
