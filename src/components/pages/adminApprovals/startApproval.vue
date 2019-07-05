<template>
  <div id="startApproval">
    <div class="startApproval" :style="mainListHeight()">
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
            <div class="items-center" v-else-if="item.moreObject">
              <label class="labelTitle">{{item.label}}</label>
              <zl-input
                v-for="(obj,num) in item.moreObject"
                :key="num"
                v-model="form[item.keyName][obj.keyName]"
                :type="obj.type"
                :disabled="obj.disabled"
                :placeholder="obj.placeholder">
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
        <li class="approvalProcess">
          <p class="promptTitle">
            <label>审批流程</label>
            <span>已启用自动去重</span>
          </p>
          <div v-for="flow in approvalFlow" class="approvalFlow">
            <i></i>
            <div>
              <h1>{{flow.name}}</h1>
              <h2>{{flow.assginees.length+'个'+flow.name}}</h2>
            </div>
            <div class="approvalPersonal">
              <p v-for="key in flow.assginees">
                <img :src="key.avatar" alt="" v-if="key.avatar">
                <img src="../../../assets/image/common/noHead.png" alt="" v-else>
                <span>{{key.name || '******'}}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div class="commonBtn">
        <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="saveSubmit(item.type)">
          {{item.label}}
        </p>
      </div>
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
        approvalFlow: [],               //审批流程
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
            label: '提交',
            type: 'success'
          },
        ],
      }
    },
    activated() {
      let type = this.$route.query.type || '';
      let key = this.$route.query.key || '';
      this.approvalStatus = type;
      this.resetting(type);
      let params = {
        processDefinitionKey: key,
        tenantId: 'hr',
        userId: this.personal.staff_id,
        orgId: this.personal.department_id,
      };
      this.$httpZll.getAdminApprovalProcess(params).then(res => {
        if (res) {
          this.approvalFlow = res;
        } else {
          this.approvalFlow = [];
        }
      })
    },
    watch: {},
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      }
    },
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
            this.searchPositionModule = true;
            // if (this.form.org_id.id) {
            //   this.searchConfig.org_id = this.form.org_id.id;
            //   this.searchConfig.org_name = this.form.org_id.name;
            // } else {
            //   this.$prompt('请选择部门！');
            // }
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
          this.form = Object.assign({}, this.form);
          this.formatData = Object.assign({}, this.formatData);
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
          case 'success':
            // if (this.$attestationKey(this.approvalList)) return;
            let postForm = {}, data = {}, attachment = [];
            if (this.approvalStatus) {
              for (let key of Object.keys(this.form)) {
                if (key !== 'attachment') {
                  data[key] = this.form[key];
                } else {
                  attachment = this.form[key];
                }
              }
              postForm.detail = [];
              postForm.detail.push(data);
              postForm.attachment = attachment;
            } else {
              postForm = this.form;
            }
            postForm.type = this.approvalStatus;
            console.log(postForm);
            this.$httpZll.sendAdminApproval(postForm).then(res => {
              if (res) {
                this.routerReplace('/adminApprovals');
                this.$store.dispatch('admin_approval_tabs', {tab: '2', status: 0});
              }
            });
            break;
        }
      },
      resetting(type) {
        this.approvalList = this.jsonClone(adminApprovalsData[type]);
        this.approvalList.push({
          label: '紧急程度',
          placeholder: '必填 请选择',
          readonly: 'readonly',
          keyName: 'priority',
          keyType: 50,
          type: 'text',
          status: 'objInt',
          showForm: 'formatData', //picker 显示form 或 formatData
          picker: 'picker',
          slot: '',
        });
        let all = this.initFormData(this.approvalList, this.showData, 'noStaff');
        this.form = all.form;
        this.formatData = all.formatData;
        this.album = this.jsonClone(all.album);
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common.scss";

  #startApproval {
    .startApproval {
      background-color: #F8F8F8;
      @include flex('bet-column');

      .startTop {
        min-height: .72rem;
        max-height: .72rem;
        @include bgImage('../../../assets/image/add/toubupolang.png');
      }

      ul {
        padding: .3rem 0;
        @include scroll;
        height: 100%;
        background-color: #FFFFFF;
        margin: 0 .3rem;

        .approvalProcess {
          margin-top: .3rem;

          .promptTitle {
            padding: .3rem;
            border-top: 1px dashed #D8D8D8;

            span {
              padding-left: .2rem;
              color: #F4511E;
            }
          }

          .approvalFlow {
            border-left: 1px dashed #9B9B9B;
            position: relative;
            margin: 0 .3rem 0 .6rem;
            padding: 0 .3rem .5rem;
            @include flex('justify-bet');

            i {
              position: absolute;
              left: -.18rem;
              top: 0;
              width: .36rem;
              height: .36rem;
              @include radius(50%);
              background-color: #D8D8D8;
            }

            h1, h2 {
              white-space: nowrap;
            }

            h1 {
              color: #4A4A4A;
              margin: 0 0 .2rem;
            }

            h2 {
              color: #001A6E;
              font-size: .24rem;
            }

          }

          .approvalPersonal {
            @include flex('items-center');
            flex-direction: row-reverse;
            flex-wrap: wrap;

            img {
              width: .6rem;
              height: .6rem;
              @include radius(50%);
            }

            p {
              @include flex('bet-column');
              align-items: center;
              padding: 0 0 .15rem .2rem;
            }

            span {
              padding-top: .06rem;
              display: block;
            }
          }

          .approvalFlow:last-child {
            border: none;
          }
        }
      }

      .commonBtn {
        background-color: #FFFFFF;
        border-top: 1px solid #D8D8D8;
        padding: .3rem;
      }
    }
  }
</style>

