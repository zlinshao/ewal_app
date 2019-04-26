<template>
  <div id="zl-input">
    <div class="zl-input">
      <div class="zl-input-form textarea" v-if="type === 'textarea'">
        <label class="labelTitle">{{label}}</label>
        <div class="textarea">
        <textarea
          :placeholder="placeholder"
          :value="value"
          :id="id"
          :disabled="disabled"
          :readonly="readonly"
          rows="3"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @input="$emit('input', $event.target.value)"></textarea>
        </div>
      </div>
      <div class="zl-input-form" v-else>
        <label class="labelTitle" v-if="label">{{label}}</label>
        <input
          v-if="readonly || disabled"
          unselectable="on"
          onfocus="this.blur()"
          ref="input"
          :value="value"
          :type="type"
          :id="id"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @input="$emit('input', $event.target.value)">
        <input
          v-else
          ref="input"
          :value="value"
          :type="type"
          :id="id"
          :placeholder="placeholder"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @input="$emit('input', $event.target.value)">
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "zl-input",
    props: ['type', 'value', 'placeholder', 'label', 'disabled', 'readonly','id'],
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #zl-input {
    .zl-input {
      min-height: .88rem;
      @include flex('items-bet');
      .zl-input-form {
        @include flex('items-center');
        height: 100%;
        width: 100%;
        div {
          width: 66%;
        }
        input {
          width: 100%;
          height: 80%;
          padding: 0 .24rem;
        }
      }
      .textarea {
        padding-top: .12rem;
        align-items: flex-start;
        label {
          padding-top: .2rem;
        }
        textarea {
          max-width: 100%;
          line-height: .4rem;
          margin: 0 .24rem;
          border: none;
          background-color: transparent;
        }
      }
      .unit {
        white-space: nowrap;
        padding: 0 .2rem;
      }
    }
  }
</style>
