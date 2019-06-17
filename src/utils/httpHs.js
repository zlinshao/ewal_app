import httpService from './httpService.js';
import common from "./myUtils";

// loading/Toast 提示信息
function $httpPrompt(msg, type) {
  common.prompt(msg, type);
}

let url = globalConfig.server;//文件上传
let url_code = globalConfig.server_code;//报备标识码
let market = globalConfig.server_market; //报备
let url_hr = globalConfig.server_hr;//人资组织机构
let url_done = globalConfig.server_done;//小飞 待办

class httpHs extends httpService {

  // 所有字典
  // static getAllDict() {
  //   return new Promise((resolve, reject) => {
  //     this.get(`${market}v1.0/market/dictionary/parent_son`).then(res => {
  //       if (res.success) {
  //         resolve(res);
  //       } else {
  //         $httpPrompt(res.message);
  //       }
  //     })
  //   })
  // }

  //获取合同列表历史记录
  static getContractList({house_id,contract_type,page,limit},msg) {
    return new Promise((resolve,reject) => {
      this.get(market + 'v1.0/market/contract/house-contract',{house_id,contract_type,page,limit},msg).then(res => {
        if (Number(res.code) === 200) {
          resolve(res.data);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  //合同列表
  static ContractList(params,msg) {
    return new Promise((resolve,reject) => {
      this.get(market + 'v1.0/market/contract',params,msg).then(res => {
        if (Number(res.code) === 200) {
          resolve(res.data);
        } else {
          $httpPrompt(res.message);
        }
      })
    })
  }

  //部门列表
  static getOrganization({parent_id,search}, status) {
    return new Promise((resolve, reject) => {
      this.get(`${url_hr}organization/organization`, {
        parent_id,
        search
      }, status).then(res => {
        resolve(res);
      });
    });
  }

  //合同详情
  static getContractDetail({contract_type,contract_id},status) {
    return new Promise((resolve,reject) => {
      this.get(market + `v1.0/market/contract/${contract_type}/${contract_id}`,{},status).then(res => {
        resolve(res);
      })
    })
  }

  //空置房源
  static getEmptyHouse(params,status) {
    return new Promise((resolve,reject) => {
      this.get(market + `v1.0/market/house/kong-days`,params,status).then(res => {
        resolve(res);
      })
    })
  }
}

export default httpHs
