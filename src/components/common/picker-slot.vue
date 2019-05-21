<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.4)'}" v-model="popupModule"
               position="bottom" :overlay="true" class="popupModule">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finishData">完成</h3>
      </div>
      <div class="pickerInput">
        <div v-for="(item,index) in drawForm" class="chooseList" :class="{'slotChoose':item.keyName === pickerName}">
          <div v-if="item.showForm === 'formatData'">
            <picker-input
              v-if="!item.pickerRead"
              v-model="formatData[item.keyName]"
              @focus="choosePicker(item,postFormData[item.keyName])"
              :key="index"
              :type="item.type"
              :label="item.label"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :placeholder="item.placeholder">
            </picker-input>
            <picker-input
              v-else
              :key="index"
              v-model="formatData[item.keyName]"
              :type="item.type"
              :label="item.label"
              :placeholder="item.placeholder">
            </picker-input>
          </div>
          <div v-else>
            <picker-input
              v-if="!item.pickerRead"
              v-model="postFormData[item.keyName]"
              @focus="choosePicker(item, postFormData[item.keyName])"
              :key="index"
              :type="item.type"
              :label="item.label"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :placeholder="item.placeholder">
            </picker-input>
            <picker-input
              v-else
              :key="index"
              v-model="postFormData[item.keyName]"
              :type="item.type"
              :label="item.label"
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
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="timeModule = false"
                 @onDate="onConTime"></choose-time>
  </div>
</template>

<script>

  export default {
    name: "picker",
    props: ['module', 'pickers', 'drawing', 'postData', 'formData', 'popup'],
    data() {
      return {
        popupModule: false,
        pickerModule: false,
        timeModule: false,
        drawForm: [],
        postFormData: {},
        formatData: {},
        pickerConfig: {},
        pickerName: '',
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
          this.drawForm = [];
          for (let item of this.drawing) {
            if (item.picker === this.popup) {
              this.drawForm.push(item);
            }
          }
          this.formatData = this.jsonClone(this.formData);
        }
      },
      postData: {
        handler(val, oldVal) {
          this.postFormData = this.jsonClone(val);
        },
        immediate: true,
        deep: true,
      },
      pickers: {
        handler(val, oldVal) {
          this.pickerName = val.keyName;
          this.pickerConfig = this.jsonClone(val);
        },
        deep: true,
      },
    },
    computed: {},
    methods: {
      choosePicker(val, date) {
        // show date
        this.pickerName = val.keyName;
        if (val.status === 'dateSlot') {
          this.chooseTime(val, date);
          return;
        }
        // show picker
        this.pickerModule = true;
        this.pickerConfig = this.inputSelect(this.pickerConfig, val);
      },
      // 日期选择
      chooseTime(val, date) {
        this.timeModule = true;
        this.formatData.dateKey = val.keyName;
        this.formatData.dateVal = date;
      },
      // 确认时间
      onConTime(val) {
        this.postFormData[val.dateKey] = val.dateVal;
        this.timeModule = false;
      },
      // 确认选择
      onConfirm(value, index) {
        if (!value.length) {
          this.$prompt('请选择或输入内容');
          return;
        }
        let picker = this.pickerConfig;
        let key = picker.keyName;
        if (picker.status.includes('arrs')) {
          if (key === 'house_type') {
            index[0] = index[0] + 1;
            this.postFormData[key] = index;
            this.formatData[key] = value.join('');
          } else if (key === 'floors') {
            let floor = value[0].split(' ')[1];
            let floors = value[1].split(' ')[1];
            this.postFormData.floor = Number(floor);
            this.postFormData.floors = Number(floors);
            this.formatData[key] = floor + ' / ' + floors;
          } else {
            this.postFormData[key] = index;
            this.formatData[key] = value.join('');
          }
        } else {
          switch (picker.status) {
            case 'obj':
              this.postFormData[key].id = picker.ids[index];
              this.postFormData[key].name = value;
              this.formatData[key] = value;
              break;
            case 'arr':
              this.postFormData[key] = picker.ids[index];
              break;
            case 'objInt':
              this.postFormData[key] = picker.ids[index];
              this.formatData[key] = value;
              break;
          }
        }
        this.formatData = Object.assign({}, this.formatData);
      },
      finishData() {
        this.$emit('close', this.postFormData, this.formatData);
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
