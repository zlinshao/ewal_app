<template>
  <div id="checkChoose">
    <van-popup overlay-class="overlay-color" v-model="checksModule" position="bottom" :overlay="true"
               class="popupModule">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finish()">完成</h3>
      </div>
      {{checksList.checks}}
      <div class="radioChecks">
        <div v-for="item in checksList.checks">
          <p @click="checkChoose(item, checksChoose)" :class="{'chooseCheck': checksChoose.includes(item)}">
            {{item.text}}
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "check-choose",
    props: ['module', 'list', 'form', 'formData'],
    data() {
      return {
        checksModule: false,
        checksList: [],
        checksChoose: [],
        forms: {},
        formatData: {},
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.checksModule = val;
      },
      checksModule(val) {
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
      list: {
        handler(val, oldVal) {
          this.checksList = val;
          this.checksChoose = [];
          for (let value of this.forms[val.keyName]) {
            for (let item of val.checks) {
              if (item.id === Number(value)) {
                this.checksChoose.push(item);
              }
            }
          }
        },
        deep: true,
      },
    },
    computed: {},
    methods: {
      // 复选
      checkChoose(item, value) {
        if (value.length) {
          value.forEach((key, index) => {
            if (key === item) {
              value.splice(index, 1);
            } else {
              value.push(item);
            }
          });
        } else {
          value.push(item);
        }
      },
      finish() {
        let name = this.checksList.keyName;
        let id = [];
        let names = [];
        for (let item of this.checksChoose) {
          id.push(item.id);
          names.push(item.text);
        }
        this.forms[name] = id;
        this.formatData[name] = names.join(',');
        this.$emit('close', this.forms, this.formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #checkChoose {

  }
</style>
