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
    let urls = globalConfig.login;
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
    Vue.prototype.checkChooseCommon = function (item, value, type = 'id') {
      if (value.length) {
        if (value.includes(item)) {
          let index = value.indexOf(item);
          value.splice(index, 1);
        } else {
          if (type === 'id') {
            value.push(item.id);
          } else {
            value.push(item);
          }
        }
      } else {
        if (type === 'id') {
          value.push(item.id);
        } else {
          value.push(item);
        }
      }
    };
    // 列表 数据重组
    Vue.prototype.groupHandlerListData = function (data) {
      let arr = [];
      for (let item of data) {
        let obj = {};
        for (let key of item.variables) {
          obj[key.name] = key.value;
          if (key.name === 'signer') {
            obj.signer = JSON.parse(key.value) || {};
          }
          if (key.name === 'due_date') {
            let date = this.myUtils.timeDifference(key.value);
            obj.due_date_hours = date.hours;
            obj.due_date_minutes = date.minutes;
          }
        }
        obj.name = item.name;
        obj.task_id = item.id;
        obj.duration = item.duration;
        obj.status = item.status || [];
        obj.root_id = item.rootProcessInstanceId;
        obj.taskDefinitionKey = item.taskDefinitionKey;
        obj.process_id = item.processInstanceId;
        arr.push(obj);
      }
      return arr;
    };
    //自动获取用户IP，返回当前城市
    Vue.prototype.getBeforeCity = function (data = []) {
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
              console.log(address.city.includes(city.name));
              if (address.city.includes(city.name)) {
                if (Array.isArray(city.code)) {
                  obj.city = city.code;
                  obj.name = city.name;
                } else {
                  obj.city.push(city.code);
                  obj.name = city.name;
                }
              }
            }
            resolve(obj);
          });
          AMap.event.addListener(geolocation, 'error', function (err) {
            obj.city = [320100];
            obj.name = '南京';
            obj.location = [118.734235, 31.984095];
            resolve(obj);
          });
        });
      })
    };
    // 初始化数据
    Vue.prototype.initFormData = function (drawForm, showForm, noStaff) {
      let form = {};
      let album = {};
      let formatData = this.jsonClone(showForm);
      let value = [];
      for (let item of drawForm) {
        if (item.moreString) {
          for (let str of item.moreString) {
            form[str.keyName] = str.keyType;
            if (item.showForm) {
              formatData[str.keyName] = str.keyType;
            }
          }
        } else if (item.moreArray) {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = this.jsonClone(item.keyType);
          for (let arr of item.moreArray) {
            form[item.keyName].push(arr.keyType);
            formatData[item.keyName] = '';
          }
        } else if (item.picker === 'upload') {
          for (let up of item.value) {
            form[up.keyName] = [];
            album[up.keyName] = [];
          }
        } else if (item.picker === 'album') {
          // 新建小区
          form[item.keyName] = item.keyType;
          album[item.keyName] = item.keyType;
          for (let up of item.value) {
            form[item.keyName][up.keyName] = [];
            album[item.keyName][up.keyName] = [];
          }
        } else if (item.value) {
          value = item.value;
          for (let val of item.value) {
            form[val.key] = val.num;
          }
        } else if (item.checks) {
          form[item.keyName] = item.keyType;
          formatData[item.keyName] = ''
        } else if (item.children) {
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
        } else {
          if (item.status === 'obj') {
            form[item.keyName] = {
              id: '',
              name: '',
            };
          } else if (item.keyName === 'floors') {
            form.floor = '';
            form.floors = '';
          } else {
            if (item.keyName) {
              form[item.keyName] = item.keyType;
            }
          }
          if (item.showForm) {
            formatData[item.keyName] = item.keyType || '';
            if (item.keyType && dicties[item.keyName]) {
              formatData[item.keyName] = dicties[item.keyName][Number(item.keyType)] || '';
            }
          }
        }
      }
      if (!noStaff) {
        this.getPersonal(form, this.$store.state.app.personal);
      }
      return {form, formatData, value, album};
    };
    // 预填数据处理
    Vue.prototype.changeHandle = function (res, item, val, all, data) {
      let formatData = data;
      for (let slither of Object.keys(all)) {
        for (let list of all[slither]) {
          if (list.keyName === item) {
            for (let i = 1; i < res[item].length; i++) {
              list.children.push(list.children[0]);
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
    };
    // 下拉框数据显示 picker 配置
    Vue.prototype.inputSelect = function (pickers, val, num, parentKey) {
      pickers.keyName = val.keyName;
      pickers.status = val.status;
      pickers.title = val.label;
      pickers.index = num;
      pickers.parentKey = parentKey || '';
      if (val.status.includes('arrs')) {
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
      return pickers;
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
    Vue.prototype.$signPostApi = function (item, params, title = [], route) {
      console.log(item);
      let url = '', sign = {};
      if (item.bulletin_type === 'bulletin_collect_basic') {
        url = 'sign_collect';
        sign = {
          task_id: item.task_id,
          contract_id: item.contract_number,
        };
      }
      for (let key of Object.keys(params)) {
        sign[key] = params[key]
      }
      this.$dialog(title[0], title[1]).then(data => {
        if (data) {
          this.$httpZll.localSignContract(url, sign).then(res => {
            if (Number(sign.type) === 2) {
              this.$ddSkip(res.data.data, route);
            } else {
              this.$prompt('发送成功!', 'success');
            }
          })
        }
      });
    };
    // 修改合同
    Vue.prototype.$reviseContract = function (action = {}, name = '', item) {
      this.$dialog('合同修改', '是否确认修改合同?').then(res => {
        if (res) {
          let postData = {};
          postData.action = 'complete';
          postData.variables = [{
            name: name,
            value: action.action,
          }];
          this.$httpZll.finishBeforeTask(item.task_id, postData).then(_ => {
            if (action.action === 'success') {
              this.$prompt('签署成功！');
              this.routerLink(action.route);
            } else {
              let params = {
                taskDefinitionKey: 'InputBulletinData',
                rootProcessInstanceId: item.root_id,
              };
              this.$httpZll.getNewTaskId(params).then(res => {
                let query = {};
                let task = res.data[0];
                query.task_id = task.id;
                query.process_id = task.processInstanceId;
                query.root_id = task.rootProcessInstanceId;
                query.task_action = action.route;
                for (let v of task.variables) {
                  if (v.name === 'ctl_detail_request_url' || v.name === 'bm_detail_request_url') {
                    query[v.name] = v.value || '';
                  }
                }
                if (query.bm_detail_request_url) {
                  this.againTaskDetail(query).then(_ => {
                    this.againDetailRequest(query, 'again');
                  });
                }
              });
            }
          });
        }
      });
    };
    // 任务详情
    Vue.prototype.againTaskDetail = function (val) {
      return new Promise((resolve, reject) => {
        this.$httpZll.get(val.ctl_detail_request_url, {}, 'prompt').then(res => {
          if (res.success) {
            let data = {};
            let content = res.data.content;
            let arr = ['property_fee', 'property_phone'];
            if (content.add_data) {
              for (let item of content.add_data) {
                if (arr.includes(item.name)) {
                  content[item.name] = item.value;
                }
              }
            }
            data.content = content;
            data.task_id = val.task_id;
            data.process_instance_id = val.process_id;
            data.root_process_instance_id = val.root_id;
            this.$store.dispatch('task_detail', data);
          }
          resolve(true);
        });
      });
    };
    // 报备详情
    Vue.prototype.againDetailRequest = function (val, again = '') {
      this.$httpZll.get(val.bm_detail_request_url, {}, 'prompt').then(res => {
        if (res.success) {
          let data = {};
          data.content = res.data.content;
          data.task_id = val.task_id;
          data.process_instance_id = val.process_id;
          this.$store.dispatch('bulletin_draft', data);
          this.routerLink(val.task_action, {again: again});
        }
      });
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
    Vue.prototype.$ddSkip = function (url, type = '') {
      let that = this;
      dd.biz.util.openLink({
        url: url,//要打开链接的地址
        onSuccess(result) {
          that.$store.dispatch('sign_routers', type);
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
          dd.config({
            agentId: _config.agentId, // 必填，微应用ID
            corpId: _config.corpId,//必填，企业ID
            timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
            nonceStr: _config.nonceStr, // 必填，生成签名的随机串
            signature: _config.signature, // 必填，签名
            jsApiList: ['biz.cspace.saveFile', 'biz.cspace.preview'] // 必填，需要使用的jsapi列表，注意：不要带dd。
          });
          dd.ready(() => {
            dd.runtime.permission.requestAuthCode({
              corpId: _config.corpId,
              onSuccess(info) {
                that.$httpZll.getUserInfo(info.code).then((res) => {
                  that.personalData(res, resolve);
                })
              },
              onFail(err) {
                alert('您不在系统内，请联系管理员添加！');
                that.closeDD();
              }
            });
          });
          dd.error((err) => {
            alert('dd error: ' + JSON.stringify(err));
          });
        });
      });
    };
    // 存储个人信息
    Vue.prototype.personalData = function (res, resolve) {
      let token = res.token;
      console.log(res.user);
      globalConfig.token = token.token_type + ' ' + token.access_token;
      console.log(globalConfig.token);
      // let info = res.data;
      // data.avatar = info.avatar;
      // data.phone = info.phone;
      // data.staff_id = info.id;
      // data.staff_name = info.name;
      // data.department_name = info.org[0].name;
      // data.department_id = info.org[0].id;
      // this.$store.dispatch('personal_storage', JSON.stringify(data));
      // resolve(true);
    };
    // 关闭钉钉
    Vue.prototype.closeDD = function () {
      let that = this;
      dd.biz.navigation.close({
        onSuccess(result) {
          let route = that.$store.state.app.signRouters;
          switch (route) {
            case 'toBeDone':
              that.routerReplace(route);
              break;
            case '/toBeDone':
              that.routerLink(route);
              break;
            case '':
              break;
          }
        },
        onFail(err) {
        }
      });
    };
  }
}
