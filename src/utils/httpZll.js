import httpService from './httpService.js';
import common from "./myUtils";

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

let url = globalConfig.server; //文件上传
let url_login = globalConfig.login; //登陆
let url_code = globalConfig.server_code; //报备标识码
let market = globalConfig.server_market; //报备
let url_hr = globalConfig.server_hr; //人资组织机构
let url_done = globalConfig.server_done; //小飞 待办
let url_identity = globalConfig.server_identity; //身份认证 / 电子合同编号（马国明）
let mould = globalConfig.contract_mould; //合同模板（马国明）

class httpZll extends httpService {

  // 登录
  static getDDConfig() {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}api/sns/dingtalk/config`).then(res => {
        resolve(res.data);
      })
    })
  }

  // 获取 登录token
  static getTokenInfo(code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}api/sns/dingtalk/fromClient`, {code: code}).then(res => {
        resolve(res.data);
      })
    })
  }

  // 获取个人信息
  static getUserInfo(code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}api/auth/user`, {code: code}).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message, 'fail');
        }
      })
    })
  }

  // 获取 token
  static getOauthToken() {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}oauth/token`).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 所有字典
  static getAllDict() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/dictionary/parent_son`).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 公告类型
  static getAnnouncementType() {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}announcement/announcement_type`).then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data.data);
        } else {
          resolve(false);
        }
      })
    })
  }

  // 所有城市
  static getAllCityList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address`, params).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 城市列表
  static getCityList() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address/city-list`).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 新建小区
  static newAddVillage(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}/v1.0/market/task/AddCommunity`, data, 'prompt').then(res => {
        if (res.data.success) {
          $httpPrompt(res.data.message, 'success');
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 小区搜索
  static searchVillageList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/community/pattern`, params, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 房屋搜索
  static searchHouseList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/house`, params, 'prompt').then(res => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 合同搜索
  static getContractList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/contract`, params, 'prompt').then(res => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 报备详情
  static getBulletinDetail(id) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/process/contract/${id}`, {}, 'prompt').then(res => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      })
    })
  }

  // 员工id获取详情信息
  static getUserIdStaffDetail(params, id) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}staff/user/${id}`, params, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 员工搜索
  static searchStaffList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}staff/user`, params, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 岗位搜索
  static searchPositionList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}/organization/position`, params, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 组织架构 部门
  static getOrganization(org) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}organization/organization`, {
        parent_id: org,
        // user_count: 1,
      }, 'prompt').then(res => {
        resolve(res.data);
      });
    });
  }

  // 开启一个流程
  static postOpenOneProcess(id) {
    return new Promise((resolve, reject) => {
      let time = common.startTime('time');
      this.post(`${url_done}/runtime/process-instances`, {
        "message": "BookingMessage",
        "tenantId": "market",
        "variables": [
          {
            name: 'title',
            value: '未收先租 ' + time,
          },
          {
            name: 'bulletin_staff_id',
            value: id,
          },
          {
            name: 'bulletin_type',
            value: 'bulletin_rent_RWC'
          },
          {
            name: 'new_RWC',
            value: 'bulletin_rent_RWC'
          }
        ]
      }).then(res => {
        resolve(res.data);
      });
    });
  }

  // 新建待办任务
  static createdTask(data, name) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/task/${name}`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 获取合同模板
  static getContractMould(params) {
    return new Promise((resolve, reject) => {
      this.get(`${mould}fdd/pdf`, params, 'prompt', close).then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 带看打卡 完成打卡
  static postFinishPunchClock(data) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/task/variables`, data, 'prompt').then(res => {
        if (res.data.success) {
          $httpPrompt(res.data.message, 'success');
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 获取 所有待办列表
  static getToBeDoneListApi(url, data, close) {
    let params = {
      size: 12,
      // assignee: '69',//登陆人
    };
    for (let key of Object.keys(data)) {
      params[key] = data[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}${url}`, params, 'prompt', close).then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 获取 报备待办列表
  static getToBeDoneApi(val = {}) {
    let params = {
      size: 12,
      tenantId: 'market',
      assignee: '', //登陆人
      order: 'desc',
      taskDefinitionKeyIn: '',
      rootProcessDefinitionKeyIn: '',
      includeProcessVariables: true,
      includeTaskLocalVariables: true,
    };
    for (let key of Object.keys(val)) {
      params[key] = val[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 转交直接换人
  static postApprovalDeliver(id, assignee) {
    let params = {
      action: 'delegate',
      assignee: assignee,
    };
    return new Promise((resolve, reject) => {
      this.post(`${url_done}runtime/tasks/${id}`, params, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(true);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 转交/代签
  static postToBeDoneDeliver(id, data, val) {
    return new Promise((resolve, reject) => {
      this.post(`${url_done}runtime/tasks/${id}`, data, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(true);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 结束任务
  static finishToBeDoneTask(id, data) {
    return new Promise((resolve, reject) => {
      this.delete(`${url_done}runtime/process-instances/${id}`, data, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(true);
          $httpPrompt('任务删除成功!', 'success');
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 任务跟进详情
  static followRecordList(id) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/task-follow-up/list?task_id=${id}`, {}, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 交接单
  static postDeliveryReceipt(data, url) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/handover${url}`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }

      });
    });
  }

  // 获取房屋最新交接单
  static getNewDeliveryDraft(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/handover/house_handover`, params, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 获取 交接单 pdf
  static getDeliveryPDF(id) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/handover/${id}`, {}, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 获取交接单草稿
  static getDeliveryDraft(id) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/handover/draft?task_id=${id}`, {}, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 预览交接单
  static postPreviewDelivery(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/handover/preview`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 完成任务
  static finishBeforeTask(id, data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_done}runtime/tasks/${id}`, data, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(true);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 获取去签约任务ID
  static getNewTaskId(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 行政审批
  static sendAdminApproval(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_hr}process/process`, data, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
          $httpPrompt(res.data.msg, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 获取审批流程
  static getAdminApprovalProcess(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}assignment/process-definition-key`, params, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 审批
  static getMeInitiate(url, val = {}) {
    let params = {
      title: '',
      size: 12,
    };
    for (let key of Object.keys(val)) {
      params[key] = val[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}${url}`, params, 'prompt').then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      });
    });
  }

  // 本地签署电子合同
  static localSignContract(url, data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_identity}fdd/contract/${url}`, data, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
          $httpPrompt(res.data.msg, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 获取singer
  static getElectronicContractSinger(executionId) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/executions/${executionId}/variables/signer`, {}, 'prompt').then(res => {
        resolve(res.data);
      })
    })
  }

  // 发送电子合同
  static sendElectronicContract(number, params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_identity}fdd/contract/send/${number}`, params, 'prompt').then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
          $httpPrompt(res.data.msg, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  // 补齐资料详情
  static getPolishingDetail(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/contract/album/${params.type}/${params.id}`, {}).then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  // 补齐资料报备
  static setPolishingBulletin(task_id = '', params, api = '') {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/task-follow-up${api}?task_id=${task_id}`, params, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 获取报备详情
  static getApprovalDetail(url) {
    return new Promise((resolve, reject) => {
      this.get(url, {}, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 历史流程节点
  static getHistoryProcess(id) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}history/process-instances/${id}/log`).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      })
    })
  }

  // 评论
  static setBulletinComment(data, id) {
    return new Promise((resolve, reject) => {
      this.post(`${url_done}history/process-instances/${id}/comments`, data).then(res => {
        if (199 < res.status < 300) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.status);
        }
      })
    })
  }

  // 暂缓任务
  static putActionTask(id, data) {
    return new Promise((resolve, reject) => {
      this.put(`${url_done}runtime/process-instances/${id}`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 银行名称认证
  static getBankNameAttestation(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/helper/bank_name`, params, 'prompt').then((res) => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      })
    })
  }

  // 获取电子合同编号
  static getElectronicContract(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_identity}fdd/number/take`, data).then((res) => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  // 客户认证
  static customerIdentity(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_identity}fdd/customer/cert`, data, 'prompt').then((res) => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          $httpPrompt(res.data.msg);
          this.getFDDUserId(data).then(user => {
            resolve(user);
          });
        }
      })
    })
  }

  // 获取法大大 user_id
  static getFDDUserId(params) {
    let data = {};
    data.name = params.customer_name;
    data.idcard = params.idcard;
    data.phone = params.mobile;
    return new Promise((resolve, reject) => {
      this.get(`${url_identity}fdd/customer/verified`, data, '', 'close').then((res) => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        }
      })
    })
  }

  // 报备唯一标识码
  static bulletinCode = function (code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_code}api/registration/uinq_code?prefix=${code}`).then((res) => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  };

  // 收款账户
  static getFinancialAccount(id) {
    return new Promise((resolve, reject) => {
      this.get(`${url_code}api/allocation/org_account?org_id=${id}`).then(res => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      })
    })
  }

  // 补充协议
  static postSupplyAgreement(data, type) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/bulletin/agreement/${type}`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 收房报备 发布
  static submitReport(data, to) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/bulletin?to=${to}`, data, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });
    });
  }

  // 收房报备 修改
  static putReviseReport(data, to) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/bulletin/${data.id}?to=${to}`, data, 'prompt').then(res => {
        if (Number(res.data.code) === 200) {
          resolve(res.data);
          $httpPrompt(res.data.message, 'success');
        } else {
          resolve(false);
          $httpPrompt(res.data.message);
        }
      });

    });
  }

  // 报备 草稿
  static getBulletinDraft(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/bulletin`, params, 'prompt').then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 图片id获取图片地址
  static getUploadUrl(ids, close, prompt = '') {
    return new Promise((resolve, reject) => {
      this.post(`${url}api/v1/get_urls`, {ids: ids}, prompt, close).then(res => {
        if (res.data.code.endsWith('0')) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 获取上传文件token
  static getToken() {
    return new Promise((resolve, reject) => {
      this.get(`${url}api/v1/token`, '').then(res => {
        if (res.data.code === '11020') {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 上传文件
  static uploadServer(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url}api/v1/upload-direct`, data).then(res => {
        if (res.data.code === '110100') {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  // 待办类型
  static getToDoTypeList(data) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/taskKeys`, data).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }

  //获取业务员个人业绩
  static getPersonalList(data) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}achv/achv/get_personal`, data).then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve(false);
          $httpPrompt(res.data.msg);
        }
      });
    });
  }


}

export default httpZll
