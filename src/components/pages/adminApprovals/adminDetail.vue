<template>
  <div id="adminDetail">
    <van-popup overlay-class="overlay-color" v-model="adminDetailModule" position="right" :overlay="true">
      <div>
        3213123
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "admin-detail",
    props: ['module', 'content'],
    data() {
      return {
        adminDetailModule: false,
      }
    },
    watch: {
      module(val) {
        this.adminDetailModule = val;
      },
      adminDetailModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  #adminDetail {

  }
</style>
