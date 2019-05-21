<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        :type="dateType"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "choose-time",
    props: ['module', 'formatData'],
    data() {
      return {
        minHour: 10,
        maxHour: 20,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value
        dateType: 'date',             //日期value
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.timeShow = val;
        this.dateType = this.formatData.dateType || 'date';
        this.chooseTime(this.formatData.dateVal);
      },
      timeShow(val) {
        if (!val) {
          this.$emit('close','close');
        }
      }
    },
    computed: {},
    methods: {
      // 获取当前日期
      getNowTime() {
        this.timeValue = '';
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        let hh = date.getHours();
        let mm = date.getMinutes();
        if (this.dateType === 'date') {
          this.currentDate = new Date(year, month, strDate);
          return;
        }
        this.currentDate = new Date(year, month, strDate, hh, mm);
      },
      // 日期初始化
      chooseTime(val) {
        if (!val) {
          this.getNowTime();
          return
        }
        this.timeValue = val;
        let date = val.split('-');
        let date1 = Number(date[1]) - 1;
        let date2 = date[2];
        let time = date2.split(' ');
        if (this.dateType === 'date') {
          this.currentDate = new Date(date[0], date1, Number(time[0]));
          return;
        }
        let mm = time[1].split(':');
        this.currentDate = new Date(date[0], date1, Number(time[0]), Number(mm[0]), Number(mm[1]));
      },
      // 确认日期
      onDate(val) {
        this.timeValue = this.myUtils.formatDate(val, this.dateType);
        this.timeShow = false;
        let data = {};
        data.dateVal = this.timeValue;
        data.dateIdx = this.formatData.dateIdx || '';
        data.dateKey = this.formatData.dateKey;
        this.$emit('close', data);
      },
      // select关闭
      onCancel() {
        this.timeShow = false;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
