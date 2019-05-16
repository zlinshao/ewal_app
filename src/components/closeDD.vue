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
      alert(3123123);
      this.$router.go(-1);
      window.close();
      this.closeDD();
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>

</style>
