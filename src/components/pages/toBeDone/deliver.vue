<template>
  <div id="deliver">
    <van-popup v-model="deliverPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}" :overlay="true"
               class="deliverPopup">
      <div class="deliverTitle">
        {{deliverIndex?'转交':'代签'}}
      </div>
      <div class="deliver">
        <div v-for="item in defineDeliver[deliverIndex]" :class="item.type">
          <label>{{item.label}}</label>
          <input
            v-if="item.type !== 'textarea'"
            type="text"
            v-model="formatData[item.keyName]"
            :readonly="item.readonly"
            :disabled="item.disabled"
            @focus="choosePicker(item)"
            :placeholder="item.placeholder">
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="onCancel">取消</p>
        <p class="btn" @click="saveDeliver(deliverIndex)">确定</p>
      </div>
    </van-popup>
    <!--员工搜索-->
    <search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>
  </div>
</template>

<script>
  import SearchStaff from '../../common/searchStaff.vue';

  export default {
    name: "deliver",
    props: ['module', 'config'],
    components: {SearchStaff},
    data() {
      return {
        task_id: '',
        form: {},
        formatData: {},
        deliverPopup: false,
        searchStaffModule: false,
        deliverIndex: 0,
        defineDeliver: [
          [
            {
              label: '代签人',
              readonly: 'readonly',
              type: 'text',
              keyName: 'assignee',
              placeholder: '必填 请选择',
            },
            {
              label: '部门',
              type: 'text',
              disabled: 'disabled',
              keyName: 'department_name',
              placeholder: '已禁用',
            },
          ],
          [
            {
              label: '转交人',
              readonly: 'readonly',
              type: 'text',
              keyName: 'assignee',
              placeholder: '必填 请选择',
            },
            {
              label: '部门',
              type: 'text',
              disabled: 'disabled',
              keyName: 'department_name',
              placeholder: '已禁用',
            },
          ]
        ],
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.deliverPopup = val;
      },
      deliverPopup(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
      config: {
        handler(val, oldVal) {
          console.log(val);
          this.task_id = val.id;
          let status = val.name === 'deliver' ? 1 : 0;
          this.resetting(status);
        },
        deep: true,
      }
    },
    computed: {},
    methods: {
      // 人员/部门/时间
      choosePicker(val) {
        if (val.keyName === 'assignee') this.searchStaffModule = true;
      },
      // 员工搜索结果
      getStaffInfo(val) {
        this.searchStaffModule = false;
        if (val !== 'close') {
          this.form.assignee = val.staff_id;
          this.formatData.assignee = val.staff_name;
          this.formatData.department_name = val.department_name;
        }
      },
      // 转交 / 代签
      saveDeliver(val) {
        this.form.changeOwner = Boolean(val);
        if (!this.form.assignee) {
          let msg = '请选择' + (val ? '转交' : '代签') + '人';
          this.$prompt(msg, 'fail');
          return;
        }
        this.$httpZll.postToBeDoneDeliver(this.task_id, this.form, val).then(_ => {
          if (val) {
            this.$prompt('发送转交成功', 'success');
          } else {
            this.$prompt('发送代签成功', 'success');
          }
          this.onCancel();
        })
      },
      onCancel() {
        this.deliverPopup = false;
      },
      // 转交/代签
      resetting(val) {
        this.deliverIndex = val;
        this.formatData = {
          assignee: '',
          department_name: '',
        };
        this.form = {
          assignee: '',
          action: 'transfer',
          changeOwner: true
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  .deliverPopup {
    @include radius(.2rem);
    padding: .3rem;

    .deliverTitle {
      font-size: .33rem;
      padding: 0 0 .5rem .2rem;
    }

    .deliver {
      > div {
        @include flex('items-center');
        min-height: .88rem;

        label {
          min-width: 1.5rem;
          max-width: 1.5rem;
          text-align: right;
          margin-right: .3rem;
        }
      }
    }

    .commonBtn {
      padding: .5rem 0 .2rem;
    }
  }
</style>
