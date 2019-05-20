<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.4)'}" v-model="popupModule"
               position="bottom" :overlay="true" class="popupModule">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finishData">完成</h3>
      </div>
      <div class="pickerInput">
        <div v-for="slither of Object.keys(drawForm)" v-if="slither === pickerConfig.parentKey" class="listParent">
          <div v-for="(item,index) of drawForm[slither]"
               v-if="slither !== 'slither'&& item.status === 'child' && item.picker === popup" class="chooseList"
               :class="{'slotChoose':item.keyName === pickerName}">
            <picker-input
              v-model="formatData[slither][item.keyName]"
              @focus="choosePicker(item,forms[slither][item.keyName],slither,item)"
              :key="index"
              :type="item.type"
              :label="item.label"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :placeholder="item.placeholder">
            </picker-input>
          </div>
        </div>
      </div>

      <van-picker
        show-toolbar
        v-if="pickerModule"
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
    name: "picker",
    props: ['module', 'pickers', 'postData', 'formData', 'drawing', 'popup'],
    data() {
      return {
        popupModule: false,
        pickerModule: false,
        timeModule: false,
        drawForm: {},
        forms: {},
        formatData: {},
        pickerConfig: {},
        pickerName: '',
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
        this.popupModule = val;
        this.pickerModule = val;
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        } else {
          this.drawForm = this.drawing;
        }
      },
      postData: {
        handler(val, oldVal) {
          this.forms = this.jsonClone(val);
          this.formatData = this.jsonClone(this.formData);
        },
        immediate: true,
        deep: true,
      },
      pickers: {
        handler(val, oldVal) {
          this.pickerName = val.keyName;
          let config = this.jsonClone(val);
          this.setPickers(config);
        },
        deep: true,
      },
    },
    computed: {},
    methods: {
      closePickerConfig() {
        return new Promise((resolve, reject) => {
          this.pickerConfig = {
            title: '',                        //picker标题
            type: '',                         //字典类型
            keyName: '',                      //字段名
            childKeys: [],                    //字段名
            parentKey: '',                    //父级 字段名 变化有picker
            columns: [],                      //下拉框选择文本列表
            ids: [],                          //当前字典所有id
            index: '',                        //变化下标
          };
          resolve(true);
        })
      },
      // 切换
      choosePicker(item, value = '', parentKey = '', child) {
        this.closePickerConfig().then(_ => {
          this.pickerName = item.keyName;
          let dict = dicties[item.keyName];
          let config = this.pickerConfig;
          config.columns = [];
          config.ids = [];
          for (let item of Object.keys(dict)) {
            let obj = {values: []}, ids = {values: []};
            for (let val of Object.keys(dict[item])) {
              obj.values.push(dict[item][val]);
              ids.values.push(val);
            }
            config.columns.push(obj);
            config.ids.push(ids);
          }
          config.title = child.label;
          config.parentKey = parentKey;
          config.keyName = item.keyName;
          config.childKeys = item.childKeys;
          this.setPickers(config);
        });
      },
      // 预填所有选项
      setPickers(config) {
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
        this.pickerConfig = Object.assign({}, config);
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
        console.log(config);
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
        value = value.filter(item => item !== '');
        this.formatData[parentKey][key] = value.join('/');

      },
      finishData() {
        this.$emit('close', this.forms, this.formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
