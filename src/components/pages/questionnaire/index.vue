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
                <input type="text" placeholder="请输入搜索内容" v-model="params.title" @keyup.enter="onSearch()">
                <span v-if="params.title" @click="params.title = ''"></span>
              </div>
              <p class="searchBtn" @click="onSearch()">搜索</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="listContainerRef" class="list-container scroll_bar" :style="mainListHeight(listHeight)">
        <!--<div  class="item">

        </div>-->

        <van-swipe-cell v-if="hasAuthority" v-for="index in 13" :key="index" :right-width="sliderWidth" :on-close="onClose">
          <van-cell-group>
            <div class="item">
              <div class="item-top">问卷标题问卷标题问卷标题标题问卷标题</div>
              <div class="item-middle">
                <div class="item-middle-left">
                  <div class="item-middle-left__status">收集中</div>
                  <div class="item-middle-left__data">数据:220</div>
                </div>
                <div class="item-middle-right">2019-04-27 19:14:00</div>
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

        <van-swipe-cell v-if="!hasAuthority" v-for="index in 13" :key="index">
          <van-cell-group>
            <div class="item-no-authority">
              <div class="item-top">问卷标题问卷标题问卷标题标题问卷标题</div>
              <div class="item-middle">
                <div class="item-middle-left">
                  <div class="item-middle-left__status">收集中</div>
                  <div class="item-middle-left__data">数据:220</div>
                </div>
                <div class="item-middle-right"></div>
              </div>
              <div class="item-bottom">
                <div class="item-bottom-left">
                  2019-04-27 19:14:00
                </div>
                <div class="item-bottom-right">
                  去回答>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-swipe-cell>

        <div class="bottom-tip">拼一把,让明天的你感谢今天的自己!</div>
      </div>

      <div @click="routerLink('/createQuestionnaire')" v-if="hasAuthority" class="add-button-circle"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "questionnaire",
    data() {
      return {
        params: {
          title: '',
        },
        listHeight: 0,
        sliderWidth: 0,
        hasAuthority:true,//是否有权限


      }
    },
    methods: {
      onSearch() {
        console.log('search');
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
      this.listHeight = this.$refs['listContainerRef'].offsetTop;
      this.sliderWidth = this.screenWidth >> 1;
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/questionnaire/index";
</style>
