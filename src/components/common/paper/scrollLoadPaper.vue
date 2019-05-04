<template>
  <div id="mainContent">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <ul id="listContent" :class="name">
        <slot></slot>
      </ul>
    </van-pull-refresh>
  </div>
</template>

<script>
  export default {
    name: "scroll-load",
    props: ['disabled', 'name'],
    data() {
      return {
        scrollHeight: '',
        isGetMore: false,
        isLoading: false
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      disabled(val) {
        this.isGetMore = val;
        this.isScroll();
      }
    },
    computed: {},
    methods: {
      isScroll() {
        /**
         @监听滚动加载
         **/
          // 当前可视列表高度
        let that = this, mainContent, mainHeight, listContent, scrollHeight, scrollTop;
        mainContent = document.getElementById('mainContent');
        mainHeight = mainContent.offsetHeight;
        // 滚动条到顶部的位置
        scrollTop = 0;
        mainContent.onscroll = function () {
          // 滚动条内容的总高度
          listContent = document.getElementById('listContent');
          scrollHeight = listContent.scrollHeight;
          scrollTop = mainContent.scrollTop;

          if (scrollHeight - (scrollTop + mainHeight) < -30) {
            that.isGetMore = true;
            that.$emit('getLoadMore', that.isGetMore);
          }
        }
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit('getLoadMore', false);
        }, 500);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #mainContent {
    height: 100%;
    @include scroll;
    .flex-warp {
      @include flex();
      flex-wrap: wrap;
    }
  }
</style>
