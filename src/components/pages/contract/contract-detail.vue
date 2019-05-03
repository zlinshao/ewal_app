<template>
  <div id="contract-detail">
    <header class="flex-center">
      <span
        v-for="tmp in header_filter" :key="tmp.id"
        :class="{'is-active': tmp.id === current_tab}"
        @click="handleTabClick(tmp)"
      >{{ tmp.title }}</span>
    </header>
    <div class="main-container scroll_bar" ref="mainContainer" :style="mainHeight">
      <div v-if="current_tab === 4">
        <div class="pic-content" v-if="contract_detail.album">
          <div v-for="(item,index) in contract_detail.album" class="flex">
            <a>{{ other_pictures[index] }}</a>
            <p class="flex">
              <img :src="tmp.uri" alt="" v-for="tmp in item" v-if="tmp.uri" @click="handleLookBigPic(item,tmp.uri)">
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        header_filter: [
          {id: 1, title: '合同详情'},
          {id: 2, title: '合同附件'},
          {id: 3, title: '电子收据'},
          {id: 4, title: '其他附件'},
        ],
        current_tab: 4,
        mainHeight: {
          height: 0
        },
        contract_detail: '',
        //附件信息
        other_pictures: {
          identity_photo: '证件照片',
          bank_photo: '银行卡照片',
          photo: '合同照片',
          water_photo: '水表照片',
          electricity_photo: '电表照片',
          electricity_card_photo: '电卡照片',
          gas_photo: '气表照片',
          gas_card_photo: '气卡照片',
          checkin_photo: '交接单照片',
          auth_photo: '委托书照片',
          deposit_photo: '押金照片',
          promise: '承诺书照片',
          other_photo: '补充照片',
          checkout_photo: '退租交接单照片',
          checkout_settle_photo: '退租结算照片',
          water_card_photo: '水卡照片',
          property_photo: '物业照片'
        }
      }
    },
    mounted() {
      var top = this.$refs['mainContainer'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';

      this.$httpHs.getContractDetail(this.$route.query, '加载中...').then(res => {
        if (res.code === 200) {
          this.contract_detail = res.data;
          console.log(this.contract_detail);
        } else {
          this.$prompt('获取详情失败');
          return false;
        }
      })
    },
    watch: {},
    computed: {},
    methods: {
      //查看大图
      handleLookBigPic(tmp,uri) {
        this.$bigPhoto(tmp,uri);
      },
      //tab切换
      handleTabClick(tmp) {
        this.current_tab = tmp.id;
      },
    },
  }
</script>

<style lang="scss" scoped>
  #contract-detail {
    header {
      border-top: .05rem solid #F2F2F2;
      min-height: 1.2rem;
      span {
        width: 100%;
        text-align: center;
        color: #9B9B9B;
      }
      span.is-active {
        color: #4481FE;
      }
    }
    .main-container {
      background-color: #F2F2F2;
      padding: .2rem;
      .pic-content {
        padding: .2rem;
        background-color: white;
        border-radius: .2rem;
        div {
          margin-bottom: .2rem;
          a {
            min-width: 2.2rem;
            text-align: right;
            padding-right: .1rem;
            vertical-align: middle;
          }
          p {
            flex-wrap: wrap;
          }
          img {
            width: 50pt;
            height: 50pt;
            margin-bottom: .1rem;
            border-radius: .1rem;
            box-shadow: 2px 2px 1px 1px #9B9B9B;
            &:not(:last-child) {
              margin-right: 5pt;
            }
          }
        }
      }
    }
  }
</style>
