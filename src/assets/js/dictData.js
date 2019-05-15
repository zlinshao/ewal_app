const dictArticle = {1: '齐全', 2: '缺一', 3: '缺两', 4: '缺三', 5: '缺四'};
const zeroAndOne = {1: '补齐', 0: '不补齐'};
const haveAndNoHave = {1: '有', 0: '没有'};
const oneYesZeroNo = {1: '是', 0: '否'};

dicties = {
  // 省
  province: {},
  // 房屋类型
  house_type: {
    value_0: ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'],
    value_1: ['0厅', '1厅', '2厅', '3厅', '4厅', '5厅'],
    value_2: ['0卫', '1卫', '2卫', '3卫', '4卫', '5卫']
  },
  // 楼层
  floors: {
    value_0: [],
    value_1: [],
  },
  // 所属区域
  position: {1: '城中心', 2: '城区', 3: '郊区'},
  // 朝向
  direction: {1: '东', 2: '南', 3: '西', 4: '北', 5: '东南', 6: '东北', 7: '西南', 8: '西北', 9: '南北'},
  // 建筑年限
  built_year: [],
  // 装修
  decorate: {},
  // 房屋类型
  property_type: {},
  // 持有证件
  holding_documents_type: {1: '房产证', 2: '房屋买卖合同', 3: '其他房屋来源证明文件'},
  // 门锁类型
  lock_type: {1: '普通锁', 2: '密码锁', 3: '指纹锁'},
  // 床和床垫情况
  bed: dictArticle,
  // 衣柜情况
  wardrobe: dictArticle,
  // 窗帘情况
  curtain: dictArticle,
  // 家电是否齐全
  is_fill: {1: '齐全', 0: '不齐全'},
  // 房东是否补齐
  is_lord_fill: zeroAndOne,
  // 是否有暖气
  has_heater: haveAndNoHave,
  // 是否有天然气
  has_gas: haveAndNoHave,
  // 是否有电梯
  is_elevator: haveAndNoHave,
  // 卫生情况
  is_clean: {1: '干净', 0: '不干净'},
  // 签约人身份
  signatory_identity: {1: '产权人', 2: '代理人'},
  // 性别
  customer_sex: {'m': '男', 'w': '女'},
  // 联系方式
  contact_way: {1: '手机', 2: '座机', 3: '小灵通'},
  // 押
  pay_way_bet: [0, 1, 2, 3, 4, 5, 6],
  // 付款方式
  pay_way: {1: '月付', 2: '双月付', 3: '季付', 6: '半年付', 12: '年付'},
  // 非房东费用
  non_landlord_fee: {1: '水费', 2: '电费', 3: '燃气费', 4: '物业管理费', 5: '网费', 6: '其他费用'},
  // 证件类型
  card_type: {},
  // 是否渠道
  is_agency: oneYesZeroNo,
  // 可否装修
  can_decorate: oneYesZeroNo,
  // 可否添加物品
  can_add_goods: oneYesZeroNo,
  // 是否电子合同
  is_electronic_contract: oneYesZeroNo,
  // 备注条款
  remark_terms: {
    '1': '需经过乙方同意后，上门查房，不能打扰租客生活',
    '2': '房屋内家具家电自然老化，由甲方负责更换，人为损坏乙方负责',
    '3': '乙方将能够通过合法途径获取的租客信息告知甲方',
    '4': '非甲方及房屋原因导致的安全责任事故与甲方无关',
    '5': '同等条件下，房东享有签约权(从乙方处承租）'
  },
  // 保洁类型
  cleaning_type: {1: '自己保洁', 2: '第三方保洁'},
  // 维修类型
  repair_type: {1: '自己维修', 2: '第三方维修'},
  // 交接单 字典
  // 门锁类型
  gate_lock: {
    value_0: {1: '普通锁', 2: '密码锁', 3: '指纹锁'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
  },
  // 钥匙
  key: {
    value_0: {1: '1把', 2: '2把', 3: '3把', 4: '4把', 5: '5把'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
  },
  // 彩电
  tv: {
    value_0: {1: '普通电视', 2: '智能电视', 3: '投影', 4: '4K超高清曲面', 5: 'OLED电视HDR'},
    value_1: {1: '1台', 2: '2台', 3: '3台', 4: '4台', 5: '5台'},
    value_2: {0: '无损坏', 1: '损坏'},
    value_3: {0: ''},
  },
};
