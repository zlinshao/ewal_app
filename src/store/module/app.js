const app = {
  state: {
    video_visible: true, //显示隐藏全局video
    key_up_status: false,
    allCityList: [],//所有城市
    personalDetail: {},//所有个人信息
    // 姓名/部门
    personal: {
      staff_id: '',
      staff_name: '',
      department_id: '',
      department_name: '',
    },
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
    // 个人信息
    PERSONAL_STORAGE(state, view) {
      state.personalDetail = view;
      for (let item of Object.keys(state.personal)) {
        state.personal[item] = view[item];
      }
    },
    // 所有城市
    ALL_CITY_LIST(state, view) {
      console.log(view);
      state.allCityList = view;
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
  },
  // 执行函数
  actions: {
    // 个人信息
    personal_storage({commit}, view) {
      commit('PERSONAL_STORAGE', view);
    },
    // 所有城市
    all_city_list({commit}, view) {
      commit('ALL_CITY_LIST', view);
    },
    // 监听键盘弹出/收起
    key_up_status({commit}, view) {
      commit('KEY_UP_STATUS', view);
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
    // 签署路由
    sign_routers({commit}, status) {
      commit('SIGN_ROUTERS', status);
    },
  }
};

export default app
