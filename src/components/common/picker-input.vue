<template>
  <div id="picker-input">
    <label>
      <div>{{label}}</div>
      <input
        v-if="readonly || disabled"
        unselectable="on"
        onfocus="this.blur()"
        ref="input"
        :value="value"
        :type="type"
        :disabled="disabled || false"
        :readonly="readonly || false"
        :placeholder="placeholder"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @input="$emit('input', $event.target.value)">
      <input
        v-else
        ref="input"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @input="$emit('input', $event.target.value)">
    </label>
  </div>
</template>

<script>
  export default {
    name: "picker-input",
    props: ['type', 'value', 'placeholder', 'label', 'disabled', 'readonly'],
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
  #picker-input {
    text-align: center;
    div {
      margin-bottom: .2rem;
    }
    input {
      color: #001A6E;
      width: 100%;
      padding: 0 .1rem;
      text-align: center;
    }
  }
</style>
