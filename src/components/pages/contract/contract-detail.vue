<template>
  <div id="contract-detail">
    <header class="flex-center">
      <span
        v-for="tmp in header_filter" :key="tmp.id"
        :class="{'is-active': tmp.id === current_tab}"
        @click="handleTabClick(tmp)"
      >{{ tmp.title }}</span>
    </header>
    <div class="main-container scroll_bar" ref="main-container" :style="mainHeight">
      <div class="detail_content">
        <div  v-if="current_tab === 1">
          合同详情
        </div>
        <div  v-if="current_tab === 2">
          合同附件
        </div>
        <div  v-if="current_tab === 3">
          电子收据
        </div>
        <div  v-if="current_tab === 4">
          <div v-for="(item,index) in  other_pictures" class="pic_li" >
            <span class="pic_label">{{item}}</span>
            <span class="pic_imgs"  v-if="ablumArr && ablumArr[index]">
              <img :src="tmp.uri" v-for="(tmp,i) in ablumArr[index]"  v-if="tmp.uri" @click="handleLookBigPic(ablumArr[index],tmp.uri)">
            </span>
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
        contract_detail: '', //详情数据
        //其他附件
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
        },
        ablumArr:[],//其他附件的详情数据
      }
    },
    mounted() {},
    activated(){
      let top = this.$refs['main-container'].offsetTop;
      this.mainHeight.height = window.innerHeight - top + 'px';
      let param=this.$route.query; //路由传参，调详情接口
      this.ContractDetail(param);
    },
    deactivated(){
      this.ablumArr=[];   //其他附件
    },
    watch: {
    },
    computed: {},
    methods: {
      //详情接口
      ContractDetail(param) {
        this.$httpHs.getContractDetail(param, '加载中...').then(res => {
          if (res.code === 200) {
            this.contract_detail = res.data;
            this.ablumArr=this.contract_detail.album;  //其他附件
            //处理图片路径
            if(this.ablumArr){
              this.getAlbumUrl(this.ablumArr);
            }
          } else {
            this.$prompt('获取详情失败');
            return false;
          }
        })
      },
      //图片id 转化成路径
      getAlbumUrl(obj){
        let arr=Object.keys(this.other_pictures);
        arr.forEach(item=>{
          if(obj[item]&&obj[item].length>0){
            this.$httpZll.getUploadUrl(obj[item],'' ,'prompt').then(res => {
              obj[item]=res.data;
            })
          }
        })
        return  obj;
      },
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
      .detail_content {
        padding: .2rem;
        background-color: white;
        border-radius: .2rem;
        min-height: 100%;
        //其他附件照片
        .pic_li{
           display: flex;
           justify-content: space-between;
           margin-bottom: .4rem;
          span{
            display: inline-block;
          }
          .pic_label{
            width: 2.8rem;
            text-align: right;
            padding-right: .35rem;
          }
          .pic_imgs{
            flex: 1;
            img{
              width: 1rem;
              height: 1rem;
              border-radius: 5px;
              margin-bottom: .1rem;
              border-radius: .1rem;
              box-shadow: 2px 2px 1px 1px #F2F2F2;
              &:not(:last-child) {
                margin-right: 5pt;
              }
            }
          }
        }
      }
    }
  }
</style>
