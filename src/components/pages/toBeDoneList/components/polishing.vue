<template>
  <div id="polishing">
    <van-popup v-model="popupModule" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="popupModule">
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "polishing",
    props: ['module', 'detail'],
    data() {
      return {
        popupModule: false,
        allDetail: {},
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.popupModule = val;
      },
      detail(val) {
        this.allDetail = val;
        if (val.outcome) {
          this.taskAction = JSON.parse(val.outcome);
        }

        // this.getDetail(val.ctl_detail_request_url);
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close');
        }
      }
    },
    computed: {},
    methods: {
      // 获取任务详情
      getDetail(api) {
        this.$httpZll.get(api).then(res => {
          if (res.success) {
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  @mixin polishImg($n) {
    @include bgImage('../../../../assets/image/toBeDoneList/goSignContract/'+$n+'.png');
  }

  #polishing {
    .popupModule {
      right: 0;
      left: 1.8rem;
      height: 100%;
      @include radius(.2rem 0 0 .2rem);
      background-color: #FFFFFF;
      @include flex('bet-column');
    }
  }
</style>
