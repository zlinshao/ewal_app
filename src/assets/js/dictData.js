const dictArticle = {1: '齐全', 2: '缺一', 3: '缺两', 4: '缺三', 5: '缺四'};
const zeroAndOne = {1: '补齐', 0: '不补齐'};
const haveAndNoHave = {1: '有', 0: '没有'};
const oneYesZeroNo = {1: '是', 0: '否'};
const valueNumber = {
  value_1: {0: '无损坏', 1: '损坏'},
  value_2: {0: ''},
  value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
};
const valueHave = {
  value_0: {0: '没有', 1: '有'},
  value_1: {0: '无损坏', 1: '损坏'},
  value_2: {0: ''},
};

dicties = {
  // 省
  province: {},
  // 市
  city: {},
  // 区/县
  district: {},
  // 区域
  region: {},
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
  // 收款账户
  remittance_account: {},
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
  card_type: {411: '身份证'},
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
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1台', 2: '共2台', 3: '共3台', 4: '共4台', 5: '共5台'},
  },
  // 窗户
  screen_window: {
    value_0: {1: '铝合金', 2: '塑钢', 3: '铁窗', 4: '纱窗'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
  },
  // 遥控器
  remote_control: valueHave,
  // 沙发
  sofa: {
    value_0: {1: '皮质沙发', 2: '布艺沙发', 3: '木质沙发'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 茶几
  tea_table: valueNumber,
  // 冰箱
  refrigerator: {
    value_0: {1: '单门冰箱', 2: '双门冰箱', 3: '三门冰箱', 4: '双开门冰箱', 5: '十字对开门冰箱', 6: '多门冰箱'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 椅子
  chair: {
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1把', 2: '共2把', 3: '共3把', 4: '共4把', 5: '共5把'},
  },
  // 餐桌
  dining_table: {
    value_0: {1: '木制餐桌', 2: '大理石餐桌', 3: '玻璃餐桌'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 客厅灯
  light: {
    value_0: {1: '吸顶灯', 2: 'LED灯', 3: '节能灯'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 热水器
  water_heater: {
    value_0: {1: '电热水器', 2: '燃气热水器', 3: '太阳能热水器', 4: '其他'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 浴霸
  bath_heater: {
    value_0: {1: '风暖型浴霸', 2: '灯暖型浴霸', 3: '灯风双暖型浴霸', 4: '智能浴霸', 5: '壁挂浴霸', 6: '凉霸', 7: '其他'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 洗衣机
  washer: {
    value_0: {1: '滚筒洗衣机', 2: '波轮洗衣机'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 燃气灶
  gas_stove: {
    value_0: {1: '液化气燃气灶', 2: '天然气燃气灶'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1个', 2: '共2个', 3: '共3个', 4: '共4个', 5: '共5个'},
  },
  // 橱柜
  sideboard: valueNumber,
  // 洗菜池
  washing_pool: valueNumber,
  // 水龙头
  faucet: valueNumber,
  // 微波炉
  microwave_oven: valueNumber,
  // 厨房灯
  kitchen_light: valueNumber,
  // 阳台灯
  balcony_light: valueNumber,
  // 卫生间灯
  bathroom_light: valueNumber,
  // 浴霸灯
  bath_heater_light: valueNumber,
  // 洗面池
  wash_basin: valueNumber,
  // 马桶盖
  toilet_lid: valueHave,
  // 晾衣架
  drying_rack: valueHave,
  // 床
  delivery_bed: valueNumber,
  // 床垫
  mattress: valueNumber,
  // 衣柜
  delivery_wardrobe: valueNumber,
  // 窗帘
  delivery_curtain: valueNumber,
  // 空调
  air_conditioning: {
    value_0: {1: '壁挂式空调', 2: '立柜式空调'},
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1台', 2: '共2台', 3: '共3台', 4: '共4台', 5: '共5台'},
  },
  // 空调遥控器
  air_conditioner_remote: valueNumber,
  // 电视遥控器
  tv_remote_control: valueNumber,
  // 书桌
  desk: valueNumber,
  // 门锁钥匙
  door_lock_key: {
    value_1: {0: '无损坏', 1: '损坏'},
    value_2: {0: ''},
    value_3: {1: '共1把', 2: '共2把', 3: '共3把', 4: '共4把', 5: '共5把'},
  },
  // 缴费类型
  payment_type: {1: '水电燃气表', 2: '物业代缴', 3: '储值卡'},
  // 转租类型
  trans_type: {0: '公司转租', 1: '个人转租'},
  // 已收金额类型
  amount_type_received: {1: '押金', 2: '押金+租金', 3: '押金+租金+其他费用'},
  // 是否有其他金额
  is_other_fee: {0: '否', 1: '有'},
  // 是否是家庭
  is_family: {1: "是", 0: "不是"},
  //租赁用途 自住，办公使用，其他，选择其他，在列表中加一行，请输入用途
  rental_use: {1: '自住', 2: '办公使用', 3: '其他'},
  // 收房/租房
  collect_or_rent: {0: '收房', 1: '租房'},
  // 尾款是否补齐
  is_full_amount: {0: '未补齐', 1: '已补齐'},
  // 是否合租
  is_joint: {1: '合租', 0: '整租'},
  // 协议类型
  pact_type: {1: '延长收房时长', 2: '房东更换银行卡', 3: '-延长租房时长', 4: '调整收房价'},
};
