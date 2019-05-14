hhhhhhhhhhhh = {
  "house_address": "",
  "community": {
    "id": "446",
    "area": "320102",
    "city": "320100",
    "code": "025",
    "unit": "[1]",
    "album": "",
    "floor": "[1]",
    "py_all": "taipingbeilu122hao",
    "region": "12",
    "remark": "https://nj.lianjia.com/xiaoqu/1411041190210/",
    "suffix": "[1]",
    "address": "太平北路122号",
    "content": "",
    "latitude": "32.05203446324",
    "position": "",
    "province": "320000",
    "py_first": "tpbl1h",
    "longitude": "118.7980569475",
    "max_price": "",
    "min_price": "",
    "built_year": "1971",
    "created_at": "2017-12-05 19:58:46",
    "developers": "南京市政建设开发有限公司",
    "house_type": "0",
    "seat_block": "[1]",
    "updated_at": "2017-12-07 13:49:43",
    "bd_latitude": "32.058392",
    "subway_road": "距离浮桥(地铁站)3号线418米，距离鸡鸣寺(地铁站)4号线582米，距离大行宫(地铁站)2号线1187米，距离珠江路(地铁站)1号线1312米",
    "bd_longitude": "118.804473",
    "number_rooms": "[1]",
    "property_com": "街道办事处（委员会）代管物业",
    "property_fee": "0.1元/平米/月",
    "total_houses": "746户",
    "village_name": "太平北路122号",
    "village_alias": "",
    "district_group": "[1]",
    "property_phone": "",
    "peripheral_info": "",
    "total_buildings": "15栋",
    "property_fee_list": ""
  },
  "position": "2",
  "property_address": "发发大水发射点",
  "property_owner": "放大撒地方",
  "door_address": ["12", "33", "44"],
  "house_type": ["1", "1", "1"],
  "area": "122",
  "decorate": {"id": "405", "name": "毛坯"},
  "direction": {"id": "1", "name": "东"},
  "floor": "3",
  "floors": "18",
  "property_fee": "0.1元/平米/月",
  "property_phone": "18188181",
  "property_type": {"id": "419", "name": "住宅"},
  "holding_documents_type": "2",
  "property_right_card_number": "321312",
  "qiu_quan_number": "2313123",
  "lock_type": "1",
  "other_remark": "fdsfda",
  "photo": [4226867, 4226868, 4226869],
  "house_video": [4226870],
  "bed": "3",
  "bed_remark": "fdfdsafasd",
  "wardrobe": "2",
  "wardrobe_remark": "fdsfas",
  "curtain": "3",
  "curtain_remark": "dfsfsdaf",
  "is_elevator": "0",
  "is_clean": "0",
  "is_fill": "1",
  "is_lord_fill": "1",
  "has_heater": "0",
  "has_gas": "0",
  "lord_fill_date": "2019-04-30",
  "other_furniture": "gfdgsdg",
  "air_condition": "1",
  "fridge": 2,
  "television": "1",
  "wash_machine": "1",
  "water_heater": "1",
  "hood": "1",
  "microwave": "1",
  "sofa": "1",
  "clothe_rack": "1",
  "gas_stove": "1",
  "dining_table": "1",
  "chair": "1",
  "signatory_identity": "1",
  "customer_name": "张琳琳",
  "customer_sex": "m",
  "card_type": "411",
  "card_id": "320321198904010033",
  "contact_way": "1",
  "contact_phone": "18052001167",
  "bank": "上海浦东发展银行",
  "subbranch": "fgdsgdsf",
  "account_name": "贾少君",
  "account": "6225212583158743",
  "relationship": "fdsaf",
  "subsidiary_customer": [{
    "card_id": "",
    "card_type": "",
    "contact_way": "",
    "customer_sex": "",
    "contact_phone": "",
    "customer_name": ""
  }],
  "id_card_photo": [4226871, 4226872],
  "bank_card_photo": [4226873, 4226874, 4226875, 4226876],
  "is_electronic_contract": "1",
  "contract_number": "",
  "sign_date": "2019-04-30",
  "month": "12",
  "day": "3",
  "vacancy": "12",
  "begin_date": "2019-04-30",
  "end_date": "2020-05-14",
  "end_date_vacant": "2019-05-12",
  "pay_way_bet": "1",
  "period_price_way_arr": [{
    "period": "12",
    "pay_way": "1",
    "end_date": "2019-05-25",
    "begin_date": "2020-05-13",
    "month_unit_price": "1222"
  }],
  "deposit": 1222,
  "pay_first_date": "2019-05-13",
  "pay_second_date": "2019-06-13",
  "penalty": "3333",
  "can_decorate": "0",
  "can_add_goods": "0",
  "is_agency": "1",
  "agency_name": "321312",
  "agency_price": "321312",
  "agency_user_name": "3213",
  "agency_phone": "432432",
  "non_landlord_fee": [3, 2, 6],
  "remark_terms": ["5", "4", "3"],
  "staff_name": "张琳琳",
  "department_name": "南京马群一组",
  "staff_id": "69",
  "department_id": "134",
  "id": 110,
  "task_id": "57145337-689b-11e9-895e-76de95b6db95",
  "type": 1,
  "is_draft": 0,
  "spot_code": "s7d30"
};

