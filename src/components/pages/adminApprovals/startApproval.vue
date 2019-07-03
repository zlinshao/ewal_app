<template>
  <div id="startApproval" :style="mainListHeight()">
    <div class="startTop"></div>
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
            <div class="zl-button" :class="item.close" v-if="item.button" @click="closeInput(item)">
              {{item.button}}
            </div>
            <div class="unit" v-if="item.unit">{{item.unit}}</div>
          </zl-input>
        </div>
        <!--上传-->
        <div v-else-if="item.photos" class="uploadForm">
          <div v-for="upload in item.photos" class="flex">
            <Upload :file="upload" :getImg="album[upload.keyName]" @success="getImgData"></Upload>
          </div>
        </div>
        <!--输入框-->
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
    <div class="commonBtn">
      <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="saveSubmit(item.type)">
        {{item.label}}
      </p>
    </div>
    <!--正常 picker-->
    <picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onConfirm"></picker>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>
    <!--部门搜索-->
    <search-depart :module="searchDepartModule" @close="getDepartInfo"></search-depart>
    <!--岗位搜索-->
    <search-position :module="searchPositionModule" @close="getDepartInfo" :config="searchConfig"></search-position>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
  </div>
</template>

<script>
  import SearchStaff from '../../common/searchStaff.vue';
  import SearchDepart from '../../common/searchDepart.vue';
  import SearchPosition from '../../common/searchPosition.vue';

  export default {
    name: "start-approval",
    components: {SearchStaff, SearchDepart, SearchPosition},
    data() {
      return {
        approvalStatus: '',
        pickers: {},
        timeModule: false,
        pickerModule: false,
        searchStaffModule: false,
        searchDepartModule: false,
        searchPositionModule: false,
        searchConfig: {},
        approvalList: [],
        album: {},
        form: {},
        formatData: {},
        showData: {
          dateVal: '',                  //日期
          parentKey: '',                //父级 字段名 变化有picker
          dateKey: '',                  //日期 字段名
          dateType: '',                 //日期类型 默认date 时分datetime
          dateIdx: '',                  //日期字段下标 变化情况使用
        },
        buttons: [
          {
            label: '取消',
            type: 'back'
          },
          {
            label: '邀请同事提交',
            type: 'deliver'
          },
          {
            label: '提交',
            type: 'success'
          },
        ],
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
        if (item.status === 'objName') {
          this.form[item.keyName] = {};
        } else {
          this.form[item.keyName] = '';
        }
        this.formatData[item.keyName] = '';
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
          case 'searchPosition':
            this.searchConfig = val;
            if (this.form.org_id.id) {
              this.searchConfig.org_id = this.form.org_id.id;
              this.searchConfig.org_name = this.form.org_id.name;
              this.searchPositionModule = true;
            } else {
              this.$prompt('请选择部门！');
            }
            break;
          case 'searchDepart':
            this.searchConfig = val;
            this.searchDepartModule = true;
            break;
        }
      },
      // 确认下拉选择
      onConfirm(form, show) {
        this.onCancel();
        if (form !== 'close') {
          this.form = form;
          this.formatData = show;
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
      // 搜索员工结果
      getStaffInfo(val) {
        this.onCancel();
        if (val !== 'close') {
          let config = this.searchConfig;
          console.log(val);
        }
      },
      // 部门 / 岗位
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
        this.pickerModule = false;
        this.searchStaffModule = false;
        this.searchDepartModule = false;
        this.searchPositionModule = false;
      },
      getImgData(val) {
        this.form[val[0]] = val[1];
      },
      // 提交
      saveSubmit(val) {
        switch (val) {
          case 'back':
            this.$router.go(-1);
            break;
          case 'deliver':

            break;
          case 'success':
            if (this.$attestationKey(this.approvalList)) return;
            let type = this.$route.query.type;
            this.form.type = type;
            this.$httpZll.sendAdminApproval(this.form).then(res => {
              console.log(res);
            });
            break;
        }
      },
      resetting(type) {
        this.approvalList = this.jsonClone(adminApprovalsData[type]);
        let all = this.initFormData(this.approvalList, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        this.album = this.jsonClone(all.album);
        console.log(all)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common.scss";

  #startApproval {
    background-color: #F8F8F8;
    @include flex('bet-column');

    .startTop {
      height: .8rem;
      @include bgImage('../../../assets/image/add/toubupolang.png');
    }

    ul {
      height: 100%;
      background-color: #FFFFFF;
      margin: 0 .3rem;
    }

    .commonBtn {
      background-color: #FFFFFF;
      border-top: 1px solid #D8D8D8;
      padding: .3rem;

      .deliver {
        padding: .15rem .3rem;
      }
    }
  }
</style>

