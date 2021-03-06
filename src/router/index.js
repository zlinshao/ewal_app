import Vue from 'vue'
import Router from 'vue-router'
import Redirect from '@/components/redirect.vue'
import HomePage from '@/components/index.vue'
import CloseDD from '@/components/closeDD.vue'

// 收房合同
import CollectReport from '@/components/pages/collectReport/index.vue'//收房
import ToBeDone from '@/components/pages/toBeDone/index.vue'//市场部待办
import ToBeDoneList from '@/components/pages/toBeDoneList/index.vue'//所有待办
import DatumRecord from '@/components/pages/toBeDoneList/addRecord/datumRecord.vue'//增加资料跟进记录
import PunchClock from '@/components/pages/punchClock/index.vue'//待办
import DeliveryReceipt from '@/components/pages/toBeDoneList/deliveryReceipt/index.vue'//交接单
import Approvals from '@/components/pages/approvals/index.vue'//业务审批
import AdminApprovals from '@/components/pages/adminApprovals/index.vue'//行政审批
import StartApproval from '@/components/pages/adminApprovals/startApproval.vue'//发起审批
import ApprovalDetail from '@/components/pages/approvals/detail.vue'//审核
import CreatedTask from '@/components/pages/createdTask/index.vue'//新建 带看任务
import CreatedVillage from '@/components/pages/createdVillage/index.vue'//新建小区
import ContractSearch from '@/components/pages/contractSearch/index.vue'//合同搜索

// 补充协议
import SupplyAgreement from '@/components/pages/supplyAgreement/index.vue'

//房源管理
import HouseResource from '@/components/pages/houseResource/index.vue';
import HouseDetail from '@/components/pages/houseResource/house_detail.vue';
import HouseProperty from '@/components/pages/houseResource/house_property.vue';
import HouseContract from '@/components/pages/houseResource/houseContract.vue';
import HouseImage from '@/components/pages/houseResource/house_image.vue';

//合同管理
import Contract from '@/components/pages/contract/index.vue';
import ContractDetail from '@/components/pages/contract/contract-detail.vue';

//问卷调查
import Questionnaire from '@/components/pages/questionnaire/index.vue';
import CreateQuestionnaire from '@/components/pages/questionnaire/createQuestionnaire.vue';
import Exam from '@/components/pages/exam';

//数据看板
import DataBillBoard from '@/components/pages/dataBillBoard/index.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '验证中',
      hidden: false,
      component: Redirect,
      meta: {title: '验证中', index: 0},
    },
    {
      path: '/closeDD',
      name: '正在跳转...',
      hidden: false,
      component: CloseDD,
      meta: {title: '正在跳转...', index: 0},
    },
    {
      path: '/index',
      name: '首页',
      component: HomePage,
      meta: {title: '首页', index: 1},
    },
    {
      path: '/createdTask',
      name: '新建-带看任务',
      component: CreatedTask,
      meta: {title: '新建-带看任务', index: 1},
    },
    {
      path: '/contractSearch',
      name: '选择房屋',
      component: ContractSearch,
      meta: {title: '选择房屋', index: 3},
    },
    {
      path: '/supplyAgreement',
      name: '补充协议',
      component: SupplyAgreement,
      meta: {title: '补充协议', index: 1},
    },
    {
      path: '/createdVillage',
      name: '新建小区',
      component: CreatedVillage,
      meta: {title: '新建小区', index: 3},
    },
    {
      path: '/toBeDoneList',
      name: '待办列表',
      hidden: 'index.vue',
      component: ToBeDoneList,
      meta: {title: '待办列表', index: 4},
    },
    {
      path: '/punchClock',
      name: '带看打卡',
      hidden: 'index.vue',
      component: PunchClock,
      meta: {title: '带看打卡', index: 3},
    },
    {
      path: '/approvals',
      name: '业务审批',
      hidden: 'index.vue',
      component: Approvals,
      meta: {title: '业务审批', index: 5},
    },
    {
      path: '/adminApprovals',
      name: '行政审批',
      hidden: 'index.vue',
      component: AdminApprovals,
      meta: {title: '行政审批', index: 5},
    },
    {
      path: '/startApproval',
      name: '发起审批',
      hidden: 'index.vue',
      component: StartApproval,
      meta: {title: '发起审批', index: 6},
    },
    {
      path: '/approvalDetail',
      name: '审核',
      component: ApprovalDetail,
      meta: {title: '审核', index: 6},
    },
    {
      path: '/deliveryReceipt',
      name: '交接',
      component: DeliveryReceipt,
      meta: {title: '交接', index: 6},
    },
    {
      path: '/datumRecord',
      name: '增加资料跟进记录',
      component: DatumRecord,
      meta: {title: '增加资料跟进记录', index: 3},
    },
    {
      path: '/toBeDone',
      name: '待办',
      component: ToBeDone,
      meta: {title: '待办', index: 2},
    },
    {
      path: '/collectReport',
      name: '报备',
      component: CollectReport,
      meta: {title: '报备', index: 5},
    },
    {
      path: '/houseResource',
      name: '房源管理',
      component: HouseResource,
      meta: {title: '房源管理', index: 8}
    },
    {
      path: '/houseDetail',
      name: '房源详情',
      component: HouseDetail,
      meta: {title: '房源详情', index: 8}
    },
    {
      path: '/houseProperty',
      name: '房屋配置',
      component: HouseProperty,
      meta: {title: '房屋配置', index: 9}
    },
    {
      path: '/houseContract',
      name: '房屋合同',
      component: HouseContract,
      meta: {title: '房屋合同', index: 10}
    },
    {
      path: '/house_image',
      name: '房屋照片',
      component: HouseImage,
      meta: {title: '房屋照片', index: 11}
    },
    {
      path: '/contract',
      name: '合同管理',
      component: Contract,
      meta: {title: '合同管理', index: 12}
    },
    {
      path: '/contract_detail',
      name: '合同详情',
      component: ContractDetail,
      meta: {title: '合同详情', index: 13}
    },
    {/*问卷调查*/
      path: '/questionnaire',
      name: 'questionnaire',
      component: Questionnaire,
      meta: {title: '问卷调查', index: 1},
    },
    {
      path: '/createQuestionnaire',
      name: 'createQuestionnaire',
      component: CreateQuestionnaire,
      meta: {title: '创建问卷', index: 2}
    },
    {/*考试*/
      path: '/exam',
      component: Exam,
      name: 'exam',
      meta: {title: '考试', index: 4},
    },
    {
      path: '/dataBillBoard',
      name: '数据看板',
      component: DataBillBoard,
      meta: {title: '数据看板', index: 8}
    },
  ]
})
