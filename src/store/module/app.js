const app = {
  state: {
    video_visible: true, //显示隐藏全局video
    key_up_status: false,
    personalDetail: {},//所有个人信息
    // 姓名/部门
    personal: {
      staff_id: '',
      staff_name: '',
      department_id: '',
      department_name: '',
    },
    bulletinTypes: '',
    bulletinPreFill: {},
    taskDetail: {},
    //审批切换
    approvalTab: {
      tab: '1',
      status: 0,
    },
    // 待办任务切换
    doneTab: '1',
    followRecord: {},//跟进记录
  },
  // 计算属性
  getter: {},
  // 函数声明
  mutations: {
    // 报备类型
    BULLETIN_TYPE(state, view) {
      state.bulletinTypes = view;
    },
    // 报备草稿预填
    BULLETIN_DRAFT(state, view) {
      state.bulletinPreFill = view;
    },
    // 任务详情
    TASK_DETAIL(state, view) {
      state.taskDetail = view;
    },
    // 个人信息
    PERSONAL_STORAGE(state, view) {
      let personal = JSON.parse(view);
      state.personalDetail = personal;
      for (let item of Object.keys(state.personal)) {
        state.personal[item] = personal[item];
      }
    },
    // 监听键盘弹出/收起
    KEY_UP_STATUS(state, view) {
      state.key_up_status = view;
    },
    // 审批切换
    APPROVAL_TABS(state, view) {
      state.approvalTab = view;
    },
    // 待办切换
    DONE_TABS(state, view) {
      state.doneTab = view;
    },
    // 开关video
    SWITCH_VIDEO(state, status) {
      state.video_visible = status;
    },
    // 跟进记录
    FOLLOW_RECORD(state, status) {
      state.followRecord = status;
    },
  },
  // 执行函数
  actions: {
    // 个人信息
    personal_storage({commit}, view) {
      commit('PERSONAL_STORAGE', view);
    },
    // 获取个人信息
    get_personal({commit}, view) {
      commit('GET_PERSONAL', view);
    },
    // 监听键盘弹出/收起
    key_up_status({commit}, view) {
      commit('KEY_UP_STATUS', view);
    },
    // 报备类型
    bulletin_type({commit}, view) {
      commit('BULLETIN_TYPE', view);
    },
    // 报备草稿预填
    bulletin_draft({commit}, view) {
      commit('BULLETIN_DRAFT', view);
    },
    // 任务 预填
    task_detail({commit}, view) {
      commit('TASK_DETAIL', view);
    },
    // 审批切换
    approval_tabs({commit}, view) {
      commit('APPROVAL_TABS', view);
    },
    // 待办切换
    done_tabs({commit}, view) {
      commit('DONE_TABS', view);
    },
    // 开关video
    switch_video({commit}, status) {
      commit('SWITCH_VIDEO', status);
    },
    // 跟进记录
    follow_record({commit}, status) {
      commit('FOLLOW_RECORD', status);
    },
  }
};

export default app
