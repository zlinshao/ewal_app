<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="pickerModule" position="bottom"
               :overlay="true">
      <van-picker
        show-toolbar
        :title="'请选择' + pickerConfig.title"
        :columns="pickerConfig.columns"
        @cancel="pickerModule = false"
        @confirm="onConfirm"/>
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
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {},
    methods: {
      onConfirm(value, index) {
        let picker = this.pickerConfig;
        let parentKey = picker.parentKey;
        let idx = picker.index;
        let key = picker.keyName;
        console.log(picker);
        console.log(value);
        console.log(index);
        // let form = this.forms;
        // let formatData = this.formatData;
        // this.$emit('close', form, formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
