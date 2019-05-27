<template>
  <div id="approvalDetail">
    <div class="detailTop" ref="top">
      <div>
        <img :src="queryData.bulletin_staff_avatar" v-if="queryData.bulletin_staff_avatar" alt="">
        <img src="../../../assets/image/common/noHead.png" alt="" v-else>
        <span>{{queryData.bulletin_staff_name}}</span>
        <p class="ellipsis">{{queryData.bulletin_name}}</p>
      </div>
      <p class="ellipsis">
        <i></i>
        <span>耗时{{queryData.duration}}分钟</span>
      </p>
      <h1 v-if="topOperates.length">
        <i v-for="item in topOperates" :class="['icon-'+item.id]" @click="iconButton(item.id)"></i>
      </h1>
    </div>
    <div class="main" :style="mainHeight">
      <div class="detailInfo" @touchstart="tapStart" @touchmove="tapMove" @touchend="tapEnd">
        <div class="detailTitle">
          <i></i>
          <span class="writingMode">{{bulletinTitle[slither]}}</span>
        </div>
        <div class="detail">
          <div>
            <ul v-for="item in Object.keys(drawSlither)" :class="['slide' + slither]">
              <li v-for="key in Object.keys(drawSlither[item])">
                <div v-if="formatData[key]">
                  <h1>{{drawSlither[item][key]}}</h1>
                  <div>
                    <div v-if="Array.isArray(formatData[key])">
                      <span v-for="(val,idx) in formatData[key]" v-if="val.uri">
                        <!--图片-->
                        <img :src="val.uri" :alt="val.uri" v-if="val.info.ext.includes('image')"
                             @click="$bigPhoto(formatData[key],val.uri)">
                        <!--视频-->
                        <!--@click="videoPlay($event)" 播放事件-->
                        <img src="../../../assets/image/file/video.png" @click="videoPlay($event)"
                             v-else-if="val.info.ext.includes('video')" :alt="val.uri">
                        <!--其它类型-->
                        <img src="../../../assets/image/file/xls.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('xls')">
                        <img src="../../../assets/image/file/doc.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('doc')">
                        <img src="../../../assets/image/file/txt.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('text')">
                        <img src="../../../assets/image/file/pdf.png" :alt="val.uri"
                             v-else-if="val.info.ext.includes('pdf')">
                        <img src="../../../assets/image/file/file.png" :alt="val.uri" v-else>
                      </span>
                      <div v-else-if="val.period">
                        <h4 :class="[idx !== 0?'h4':'']">
                          {{val.begin_date}}至{{val.end_date}}<br>
                          {{val.pay_way}}：{{val.month_unit_price}}元
                        </h4>
                      </div>
                      <div v-else-if="val.card_id">
                        <h3 :class="[idx !== 0?'h3':'']" v-if="formatData[key].length > 1">附属房东{{idx+1}}</h3>
                        <h2>客户姓名：{{val.customer_name}}</h2>
                        <h2>性别：{{val.customer_sex}}</h2>
                        <h2>证件类型：{{val.card_type}}</h2>
                        <h2>证件号：{{val.card_id}}</h2>
                        <h2>联系方式：{{val.contact_way}}</h2>
                        <h2>联系电话：{{val.contact_phone}}</h2>
                      </div>
                    </div>
                    <span v-else>
                     {{formatData[key]}}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="operates">
        <p>
          <i v-for="(i,idx) in 4" :class="{'hover': idx === slither}"></i>
        </p>
        <div v-if="operates.variableName">
          <h1 v-for="item in operates.outcomeOptions" class="btn" :class="item.route || ''"
              @click="clickBtn(operates.variableName, item)">
            <span class="writingMode">{{item.title}}</span>
          </h1>
        </div>
      </div>
    </div>
    <!--视频播放-->
    <div id="videoId" :class="['video-' + phoneType()]" v-show="videoSrc !== ''">
      <video id="video" :src="videoSrc" muted controls autoplay></video>
      <div class="items-center close">
        <span class="flex-center" @click="videoPlay()">
          <img src="../../../assets/image/file/closeBtn.png" alt="">
        </span>
      </div>
    </div>
    <!--评论-->
    <van-popup v-model="commentPopup" class="commentPopup">
      <h1>评论</h1>
      <div>
        <div>
          <label>评论内容</label>
          <textarea placeholder="必填 请输入" v-model="commentForm.remark"></textarea>
        </div>
        <div v-for="item in commentUpload">
          <label style="padding-top: .2rem">{{item.text}}</label>
          <Upload :file="item" :close="!commentPopup" @success="getImgData"></Upload>
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="cancel('comment')">取消</p>
        <p class="btn ">确定</p>
      </div>
    </van-popup>
    <!--转交-->
    <van-popup v-model="deliverPopup" class="deliverPopup">
      <h1>转交</h1>
      <div>
        <div class="deliver">
          <label>转交人</label>
          <input placeholder="必填 请输入" v-model="staff_name" readonly
                 @focus="searchStaffModule = true"/>
        </div>
        <div>
          <label>转交原因</label>
          <textarea placeholder="必填 请输入" v-model="deliverForm.content"></textarea>
        </div>
        <div v-for="item in deliverUpload">
          <label style="padding-top: .2rem">{{item.text}}</label>
          <Upload :file="item" :close="!deliverPopup" @success="getImgData1"></Upload>
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="cancel('deliver')">取消</p>
        <p class="btn ">确定</p>
      </div>
    </van-popup>
    <!--历史审批流程-->
    <div class="records" @click="recordPopup = true"><p></p></div>
    <van-popup v-model="recordPopup" :overlay-style="{'background':'rgba(0,0,0,.4)'}"
               position="right" :overlay="true" class="recordPopup">
      <div class="content">
        <div class="contentMain">
          <div>
            <div v-for="item in 100">
              {{item}}
            </div>
          </div>
        </div>
        <div class="commonBtn">
          <p class="btn back" @click="cancel('record')">取消</p>
          <p class="btn ">确定</p>
        </div>
      </div>
    </van-popup>
    <!--选择人员-->
    <search-staff :module="searchStaffModule" @close="getStaffInfo"></search-staff>
  </div>
