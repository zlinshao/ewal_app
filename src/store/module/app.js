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
    bulletinPreFill: {},
    //审批切换
    approvalTab: {
      tab: '1',
      status: 0,
    },
    // 待办任务切换
    doneTab: '1',
  },
  // 计算属性
  getter: {},
  // 函数声明
  mutations: {
    // 报备草稿预填
    BULLETIN_DRAFT(state, view) {
      state.bulletinPreFill = view;
    },
    // 个人信息
    PERSONAL_STORAGE(state, view) {
      let p = JSON.parse(view);
      state.personalDetail = p;
      for (let item of Object.keys(state.personal)) {
        state.personal[item] = p[item];
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
    SWITCH_VIDEO(state,status) {
      state.video_visible = status;
    }
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
    // 报备草稿预填
    bulletin_draft({commit}, view) {
      commit('BULLETIN_DRAFT', view);
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
    switch_video({commit},status) {
      commit('SWITCH_VIDEO',status);
    }
  }
};

export default app
