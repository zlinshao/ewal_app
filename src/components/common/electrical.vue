<template>
  <div>
    <!--家电-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.4)'}" v-model="electricalModule"
               position="bottom" :overlay="true" class="popupModule">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finish()">完成</h3>
      </div>
      <div class="electricalList">
        <div v-for="item in electricalList">
          <p @click="chooseListNum(item)" :class="{'choose': item.key === listNumber,'chooseCheck': item.status}">
            <span>{{item.label}}{{forms[item.key]}}</span>
          </p>
        </div>
      </div>
      <div class="electricalNum">
        <span v-for="(item,index) in 6" @click="chooseQuantity(index)" :class="{'choose': index === quantity}">
          {{index}}
        </span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "electrical",
    props: ['module', 'list', 'form'],
    data() {
      return {
        electricalModule: false,
        listNumber: '',           //当前选择家电 key
        quantity: '',             //选择数量
        forms: [],
        electricalList: [],
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.electricalModule = val;
      },
      electricalModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
      form: {
        handler(val, oldVal) {
          this.electricalList = this.list;
          for (let item of this.list) {
            this.forms[item.key] = val[item.key];
          }
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {},
    methods: {
      // 家电
      chooseListNum(item) {
        if (this.listNumber === item.key) return;
        this.listNumber = item.key;
        this.quantity = Number(this.forms[item.key]);
        item.status = 'choose';
      },
      // 家电 数量
      chooseQuantity(num) {
        let list = this.electricalList;
        list.forEach((item, index) => {
          if (item.key === this.listNumber) {
            this.quantity = num;
            list[index].num = num;
            this.forms[item.key] = num;
          }
        });
      },
      finish() {
        this.$emit('close', this.forms);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

</style>
