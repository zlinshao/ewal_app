<template>
  <div id="deliveryPickerSlot">
    <van-popup overlay-class="overlay-color" v-model="popupModule" position="bottom" :overlay="true" class="popupModule"
               :style="maxHeight">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finishData">完成</h3>
      </div>
      <div class="pickerInput">
        <div v-for="slither of Object.keys(drawForm)" class="listParent">
          <div v-for="(item,index) of drawForm[slither]"
               v-if="slither !== 'slither' && pickerConfig.parentKey !== 'bedroom' && item.status === 'child' && item.picker === popup"
               class="chooseList" :class="{'slotChoose':item.keyName === pickerName}">
            <picker-input
              v-model="formatData[slither][item.keyName]"
              @focus="choosePicker(item,forms[slither][item.keyName],slither)"
              :key="index"
              :type="item.type"
              :label="item.label"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :placeholder="item.placeholder">
            </picker-input>
          </div>
          <div
            v-else-if="slither !== 'slither' && pickerConfig.parentKey === 'bedroom'" class="listChildren">
            <div v-for="room in item" :class="{'slotChoose':room.keyName === pickerName}" v-if="room.picker === popup">
              <picker-input
                v-model="formatData[slither][index][room.keyName]"
                @focus="choosePicker(room,forms[slither][index][room.keyName],slither,index)"
                :key="index"
                :type="room.type"
                :label="room.label"
                :readonly="room.readonly"
                :disabled="room.disabled"
                :placeholder="room.placeholder">
                <div class="zl-button" v-if="room.button">{{room.button}}</div>
                <div class="unit" v-if="room.unit">{{room.unit}}</div>
              </picker-input>
            </div>
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
        length: [],
        maxHeight: '',
      }
    },
    mounted() {
    },
    activated() {
      this.maxHeight = {maxHeight: (Number(sessionStorage.windowHeight) - 60) + 'px'};
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
      // 重置筛选
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
      // 点击切换
      choosePicker(item, value = '', parentKey = '', index = '') {
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
          config.title = item.label;
          config.parentKey = parentKey;
          config.index = index;
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
        let obj;
        if (typeof config.index === 'number') {
          obj = this.forms[config.parentKey][config.index][config.keyName];
        } else {
          obj = this.forms[config.parentKey][config.keyName];
        }
        config.childKeys.forEach((key, idx) => {
          if (key === 'is_bad') {
            this.is_bad = Number(obj[key]) || 0;
          }
          if (Number(config.ids[idx].values[0]) === 0) {
            config.columns[idx].defaultIndex = Number(obj[key]);
          } else {
            if (obj[key] > 0) {
              config.columns[idx].defaultIndex = Number(obj[key]) - 1;
            } else {
              config.columns[idx].defaultIndex = Number(obj[key]);
            }
          }
        });
        this.pickerConfig = Object.assign({}, config);
        if (this.is_bad === 1) {
          this.addColumns();
        }
      },
      // 增加损坏数量 选项
      addColumns(picker) {
        let unit = '';
        let num = [];
        let sets = ['air_conditioning', 'tv'];//台
        let few = ['chair', 'door_lock_key', 'key'];//把
        let config = this.pickerConfig;
        unit = sets.includes(config.keyName) ? '台' : (few.includes(config.keyName) ? '把' : '个');
        for (let i = 1; i < 6; i++) {
          num.push(i + unit);
          config.ids[this.length[1]].values.push(i);
        }
        if (picker) {
          picker.setColumnValues(this.length[1], num);
        }
        config.columns[this.length[1]].values = num;
        this.pickerConfig = Object.assign({}, config);
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
        let config = this.pickerConfig;
        let ids = config.ids;//id组
        let parentKey = config.parentKey;//最外层字段名
        let key = config.keyName;//父级 字段名
        let child = config.childKeys;//子集 字段名
        child.forEach((res, idx) => {
          let status = typeof ids[idx].values[index[idx]] !== 'undefined';
          if (config.parentKey === 'bedroom') {
            if (status) {
              this.forms[parentKey][config.index][key][res] = Number(ids[idx].values[index[idx]]);
            }
            this.formatData[parentKey][config.index][key] = value.join('/');
          } else {
            if (status) {
              this.forms[parentKey][key][res] = Number(ids[idx].values[index[idx]]);
            }
            this.formatData[parentKey][key] = value.join('/');
          }
        });
        this.formatData = Object.assign({}, this.formatData);
      },
      finishData() {
        this.$emit('close', this.forms, this.formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/common.scss";

  #deliveryPickerSlot {
    .popupModule {
      @include flex('bet-column');

      .pickerInput {
        height: 100%;
        @include scroll;
      }

      .listChildren {
        display: flex;
        flex-wrap: wrap;

        > div {
          width: 33.33%;
          padding: .2rem 0;
          @include radius(.1rem);
        }
      }
    }
  }


</style>
