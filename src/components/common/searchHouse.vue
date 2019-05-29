<template>
  <div id="searchHouse">
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="searchModule" position="bottom"
               :overlay="true">
      <div class="searchModule" :style="mainListHeight(88)">
        <div class="popupTop">
          <p>请选择房屋</p>
          <h3></h3>
        </div>
        <div class="searchInput">
          <div class="input">
            <div>
              <input type="text" v-model="params.serach" @keyup.enter="onSearch" placeholder="输入房屋地址">
              <span v-if="params.serach" @click="params.serach = ''"></span>
            </div>
            <p v-if="params.serach" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!params.serach" @click="searchModule = false">取消</p>
          </div>
        </div>
        <div class="searchHouse">
          <ul v-if="searchList.length">
            <li v-for="item in searchList" @click="onConfirm(item)">
              <div class="img" v-if="item.album_photo.length">
                <img :src="item.album_photo[0].uri" v-if="item.album_photo[0].info.ext.includes('image')" alt="">
                <span v-else>
                  <img src="../../assets/image/file/upload.png" alt="">
                </span>
              </div>
              <div class="img" v-else>
                <span>
                  <img src="../../assets/image/file/upload.png" alt="">
                </span>
              </div>
              <div class="content">
                <h1>{{item.name}}</h1>
                <h2>
                  <span>{{item.area}}㎡</span><span>{{item.floor.this}}&nbsp;/&nbsp;{{item.floor.all}}</span><span>{{item.house_toward}}</span><span>{{item.decorate}}-{{item.house_identity}}</span>
                </h2>
                <h3>
                  <span class="span1">剩1年5个月12天</span>
                  <span class="span2">建议12月付</span>
                  <span class="span3">{{item.house_status_name}}</span>
                </h3>
                <div>
                  <h4>
                    <i></i>
                    <span>已空置{{item.warning_current_days || 0}}天</span>
                  </h4>
                  <h5>{{item.suggest_price}}元/月</h5>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-house",
    props: ['module', 'config'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        searchList: [],
        total: 0,
        params: {
          search: '',
          page: 1,
          limit: 20,
        },
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      'params.search'(val) {
        this.params.search = val.replace(/\s+/g, '');
        if (!this.params.search) this.close_();
      },
      module(val) {
        this.searchModule = val;
      },
      config(val) {
        console.log(val);
      },
      searchModule(val) {
        if (!val) {
          this.$emit('close', 'close');
        }
      },
    },
    computed: {},
    methods: {
      onSearch() {
        this.$httpZll.searchHouseList(this.params).then(res => {
          if (res) {
            this.searchList = res.data.data;
            this.total = res.data.all_count;
          }
        })
      },
      onConfirm(item) {
        let form = {};
        form.id = item.id;
        form.name = item.name;
        this.$emit('close', form, this.config);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #searchHouse {
    .searchHouse {
      @include scroll;
      height: 100%;
      padding: 0 .25rem;

      ul {
        h1, h2, h3, h4, h5, h6, span {
          font-size: .26rem;
          font-family: "Microsoft YaHei UI";
        }

        li {
          padding: 0;
          height: 2rem;
          margin-bottom: .3rem;
          @include flex();

          .img {
            margin-right: .3rem;
            min-width: 1.8rem;
            max-width: 1.8rem;

            span {
              display: inline-block;
              background-color: #c1c1c1;
              width: 100%;
              height: 100%;
              @include flex('flex-center');

              img {
                width: .6rem;
                height: .6rem;
              }
            }
          }

          .content {
            width: 100%;
            @include flex('bet-column');

            h1 {
              font-weight: bold;
              font-size: .3rem;
            }

            h2 {
              margin: .06rem 0 .1rem;

              span {
                border-left: 1px dashed #797982;
                padding: 0 .2rem;
                font-size: .24rem;
                color: #797982;
              }

              span:first-of-type {
                border-left: none;
                padding-left: 0;
              }
            }

            h3 {
              @include flex('items-center');
              flex-wrap: wrap;

              span:last-of-type {
                margin-right: 0;
              }

              span {
                @include radius(.06rem);
                font-size: .2rem;
                margin-right: .1rem;
                white-space: nowrap;
                padding: .04rem .12rem;
              }

              .span1 {
                color: #797982;
                background-color: #F0F0F0;
              }

              .span2 {
                color: #4570FE;
                background-color: #ECF0FF;
              }

              .span3 {
                color: #FEB105;
                background-color: #FFF9E1;
              }
            }

            div {
              margin-top: .24rem;
              @include flex('items-bet');

              h4 {
                @include flex('items-center');

                i {
                  width: .3rem;
                  height: .3rem;
                  margin-right: .1rem;
                  background-color: #CF2E33;
                }

                span {
                  color: #797982;
                }
              }

              h5 {
                font-size: .28rem;
                color: #E53A36;
              }
            }
          }
        }
      }
    }
  }
</style>
