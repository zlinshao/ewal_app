<template>
  <div id="checkChoose">
    <van-popup overlay-class="overlay-color" v-model="checksModule" position="bottom" :overlay="true"
               class="popupModule">
      <div class="popupTop">
        <p>请完成相关选项</p>
        <h3 @click="finish()">完成</h3>
      </div>
      <div class="radioChecks">
        <div v-for="item in checksList.checks">
          <p @click="checkChoose(item, checksChoose)" :class="{'chooseCheck': checksChoose.includes(item)}">
            {{item.text}}
          </p>
        </div>
      </div>
      <div class="otherFee" v-if="otherFreeStatus">
        <label>其他费用</label>
        <textarea
          placeholder="必填 请输入"
          v-model="forms.other_fee"
          rows="3">
        </textarea>
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
        otherFreeStatus: false,
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
          let idx;
          value.forEach((key, index) => {
            if (key.id === item.id) {
              idx = index
            }
          });
          if (idx || idx === 0) {
            value.splice(idx, 1);
          } else {
            value.push(item);
          }
        } else {
          value.push(item);
        }
        for (let key of value) {
          if (key.id === 6 || key.id === '6') {
            this.forms.other_fee = '';
            this.otherFreeStatus = true;
            return;
          }
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
    .otherFee {
      padding: 0 .3rem .3rem 0;
      @include flex();

      label {
        white-space: nowrap;
        padding: .06rem .3rem 0 .2rem;
      }

      textarea {
        border: none;
        width: 100%;
      }
    }
  }
</style>
