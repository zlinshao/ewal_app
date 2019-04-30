<template>
  <div id="house_image" class="scroll_bar" ref="mainContainer" :style="mainHeight">
    <div class="flex-center" v-for="item in image_list" :key="item.id">
      <div>
        <img @click="handleGetBigImg(item)" :src="item.uri" alt="" v-if="!item.uri.endsWith('mp4')">
        <video :src="item.uri" v-else controls webkit-playsinline="true" v-show="video_visible"></video>
        <b>{{ item.created_at || '/'}}</b>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        image_list: [],
        mainHeight: {
          height: 0
        },
      }
    },
    mounted() {
      var top = this.$refs['mainContainer'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      if (this.$route.query.image) {
        this.image_list = JSON.parse(this.$route.query.image);
      } else {
        this.image_list = [];
      }
      console.log(this.image_list);
    },
    watch: {},
    computed: {
      video_visible() {
        return this.$store.state.app.video_visible;
      },
    },
    methods: {
      //查看大图
      handleGetBigImg(item) {
        this.$store.dispatch('switch_video',false);
        this.$bigPhoto(this.image_list,item.uri);
      },
    },
  }
</script>

<style lang="scss" scoped>
  #house_image {
    border-top: .1rem solid #F2F2F2;
    > div {
      width: 50%;
      float: left;
      flex-wrap: wrap;
      > div {
        width: 100%;
        min-height: 3rem;
        box-shadow: 2px 2px 5px 2px #F2F2F2;
        margin: .1rem;
        border-radius: .1rem;
        padding: .1rem;
        img ,video{
          width: 100%;
          height: 2.5rem;
          border-radius: .1rem;
        }
        video {
          z-index: 1;
        }
        b {
          color: #9B9B9B;
          font-size: .25rem;
        }
      }
    }
  }
</style>
