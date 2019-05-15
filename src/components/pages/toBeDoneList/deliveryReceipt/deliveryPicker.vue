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
          let picker = this.pickerConfig;
          if (!val.parentKey) return;
          let obj = this.forms[val.parentKey][val.keyName];
          let length = picker.childKeys.length;
          let idx = 0;
          for (let val of picker.childKeys) {
            if (val === picker.childKeys[length - 2]) {
              this.is_bad = obj[val];
              picker.columns[idx].defaultIndex = obj[val];
            } else if (val === picker.childKeys[length - 1]) {
              if (obj[val] > 0) {
                picker.columns[idx].defaultIndex = obj[val] - 1;
              } else {
                picker.columns[idx].defaultIndex = obj[val];
              }
            } else {
              picker.columns[idx].defaultIndex = obj[val] - 1;
            }
            idx++;
          }
          this.pickerConfig = Object.assign({}, picker);
          if (this.is_bad === 1) {
            let length = val.childKeys.length;
            let num = [];
            for (let i = 1; i < 6; i++) {
              num.push(i + '个');
              this.pickerConfig.ids[length - 1].values.push(i);
            }
            this.pickerConfig.columns[length - 1].values = num;
          }
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {},
    methods: {
      onChange(picker, value) {
        let config = this.pickerConfig;
        let length = config.childKeys.length;
        let column = config.columns[length - 2].values;
        config.ids[length - 1].values = [];
        if (length) {
          if (column.indexOf(value[length - 2]) === 0) {
            config.ids[length - 1].values = [0];
            this.is_bad = 0;
            picker.setColumnValues(length - 1, [''])
          } else {
            let num = [];
            for (let i = 1; i < 6; i++) {
              num.push(i + '个');
              config.ids[length - 1].values.push(i);
            }
            this.is_bad = 1;
            config.columns[length - 1].values = num;
            picker.setColumnValues(length - 1, num);
          }
        }
      },
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
