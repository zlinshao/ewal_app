<template>
  <div id="houseResource">
    <div>

    </div>
    <div class="commonFooterTag">
      <p v-for="item in 4" :class="['p-'+item]" @click="footerTag(item)"></p>
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
    watch: {},
    computed: {},
    methods: {
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.routerLink('/index');
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

</style>
