<template>
  <div id="remarkTerms">
    <van-popup overlay-class="overlay-color" v-model="popupModule" position="bottom" :overlay="true">
      <div class="remarkTerms">
        <div class="top">
          <h1>请完成相关选项</h1>
          <p @click="onConfirm">完成</p>
        </div>
        <van-checkbox-group v-model="forms.remark_terms">
          <van-checkbox
            v-for="item in Object.keys(remark_terms)"
            :key="item"
            :name="item">
            {{remark_terms[item]}}
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "remark-terms",
    props: ['module', 'form', 'formData'],
    data() {
      return {
        popupModule: false,
        forms: {},
        formatData: {},
        remark_terms: dicties.remark_terms,
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        setTimeout(() => {
          this.popupModule = val;
        }, 300);
      },
      popupModule(val) {
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
    },
    computed: {},
    methods: {
      onConfirm() {
        let form = this.forms;
        let formatData = this.formatData;
        formatData.remark_terms = '';
        for (let item of form.remark_terms) {
          formatData.remark_terms += item + '、' + this.remark_terms[item]
        }
        this.$emit('close', form, formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  #remarkTerms {
    .remarkTerms {
      padding: .3rem .36rem .3rem .42rem;
      .top {
        @include flex('items-bet');
        padding: .1rem .1rem .5rem;
        h1 {
          color: #9B9B9B;
        }
        p {
          color: #4570FE;
        }
      }
    }
  }
</style>
