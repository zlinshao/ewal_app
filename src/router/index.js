import Vue from 'vue'
import Router from 'vue-router'
import Redirect from '@/components/redirect.vue'
import HomePage from '@/components/index.vue'

// 收房合同
import CollectReport from '@/components/pages/collectReport/index.vue'//收房
import ToBeDone from '@/components/pages/toBeDone/index.vue'//市场部待办
import ToBeDoneList from '@/components/pages/toBeDoneList/index.vue'//所有待办
import PunchClock from '@/components/pages/punchClock/index.vue'//待办
import GoSignContract from '@/components/pages/punchClock/goSignContract.vue'//去签署
import Approvals from '@/components/pages/approvals/index.vue'//审批
import ApprovalDetail from '@/components/pages/approvals/detail.vue'//审核
import CreatedTask from '@/components/pages/createdTask/index.vue'//新建 带看任务
import CreatedVillage from '@/components/pages/createdVillage/index.vue'//新建小区

//房源管理
import HouseResource from '@/components/pages/houseResource/index.vue';



//问卷调查
import Questionnaire from '@/components/pages/questionnaire';
import Exam from '@/components/pages/exam';

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
      path: '/index',
      name: '首页',
      component: HomePage,
      meta: {title: '首页', index: 1},
    },
    {
      path: '/createdTask',
      name: '新建-收房带看任务',
      component: CreatedTask,
      meta: {title: '新建-收房带看任务', index: 1},
    },
    {
      path: '/createdVillage',
      name: '新建小区',
      component: CreatedVillage,
      meta: {title: '新建小区', index: 3},
    },
    {
      path: '/toBeDoneList',
      name: '待办',
      hidden: 'index',
      component: ToBeDoneList,
      meta: {title: '待办', index: 2},
    },
    {
      path: '/punchClock',
      name: '带看打卡',
      hidden: 'index',
      component: PunchClock,
      meta: {title: '带看打卡', index: 3},
    },
    {
      path: '/goSignContract',
      name: '去签署',
      hidden: 'index',
      component: GoSignContract,
      meta: {title: '去签署', index: 4},
    },
    {
      path: '/approvals',
      name: '审批',
      hidden: 'index',
      component: Approvals,
      meta: {title: '审批', index: 5},
    },
    {
      path: '/approvalDetail',
      name: '审核',
      component: ApprovalDetail,
      meta: {title: '审核', index: 6},
    },
    {
      path: '/toBeDone',
      name: '收房待办',
      hidden: 'index',
      component: ToBeDone,
      params: {type: 'collect'},
      meta: {title: '收房待办', index: 2},
    },
    {
      path: '/toBeDone',
      name: '租房',
      hidden: 'index',
      component: ToBeDone,
      params: {type: 'rent'},
      meta: {title: '租房', index: 5},
    },
    {
      path: '/collectReport',
      name: '收房报备',
      component: CollectReport,
      meta: {title: '收房报备', index: 5},
    },
    {
      path: '/houseResource',
      name: '收房报备',
      component: HouseResource,
      meta: {title: '房源管理', index: 7},
    },
    {/*问卷调查*/
      path:'/questionnaire',
      name:'questionnaire',
      component:Questionnaire,
      meta:{title:'问卷调查',index:3}
    },
    {/*考试*/
      path:'/exam',
      component:Exam,
      name:'exam',
      meta: {title:'考试',index:4},
    }
  ]
})
