<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
      // this.$router.go(-1);
      // window.close();
      sessionStorage.setItem('signRouter', '/' + sessionStorage.signRouter);
      this.closeDD();
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>

</style>
