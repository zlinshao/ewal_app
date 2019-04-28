<template>
  <div id="expand-container" :style="myStyle" ref="expandContainer" @click.self="handleCloseExpand">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['offsetTop'],
    data() {
      return {
        myStyle: {
          height: 0,
          top: 0,
        },
      }
    },
    mounted() {},
    watch: {
      offsetTop(top) {
        console.log(top);
        if (top) {
          if (typeof top !== 'number') {
            return false;
          }
          this.myStyle.top = top + 'px';
          this.myStyle.height = window.innerHeight - top + 'px';
        } else {
          this.myStyle.height = 0;
        }
      },
    },
    computed: {},
    methods: {
      handleCloseExpand() {
        this.myStyle.height = 0;
        this.$emit('close');
      },
    },
  }
</script>

<style lang="scss" scoped>
  #expand-container {
    width: 100%;
    background-color: rgba(0,0,0,.3);
    position: absolute;
    left: 0;
    top: 133px;
    z-index: 99;
    transition: all ease .3s;
    overflow: hidden;
    > div {
      background-color: white;
      padding: .2rem .3rem .5rem .3rem;
      min-height: 150px;
    }
  }
</style>
