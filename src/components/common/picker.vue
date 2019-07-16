<template>
  <div>
    <van-popup overlay-class="overlay-color" v-model="pickerModule" position="bottom" :overlay="true">
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
    name: "picker",
    props: ['module', 'pickers', 'form', 'formData'],
    data() {
      return {
        pickerModule: false,
        forms: {},
        formatData: {},
        pickerConfig: {}
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
        if (parentKey) {
          if (picker.keyName === 'remittance_account') {
            this.forms[parentKey][idx]['account_id'] = picker.ids[index];
            this.forms[parentKey][idx][key] = value.split('<br>').join(' ');
            this.formatData[parentKey][idx][key] = value.split('<br>').join(' ');
          } else {
            this.forms[parentKey][idx][key] = picker.ids[index];
            this.formatData[parentKey][idx][key] = value;
          }
        } else {
          if (picker.status.includes('column')) {
            if (key === 'house_type') {
              index[0] = index[0] + 1;
              this.forms[key] = index;
              this.formatData[key] = value.join('');
            } else {
              this.forms[key] = index;
              this.formatData[key] = value.join('');
            }
          } else {
            switch (picker.status) {
              case 'obj':
                this.forms[key].id = picker.ids[index];
                this.forms[key].name = value;
                this.formatData[key] = value;
                break;
              case 'arr':
                this.forms[key] = value;
                this.formatData[key] = value;
                break;
              case 'objInt':
                let str = 'payment_type';
                if (picker.keyName.includes(str)) {
                  this.forms[picker.keyName][str] = picker.ids[index];
                  this.formatData[key] = value;
                } else {
                  this.forms[key] = picker.ids[index];
                  this.formatData[key] = value;
                }
                break;
            }
          }
        }
        this.$emit('close', this.forms, this.formatData, picker);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
