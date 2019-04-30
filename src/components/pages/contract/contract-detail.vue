<template>
  <div id="contract-detail">
    <header class="flex-center">
      <span
        v-for="tmp in header_filter" :key="tmp.id"
        :class="{'is-active': tmp.id === current_tab}"
        @click="handleTabClick(tmp)"
      >{{ tmp.title }}</span>
    </header>
    <div class="main-container" ref="mainContainer" :style="mainHeight">

    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        header_filter: [
          {id: 1,title: '合同详情'},
          {id: 2,title: '合同附件'},
          {id: 3,title: '电子收据'},
          {id: 4,title: '其他附件'},
        ],
        current_tab: 1,
        mainHeight: {
          height: 0
        }
      }
    },
    mounted() {
      var top = this.$refs['mainContainer'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
    },
    watch: {},
    computed: {},
    methods: {
      //tab切换
      handleTabClick(tmp) {
        this.current_tab = tmp.id;
      },
    },
  }
</script>

<style lang="scss" scoped>
  #contract-detail {
    header {
      border-top: .05rem solid #F2F2F2;
      min-height: 1.2rem;
      span {
        width: 100%;
        text-align: center;
        color: #9B9B9B;
      }
      span.is-active {
        color: #4481FE;
      }
    }
    .main-container {
      background-color: #F2F2F2;
    }
  }
</style>
