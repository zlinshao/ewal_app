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
            <div class="zl-button" :class="item.close" v-if="item.button" @click="closeInput(item)">{{item.button}}
            </div>
            <div class="unit" v-if="item.unit">{{item.unit}}</div>
          </zl-input>
        </div>
        <div v-else>
          <div v-if="item.disabled">
            <zl-input
              :key="index"
              v-model="form[item.keyName]"
              :type="item.type"
              :disabled="item.disabled"
              :label="item.label"
              :placeholder="item.placeholder">
            </zl-input>
          </div>
          <div v-else>
            <zl-input
              :key="index"
              v-model="form[item.keyName]"
              :type="item.type"
              :label="item.label"
              :placeholder="item.placeholder">
            </zl-input>
          </div>
          <div class="prompts" v-if="item.prompts">{{item.prompts}}</div>
        </div>
      </li>
    </ul>
    <!--部门搜索-->
    <search-depart :module="searchDepartModule" @close="getDepartInfo"></search-depart>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
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
        timeModule: false,
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
      // 清除日期
      closeInput(item) {
        this.form[item.keyName] = item.keyType;
        if (item.status === 'objName') {
          this.formatData[item.keyName] = '';
        } else {
          this.formatData[item.keyName] = item.keyType;
        }
      },
      // 下拉框筛选
      choosePicker(val, value) {
        switch (val.picker) {
          case 'picker':
            this.pickerModule = true;
            this.inputSelect(val).then(picker => {
              this.pickers = picker;
            });
            break;
          case 'date':
          case 'datetime':
            this.chooseTime(val, value);
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
      // 日期选择
      chooseTime(val, date) {
        this.timeModule = true;
        this.formatData.dateKey = val.keyName;
        this.formatData.dateType = val.picker;
        this.formatData.dateVal = date;
      },
      // 确认时间
      onConTime(val) {
        this.onCancel();
        if (val !== 'close') {
          this.form[val.dateKey] = val.dateVal;
          this.formatData[val.dateKey] = val.dateVal;
        }
      },
      // 部门
      getDepartInfo(val) {
        this.onCancel();
        let config = this.searchConfig;
        if (val !== 'close') {
          this.form[config.keyName].id = val.id;
          this.form[config.keyName].name = val.name;
          this.formatData[config.keyName] = val.name;
        }
      },
      onCancel() {
        this.timeModule = false;
        this.searchDepartModule = false;
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

