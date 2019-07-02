<template>
  <div id="adminDetail">
    <van-popup overlay-class="overlay-color" v-model="adminDetailModule" position="right" :overlay="true"
               class="adminDetail">
      <main>
        <header>

        </header>
        <div class="mainLog">
          <ul>
            <li v-for="item in 100">{{item}}</li>
          </ul>
        </div>
      </main>
      <footer>
        <ul>
          <li v-for="item of buttons" :class="item.route" @click="onOperates(item)">
            <span class="writingMode">{{item.title}}</span>
          </li>
        </ul>
      </footer>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "admin-detail",
    props: ['module', 'content'],
    data() {
      return {
        adminDetailModule: false,
        buttons: [
          {
            route: "comment",
            title: '评论',
          },
          {
            route: "refuse",
            title: '拒绝',
          },
          {
            route: "suspend",
            title: '暂缓',
          },
          {
            route: "deliver",
            title: '转交',
          },
          {
            route: "publish",
            title: '提交',
          },
        ]
      }
    },
    watch: {
      module(val) {
        this.adminDetailModule = val;
        this.$httpZll.getHistoryProcess('99b9e08c-9bf1-11e9-94ae-02420617522e').then(res => {

        })
      },
      adminDetailModule(val) {
        if (!val) {
          this.$emit('close');
        }
      },
      content(val) {
        console.log(val);
      }
    },
    methods: {
      onOperates(item) {
        console.log(item);
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/common.scss";

  @mixin detailImg($n) {
    @include bgImage('../../../assets/image/approvals/detail/' + $n + '.png');
  }

  #adminDetail {
    .adminDetail {
      left: 1rem;
      right: 0;
      height: 100%;
      @include flex('bet-column');

      main {
        height: 100%;
        @include scroll;

        header {

        }
      }

      footer {
        overflow: hidden;

        ul {
          padding: .3rem .3rem 0;
          @include flex('justify-around');

          li {
            height: 1.6rem;
            padding: .45rem .12rem 0;
            background-color: #4A74FE;
          }

          /*拒绝*/
          .refuse {
            @include detailImg('jujue');
          }

          /*暂缓 / 评论 / 转交*/
          .suspend, .comment, .deliver {
            color: #FFFFFF;
            @include detailImg('zanhuan');
          }

          /*通过*/
          .publish {
            color: #FFFFFF;
            @include detailImg('tongguo');
          }
        }
      }
    }
  }
</style>
