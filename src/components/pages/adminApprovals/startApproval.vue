<template>
  <div id="startApproval">
    <ul>
      <li v-for="(item,index) in approvalList">
        <div v-if="item.showForm === 'formatData' || (item.picker && item.readonly)">
          <zl-input
            v-model="formatData[item.keyName]"
            @focus="choosePicker(item,form[item.keyName])"
            :key="index"
            :type="item.type"
            :label="item.label"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :placeholder="item.placeholder">
            <div class="zl-button" v-if="item.button">{{item.button}}</div>
            <div class="unit" v-if="item.unit">{{item.unit}}</div>
          </zl-input>
        </div>
        <div v-else>

        </div>
      </li>
    </ul>
    <!--部门搜索-->
    <search-depart :module="searchDepartModule" @close="getDepartInfo"></search-depart>
  </div>
</template>

<script>
  import SearchStaff from '../../common/searchStaff.vue';
  import SearchDepart from '../../common/searchDepart.vue';

  export default {
    name: "start-approval",
    components: {SearchStaff, SearchDepart},
    data() {
      return {
        approvalStatus: '',
        pickers: {},
        pickerModule: false,
        searchStaffModule: false,
        searchDepartModule: false,
        searchConfig: {},
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
      // 下拉框筛选
      choosePicker(val, value, num, parentKey = '') {
        this.popupStatus = val.picker;
        switch (val.picker) {
          case 'picker':
            this.pickerModule = true;
            this.inputSelect(val, num, parentKey).then(picker => {
              this.pickers = picker;
            });
            break;
          case 'date':
          case 'datetime':
            this.chooseTime(val, value, num, parentKey);
            break;
          case 'searchStaff':
            this.searchConfig = val;
            this.searchStaffModule = true;
            break;
          case 'searchDepart':
            this.searchConfig = val;
            this.searchDepartModule = true;
            break;
        }
      },
      getDepartInfo(val) {
        console.log(this.form)
      },
      resetting(type) {
        this.approvalList = adminApprovalsData[type];
        let all = this.initFormData(this.approvalList, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        console.log(all)
      },
    },
  }
</script>

<style scoped lang="scss">
  #startApproval {

  }
</style>

