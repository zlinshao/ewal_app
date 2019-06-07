<template>
  <div>
    <van-popup overlay-class="overlay-color" v-model="popupModule" position="bottom" :overlay="true"
               class="popupModule">
      <div class="popupTop">
        <p>请完成相关填写</p>
        <h3 @click="finishData">完成</h3>
      </div>
      <div class="pickerInput">
        <div v-for="item in drawForm" class="items-bet">
          <picker-input
            v-for="(str,idx) in item.moreArray"
            :key="idx"
            v-model="postFormData[item.keyName][idx]"
            :type="item.type"
            :label="str.label"
            @input="listenInput(postFormData[item.keyName], item.keyName)"
            :placeholder="str.placeholder">
          </picker-input>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

  export default {
    name: "no-picker",
    props: ['module', 'drawing', 'postData', 'formData'],
    data() {
      return {
        popupModule: false,
        drawForm: [],
        postFormData: {},
        formatData: {},
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.popupModule = val;
      },
      popupModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
      drawing: {
        handler(val, oldVal) {
          this.drawForm = [];
          for (let item of val) {
            if (item.picker === 'noPicker') {
              this.drawForm.push(item);
            }
          }
        },
        immediate: true,
        deep: true,
      },
      postData: {
        handler(val, oldVal) {
          this.postFormData = this.jsonClone(val);
          this.formatData = this.jsonClone(this.formData);
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {},
    methods: {
      listenInput(val, key) {
        let show = this.jsonClone(val);
        show[0] = show[0] ? show[0] + '-' : '';
        show[1] = show[1] ? show[1] + '-' : '';
        show[2] = show[2] ? show[2] : '';
        this.formatData[key] = show.join('');
      },
      finishData() {
        this.$emit('close', this.postFormData, this.formatData);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .pickerInput {
    > div {
      width: 100%;
    }
  }
</style>
