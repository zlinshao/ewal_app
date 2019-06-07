<template>
  <div id="approvalDetail">
    <div class="detailTop" ref="top">
      <div>
        <img :src="detailData.bulletin_staff_avatar" v-if="detailData.bulletin_staff_avatar" alt="">
        <img src="../../../assets/image/common/noHead.png" alt="" v-else>
        <span>{{detailData.bulletin_staff_name}}</span>
        <p class="ellipsis">{{detailData.bulletin_name}}</p>
      </div>
      <p class="ellipsis">
        <i></i>
        <span>耗时{{detailData.duration}}分钟</span>
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
        <div class="detail" :class="['transition' + allReportNum]">
          <div :style="{'width':bulletinTitle.length + '00%'}" :class="['slide' + slither]">
            <ul v-for="item in Object.keys(drawSlither)">
              <li v-for="key in Object.keys(drawSlither[item])">
                <div v-if="formatData[key]">
                  <h1>{{drawSlither[item][key]}}</h1>
                  <div v-if="Array.isArray(formatData[key])">
                    <div v-for="(val,idx) in formatData[key]">
                      <span v-if="val.uri">
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
                      <div v-else-if="val.money_sep">
                        <h4 :class="[idx !== 0?'h4':'']">
                          {{val.remittance_account + ':' + val.money_sep + '元'}}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <span v-else>{{formatData[key]}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="operates">
        <p>
          <i v-for="(i,idx) in allReportNum" :class="{'hover': idx === slither}" @click="slither = idx"></i>
        </p>
        <div v-if="operates.variableName">
          <div v-if="operates.status !== 'common'" class="detailBtn">
            <h1 v-for="item in operates.outcomeOptions" :class="item.route || ''"
                @click="clickBtn(item,operates.variableName)">
              <span class="writingMode">{{item.title}}</span>
            </h1>
          </div>
          <div v-else class="commonBtn">
            <p class="btn" :class="item.route" v-for="item in operates.outcomeOptions"
               @click="clickBtn(item,operates.variableName)">
              {{item.title}}
            </p>
          </div>
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
          <textarea placeholder="必填 请输入" v-model="commentForm.content.message"></textarea>
        </div>
        <div v-for="item in commentUpload">
          <label style="padding-top: .2rem">{{item.text}}</label>
          <Upload :file="item" :close="!commentPopup" @success="getImgData"></Upload>
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="cancel('comment')">取消</p>
        <p class="btn" @click="onComment">确定</p>
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
          <Upload :file="item" :close="!deliverPopup" @success="getImgDeliver"></Upload>
        </div>
      </div>
      <div class="commonBtn">
        <p class="btn back" @click="cancel('deliver')">取消</p>
        <p class="btn">确定</p>
      </div>
    </van-popup>
    <!--历史审批流程-->
    <div class="records" @click="recordPopup = true"><p></p></div>
    <van-popup v-model="recordPopup" overlay-class="overlay-color" position="right" :overlay="true" class="recordPopup">
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
          <p class="btn">确定</p>
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
        tabs: {},
        allReportNum: 0,//表单模块数
        bulletinTitle: [],
        startClientX: 0,
        endClientX: 0,
        slither: 0,
        allDetail: {},//详情数据
        detailData: {},//所有参数
        objInt: [],
        // 头部操作
        topOperates: [],

        mainHeight: '',
        operates: {},
        drawSlither: {},
        formatData: {},
        videoSrc: '',//视频
        recordPopup: false,//历史流程
        commentPopup: false,//评论
        deliverPopup: false,//转交

        commentForm: {
          author: 69,
          content: {
            message: '',
            attachments: []
          },
          saveProcessInstanceId: true,
        },
        commentUpload: [
          {
            text: '图片',
            keyName: 'attachments',
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
      let detail = JSON.parse(sessionStorage.approvalDetail || '{}');
      this.detailData = detail;
      this.tabs = this.$route.query;
      this.getOperates(detail, this.tabs);
      this.handleData(detail);
      this.approvalDetail(detail.bm_detail_request_url);
    },
    watch: {},
    computed: {},
    methods: {
      closeOperates() {
        this.topOperates = [];//头部按钮
        this.operates = {};//底部按钮
        this.operates.variableName = '';//底部按钮 点击状态
        this.operates.outcomeOptions = [];//底部按钮
      },
      // 获取操作按钮
      getOperates(detail, query) {
        this.closeOperates();
        let btn = [];
        let tab = Number(query.tab), status = Number(query.status);
        if (tab === 1) {//我审批
          if (status) {//已审批
            this.topOperates = [
              {id: '2'},
            ]
          } else {//待审批
            this.setOperates(detail.outcome);
            if (detail.bulletin_type === 'bulletin_retainage') {
              this.topOperates = [
                {id: '2'},
                {id: '3'},
              ]
            } else {
              this.topOperates = [
                {id: '1'},
                {id: '2'},
                {id: '3'},
              ]
            }
          }
        } else if (tab === 2) {//我发起的
          if (status) {
            if (status === 1) {//已完成
              this.topOperates = [
                {id: '2'},
              ]
            } else if (status === 2) {//合同修改

              for (let come of detail.outcome.outcomeOptions) {
                if (come.action === 'modify') {
                  btn.push(come);
                }
              }
              this.operates.variableName = detail.outcome.variableName;
              this.operates.status = 'common';
              this.generateButton(btn);
              this.topOperates = [
                {id: '4'},
                {id: '5'},
                {id: '6'},
              ]
            } else if (status === 3) {//待重签
              btn = [
                {
                  action: true,
                  route: "again",
                  title: "重新提交"
                },
              ];
              this.operates.variableName = 'zll';
              this.operates.status = 'common';
              this.generateButton(btn);
            }
          } else {//未完成
            btn = [
              {
                action: true,
                route: "urge",
                title: "催办"
              },
              {
                action: true,
                route: "cancel",
                title: "撤销"
              },
            ];
            this.operates.variableName = 'zll';
            this.generateButton(btn);
            if (detail.suspended) {
              this.topOperates = [
                {id: '1'},
                {id: '2'},
              ]
            } else {
              this.topOperates = [
                {id: '2'},
              ]
            }
          }
        } else if (tab === 3) {//抄送我的

        } else if (tab === 4) {//暂不处理
          this.setOperates(detail.taskInfo[0].outcome);
          if (detail.bulletin_type === 'bulletin_retainage') {
            this.topOperates = [
              {id: '2'},
              {id: '3'},
            ]
          } else {
            this.topOperates = [
              {id: '1'},
              {id: '2'},
              {id: '3'},
            ]
          }
        }
      },
      // 待重签
      getOperatesAgain(name) {
        let btn = [
          {
            action: true,
            route: "again",
            title: name
          },
        ];
        this.generateButton(btn);
      },
      // 生成操作按钮
      generateButton(btn) {
        for (let val of btn) {
          this.operates.outcomeOptions.push(val);
        }
        this.operates.outcomeOptions.push({
          action: true,
          route: "back",
          title: "取消"
        },)
      },

      // 待审批
      setOperates(outcome) {
        if (!outcome) return;
        if (typeof outcome === 'string') {
          this.operates = JSON.parse(outcome || '{}');
        } else {
          this.operates = outcome;
        }
        let btn = [];
        if (!this.detailData.suspended) {
          btn = [
            {
              action: true,
              route: "suspend",
              title: "暂缓"
            },
          ];
        }
        this.generateButton(btn);
      },
      // 头部操作按钮
      iconButton(num) {
        let detail = this.detailData;
        switch (num) {
          case '1':
            this.bulletinRouter(detail.bulletin_type);
            break;
          case '2':
            this.commentPopup = true;
            break;
          case '3':
            this.deliverPopup = true;
            break;
          case '4'://预览
          case '5'://本地签署
          case '6'://客户手机签署
            let outcome = detail.outcome;
            for (let item of outcome.outcomeOptions) {
              if (num === '4' && item.action === 'preview') {
                if (!detail.contract_view_url) {
                  this.$prompt('合同地址不存在！');
                  return;
                }
                this.$ddSkip(detail.contract_view_url);
              }
              if (num === '5' || num === '6') {
                let user_id, index;
                if (num === '5' && item.action === 'success') {
                  index = 2;
                }
                if (num === '6' && item.action === 'phone') {
                  index = 1;
                }
                user_id = this.$getFadadaUserId(detail);
                this.$handlerSign(detail, user_id, index).then(_ => {
                  this.$router.go(-1);
                });
              }
            }
            break;
        }
      },
      // 报备类型跳转
      bulletinRouter(type) {
        sessionStorage.setItem('task_detail', JSON.stringify(this.allDetail));
        sessionStorage.setItem('bulletin_type', JSON.stringify(bulletinRouterStatus[type]));
        this.routerLink('/collectReport', {revise: 'revise'});
      },
      // 同意 拒绝 催办 撤销
      clickBtn(action = {}, name = '') {
        let detail = this.detailData;
        let msg = {suspend: '暂缓', urge: '催办', cancel: '撤销'};
        switch (action.route) {
          case'back'://取消
            this.$router.go(-1);
            break;
          case'suspend'://暂缓
          case'urge'://催办
          case'cancel'://撤销
            this.$httpZll.putActionTask(detail.process_id, {action: action.route}).then(_ => {
              this.$prompt((msg[action.route] + '成功'), 'success');
              if (action.route === 'suspend' || action.route === 'cancel') {
                setTimeout(_ => {
                  if (action.route === 'suspend') {
                    this.$store.dispatch('approval_tabs', {tab: '4'});
                  } else {
                    this.$store.dispatch('approval_tabs', {tab: '2', status: 3});
                  }
                  this.$router.go(-1);
                }, 500);
              }
            });
            break;
          case 'collectReport':
            this.$handleBulletinType(detail);
            this.$reviseContract(action, name, detail, 'replace');
            break;
          case 'again':
            this.$handleBulletinType(detail);
            this.againTaskDetail(detail).then(_ => {
              this.againDetailRequest(detail, 'again', 'replace');
            });
            break;
          default:
            let postData = {};
            postData.action = 'complete';
            postData.variables = [{
              name: name,
              value: action.action,
            }];
            this.$httpZll.finishBeforeTask(detail.task_id, postData).then(_ => {
              this.$prompt('审核成功！', 'success');
              setTimeout(_ => {
                if (this.tabs.tab === '4') {
                  this.$store.dispatch('approval_tabs', {tab: '1', status: 1});
                }
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
          if ((this.allReportNum - 1) > this.slither > 0) {
            this.slither++;
          }
        }
        if (start - end < -66) {
          if (this.slither > 0) {
            this.slither--;
          }
        }
      },
      // 评论
      onComment() {
        this.commentForm.content.message = this.commentForm.content.message.replace(/\s+/g, '');
        if (!this.commentForm.content.message) {
          this.$prompt('请填写评论内容');
          return;
        }
        this.$httpZll.setBulletinComment(this.commentForm, this.detailData.process_id).then(res => {
          this.cancel('comment');
          if (res.content && res.content.message) {
            this.$prompt('评论成功！', 'success');
          } else {
            this.$prompt('评论失败！', 'fail');
          }
        })
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
        this.commentForm.content[val[0]] = val[1];
      },
      getImgDeliver(val) {
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
      // 所有单选 picker
      objIntArray(data) {
        let arr = [];
        for (let item of Object.keys(data)) {
          for (let key of data[item]) {
            if (key.status === 'objInt') {
              arr.push(key.keyName);
            }
          }
        }
        return arr;
      },
      // 展示数据字段
      handleData(detail) {
        this.slither = 0;
        this.formatData = {};
        let bulletinData = this.$bulletinType(detail.bulletin_type, detail.pact_type);
        this.bulletinTitle = bulletinData.title;
        let data = this.jsonClone(bulletinData.data);
        this.objInt = this.objIntArray(bulletinData.data);
        this.allReportNum = Object.keys(data).length;
        let obj = {};
        for (let val of Object.keys(data)) {
          obj[val] = {};
          for (let item of data[val]) {
            if (item.picker === 'upload') {
              for (let pic of item.photos) {
                obj[val][pic.keyName] = pic.label;
              }
            } else if (item.showList) {
              obj[val][item.keyName] = item.label;
              for (let list of item.showList) {
                obj[val][list.keyName] = list.label;
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
        this.$httpZll.getApprovalDetail(url).then((res) => {
          if (res) {
            this.allDetail = this.jsonClone(res.data);
            this.allDetail.task_id = this.detailData.task_id;
            this.allDetail.process_instance_id = this.detailData.process_id;
            this.allDetail.variableName = this.operates.variableName;
            this.formatData = res.data.content;
            this.handleDetail(res.data.content);
          }
        })
      },
      // 数据转换文本
      handleDetail(res) {
        for (let item of Object.keys(res)) {
          switch (item) {
            case 'house_id':
              this.formatData.house_id = res.address;
              break;
            case 'door_address'://门牌地址
              let door = this.jsonClone(res[item]);
              door[0] = door[0] ? door[0] + '-' : '';
              door[1] = door[1] ? door[1] + '-' : '';
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
            case 'house_address':
              this.formatData[item] = res[item].name;
              break;
            case 'floors':
              this.formatData.floors = res.floor + ' / ' + res.floors;
              break;
            case 'month':
              if (res.day) {
                this.formatData.month = res.month + '个月' + res.day + '天';
              } else {
                this.formatData.month = res.month + '个月';
              }
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
                this.changeHandle(res, item, customer, this.drawSlither, this.formatData);
              }
              break;
            case 'period_price_way_arr'://付款方式变化
              let pay_way = ['pay_way'];
              this.changeHandle(res, item, pay_way, this.drawSlither, this.formatData);
              break;
            default:
              if (this.objInt.includes(item)) {
                let num = this.myUtils.isNum(res[item]) ? Number(res[item]) : (res[item] || '');
                this.formatData[item] = dicties[item][num];
              }
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
        for (let slither of Object.keys(all)) {
          for (let list of Object.keys(all[slither])) {
            if (all[slither][list].keyName === item) {
              for (let i = 1; i < res[item].length; i++) {
                all[slither][list].children.push(all[slither][list].children[0]);
              }
            }
          }
        }
        data[item] = this.jsonClone(res[item]);
        res[item].forEach((key, idx) => {
          for (let key of val) {
            data[item][idx][key] = dicties[key][res[item][idx][key]];
          }
        });
      },
      // 取消
      cancel(val) {
        switch (val) {
          case 'comment':
            this.commentForm.content = {
              message: '',
              attachments: [],
            };
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

  /*滑动表单过渡效果*/
  @mixin slides($n) {
    $num: 100% / $n;
    @for $i from 1 through $n {
      .transition#{$n} {
        .slide#{$i} {
          @include transform(translateX(-($num*$i)));
        }
      }
    }
  }

  #approvalDetail {
    background-color: #f8f8f8;
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

        .icon-4 {
          @include detailImg('detaihetongyulan');
        }

        .icon-5 {
          @include detailImg('bendiqianshu');
        }

        .icon-6 {
          @include detailImg('kehushoujiqianshu');
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
            height: 100%;
            transition: transform .3s;

            ul {
              @include scroll;
              width: 100%;
              height: 100%;
              padding-left: .6rem;

              li {

                h1 {
                  min-width: 38%;
                  max-width: 38%;
                  color: #4A4A4A;
                  text-align: right;
                  padding-right: .36rem;
                }

                > div {
                  @include flex();
                  padding: .1rem .2rem .1rem 0;

                  > div {
                    @include flex();
                    flex-wrap: wrap;
                    width: 64%;
                    color: #000;

                    h3 {
                      color: #4A4A4A;
                      padding-bottom: .1rem;
                    }

                    .h3, .h4 {
                      padding-top: .2rem;
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

        @include slides(2);
        @include slides(3);
        @include slides(4);
        @include slides(5);
        @include slides(6);
        @include slides(7);
        @include slides(8);
        @include slides(9);
        @include slides(10);
      }

      .operates {
        overflow: hidden;
        @include flex('bet-column');
        border-top: 1px dashed #C6CAD8;

        > p {
          @include flex('flex-center');
          padding: .3rem 0;

          i {
            width: .16rem;
            height: .16rem;
            margin: 0 .06rem;
            @include radius(50%);
            background-color: #D8D8D8;
          }

          .hover {
            background-color: #448aff;
            @include radius(1rem);
            width: .3rem;
          }
        }

        .detailBtn {
          height: 2.4rem;
          margin-bottom: -.6rem;
          padding: 0 .8rem;
          @include flex('justify-around');
          justify-items: flex-end;
          flex-direction: row-reverse;

          h1 {
            padding-bottom: .8rem;
            width: .7rem;
            @include flex('flex-center');
          }

          /*取消*/
          .back {
            @include detailImg('quxiao');
          }

          /*拒绝*/
          .refuse, .cancel {
            @include detailImg('jujue');
          }

          /*暂缓*/
          .suspend {
            color: #FFFFFF;
            @include detailImg('zanhuan');
          }

          /*通过*/
          .publish, .urge {
            color: #FFFFFF;
            @include detailImg('tongguo');
          }
        }

        .commonBtn {
          flex-direction: row-reverse;
          padding: 0 .3rem .6rem;
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