</template>

<script>
  import SearchStaff from '../../common/searchStaff.vue';

  export default {
    name: "detail",
    components: {SearchStaff},
    data() {
      return {
        bulletinTitle: [],
        startClientX: 0,
        endClientX: 0,
        slither: 0,
        allDetail: {},//详情数据
        queryData: {},//所有参数

        // 头部操作
        topOperates: [
          {id: '1'},
          {id: '2'},
          {id: '3'},
        ],

        mainHeight: '',
        operates: [],
        drawSlither: {},
        formatData: {},
        videoSrc: '',//视频
        recordPopup: false,//历史流程
        commentPopup: false,//评论
        deliverPopup: false,//转交

        commentForm: {
          remark: '',
          photo: [],
          house_video: [],
        },
        commentUpload: [
          {
            text: '图片',
            keyName: 'photo',
          }, {
            text: '附件',
            keyName: 'house_video',
          }
        ],

        staff_name: '',
        deliverForm: {
          staff_id: '',
          content: '',
          house_video: [],
        },
        deliverUpload: [
          {
            text: '房屋影像',
            keyName: 'house_video',
          }
        ],
        searchStaffModule: false,
      }
    },
    created() {
    },
    mounted() {
    },
    activated() {
      let top = this.$refs.top.offsetHeight;
      this.mainHeight = this.mainListHeight(top);
      let query = JSON.parse(sessionStorage.approvalDetail || '{}');
      this.queryData = query;
      this.getOperates(query);
      this.handleData(query);
      this.approvalDetail(query.bm_detail_request_url);
    },
    watch: {},
    computed: {
      tabs() {
        return this.$store.state.app.approvalTab;
      }
    },
    methods: {
      // 获取操作按钮
      getOperates(query) {
        console.log(this.tabs);
        this.operates = [];
        if (!query.outcome) return;
        if (typeof query.outcome === 'string') {
          this.operates = JSON.parse(query.outcome || '{}');
        } else {
          this.operates = query.outcome;
        }
        let btn = [
          {
            action: true,
            route: "postpone",
            title: "暂缓"
          },
          {
            action: true,
            route: "back",
            title: "取消"
          },
        ];
        for (let val of btn) {
          this.operates.outcomeOptions.push(val);
        }
      },
      // 头部操作按钮
      iconButton(num) {
        switch (num) {
          case '1':
            this.bulletinRouter(this.queryData.bulletin_type);
            break;
          case '2':
            this.commentPopup = true;
            break;
          case '3':
            this.deliverPopup = true;
            break;
        }
      },
      // 报备类型跳转
      bulletinRouter(type) {
        sessionStorage.setItem('bulletin_draft', JSON.stringify(this.queryData));
        switch (type) {
          case 'bulletin_collect_basic':
            sessionStorage.setItem('bulletin_type', JSON.stringify(bulletinRouterStatus.newCollect));
            this.routerLink('/collectReport', {revise: 'revise'});
            break;
          case'':
            break;
        }
      },
      // 同意 拒绝
      clickBtn(key = '', action = {}) {
        switch (action.route) {
          case'back'://取消
            this.$router.go(-1);
            break;
          case'postpone'://暂缓
            this.$httpZll.postponeTask(this.queryData.process_id, {action: 'suspend'}).then(_ => {
              this.$prompt('操作成功', 'success');
              setTimeout(_ => {
                this.$router.go(-1);
              }, 500);
            });
            break;
          default:
            let postData = {};
            postData.action = 'complete';
            postData.variables = [{
              name: key,
              value: action.action,
            }];
            this.$httpZll.finishBeforeTask(this.queryData.task_id, postData).then(_ => {
              this.$prompt('审核成功！', 'success');
              setTimeout(_ => {
                this.$router.go(-1);
              }, 500);
            });
            break;
        }
      },
      // touch 左右切换
      tapStart(event) {
        for (let item of event.touches) {
          this.startClientX = item.clientX;
          this.endClientX = item.clientX;
        }
      },
      tapMove(event) {
        for (let item of event.touches) {
          this.endClientX = item.clientX;
        }
      },
      tapEnd() {
        let start = this.startClientX;
        let end = this.endClientX;
        if (start - end > 66) {
          if (3 > this.slither > 0) {
            this.slither++;
          }
        }
        if (start - end < -66) {
          if (this.slither > 0) {
            this.slither--;
          }
        }
      },
      // 员工搜索
      getStaffInfo(val) {
        this.searchStaffModule = false;
        if (val !== 'close') {
          this.staff_name = val.staff_name;
          this.deliverForm.staff_id = val.staff_id;
        }
      },
      // 图片上传
      getImgData(val) {
        this.commentForm[val[0]] = val[1];
      },
      getImgData1(val) {
        this.deliverForm[val[0]] = val[1];
      },
      // 视频播放
      videoPlay(event = '') {
        if (event && event.target.alt.includes(globalConfig.domain)) {
          this.videoSrc = event.target.alt;
        } else {
          this.videoSrc = '';
          // alert('不支持的视频文件！');
        }
      },
      // 展示数据字段
      handleData(query) {
        this.slither = 0;
        let bulletinData = this.$bulletinType(query.bulletin_type);
        this.bulletinTitle = bulletinData.title;
        this.drawSlither = this.jsonClone(bulletinData.data);
        let data = this.drawSlither;
        let obj = {};
        for (let val of Object.keys(data)) {
          obj[val] = {};
          for (let item of data[val]) {
            if (item.picker === 'upload') {
              for (let pic of item.photos) {
                obj[val][pic.keyName] = pic.label;
              }
            } else {
              if (item.keyName) {
                obj[val][item.keyName] = item.label;
              }
            }
          }
        }
        this.drawSlither = obj;
      },
      // 获取详情数据
      approvalDetail(url) {
        this.formatData = {};
        this.$httpZll.getApprovalDetail(url).then(res => {
          if (res) {
            this.allDetail = this.jsonClone(res.data);
            this.allDetail.task_id = this.queryData.task_id;
            this.allDetail.process_instance_id = this.queryData.process_id;
            this.allDetail.variableName = this.operates.variableName;
            this.formatData = res.data.content;
            this.handleDetail(res.data.content)
          }
        })
      },
      // 数据转换文本
      handleDetail(res) {
        for (let item of Object.keys(res)) {
          this.formatData[item] = res[item] || this.formatData[item];
          switch (item) {
            case 'door_address'://门牌地址
              let door = this.jsonClone(res[item]);
              door[0] = door[0] ? door[0] + '栋' : '';
              door[1] = door[1] ? door[1] + '单元' : '';
              door[2] = door[2] ? door[2] : '';
              this.formatData[item] = door.join('');
              break;
            case 'community':
              this.formatData[item] = res[item].village_name;
              break;
            case 'house_type'://户型
              let house = this.jsonClone(res[item]);
              house[0] = house[0] ? house[0] + '室' : '';
              house[1] = house[1] ? house[1] + '厅' : '';
              house[2] = house[2] ? house[2] + '卫' : '';
              this.formatData[item] = house.join('');
              break;
            case 'decorate'://装修
            case 'property_type'://房屋类型
            case 'direction'://朝向
              this.formatData[item] = res[item].name;
              break;
            case 'floors':
              this.formatData.floors = res.floor + ' / ' + res.floors;
              break;
            case 'holding_documents_type'://持有证件
            case 'lock_type'://门锁类型
            case 'bed'://床和床垫的情况
            case 'wardrobe'://衣柜情况
            case 'curtain'://窗帘情况
            case 'is_fill'://家电是否补齐
            case 'is_lord_fill'://房东是否补齐
            case 'has_heater'://是否有暖气
            case 'has_gas'://是否有天然气
            case 'customer_sex'://性别
            case 'card_type'://证件类型
            case 'contact_way'://联系方式
            case 'is_elevator'://是否有电梯
            case 'is_clean'://卫生情况
            case 'is_agency'://是否渠道
            case 'is_electronic_contract'://是否电子合同
            case 'can_decorate'://可否装修
            case 'can_add_goods'://可否添加物品
            case 'signatory_identity'://签约人身份
            case 'position'://所属区域
              let num = this.myUtils.isNum(res[item]) ? Number(res[item]) : (res[item] || '');
              this.formatData[item] = dicties[item][num];
              break;
            case 'non_landlord_fee'://非房东费用
              let names = [];
              for (let name of this.formatData[item]) {
                names.push(dicties[item][name])
              }
              this.formatData[item] = names.join(',');
              break;
            case 'remark_terms'://备注条款
              let terms = [];
              for (let name of res[item]) {
                terms.push(name + '、' + dicties[item][name]);
              }
              this.formatData[item] = terms.join(',');
              break;
            case 'subsidiary_customer'://附属房东
              if (res[item]) {
                let customer = ['customer_sex', 'card_type', 'contact_way'];
                this.formatData = this.changeHandle(res, item, customer, this.drawSlither, this.formatData);
              }
              break;
            case 'period_price_way_arr'://付款方式变化
              let pay_way = ['pay_way'];
              this.formatData = this.changeHandle(res, item, pay_way, this.drawSlither, this.formatData);
              break;
          }
        }
        if (res.album) {
          for (let pic of Object.keys(res.album)) {
            this.formatData[pic] = res.album[pic];
          }
        }
      },
      // 变化数据 预填数据处理
      changeHandle(res, item, val, all, data) {
        let formatData = data;
        for (let slither of Object.keys(all)) {
          for (let list of Object.keys(all[slither])) {
            if (all[slither][list].keyName === item) {
              for (let i = 1; i < res[item].length; i++) {
                all[slither][list].children.push(all[slither][list].children[0]);
              }
            }
          }
        }
        formatData[item] = this.jsonClone(res[item]);
        res[item].forEach((key, idx) => {
          for (let key of val) {
            formatData[item][idx][key] = dicties[key][res[item][idx][key]];
          }
        });
        return formatData;
      },
      // 取消
      cancel(val) {
        switch (val) {
          case 'comment':
            this.commentForm.remark = '';
            this.commentPopup = false;
            break;
          case 'record':
            this.recordPopup = false;
            break;
          case 'deliver':
            this.deliverPopup = false;
            break;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/common.scss";

  @mixin detailImg($n) {
    @include bgImage('../../../assets/image/approvals/detail/' + $n + '.png');
  }

  #approvalDetail {
    background-color: #f8f8f8;
    /*&:before {*/
    /*content: '';*/
    /*display: table;*/
    /*}*/
    /*头部*/
    .detailTop {
      position: relative;
      color: #FFFFFF;
      @include flex('items-bet');
      margin: 0 .3rem;
      padding: .3rem .3rem .8rem;
      background-color: #4570FE;
      @include radius(.1rem .1rem 0 0);
      z-index: 3;

      div {
        @include flex('items-center');

        img {
          width: .6rem;
          height: .6rem;
          @include radius(50%);
        }

        span {
          margin: 0 .2rem 0 .1rem;
        }

        p {
          font-size: .22rem;
          padding: .12rem .3rem;
          @include radius(1rem);
          background-color: #43A046;
        }
      }

      p {
        @include flex('items-center');

        i {
          width: .3rem;
          height: .3rem;
          margin-right: .06rem;
          @include detailImg('xiaohaoshijian');
        }
      }

      h1 {
        position: absolute;
        bottom: -.4rem;
        right: 0;
        @include flex('items-center');

        i {
          width: .8rem;
          height: .8rem;
          margin-right: .3rem;
          @include radius(50%);
        }

        .icon-1 {
          @include detailImg('bianji');
        }

        .icon-2 {
          @include detailImg('pinglun');
        }

        .icon-3 {
          @include detailImg('zhuanfa');
        }
      }
    }

    /*详情*/
    .main {
      background-color: #FFFFFF;
      @include boxShaw(0 -4px 10px 0 rgba(69, 112, 254, 0.2));
      @include flex('bet-column');

      .detailInfo {
        @include flex();
        height: 100%;
        padding: 1rem 0 .3rem;
        position: relative;

        .detailTitle {
          position: absolute;
          top: .5rem;
          left: .3rem;
          color: #4570FE;

          i {
            position: absolute;
            height: .5rem;
            border-left: 1px solid #448aff;
            top: -.5rem;
            left: .3rem;
          }

          span {
            background: rgba(69, 112, 254, .1);
            padding: .3rem .16rem;
            border-radius: 0 0 1rem 1rem
          }
        }

        .detail {
          width: 100%;
          height: 100%;

          > div {
            @include flex();
            width: 400%;
            height: 100%;

            ul {
              @include scroll;
              width: 100%;
              height: 100%;
              padding-left: .6rem;
              transition: transform .3s;

              li {
                > div {
                  @include flex();

                  h1, > div {
                    padding: .1rem .15rem;
                  }

                  h1 {
                    width: 36%;
                    color: #4A4A4A;
                    text-align: right;
                  }

                  > div {
                    width: 64%;
                    color: #000;

                    h3 {
                      color: #4A4A4A;
                      padding-bottom: .1rem;
                    }

                    .h3, .h4 {
                      padding-top: .2rem;
                    }

                    h2 {
                      padding-left: .3rem;
                    }

                    img {
                      width: 1rem;
                      height: 1rem;
                      margin: .1rem .1rem 0 0;
                      @include radius(.1rem);
                    }
                  }
                }
              }
            }
          }
        }

        .slide0 {
          @include transform(translateX(0));
        }

        .slide1 {
          @include transform(translateX(-100%));
        }

        .slide2 {
          @include transform(translateX(-200%));
        }

        .slide3 {
          @include transform(translateX(-300%));
        }
      }

      .operates {
        overflow: hidden;
        @include flex('bet-column');
        border-top: 1px dashed #C6CAD8;

        p {
          @include flex('flex-center');

          i {
            width: .16rem;
            height: .16rem;
            margin: .2rem .04rem;
            @include radius(50%);
            background-color: #D8D8D8;
          }

          .hover {
            background-color: #448aff;
            @include radius(1rem);
            width: .3rem;
          }
        }

        div {
          height: 2.6rem;
          padding: 0 .8rem;
          margin-bottom: -.6rem;
          @include flex('justify-around');
          justify-items: flex-end;
          flex-direction: row-reverse;

          .btn {
            width: .7rem;
            padding-bottom: .6rem;
            @include flex('flex-center');
          }

          /*取消*/
          .back {
            @include detailImg('quxiao');
          }

          /*拒绝*/
          .refuse {
            @include detailImg('jujue');
          }

          /*暂缓*/
          .postpone {
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

    /*流程详情*/
    .records {
      position: fixed;
      bottom: 3rem;
      right: -.8rem;
      width: 1.6rem;
      height: 1.6rem;
      @include radius(50%);
      background: rgba(69, 112, 254, .9);
      @include flex('items-center');
      padding-left: .24rem;

      p {
        width: .42rem;
        height: .42rem;
        @include detailImg('shenhejilu');
      }
    }

    .recordPopup {
      height: 100%;
      left: 1rem;
      background-color: #FFFFFF;

      .content {
        height: 100%;
        @include flex('bet-column');

        .contentMain {
          height: 100%;
          padding: .3rem 0;
          @include flex();

          > div {
            width: 100%;
            height: 100%;
            @include scroll;
          }
        }

        .commonBtn {
          padding: .36rem;
          border-top: 1px solid rgba(216, 216, 216, .5);;
        }
      }
    }

    /*评论弹窗===转交弹窗*/
    .commentPopup, .deliverPopup {
      padding: .42rem .3rem .3rem;
      @include radius(.1rem);
      @include flex('bet-column');

      h1 {
        font-size: .33rem;
        padding-bottom: .4rem;
      }

      > div {
        @include scroll;
        max-height: 6rem;

        div {
          @include flex();
          min-height: .88rem;

          label {
            min-width: 1.3rem;
            max-width: 1.3rem;
            text-align: right;
            margin-right: .3rem;
            white-space: nowrap;
          }

          input {
            padding-right: .3rem;
          }

          textarea {
            border: none;
          }
        }

        .deliver {
          @include flex('items-center');
          margin-bottom: .24rem;
        }
      }

      .commonBtn {
        padding: .8rem .1rem .2rem;
      }
    }
  }
</style>
