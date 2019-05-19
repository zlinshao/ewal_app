<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="pickerModule" position="bottom"
               :overlay="true">
      <van-picker
        show-toolbar
        :title="'请选择' + pickerConfig.title"
        :columns="pickerConfig.columns"
        @cancel="pickerModule = false"
        @confirm="onConfirm"
        @change="onChange"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "delivery-picker",
    props: ['module', 'pickers', 'form', 'formData'],
    data() {
      return {
        pickerModule: false,
        forms: {},
        formatData: {},
        pickerConfig: {},
        is_bad: 0,
        length: []
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        let that = this;
        setTimeout(() => {
          that.pickerModule = val;
        }, 300);
      },
      pickerModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
      form: {
        handler(val, oldVal) {
          this.forms = this.jsonClone(val);
          this.formatData = this.jsonClone(this.formData);
        },
        immediate: true,
        deep: true,
      },
      pickers: {
        handler(val, oldVal) {
          this.pickerConfig = this.jsonClone(val);
          this.setPickers();
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {},
    methods: {
      // 预填所有选项
      setPickers() {
        let config = this.pickerConfig;
        if (!config.parentKey) return;
        config.childKeys.forEach((res, index) => {
          if (res === 'is_bad') {
            this.length[0] = index;
          }
          if (res === 'bad_number') {
            this.length[1] = index;
          }
        });
        config.ids[this.length[1]].values = [];
        let obj = this.forms[config.parentKey][config.keyName];
        config.childKeys.forEach((key, idx) => {
          if (key === 'is_bad') {
            this.is_bad = obj[key] || 0;
          }
          if (Number(config.ids[idx].values[0]) === 0) {
            config.columns[idx].defaultIndex = obj[key];
          } else {
            config.columns[idx].defaultIndex = obj[key] - 1;
          }
        });
        if (this.is_bad === 1) {
          this.addColumns();
        }
      },
      // 增加损坏数量 选项
      addColumns(picker) {
        let num = [];
        let config = this.pickerConfig;
        for (let i = 1; i < 6; i++) {
          num.push(i + '个');
          config.ids[this.length[1]].values.push(i);
        }
        config.columns[this.length[1]].values = num;
        if (picker) {
          picker.setColumnValues(this.length[1], num);
        }
      },
      // 选项变化监听
      onChange(picker, value) {
        let config = this.pickerConfig;
        let column = config.columns[this.length[0]].values;
        if (column.indexOf(value[this.length[0]]) === 0) {
          this.is_bad = 0;
          picker.setColumnValues(this.length[1], ['']);
          config.columns[this.length[0]].defaultIndex = 0;
        } else {
          this.is_bad = 1;
          this.addColumns(picker);
        }
      },
      // 确认选择
      onConfirm(value, index) {
        let picker = this.pickerConfig;
        let ids = picker.ids;//id组
        let parentKey = picker.parentKey;//最外层字段名
        let key = picker.keyName;//父级 字段名
        let child = picker.childKeys;//子集 字段名
        child.forEach((res, idx) => {
          this.forms[parentKey][key][res] = Number(ids[idx].values[index[idx]]);
        });
        let formatData = this.formatData;
        value = value.filter(item => item !== '');
        formatData[parentKey][key] = value.join('/');
        this.$emit('close', this.forms, formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