// 报备类型
bulletinRouterStatus = {
  newCollect: {
    bulletin: 'bulletin_collect_basic',
    to: 'collect',
    type: 1,
  },
  newRent: {
    bulletin: 'bulletin_rent_basic',
    to: 'rent',
    type: 1,
  },
};

// 审批筛选
approvalSearch = {
  toBeDoneCollect: ['CollectTakeLook', 'InputBulletinData', 'SignEC','CollectReceiptSign'],
  toBeDoneRent: ['RentTakeLook', 'InputBulletinData', 'SignEC','RentReceiptSign'],
  approvals1: ['pqjl_approval', 'gkzx_approval'],
  approvals22: ['SignEC'],
  approvals23: ['InputBulletinData'],
};

// 收房报备
defineCollectReport = {
  // 房屋信息
  slither0: [
    {
      label: '房屋地址',// 标题
      placeholder: '必填 请选择',// placeholder
      // readonly: 'readonly',// 只读 picker必须有值
      disabled: 'disabled',// 禁用
      keyName: 'house_address',// 字段名
      keyType: '',// 数据类型
      type: 'text',// input 类型
      // date为正常日期选择  arr picker源数据为数组确定值为int  obj picker源数据为对象确定值为{id:'',name:''}格式 arrs多列选择确定值为[] objInt确定值为 int 弹窗内选择日期dateSlot
      status: '',
      // picker: 'searchVillage',// 是否显示在弹窗内 不存在为正常输入框 值为picker正常选择 searchVillage 搜索小区
      // showForm: 'formatData',//picker 显示form 或 formatData
      // prompts: '',//红色提示信息
      // pickerRead: 'no', // 在弹窗内是否为readonly// 1房屋信息 2物品信息 3合同信息 4客户信息
      slot: '',// 预留字段
    },
    {
      label: '小区地址',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'community',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '所属区域',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'position',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '产权地址',
      placeholder: '必填 请输入',
      keyName: 'property_address',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '产权人',
      placeholder: '必填 请输入',
      keyName: 'property_owner',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '门牌地址',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'door_address',
      keyType: [],
      type: 'text',
      status: '',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
      moreArray: [
        {
          label: '栋',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
        {
          label: '单元',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
        {
          label: '门牌号',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
      ],
    },
    {
      label: '户型',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'house_type',
      keyType: [],
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '面积',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'area',
      keyType: '',
      type: 'number',
      status: '',
      unit: '平米',
      slot: '',
    },
    {
      label: '装修',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'decorate',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '朝向',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'direction',
      keyType: '',
      type: 'text',
      status: 'obj',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '楼层',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'floors',
      keyType: [],
      type: 'text',
      status: 'arrs-3-0',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '物业费',
      disabled: 'disabled',
      placeholder: '已禁用',
      keyName: 'property_fee',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '物业电话',
      disabled: 'disabled',
      placeholder: '已禁用',
      keyName: 'property_phone',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '房屋类型',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'property_type',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '持有证件',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'holding_documents_type',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '产权证号',
      placeholder: '必填 请输入',
      keyName: 'property_right_card_number',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '丘权号',
      placeholder: '必填 请输入',
      keyName: 'qiu_quan_number',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '门锁类型',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'lock_type',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '其它问题',
      placeholder: '请输入',
      keyName: 'other_remark',
      keyType: '',
      type: 'textarea',
      status: '',
      slot: '',
    },
    {
      label: '上传',
      picker: 'upload',
      value: [
        {
          label: '房产证照片',
          placeholder: '必填',
          keyName: 'photo',
        }, {
          label: '房屋影像',
          placeholder: '必填',
          keyName: 'house_video',
        }
      ]
    },
  ],
  // 物品信息
  slither1: [
    {
      label: '床和床垫的情况',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'bed',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '床备注',
      placeholder: '请输入',
      keyName: 'bed_remark',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '衣柜情况',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'wardrobe',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '衣柜备注',
      placeholder: '请输入',
      keyName: 'wardrobe_remark',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '窗帘情况',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'curtain',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '窗帘备注',
      placeholder: '请输入',
      keyName: 'curtain_remark',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '家电是否齐全',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'is_fill',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '是否有电梯',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'is_elevator',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '卫生情况',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'is_clean',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '房东是否补齐',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'is_lord_fill',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '是否有暖气',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'has_heater',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '是否有天然气',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'has_gas',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'pickerArticle',
      slot: '',
    },
    {
      label: '最迟补齐日期',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'lord_fill_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '其他家具',
      placeholder: '请输入',
      keyName: 'other_furniture',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '家电',
      placeholder: '必填 请选择',
      keyName: 'electrical',
      keyType: '',
      type: 'text',
      status: '',
      picker: 'electrical',
      slot: '',
      // 家具列表
      value: [
        {
          label: '空调',
          key: 'air_condition',
          num: 1,
        },
        {
          label: '冰箱',
          key: 'fridge',
          num: 1,
        },
        {
          label: '电视',
          key: 'television',
          num: 1,
        },
        {
          label: '洗衣机',
          key: 'wash_machine',
          num: 1,
        },
        {
          label: '热水器',
          key: 'water_heater',
          num: 1,
        },
        {
          label: '油烟机',
          key: 'hood',
          num: 1,
        },
        {
          label: '微波炉',
          key: 'microwave',
          num: 1,
        },
        {
          label: '沙发',
          key: 'sofa',
          num: 1,
        },
        {
          label: '衣架',
          key: 'clothe_rack',
          num: 1,
        },
        {
          label: '燃气灶',
          key: 'gas_stove',
          num: 1,
        },
        {
          label: '餐桌',
          key: 'dining_table',
          num: 1,
        },
        {
          label: '椅子',
          key: 'chair',
          num: 1,
        },
      ],
    },
  ],
  // 客户信息
  slither2: [
    {
      label: '签约人身份',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'signatory_identity',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '客户姓名',
      placeholder: '必填 请输入',
      keyName: 'customer_name',
      keyType: '',
      type: 'text',
      button: '身份识别',
      icon: 'identity',
      status: '',
      slot: '',
    },
    {
      label: '性别',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'customer_sex',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '证件类型',
      placeholder: '必填 已禁用',
      disabled: 'disabled',
      keyName: 'card_type',
      keyType: 411,
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '证件号',
      placeholder: '必填 请输入',
      keyName: 'card_id',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '联系方式',
      placeholder: '必填 已禁用',
      disabled: 'disabled',
      keyName: 'contact_way',
      keyType: 1,
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '联系电话',
      placeholder: '必填 请输入',
      keyName: 'contact_phone',
      keyType: '',
      type: 'number',
      status: '',
      slot: '',
    },
    {
      label: '卡号',
      placeholder: '必填 请输入',
      keyName: 'account',
      keyType: '',
      type: 'number',
      status: '',
      slot: '',
    },
    {
      label: '开户名',
      placeholder: '必填 请输入',
      keyName: 'account_name',
      keyType: '',
      type: 'text',
      button: '银行卡识别',
      icon: 'bank',
      status: '',
      slot: '',
    },
    {
      label: '银行',
      placeholder: '必填 请输入',
      keyName: 'bank',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '支行',
      placeholder: '请输入',
      keyName: 'subbranch',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '与房东关系',
      placeholder: '必填 请输入',
      keyName: 'relationship',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      keyName: null,
      picker: 'addCustomer',
      button: '+增加附属租客',
    },
    {
      keyName: 'subsidiary_customer',
      picker: 'changeCustomer',
      pickerText: '个附属房东',
      label: '附属房东',
      button: '增加附属房东',
      keyType: [],
      children: [
        [
          {
            label: '客户姓名',
            placeholder: '必填 请输入',
            keyName: 'customer_name',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '性别',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'customer_sex',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '证件类型',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'card_type',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '证件号',
            placeholder: '必填 请输入',
            keyName: 'card_id',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
          {
            label: '联系方式',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'contact_way',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            slot: '',
          },
          {
            label: '联系电话',
            placeholder: '必填 请输入',
            keyName: 'contact_phone',
            keyType: '',
            type: 'text',
            status: '',
            slot: '',
          },
        ],
      ],
    },
    {
      label: '上传',
      picker: 'upload',
      value: [
        {
          label: '证件照片',
          placeholder: '必填',
          keyName: 'id_card_photo',
        }, {
          label: '银行卡照片',
          keyName: 'bank_card_photo',
        }
      ]
    },
  ],
  // 合同信息
  slither3: [
    {
      label: '是否是电子合同',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'is_electronic_contract',
      keyType: '1',
      type: 'text',
      status: 'objInt',
      picker: 'picker',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '合同编号',
      placeholder: '必填 请填写',
      keyName: 'contract_number',
      keyType: 'LJSHE',
      type: 'text',
      status: '',
      picker: '',
      slot: '',
    },
    {
      label: '签约时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'sign_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '签约时长',
      keyName: 'month',
      placeholder: '必填 请输入',
      prompts: '不包含空置期',
      moreString: [
        {
          placeholder: '必填 月数',
          keyName: 'month',
          keyType: '',
          type: 'number',
          status: '',
          slot: '',
        },
        {
          placeholder: '选填 天数',
          keyName: 'day',
          keyType: '',
          type: 'number',
          status: '',
          slot: '',
        },
      ],
    },
    {
      label: '空置天数',
      placeholder: '请输入',
      keyName: 'vacancy',
      keyType: '',
      type: 'number',
      status: '',
      slot: '',
    },
    {
      label: '合同开始时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'begin_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '合同结束时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'end_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '空置期结束时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'end_date_vacant',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '押',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'pay_way_bet',
      keyType: 1,
      type: 'text',
      status: 'objInt',
      picker: 'picker',
      slot: '',
    },
    {
      label: '应付款信息',
      keyName: 'period_price_way_arr',
      picker: 'changePrice',
      pickerText: '周期',
      keyType: [],
      button: '付款变化',
      children: [
        [
          {
            label: '开始时间',
            placeholder: '已禁用',
            disabled: 'disabled',
            keyName: 'begin_date',
            keyType: '',
            type: 'text',
            status: '',
            picker: '',
            length: 1,
            slot: '',
          },
          {
            label: '结束时间',
            placeholder: '已禁用',
            disabled: 'disabled',
            keyName: 'end_date',
            keyType: '',
            type: 'text',
            status: '',
            picker: '',
            length: 1,
            slot: '',
          },
          {
            label: '变化周期',
            placeholder: '必填 请填写',
            keyName: 'period',
            keyType: '',
            type: 'number',
            status: '',
            picker: '',
            length: 1,
            slot: '',
          },
          {
            label: '付款方式',
            placeholder: '必填 请选择',
            readonly: 'readonly',
            keyName: 'pay_way',
            keyType: '',
            type: 'text',
            status: 'objInt',
            showForm: 'formatData',//picker 显示form 或 formatData
            picker: 'picker',
            button: '付款变化',
            slot: '',
          },
          {
            label: '月单价',
            placeholder: '必填 月单价',
            keyName: 'month_unit_price',
            keyType: '',
            type: 'number',
            status: '',
            picker: '',
            slot: '',
          },
        ],
      ],
    },
    {
      label: '押金',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'deposit',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '第一次支付时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'pay_first_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '第二次支付时间',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'pay_second_date',
      keyType: '',
      type: 'text',
      status: 'date',
      picker: 'picker',
      slot: '',
    },
    {
      label: '可否装修',
      readonly: 'readonly',
      placeholder: '必填 请选择',
      keyName: 'can_decorate',
      keyType: '',
      type: 'text',
      status: 'objInt',
      picker: 'pickerCon',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '可否添加物品',
      readonly: 'readonly',
      placeholder: '必填 请选择',
      keyName: 'can_add_goods',
      keyType: '',
      type: 'text',
      status: 'objInt',
      picker: 'pickerCon',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '是否渠道',
      readonly: 'readonly',
      placeholder: '必填 请选择',
      keyName: 'is_agency',
      keyType: '',
      type: 'text',
      status: 'objInt',
      picker: 'picker',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '渠道名称',
      placeholder: '必填 请输入',
      keyName: 'agency_name',
      keyType: '',
      hidden: true,
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '渠道价格',
      placeholder: '必填 请输入',
      keyName: 'agency_price',
      keyType: '',
      hidden: true,
      type: 'number',
      status: '',
      slot: '',
    },
    {
      label: '渠道联系人',
      placeholder: '必填 请输入',
      keyName: 'agency_user_name',
      keyType: '',
      hidden: true,
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '渠道手机',
      placeholder: '必填 请输入',
      keyName: 'agency_phone',
      keyType: '',
      hidden: true,
      type: 'number',
      status: '',
      slot: '',
    },
    {
      label: '非房东费用',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'non_landlord_fee',
      keyType: [],
      type: 'textarea',
      status: '',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'non_landlord_fee',
      slot: '',
      checks: [
        {
          id: 1,
          text: '水费',
        },
        {
          id: 2,
          text: '电费',
        },
        {
          id: 3,
          text: '燃气费',
        },
        {
          id: 4,
          text: '物业管理费',
        },
        {
          id: 5,
          text: '网费',
        },
        {
          id: 6,
          text: '其它费用',
        },
      ],
    },
    {
      label: '备注条款',
      placeholder: '必填 请选择',
      keyName: 'remark_terms',
      keyType: [],
      type: 'textarea',
      picker: 'remark_terms',
      slot: '',
    },
    {
      label: '开单人',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'staff_name',
      keyType: '',
      type: 'text',
      status: '',
      // picker: 'searchStaff',
      picker: '',
      slot: '',
    },
    {
      label: '部门',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'department_name',
      keyType: '',
      type: 'text',
      status: '',
      // picker: 'searchDepart',
      picker: '',
      slot: '',
    },
  ],
};

// 租房报备
defineRentReport = {
  slither0: [
    {
      label: '房屋地址',// 标题
      placeholder: '必填 请选择',// placeholder
      // readonly: 'readonly',// 只读 picker必须有值
      disabled: 'disabled',// 禁用
      keyName: 'house_address',// 字段名
      keyType: '',// 数据类型
      type: 'text',// input 类型
      // date为正常日期选择  arr picker源数据为数组确定值为int  obj picker源数据为对象确定值为{id:'',name:''}格式 arrs多列选择确定值为[] objInt确定值为 int 弹窗内选择日期dateSlot
      status: '',
      // picker: 'searchVillage',// 是否显示在弹窗内 不存在为正常输入框 值为picker正常选择 searchVillage 搜索小区
      // showForm: 'formatData',//picker 显示form 或 formatData
      // prompts: '',//红色提示信息
      // pickerRead: 'no', // 在弹窗内是否为readonly// 1房屋信息 2物品信息 3合同信息 4客户信息
      slot: '',// 预留字段
    },
    {
      label: '小区地址',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'community',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '所属区域',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'position',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '产权地址',
      placeholder: '必填 请输入',
      keyName: 'property_address',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '产权人',
      placeholder: '必填 请输入',
      keyName: 'property_owner',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '门牌地址',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'door_address',
      keyType: [],
      type: 'text',
      status: '',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
      moreArray: [
        {
          label: '栋',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
        {
          label: '单元',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
        {
          label: '门牌号',
          placeholder: '必填',
          type: 'text',
          keyType: '',
          status: '',
          slot: '',
        },
      ],
    },
    {
      label: '户型',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'house_type',
      keyType: [],
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '面积',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'area',
      keyType: '',
      type: 'number',
      status: '',
      unit: '平米',
      slot: '',
    },
    {
      label: '装修',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'decorate',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '朝向',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'direction',
      keyType: '',
      type: 'text',
      status: 'obj',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '楼层',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'floors',
      keyType: [],
      type: 'text',
      status: 'arrs-3-0',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '物业费',
      disabled: 'disabled',
      placeholder: '已禁用',
      keyName: 'property_fee',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '物业电话',
      disabled: 'disabled',
      placeholder: '已禁用',
      keyName: 'property_phone',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '房屋类型',
      placeholder: '已禁用',
      disabled: 'disabled',
      keyName: 'property_type',
      keyType: '',
      type: 'text',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '持有证件',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'holding_documents_type',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '产权证号',
      placeholder: '必填 请输入',
      keyName: 'property_right_card_number',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '丘权号',
      placeholder: '必填 请输入',
      keyName: 'qiu_quan_number',
      keyType: '',
      type: 'text',
      status: '',
      slot: '',
    },
    {
      label: '门锁类型',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'lock_type',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker',
      slot: '',
    },
    {
      label: '其它问题',
      placeholder: '请输入',
      keyName: 'other_remark',
      keyType: '',
      type: 'textarea',
      status: '',
      slot: '',
    },
    {
      label: '上传',
      picker: 'upload',
      value: [
        {
          label: '房产证照片',
          placeholder: '必填',
          keyName: 'photo',
        }, {
          label: '房屋影像',
          placeholder: '必填',
          keyName: 'house_video',
        }
      ]
    },
  ],
};

// 收房交接单
// 物品交接
defineArticleReceipt = {
  slither0: [
    {
      label: '门锁类型',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'lock_type',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker1',
      slot: '',
    },
    {
      label: '钥匙',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'key_arr',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker1',
      unit: '把',
      slot: '',
    },
    {
      label: '纱窗',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'shachuang',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker1',
      slot: '',
    },
    {
      label: '天然气',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'has_gas',
      keyType: '',
      type: 'text',
      status: 'objInt',
      showForm: 'formatData',//picker 显示form 或 formatData
      picker: 'picker1',
      slot: '',
    },
    {
      label: '彩电',
      placeholder: '必填 请选择',
      readonly: 'readonly',
      keyName: 'television',
      keyType: [],
      type: 'text',
      status: 'arrs-0-0-0',
      picker: 'picker1',
      showForm: 'formatData',//picker 显示form 或 formatData
      slot: '',
    },
    {
      label: '上传',
      picker: 'upload',
      value: [
        {
          label: '损坏照片',
          placeholder: '必填',
          keyName: 'photo',
        }
      ]
    },
  ],
  // slither1: [
  //   {
  //     label: '门锁类型',
  //     placeholder: '必填 请选择',
  //     readonly: 'readonly',
  //     keyName: 'lock_type',
  //     keyType: '',
  //     type: 'text',
  //     status: 'objInt',
  //     showForm: 'formatData',//picker 显示form 或 formatData
  //     picker: 'picker1',
  //     slot: '',
  //   },
  // ],
  // slither2: [
  //   {
  //     label: '门锁类型',
  //     placeholder: '必填 请选择',
  //     readonly: 'readonly',
  //     keyName: 'lock_type',
  //     keyType: '',
  //     type: 'text',
  //     status: 'objInt',
  //     showForm: 'formatData',//picker 显示form 或 formatData
  //     picker: 'picker1',
  //     slot: '',
  //   },
  // ],
};
// 费用交接
defineCostReceipt = {};
