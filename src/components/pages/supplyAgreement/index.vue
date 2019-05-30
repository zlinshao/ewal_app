<template>
  <div id="supplyAgreement">
    <div class="supplyAgreement" :style="mainListHeight()">
      <div class="title">协议内容</div>
      <div class="main">
        <div class="content">
          <div v-for="item in 100">
            {{item}}
          </div>
        </div>
        <div class="commonBtn">
          <p class="btn back" @click="$router.go(-1)">取消</p>
          <p class="btn">确定</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common";

  #supplyAgreement {
    .supplyAgreement {
      padding: .3rem .3rem .5rem;
      margin-top: .1rem;
      @include flex('bet-column');
      background: linear-gradient(135deg, rgba(137, 164, 255, 1) 0%, rgba(69, 112, 254, 1) 100%);

      .title {
        color: #FFFFFF;
        padding-bottom: .3rem;
      }

      .main {
        padding-top: .2rem;
        height: 100%;
        background-color: #FFFFFF;
        @include flex('bet-column');
        @include radius(.06rem);

        .content {
          padding: 0 .2rem;
          @include scroll;
          height: 100%;
        }

        .commonBtn {
          margin-top: .2rem;
          border-top: 1px dashed #C6CAD8;
          padding: .3rem;
        }
      }
    }
  }

</style>
