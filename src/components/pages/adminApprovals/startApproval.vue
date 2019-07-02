<template>
  <div id="startApproval">
    {{approvalStatus}}
  </div>
</template>

<script>
  export default {
    name: "start-approval",
    data() {
      return {
        approvalStatus: '',
      }
    },
    activated() {
      this.approvalStatus = this.$route.query.type || '';
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  #startApproval {

  }
</style>
