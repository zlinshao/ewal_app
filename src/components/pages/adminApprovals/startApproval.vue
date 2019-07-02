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
        approvalList: [],
        form: {},
        formatData: {},
        showData: {
          dateVal: '',                  //日期
          parentKey: '',                //父级 字段名 变化有picker
          dateKey: '',                  //日期 字段名
          dateType: '',                 //日期类型 默认date 时分datetime
          dateIdx: '',                  //日期字段下标 变化情况使用
        },
      }
    },
    activated() {
      let type = this.$route.query.type || '';
      this.approvalStatus = type;
      this.resetting(type);
    },
    watch: {},
    computed: {},
    methods: {
      resetting(type) {
        this.approvalList = adminApprovalsData[type];
        let all = this.initFormData(this.approvalList, this.showData, 'noStaff');
        console.log(all);
      },
    },
  }
</script>

<style scoped lang="scss">
  #startApproval {

  }
</style>
