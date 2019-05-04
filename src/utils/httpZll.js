import httpService from './httpService.js';
import common from "./myUtils";

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

let url = globalConfig.server;//文件上传
let url_login = globalConfig.login;//文件上传
let url_code = globalConfig.server_code;//报备标识码
let market = globalConfig.server_market; //报备
let url_hr = globalConfig.server_hr;//人资组织机构
let url_done = globalConfig.server_done;//小飞 待办
let url_identity = globalConfig.server_identity;//身份认证 / 电子合同编号（马国明）

class httpZll extends httpService {

  // 登录
  static getDDConfig() {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}api/sns/dingtalk/config`).then(res => {
        resolve(res);
      })
    })
  }

  // 获取 登录信息
  static getUserInfo(code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}api/sns/dingtalk/fromClient`, {code: code}).then(res => {
        resolve(res);
      })
    })
  }

  // 获取 token
  static getOauthToken() {
    return new Promise((resolve, reject) => {
      this.get(`${url_login}oauth/token`).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 所有字典
  static getAllDict() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/dictionary/parent_son`).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 所有城市
  static getAllCityList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address`, params).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 城市列表
  static getCityList() {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/city/address/city-list`).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  // 新建小区
  static newAddVillage(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/community`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 小区搜索
  static searchVillageList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/community`, params, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 房屋搜索
  static searchHouseList(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/house`, params, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 员工搜索
  static searchStaffList(val) {
    let params = {
      search: val,
      org_id: '',
    };
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}staff/user`, params, 'prompt').then(res => {
        if (res.code.endsWith('0')) {
          resolve(res);
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });
    });
  }

  // 组织架构 部门
  static getOrganization(org, status) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}organization/organization`, {
        parent_id: org
      }, status).then(res => {
        resolve(res);
      });
    });
  }

  // 新建待办任务
  static createdTask(data, name) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/task/${name}`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
        }
        resolve(res);
      });
    });
  }

  // 带看打卡 完成打卡
  static postFinishPunchClock(data) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/task/variables`, data, 'prompt').then(res => {
        if (res.success) {
          $httpPrompt(res.message, 'success');
          resolve(res);
        } else {
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 获取 所有待办列表
  static getToBeDoneListApi(url, data) {
    let params = {
      size: 12,
      // assignee: '69',//登陆人
    };
    for (let key of Object.keys(data)) {
      params[key] = data[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}${url}`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 获取 报备待办列表
  static getToBeDoneApi(taskKey = {}, tenant = 'market') {
    let params = {
      size: 12,
      tenantId: tenant,
      // assignee: '69',//登陆人
      order: 'desc',
      taskDefinitionKeyIn: 'CollectTakeLook,InputBulletinData,SignEC',
      includeProcessVariables: true,
      includeTaskLocalVariables: true,
    };
    for (let key of Object.keys(taskKey)) {
      params[key] = taskKey[key]
    }
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 完成当前任务
  static finishBeforeTask(id, data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_done}runtime/tasks/${id}`, data, 'prompt').then(res => {
        resolve(res);
      });
    });
  }

  // 获取去签约任务ID
  static getNewTaskId(params) {
    return new Promise((resolve, reject) => {
      this.get(`${url_done}runtime/tasks`, params, 'prompt').then(res => {
        resolve(res);
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
        resolve(res);
      });
    });
  }

  // 获取报备详情
  static getApprovalDetail(url) {
    return new Promise((resolve, reject) => {
      this.get(url, {}, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      })
    })
  }

  // 银行名称认证
  static getBankNameAttestation(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/helper/bank_name`, params, 'prompt').then((res) => {
        if (Number(res.code) === 200) {
          $httpPrompt(res.message);
          resolve(res);
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      })
    })

  }

  // 获取电子合同编号
  static getElectronicContract(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_identity}fdd/number/take`, data).then((res) => {
        if (res.code === '20000') {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.msg);
        }
      })
    })
  }

  // 客户认证
  static customerIdentity(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url_identity}fdd/customer/cert`, data, 'prompt').then((res) => {
        if (res.code.endsWith('0')) {
          resolve(res);
        } else {
          $httpPrompt(res.msg);
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
        if (res.code.endsWith('0')) {
          resolve(res);
        }
      })
    })
  }

  // 报备唯一标识码
  static bulletinCode = function (code) {
    return new Promise((resolve, reject) => {
      this.get(`${url_code}api/registration/uinq_code?prefix=${code}`).then((res) => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          $httpPrompt(res.msg);
          resolve(false);
        }
      })
    })
  };

  // 收房报备 发布
  static submitReport(data) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/market/bulletin?to=collect`, data, 'prompt').then(res => {
        if (res.success) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });
    });
  }

  // 收房报备 修改
  static putReviseReport(data) {
    return new Promise((resolve, reject) => {
      this.put(`${market}v1.0/market/bulletin/${data.id}?to=collect`, data, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
          $httpPrompt(res.message, 'success');
        } else {
          $httpPrompt(res.message);
          resolve(false);
        }
      });

    });
  }

  // 报备 草稿
  static getBulletinDraft(params) {
    return new Promise((resolve, reject) => {
      this.get(`${market}v1.0/market/bulletin`, params, 'prompt').then(res => {
        if (Number(res.code) === 200) {
          resolve(res);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 图片id获取图片地址
  static getUploadUrl(ids, close) {
    return new Promise((resolve, reject) => {
      this.post(`${market}v1.0/output/file`, {ids: ids}, '', close).then(res => {
        if (res.success) {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.message);
        }
      });
    });
  }

  // 获取上传文件token
  static getToken() {
    return new Promise((resolve, reject) => {
      this.get(`${url}api/v1/token`, '').then(res => {
        if (res.code === '11020') {
          resolve(res);
        } else {
          resolve(false);
          $httpPrompt(res.msg);
        }
      });
    });
  }

  // 上传文件
  static uploadServer(data) {
    return new Promise((resolve, reject) => {
      this.post(`${url}api/v1/upload-direct`, data).then(res => {
        if (res.code === '110100') {
          resolve(res);
        } else {
          resolve(res);
          $httpPrompt(res.msg);
        }
      });
    });
  }
}

export default httpZll
