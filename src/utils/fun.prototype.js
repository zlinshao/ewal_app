import {ImagePreview, Dialog} from 'vant';
import PickerSlot from '../components/common/picker-slot.vue';
import ZlInput from '../components/common/zl-input.vue';
import PickerInput from '../components/common/picker-input.vue';
import ChooseTime from '../components/common/chooseTime.vue';
import Picker from '../components/common/picker.vue';
import Upload from '../components/common/upload.vue';
import FloatButton from '../components/common/floatButton.vue';
import ScrollLoad from '../components/common/scrollLoad'

export default {
  install(Vue, options) {
    // 全局组件
    Vue.component('picker', Picker);//正常picker
    Vue.component('picker-slot', PickerSlot);//带表单 弹出窗
    Vue.component('zl-input', ZlInput);//input 表单
    Vue.component('picker-input', PickerInput);//弹窗里 input 布局
    Vue.component('choose-time', ChooseTime);//时间选择
    Vue.component('Upload', Upload);//上传
    Vue.component('float-button', FloatButton);//可拖動唯一标识码
    Vue.component('scroll-load', ScrollLoad);//滚动条加载
    // 加入历史栈 跳转
    Vue.prototype.routerLink = function (url, data) {
      if (data) {
        this.$router.push({path: url, query: data});
      } else {
        this.$router.push(url);
      }
    };
    Vue.prototype.goToTop = function () {
      let mainContent = document.getElementById('mainContent');
      mainContent.scrollTop = 0;
    };
    // 关闭当前页面 跳转
    Vue.prototype.routerReplace = function (url, data) {
      if (data) {
        this.$router.replace({path: url, query: data});
      } else {
        this.$router.replace(url);
      }
    };
    // 钉钉 路由返回
    Vue.prototype.goBack = function (url = '/index', data) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url, query: data});
      });
      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess() {
          that.$router.push({path: url, query: data});
        },
      });
    };
    // 获取form个人信息
    Vue.prototype.getPersonal = function (form, data) {
      for (let key of Object.keys(data)) {
        form[key] = data[key];
      }
      return form;
    };
    // 容器高度 计算
    Vue.prototype.mainListHeight = function (remove = 0) {
      return {height: (Number(sessionStorage.windowHeight) - remove) + 'px'};
    };
    Vue.prototype.screenWidth = Number(sessionStorage.windowWidth);
    Vue.prototype.screenHeight = Number(sessionStorage.windowHeight);

    // 手机类型
    Vue.prototype.phoneType = function () {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        return 'android'
      }
      if (isIOS) {
        return 'ios'
      }
    };
    // 克隆数据/JSON数据转换
    Vue.prototype.jsonClone = function (val) {
      return JSON.parse(JSON.stringify(val));
    };
    // 复选
    Vue.prototype.checkChooseCommon = function (item, value) {
      if (value.length) {
        if (value.includes(item.id)) {
          let index = value.indexOf(item);
          value.splice(index, 1);
        } else {
          value.push(item.id);
        }
      } else {
        value.push(item.id);
      }
    };
    // 列表 数据重组
    Vue.prototype.groupHandlerListData = function (data, url) {
      let arr = [];
      for (let item of data) {
        let obj = {};
        for (let key of item.variables) {
          obj[key.name] = key.value;
          if (key.name === 'signer') {
            if (key.value && key.value.length > 12) {
              if (JSON.parse(key.value)) {
                obj.signer = JSON.parse(key.value);
              }
            }
          }
          if (key.name === 'finish_RWC') {
            obj.bookingBtn = [{
              icon: 'icon_zhuanjiao',
              title: '取消预定',
              action: 'lose',
            }]
          }
          if (key.name === 'due_date') {
            let date = this.myUtils.timeDifference(key.value);
            obj.due_date_hours = date.hours;
            obj.due_date_minutes = date.minutes;
          }
          if (key.name.includes('detail_request_url')) {
            if (key.name !== 'bm_detail_request_url') {
              obj.detail_request_url = key.value || '';
            } else {
              obj[key.name] = key.value || '';
            }
          }
          if (key.name === 'ewal_contract') {
            if (key.value) {
              if (key.value.startsWith('{')) {
                let contract = JSON.parse(key.value);
                if (contract.v3_contract_id) {
                  obj.contract_id = contract.v3_contract_id;
                }
                if (contract.house_id) {
                  obj.house_id = contract.house_id;
                }
              }
            }
          }
          if (key.name === 'outcome') {
            let outcome = '';
            let come = JSON.parse(key.value);
            outcome = come.variableName;
            obj.approvedName = outcome;
            for (let names of item.variables) {
              if (names.name === outcome) {
                obj.approvedStatus = names.value;
              }
            }
          } else if (key.name.includes('_approved') && !key.name.startsWith('bm_')) {
            obj.approvedStatus = key.value;
          }
        }
        for (let key of Object.keys(item)) {
          if (key !== 'variables') {
            obj[key] = item[key]
          }
        }
        if (url && url.includes('process-instances')) {
          obj.process_id = item.id;
          if (item.taskInfo && item.taskInfo.length) {
            obj.task_id = item.taskInfo[0].id;
          } else {
            obj.task_id = '';
          }
        } else {
          obj.task_id = item.id;
          obj.process_id = item.processInstanceId;
        }
        obj.status = item.status || [];
        obj.root_id = item.rootProcessInstanceId;
        obj.taskDefinitionKey = item.taskDefinitionKey;
        arr.push(obj);
      }
      return arr;
    };
    //自动获取用户IP，返回当前城市
    Vue.prototype.getBeforeCity = function (data = []) {
      let personal = this.$store.state.app.personalDetail;
      return new Promise((resolve, reject) => {
        let obj = {};
        obj.name = '';
        obj.city = [];
        obj.location = [];
        let mapObj = new AMap.Map('iCenter');
        //自动获取用户IP，返回当前城市
        mapObj.plugin('AMap.Geolocation', function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            showMarker: false,
            showButton: false,
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', function (res) {
            let address = res.addressComponent;
            obj.location[0] = res.position.lng;
            obj.location[1] = res.position.lat;
            for (let city of data) {
              if (address.city.includes(city.name)) {
                obj.code = city.code;
                obj.name = city.name;
              }
            }
            resolve(obj);
          });
          AMap.event.addListener(geolocation, 'error', function (err) {
            obj.code = personal.city_id;
            obj.name = personal.city_name;
            obj.location = personal.location;
            resolve(obj);
          });
        });
      })
    };
    // 提交字段认证是否为空
    Vue.prototype.$attestationKey = function (data) {
      for (let item of data) {
        if (item.keyName) {
          if (item.placeholder && item.placeholder.includes('必填')) {
            if ((!item.keyType) && item.keyType !== 0 && typeof item.keyType !== 'object') {
              if (this.form[item.keyName] === item.keyType) {
                this.$prompt(item.label + item.placeholder);
                return true
              }
            }
          }
        }
      }
      return false;
    };
    // 初始化数据
    Vue.prototype.initFormData = function (drawForm, showForm, noStaff) {
      let form = {};
      let album = {};//图片字段集合
      let formatData = this.jsonClone(showForm);//下拉框显示
      let value = [];//家电家具
      let show = {};
      for (let item of drawForm) {
        if (item.icon === 'identity') {
          formatData.identity = item.icon;
        }
        if (item.moreArray) {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = this.jsonClone(item.keyType);
          for (let arr of item.moreArray) {
            form[item.keyName].push(arr.keyType);
            formatData[item.keyName] = '';
          }
        } else if (item.moreString) {
          for (let str of item.moreString) {
            form[str.keyName] = str.keyType;
          }
        } else if (item.moreObject) {
          form[item.keyName] = item.keyType;
          for (let str of item.moreObject) {
            form[item.keyName][str.keyName] = str.keyType;
          }
        } else if (item.showList) {
          show[item.keyName] = false;
          form[item.keyName] = item.keyType;
          for (let str of item.showList) {
            form[str.keyName] = str.keyType;
          }
        } else if (item.picker === 'upload') {
          for (let pic of item.photos) {
            form[pic.keyName] = [];
            album[pic.keyName] = [];
          }
        } else if (item.picker === 'album') {
          // 新建小区
          form[item.picker] = {};
          album[item.picker] = {};
          for (let pic of item.photos) {
            form[item.picker][pic.keyName] = [];
            album[item.picker][pic.keyName] = [];
          }
        } else if (item.lists) {
          // 家电家具
          value = item.lists;
          for (let val of item.lists) {
            form[val.key] = val.num;
          }
        } else if (item.checks) {
          // 非房东费用
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = '';
        } else if (item.children) {
          // 变化
          let obj = {};
          let child = [];
          for (let key of item.children) {
            for (let con of key) {
              obj[con.keyName] = con.keyType;
            }
          }
          child.push(obj);
          form[item.keyName] = child;
          formatData[item.keyName] = this.jsonClone(child);
        } else if (item.status === 'moreKeys') {
          // 楼层
          for (let key of Object.keys(item.moreKeys)) {
            form[key] = item.moreKeys[key];
          }
        } else if (item.picker === 'date') {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = item.keyType;
        } else {
          if (item.status === 'obj') {
            form[item.keyName] = {
              id: '',
              name: '',
            };
          } else if (item.status === 'arr') {
            form[item.keyName] = item.keyType;
            formatData[item.keyName] = item.keyType;
          } else if (item.keyName) {
            form[item.keyName] = item.keyType;
          }
        }
        if (item.showForm) {
          if (item.moreArray) {
            formatData[item.keyName] = '';
          } else if (item.status === 'objName') {
            form[item.keyName] = item.keyType;
            formatData[item.keyName] = '';
          } else {
            formatData[item.keyName] = item.keyType || '';
          }
          if (item.keyType && dicties[item.keyName]) {
            formatData[item.keyName] = dicties[item.keyName][Number(item.keyType)] || item.keyType;
          }
        } else if (item.picker === 'remark_terms') {
          // 租房备注条款默认全选
          let terms = [];
          for (let name of form[item.keyName]) {
            terms.push(name + '、' + dicties[item.keyName][name]);
          }
          formatData[item.keyName] = terms.join(',');
        }
      }
      if (!noStaff) {
        this.getPersonal(form, this.$store.state.app.personal);
      }
      return {form, formatData, value, album, show};
    };
    // 报备类型搜索 名单
    Vue.prototype.$taskDefinitionKey = function () {
      let search = [];
      for (let item of Object.keys(approvalSearch)) {
        for (let val of approvalSearch[item]) {
          search = search.concat(val);
        }
      }
      search = this.myUtils.arrayWeight(search).join(',');
      return search;
    };
    // 报备类型数据匹配
    Vue.prototype.$bulletinType = function (type, rwc = '') {
      console.log(type);
      let data = {}, title = [];
      switch (type) {
        case 'bulletin_collect_basic'://收房
          title = ['房屋信息', '物品信息', '客户信息', '合同信息'];
          data = this.jsonClone(defineCollectReport);
          break;
        case 'bulletin_collect_continued'://续收
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineContinueCollect);
          break;
        case 'bulletin_rent_basic'://租房
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineRentReport);
          data.slither0 = defineNewRentReport.concat(data.slither0);
          break;
        case 'bulletin_lose'://租房
          title = ['取消预定'];
          data = this.jsonClone(defineCancelBookingReport);
          break;
        case 'bulletin_rent_trans'://转租
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineRentReport);
          data.slither0 = defineSubletReport.concat(data.slither0);
          break;
        case 'bulletin_rent_continued'://续租
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineContinueRent);
          // data = this.jsonClone(defineRentReport);
          // data.slither0 = defineNewRentReport.concat(data.slither0);
          break;
        case 'bulletin_booking_renting'://预定
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineBookingBWCReport);
          data.slither0 = defineRentBookingReport.concat(data.slither0);
          break;
        case 'bulletin_rent_RWC'://未收先租
          title = ['合同信息', '客户信息'];
          if (rwc === 'bulletin_rent_RWC') {
            data = this.jsonClone(defineRentReport);
            data.slither0 = defineRentRWCReport.concat(data.slither0);
          } else {
            data = this.jsonClone(defineBookingBWCReport);
            data.slither0 = defineRentBWCReport.concat(data.slither0);
          }
          break;
        case 'bulletin_change'://调租
          title = ['合同信息', '客户信息'];
          data = this.jsonClone(defineChangeReport);
          break;
        case 'bulletin_agency'://渠道
          title = ['渠道费报备'];
          data = this.jsonClone(defineAgencyReport);
          break;
        case 'bulletin_retainage'://尾款
          title = ['尾款报备'];
          data = this.jsonClone(defineRetainageReport);
          break;
        case 'bulletin_special':
        case 'bulletin_special_rent'://特殊
        case 'bulletin_special_collect':
          title = ['特殊事项报备'];
          data = this.jsonClone(defineSpecialReport);
          break;
        case 'bulletin_checkout'://退租
        case 'bulletin_checkout_collect'://退租
        case 'bulletin_checkout_rent'://退租
          title = ['退租'];
          data = this.jsonClone(defineCheckoutReport);
          break;
        case 'Market-VillageExpand'://新增小区
          title = ['新增小区'];
          data = {};
          data.slither0 = this.jsonClone(defineNewAddVillage);
          break;
        case 'supplement_lord_time': //延长收房时长
        case 'supplement_lord_change_bank': //房东跟还银行卡
        case 'supplement_lord_change_price': //调整收房价格
        case 'supplement_renter_time': //租客延长租期
          data = {};
          title = ['补充协议'];
          switch (type) {
            case 'supplement_lord_time':
              data.slither0 = this.jsonClone(defineSupplyAgreement[1]);
              break;
            case 'supplement_lord_change_bank':
              data.slither0 = this.jsonClone(defineSupplyAgreement[2]);
              break;
            case 'supplement_lord_change_price':
              data.slither0 = this.jsonClone(defineSupplyAgreement[3]);
              break;
            case 'supplement_renter_time':
              data.slither0 = this.jsonClone(defineSupplyAgreement[4]);
              break;
          }
          break;
      }
      return {data, title}
    };
    // 图片id转换url
    Vue.prototype.$changeAlbum = function (album, data) {
      return new Promise((resolve, reject) => {
        let photo = this.jsonClone(data);
        for (let pic of Object.keys(album)) {
          if (album[pic].length) {
            if (typeof album[pic][0] !== 'object') {
              this.$httpZll.getUploadUrl(album[pic], 'close').then(res => {
                photo[pic] = res.data;
              })
            } else {
              photo[pic] = album[pic];
            }
          }
        }
        resolve(photo);
      });
    };
    // 预填数据处理
    Vue.prototype.$changeHandle = function (res, item, val, all, data, child) {
      for (let slither of Object.keys(all)) {
        for (let list of all[slither]) {
          if (list.keyName === item) {
            if (child) {
              child[item] = this.jsonClone(list.children[0]);
            }
            if (res[item]) {
              for (let i = 1; i < res[item].length; i++) {
                list.children.push(list.children[0]);
              }
            }
          }
        }
      }
      if (res[item]) {
        data[item] = this.jsonClone(res[item]);
        res[item].forEach((key, idx) => {
          for (let key of val) {
            data[item][idx][key] = dicties[key][res[item][idx][key]];
          }
        });
      }
    };
    // 下拉框 显示 重置
    Vue.prototype.$closePicker = function () {
      return new Promise((resolve, reject) => {
        let picker = {
          title: '',                        //picker标题
          type: '',                         //字典类型
          keyName: '',                      //字段名
          childKeys: [],                    //字段名
          parentKey: '',                    //父级 字段名 变化有picker
          columns: [],                      //下拉框选择文本列表
          ids: [],                          //当前字典所有id
          index: '',                        //变化下标
          controlShow: '',                  //控制显示隐藏
        };
        resolve(picker)
      })
    };
    // 下拉框数据显示 picker 配置
    Vue.prototype.inputSelect = function (val, num = '', parentKey = '') {
      return new Promise(resolve => {
        this.$closePicker().then(res => {
          let pickers = res;
          pickers.keyName = val.keyName;
          pickers.status = val.status;
          pickers.title = val.label;
          pickers.controlShow = val.controlShow || '';
          pickers.index = num;
          pickers.parentKey = parentKey || '';
          if (val.status.includes('column')) {
            let index = val.status.split('-');
            pickers.columns = [];
            for (let i = 0; i < index.length - 1; i++) {
              let obj = {};
              obj.values = dicties[val.keyName]['value_' + i];
              obj.className = 'column' + (i + 1);
              obj.defaultIndex = Number(index[i + 1]);
              pickers.columns.push(obj);
            }
          } else {
            if (val.status === 'arr') {
              pickers.columns = dicties[val.keyName];
            } else {
              if (dicties[val.keyName]) {
                pickers.columns = Object.values(dicties[val.keyName]);
                pickers.ids = Object.keys(dicties[val.keyName]);
              }
            }
          }
          resolve(pickers);
        });
      })
    };
    // 查看大图
    Vue.prototype.$bigPhoto = function (val, uri) {
      let images = [];
      if (val instanceof Array) {
        for (let item of val) {
          if (item.info && item.info.mime) {
            if (item.info.mime.includes('image')) {
              images.push(item.uri);
            }
          } else {
            if (item.mime.includes('image')) {
              images.push(item.uri);
            }
          }
        }
      } else {
        for (let key of Object.keys(val)) {
          images.push(val[key].uri);
        }
      }
      let index = images.indexOf(uri);
      let that = this;
      ImagePreview({
        images: images,
        startPosition: index,
        onClose() {
          that.$store.dispatch('switch_video', true);
        }
      });
    };
    // loading/Toast 提示信息
    Vue.prototype.$prompt = function (msg, type) {
      this.myUtils.prompt(msg, type);
    };
    // 签署电子合同
    Vue.prototype.$signPostApi = function (item, params, title = []) {
      return new Promise((resolve, reject) => {
        let url = '', sign = {};
        switch (item.bulletin_type) {
          case 'bulletin_collect_basic':
          case 'bulletin_collect_continued':
            url = 'sign_collect';
            break;
          case 'bulletin_rent_basic':
          case 'bulletin_rent_trans':
          case 'bulletin_rent_continued':
          case 'bulletin_change':
            url = 'sign_rent';
        }
        sign = {
          task_id: item.task_id,
          contract_id: item.contract_number,
        };
        for (let key of Object.keys(params)) {
          sign[key] = params[key]
        }
        this.$dialog(title[0], title[1]).then(data => {
          if (data) {
            this.$httpZll.localSignContract(url, sign).then(res => {
              if (Number(sign.type) === 2) {
                console.log(res)
                resolve(res.data.data)
              } else {
                this.$prompt('发送成功!', 'success');
              }
            })
          }
        });
      })
    };
    // 签署电子合同
    Vue.prototype.$handlerSign = function (item, user_id, type, name = '') {
      return new Promise((resolve, reject) => {
        let title = ['电子合同', ''];
        let params = {
          customer_id: user_id,
          type: type,
          index: 1,
        };
        title[1] = type === 2 ? `客户姓名：${name}<br>是否确认签署电子合同?` : `客户姓名：${name}<br>是否确认发送客户签署电子合同?`;
        this.$signPostApi(item, params, title).then(res => {
          if (res) {
            this.$ddSkip(res);
            this.$dialog('签署', '签署是否完成?').then(res => {
              this.$prompt('正在处理..', 'send');
              setTimeout(_ => {
                resolve('success');
              }, 2000)
            })
          }
        });
      });
    };
    // 获取fadadaId
    Vue.prototype.$getFadadaUserId = function (item) {
      return item.signer && item.signer.fadada_user_id || this.$prompt('用户ID不存在！');

    };
    // 报备类型
    Vue.prototype.$handleBulletinType = function (item) {
      sessionStorage.setItem('bulletin_type', JSON.stringify(bulletinRouterStatus[item.bulletin_type]));
    };
    // 修改合同
    Vue.prototype.$reviseContract = function (action = {}, name = '', item, replace = '') {
      this.$dialog('合同修改', '此操作将重新发起报备和审批，并结束该签署任务，且无法恢复，是否继续?').then(res => {
        if (res) {
          let postData = {};
          if (item.bulletin_type === 'bulletin_rent_basic') {
            postData.action = 'complete_multi';
          } else {
            postData.action = 'complete';
          }
          postData.variables = [{
            name: name,
            value: action.action,
          }];
          this.$httpZll.finishBeforeTask(item.task_id, postData).then(res => {
            if (res) {
              if (action.action === 'success') {
                this.$prompt('签署成功！');
                this.routerLink(action.route);
              } else {
                this.$getTaskList(item, 'InputBulletinData').then(res => {
                  if (res) {
                    this.againTaskDetail(res).then(_ => {
                      this.againDetailRequest(res, 'again', replace);
                    });
                  }
                });
              }
            }
          });
        }
      });
    };
    // 报备详情
    Vue.prototype.againDetailRequest = function (val, again, replace) {
      this.$httpZll.get(val.bm_detail_request_url, {}, 'prompt').then(res => {
        if (res.data.success) {
          let data = {};
          data.content = res.data.data.content;
          data.task_id = val.task_id;
          data.house_id = val.house_id;
          data.contract_id = val.contract_id || '';
          data.bulletin = val.bulletin_type;
          data.process_instance_id = val.process_id;
          data.completion_amount = val.completion_amount;
          if (val.bulletin_type.includes('bulletin_checkout')) {
            this.routerLink('/collectReport');
          } else {
            if (replace) {
              this.routerReplace(val.task_action, {again: again});
            } else {
              this.routerLink(val.task_action, {again: again});
            }
          }
          let type = '', key = val.taskDefinitionKey;
          if (key === 'BulletinAgency') {
            type = 'bulletin_agency'
          } else if (key === 'RentRetainage') {
            type = 'bulletin_retainage'
          } else {
            type = val.bulletin_type;
          }
          let bulletin = bulletinRouterStatus[type];
          sessionStorage.setItem('bulletin_type', JSON.stringify(bulletin));
          sessionStorage.setItem('task_detail', JSON.stringify(data));
        } else {
          this.$prompt(res.data.message);
        }
      });
    };
    // 获取任务列表
    Vue.prototype.$getTaskList = function (item, status) {
      return new Promise((resolve, reject) => {
        let params = {};
        if (status) {
          params = {
            taskDefinitionKey: status,
            rootProcessInstanceId: item.root_id,
          }
        } else {
          params = {
            rootProcessInstanceId: item.root_id,
          }
        }
        this.$httpZll.getNewTaskId(params).then(res => {
          if (res) {
            let task = this.groupHandlerListData(res.data)[0];
            if (!task) {
              this.$prompt('获取任务失败', 'fail');
              resolve(false);
              return;
            }
            resolve(task);
          }
        });
      })
    };
    // 任务详情
    Vue.prototype.againTaskDetail = function (val) {
      return new Promise((resolve, reject) => {
        let url = '';
        if (val.book_url) {
          url = val.book_url;
        } else {
          url = val.detail_request_url;
        }
        if (!url) {
          this.setContentDetail(val);
          resolve(true);
          return;
        }
        this.$httpZll.get(url, {}, 'prompt').then(res => {
          if (res.data.success) {
            let content = {};
            if (val.book_url) {
              content = res.data.data;
              this.setContentDetail(val, content);
              resolve(true);
            } else {
              this.getBulletinDetailFun(res.data, val).then(item => {
                content = item;
                let arr = ['property_fee', 'property_phone'];
                if (content.add_data) {
                  for (let item of content.add_data) {
                    if (arr.includes(item.name)) {
                      content[item.name] = item.value;
                    }
                  }
                }
                this.setContentDetail(val, content);
                resolve(true);
              });
            }
          }
        });
      });
    };
    //对详情内容的处理
    Vue.prototype.setContentDetail = function (val, content = {}) {
      let data = {};
      data.content = content;
      data.task_id = val.task_id;
      data.taskDefinitionKey = val.taskDefinitionKey;
      data.process_instance_id = val.process_id;
      data.root_process_instance_id = val.root_id;
      if (val.finish_RWC) {
        data.finish_RWC = val.finish_RWC;
      }
      sessionStorage.setItem('task_detail', JSON.stringify(data));
    };

    //续收、续租：需要拿content==>contract_info==>id去请求againTaskDetail任务详情接口作为他的详情数据
    Vue.prototype.getBulletinDetailFun = function (res, val) {
      return new Promise((resolve, reject) => {
        let arr = ['bulletin_collect_continued', 'bulletin_rent_continued'];
        let isFlag = arr.includes(val.bulletin_type);
        if (isFlag) {
          let contract_id = res.data.content.contract_info.id;
          this.$httpZll.getBulletinDetail(contract_id).then(result => {
            if (result) {
              let data = result.data;
              let contentInfo = data.content.draft_content;
              if (val.bulletin_type === 'bulletin_collect_continued') { //续收图片处理
                contentInfo.album = {
                  id_card_photo: [],
                  bank_card_photo: [],
                };
                contentInfo.album.id_card_photo = contentInfo.id_card_photo; //证件照片
                contentInfo.album.bank_card_photo = contentInfo.bank_card_photo;  //银行卡照片
              } else if (val.bulletin_type === 'bulletin_rent_continued') { //续租图片处理
                contentInfo.album = {
                  id_card_photo: [],
                  photo: [],
                };
                contentInfo.album.id_card_photo = contentInfo.id_card_photo; //证件照片
                contentInfo.album.photo = contentInfo.photo;  //凭证截图
              }
              contentInfo.address = data.house_address;
              contentInfo.house_id = data.house_id;
              contentInfo.contract_id = data.contract_id;
              resolve(contentInfo);
            }
          });
        } else {
          resolve(res.data.content);
        }
      })
    };
    Vue.prototype.$bulletinTitles = function (type) {
      let name = '', bulletin = '';
      switch (type) {
        case 'bulletin_collect_basic':
          name = '收房待办';
          bulletin = '收房报备';
          break;
        case 'bulletin_collect_continued':
          name = '续收待办';
          bulletin = '续收报备';
          break;
        case 'bulletin_rent_basic':
          name = '租房待办';
          bulletin = '租房报备';
          break;
        case 'bulletin_rent_trans':
          name = '租房待办';
          bulletin = '转租报备';
          break;
        case 'bulletin_rent_continued':
          bulletin = '续租报备';
          break;
        case 'bulletin_rent_RWC':
          bulletin = '未收先租报备';
          break;
        case 'bulletin_change':
          name = '调租待办';
          bulletin = '调租报备';
          break;
        case 'bulletin_agency':
          name = '渠道费待办';
          bulletin = '渠道费报备';
          break;
        case 'bulletin_retainage':
          name = '尾款待办';
          bulletin = '尾款报备';
          break;
        default:
          if (type.includes('bulletin_special')) {
            name = '特殊待办';
            bulletin = '特殊报备';
          } else if (type.includes('bulletin_checkout')) {
            name = '退租待办';
            bulletin = '退租报备';
          }
          break
      }
      let routes = this.$router.options.routes;
      for (let value of routes) {
        if (value.path === '/toBeDone') {
          value.meta.title = name;
        }
        if (value.path === '/collectReport') {
          value.meta.title = bulletin;
        }
      }
    };
    // 合同搜索
    Vue.prototype.$contractHandlerData = function (item, res) {
      let data = {content: {}}, content = {}, address = '';
      if (res) {
        data.content = res.data.content.draft_content;
        data.content.old_address = res.house_address || res.address || '';
        data.content.address = res.house_address || res.address || '';
      } else {
        address = item.house_name.name || '';
        data.house_id = item.house_id || '';
        data.contract_id = item.id || '';
        data.address = address;
        content.address = address;
        content.old_address = address;
        content.period_price_way_arr = item.pay_way || [];
        content.trans_type = item.trans_type || '0';
        content.money_sum = item.money_sum || '';
        content.current_pay_info = item.money_table || [];
        content.is_agency = item.is_agency;
        content.is_family = item.is_family;
        content.customer_info = item.customer_info;
        if (item.customer_info && item.customer_info.length) {
          let customer = item.customer_info[0];
          content.customer_name = customer.name || '';
          content.contact_phone = customer.phone || '';
          content.card_id = customer.idcard || '';
          content.customer_sex = customer.sex == 1 ? 'm' : 'w';
          content.card_type = 411;
          content.contact_way = 1;
        } else {
          content.customer_name = '';
          content.contact_phone = '';
          content.card_id = '';
          content.customer_sex = '';
          content.card_type = 411;
          content.contact_way = 1;
        }
        console.log(content);
        content.memo = item.memo || '';
        content.num_of_residents = item.num_of_residents || '';
        content.rental_use = item.rental_use || '';
        content.remark_terms = ['1', '2', '3', '4', '5'];
        content.deposit = item.mortgage_price || '';
        content.bet = item.pay_bet;
        content.month = item.sign_month || '';
        content.day = item.sign_remainder_day || '';
        content.rental_use_remark = item.rental_use_remark || '';
        content.begin_date = item.start_at.substring(0, 10);
        content.end_date = item.end_at.substring(0, 10);
        content.sign_date = item.sign_at.substring(0, 10);
        if (item.agency_info) {
          for (let info of Object.keys(item.agency_info)) {
            content[info] = item.agency_info[info] || '';
          }
        } else {
          item.agency_name = '';
          item.agency_phone = '';
          item.agency_price = '';
          item.agency_user_name = '';
        }
        content.album = item.album;
        data.content = content;
      }
      sessionStorage.setItem('task_detail', JSON.stringify(data));
      return data;
    };
    // 确认弹出窗口
    Vue.prototype.$dialog = function (title, content) {
      return new Promise((resolve, reject) => {
        Dialog.confirm({
          title: title,
          message: content
        }).then(() => {
          resolve(true);
        }).catch(() => {
          resolve(false);
        });
      })
    };
    // 钉钉超链接跳转
    Vue.prototype.$ddSkip = function (url) {
      dd.biz.util.openLink({
        url: url,//要打开链接的地址
        onSuccess(result) {
        },
        onFail(err) {
        }
      })
    };
    // 钉钉认证
    Vue.prototype.personalGet = function () {
      let that = this;
      // 隐藏 右上角更多
      dd.biz.navigation.setRight({show: false});
      return new Promise((resolve, reject) => {
        that.$httpZll.getDDConfig().then((res) => {
          let _config = res;
          // dd.config({
          //   agentId: _config.agentId, // 必填，微应用ID
          //   corpId: _config.corpId,//必填，企业ID
          //   timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
          //   nonceStr: _config.nonceStr, // 必填，生成签名的随机串
          //   signature: _config.signature, // 必填，签名
          //   jsApiList: ['biz.cspace.preview'] // 必填，需要使用的jsapi列表，注意：不要带dd。
          // });
          // console.log(res);
          dd.ready(() => {
            dd.runtime.permission.requestAuthCode({
              corpId: _config.corpId,
              onSuccess(info) {
                that.$httpZll.getTokenInfo(info.code).then((res) => {
                  that.personalData(res, resolve);
                })
              },
              onFail(err) {
                alert('dd error: ' + JSON.stringify(err));
                // alert('您不在系统内，请联系管理员添加！');
                that.closeDD();
              }
            });
          });
          dd.error((err) => {
            alert('dd error: ' + JSON.stringify(err));
          });
          // this.$personalDataHandler(setPersonalDetail.data.detail, resolve);
          // globalConfig.token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU0NmI0NTg1Yzc4ZmEwM2YyNTAxMGFkNmY1OGJiZDllMDVkMmVhZTU3NWRlYWRiMjU5Y2EwNTQwZWZlMTE5MGI0OGJlY2FhNjAwMTM2Mzk1In0.eyJhdWQiOiIxIiwianRpIjoiNTQ2YjQ1ODVjNzhmYTAzZjI1MDEwYWQ2ZjU4YmJkOWUwNWQyZWFlNTc1ZGVhZGIyNTljYTA1NDBlZmUxMTkwYjQ4YmVjYWE2MDAxMzYzOTUiLCJpYXQiOjE1NjI0MjE3MDgsIm5iZiI6MTU2MjQyMTcwOCwiZXhwIjoxNTYzNzE3NzA3LCJzdWIiOiIzNjc4Iiwic2NvcGVzIjpbXX0.Kzn72-HiBFCm5cVZBO-o1H9GI_XBczwkHkVgcbI96HdBHfKP0oGh_AUF1g-4RdU-Hh2pMAR15PNAUUnvfZ8BO0gHKyYMt7QH28o19q9vPEEdXxLBFVsD3I2cp6fKF9ct2aEqPlGjmOGzFGK9RBn5D9tHyOemjMTOVGIXeLa8WB0RhIm4UCw-3euiXuT_bqAos3voSaHEvZ164ZbZWrYQRA9VWjnhRsa72b7VVAwnxn9O6JS4VtXwikfLqhRh0Hk3COhS6Z3NrLF2S9rHVItIf7j01iTnn2dxdikJiMw21qnAFOkAqoJy2B-3FfzDvj2H7z4w-0WkSf4wVSuQZeGOuB2USoOMe3y5TCUtZONJg2rYtppnVjUptKe1kZF7y--bzYS1maS2sgUEQy5ncEGvF16EEW0RnvBN8ssvc20fqAb_rgbzZ56R06w8PJjIvzwu7YH4DLv2Ke1ASkq2QSwtMVpP5zaymeTyp-fjmdeoEFUyC2NgBXul3M48J-KNMQDb4bcrfaVnPpkFR74T3B5MLjM-RaUNLE07ybbyWDtBI35qoTEO_hu2H3u3E4M-A9WQAN-VMlRJPFtjzcfecFqiutVrTLgmiwU35GFqLT97R1PyN8avlNIS85q_Cmr-mpSgGIO1YwXfUaLZKxQofKG2PyUjqad30NH_4xMRGZwxKtk';
        });
      });
    };
    // 存储个人信息
    Vue.prototype.personalData = function (res, resolve) {
      globalConfig.token = 'Bearer ' + res.access_token;
      this.$httpZll.getUserInfo().then(res => {
        if (res) {
          this.$personalDataHandler(res.data.detail, resolve);
        }
      })
    };
    // 个人信息处理
    Vue.prototype.$personalDataHandler = function (info, resolve) {
      let data = {};
      data.avatar = info.avatar;
      data.phone = info.phone;
      data.staff_id = info.id;
      data.staff_id = '';
      data.staff_name = info.name;
      data.org = info.org;
      if (info.company_info) {
        data.company = {};
        data.company.id = info.company_info.id || 1;
        data.company.name = info.company_info.name || '';
      }
      if (info.org && info.org.length) {
        data.department_name = info.org[0].name;
        data.department_id = info.org[0].id;
        let cityObj = {}, cityArr = [], province = {};
        for (let org of info.org) {
          if (org.city && org.city.length) {
            for (let city of org.city) {
              cityObj.code = city.city_id;
              cityObj.name = city.city_name;
              // cityObj.code = 320100;
              // cityObj.name = '天津市';
              province[city.province.province_id] = city.province.province_name;
              // province[320100] = '天津市';
              cityArr.push(cityObj);
            }
          }
        }
        dicties.province = province;
        this.$store.dispatch('all_city_list', cityArr);
        if (!cityArr.length) {
          resolve(false);
          this.$prompt('获取城市失败!', 'fail');
          return;
        } else {
          data.city_id = cityArr[0].code;
          data.city_name = cityArr[0].name;
        }
      } else {
        resolve(false);
        this.$prompt('获取部门失败!', 'fail');
        return;
      }
      this.$store.dispatch('personal_storage', data);
      resolve(true);
    };
    // 关闭钉钉
    Vue.prototype.closeDD = function () {
      let that = this;
      dd.biz.navigation.close({
        onSuccess(result) {
        },
        onFail(err) {
        }
      });
    };
    //时间戳的处理
    Vue.prototype.datetoLocaleString = function () {
      let time = new Date();
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      return y + '-' + m;
    }
  }
}
