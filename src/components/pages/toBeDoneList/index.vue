<template>
  <div id="toBeDoneList">
    <div>
      <div class="listTop" ref="listTop" @dblclick="goToTop">
        <div>
          <p @click="changeTop(item.id)" v-for="item in finishTop"
             :style="{'color': tabs === item.id ? '#FED836' : ''}">
            {{item.text}}&nbsp;<span v-if="item.id === '1'">{{total['total1']}}</span>
          </p>
        </div>
        <div class="topSearch" @click="searchHigh = !searchHigh"></div>
      </div>
      <div class="main" :style="mainHeight">
        <!--未完成-->
        <div class="noFinish" v-if="tabs === '1'">
          <scroll-load :name="'flex-warp'" @getLoadMore="scrollLoad" :disabled="!fullLoading['load1']">
            <li class="noFinishMain" v-for="(item,index) in finishList['list1']" @click="goOperates(item,'noFinish')">
              <div :class="['main-'+index,listLength.includes(index)?'mainTransform':'']">
                <p>{{item.title}}</p>
                <div class="toBeDoneType">{{item.name}}</div>
                <div class="progress">
                  <div :style="{'height': '50%'}">
                    <span>50<b>%</b></span>
                  </div>
                </div>
                <div>{{item.bulletin_type}}</div>
                <!--<div class="surplus">剩余</div>-->
                <!--<div>-->
                <!--<span class="unit">{{item.due_date_hours}}<b>h</b></span>-->
                <!--<span class="unit">{{item.due_date_minutes}}<b>m</b></span>-->
                <!--</div>-->
              </div>
            </li>
            <li class="noMore" v-if="finishList['list1'].length === total['total1'] && finishList['list1'].length > 6">
              <span v-if="!fullLoading['load1']">没有更多了</span>
            </li>
            <li class="noData" v-if="!finishList['list1'].length">
              <span v-if="!fullLoading['load1']">暂无相关数据...</span>
            </li>
          </scroll-load>
        </div>
        <!--已完成-->
        <div class="finish" v-if="tabs === '2'">
          <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading['load2']">
            <li class="finishMain" v-for="item in finishList['list2']" @click="goOperates(item,'finish')">
              <div>
                <div class="finish1">
                  <h1>{{item.title}}</h1>
                  <span></span>
                </div>
                <div class="finish2">
                  <p><span>{{item.name}}</span></p>
                  <div>
                    <h2>完成时间</h2>
                    <h3>{{item.endTime || ''}}</h3>
                  </div>
                </div>
              </div>
            </li>
            <li class="noMore" v-if="finishList['list2'].length === total['total2'] && finishList['list2'].length > 3">
              <span v-if="!fullLoading['load2']">没有更多了</span>
            </li>
            <li class="noData" v-if="!finishList['list2'].length">
              <span v-if="!fullLoading['load2']">暂无相关数据...</span>
            </li>
          </scroll-load>
        </div>
      </div>
    </div>
    <div class="commonFooterTag">
      <!-- <p v-for="item in 4" :class="['p-'+item]" @click="footerTag(item)"></p> -->
      <p :class="['p-'+1]" @click="footerTag(1)"></p>
      <p :class="['p-'+3]" @click="footerTag(3)"></p>
      <p :class="['p-'+4]" @click="footerTag(4)"></p>
    </div>

    <!--右侧栏-->
    <!--<div class="addToBeDone" @click="showAddPopup = true"></div>-->
    <van-popup v-model="showAddPopup" overlay-class="overlay-color" position="right" :overlay="true"
               class="showAddPopup">
      <p class="addTitle">
        <span class="writingMode">新建任务</span>
      </p>
      <div class="mainModule">
        <div class="module" :class="[' module'+(index+1)]" v-for="(item,index) in addShowList">
          <div @click="createRouter(item)">
            <i></i>
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
      <div class="popupBottom"></div>
    </van-popup>
    <!--搜索-->
    <van-popup v-model="searchHigh" overlay-class="overlay-color" position="top" :overlay="true" class="searchHigh"
               :style="maxSearchHeight">
      <div class="searchInput">
        <div class="input">
          <div>
            <input type="text" v-model="highParams.title" @keyup.enter="searchBtn()" placeholder="请输入搜索内容">
            <span v-if="highParams.title" @click="highParams.title = ''"></span>
          </div>
          <p v-if="highParams.title" class="searchBtn" @click="searchBtn()">搜索</p>
          <p @click="searchHigh = false" v-else>取消</p>
        </div>
      </div>
      <div class="scroll_bar">
        <div class="radioChecksLabel" v-for="item of Object.keys(highList)"
             v-if="(highList[item].type === 'check'&& highList[item].value.length>0 ) || (highList[item].type === 'radio' && tabs==1 )">
          <label>{{highList[item].title}}</label>
          <div class="radioChecks">
            <div v-for="val in highList[item].value" class="contents">
              <p @click="checkChoose(val,item)" v-if="highList[item].type === 'check'"
                 :class="{'chooseCheck': highParams[item].includes(val.id)}">
                {{val.text}}
              </p>
              <p @click="checkChoose(val,item)" :class="{'chooseCheck': highParams[item] === val.id}"
                 v-if="highList[item].type === 'radio'&& tabs==1">
                {{val.text}}
              </p>
            </div>
          </div>
        </div>
        <!-- 完成时间 -->
        <div class="radioChecksLabel3" v-if="tabs==2">
          <label>完成时间</label>
          <div class="radioChecks">
            <div class="contents3">
              <input v-model="taskCompleteBefore" @focus="chooseDate(1)" readonly="readonly" placeholder="开始时间">
              <span>至</span>
              <input v-model="taskCompleteAfter" @focus="chooseDate(2)" readonly="readonly" placeholder="结束时间">
            </div>
          </div>
        </div>

      </div>
      <div class="commonBtn">
        <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type)">
          {{item.label}}
        </p>
      </div>
    </van-popup>
    <!--未完成-->
    <no-finish :module="noFinishModule" :detail="noModuleDetail" @close="noFinisHidden"></no-finish>
    <!--已完成-->
    <finish :module="finishModule" :detail="moduleDetail" @close="finisHidden"></finish>
    <!--日期-->
    <choose-time :module="timeModule" :formatData="formatData" @close="onConTime"></choose-time>
  </div>
</template>

<script>
  import NoFinish from './components/noFinish.vue';
  import Finish from './components/finish.vue';

  export default {
    name: "index",
    components: {NoFinish, Finish},
    data() {
      return {
        //加载是否结束
        fullLoading: {
          load1: true,
          load2: true,
        },
        mainHeight: '',// 滚动 部分高度
        maxSearchHeight: '',// 搜索最大高度
        listLength: [],//中间上移 index
        finishTop: [
          {
            id: '1',
            text: '未完成'
          }, {
            id: '2',
            text: '已完成'
          },
        ],
        // 列表
        finishList: {
          list1: [],
          list2: [],
        },
        // 筛选条件
        params: {
          params1: {
            title: '',
            page: 1,
          },
          params2: {
            title: '',
            page: 1,
            // finished: true,
          },
        },
        // 总条数
        total: {
          total1: 0,
          total2: 0,
        },
        //右侧栏
        showAddPopup: false,
        addShowList: [
          {
            id: 'CollectTakeLook',
            text: '收房待看',
          }, {
            id: 'RentTakeLook',
            text: '租房待看',
          }, {
            id: 'HouseCleaning',
            text: '保洁任务',
          }, {}, {
            id: 'HouseRepair',
            text: '维修任务',
          }
        ],
        // 筛选
        searchHigh: false,
        // 条件搜索
        highParams: {},
        newHighParams: {},
        highList: {
          taskDefinitionKeyIn: {
            title: '待办类型',
            type: 'check',
            keyType: [],
            value: [],
          },
          times: {
            title: '剩余时间',
            type: 'radio',
            keyType: '',
            value: [
              {
                id: 1,
                text: '少于1 h',
              }, {
                id: 2,
                text: '1-6 h',
              }, {
                id: 3,
                text: '6-12 h',
              }, {
                id: 4,
                text: '12-24 h',
              }, {
                id: 5,
                text: '24 h以上',
              },
            ],
          },
        },
        buttons: [
          {
            label: '取消',
            type: 'back'
          },
          {
            label: '重置',
            type: 'reset'
          },
          {
            label: '确定',
          },
        ],
        // 未完成
        noFinishModule: false,
        noModuleDetail: {},
        //已完成
        finishModule: false,
        moduleDetail: {},
        // 完成时间
        timeModule: false,
        formatData: {
          dateType: 'date',
          dateKey: '',  //字段名
          dateVal: ''  //日期回显时
        },
        taskCompleteBefore: '',
        taskCompleteAfter: ''
      }
    },
    created() {
      this.resetting();
      // 代办类型的的数据
      this.getToDoTypeFun();
    },
    mounted() {


    },
    activated() {
      this.resetting();
      let listTop = this.$refs.listTop.offsetHeight;
      this.mainHeight = this.mainListHeight(listTop);
      this.maxSearchHeight = {maxHeight: (this.screenHeight - 120) + 'px'};
      let tab = this.tabs;
      this.close_(tab);
      this.getQueryDetail('1');
      this.getQueryDetail('2');
      if (tab === '2') {
        this.getFinishList('1');
      }
    },
    watch: {
      'highParams.title'(val) {
        this.highParams.title = val.replace(/\s+/g, '');
      },
    },
    computed: {
      tabs() {
        return this.$store.state.app.doneTab;
      },
      personal() {
        return this.$store.state.app.personal;
      },
    },
    methods: {
      // 新建带看
      createRouter(val) {
        if (val.id === 'CollectTakeLook' || val.id === 'RentTakeLook') {
          this.routerLink('/createdTask', val);
        }
      },
      getQueryDetail(tab) {
        this.params['params' + tab].taskDefinitionKeyNotIn = this.$taskDefinitionKey();
      },
      // 已完成 / 未完成 切换
      changeTop(val) {
        this.goToTop();
        this.highParamsHandle();
        if (this.tabs === val) return;
        this.resetting();
        this.$store.dispatch('done_tabs', val);
        if (!this.finishList['list' + val].length) {
          this.getFinishList(val);
        }
      },
      // 清空 列表
      close_(tab) {
        this.fullLoading = {
          load1: true,
          load2: true,
        };
        this.params['params' + tab].page = 1;
        this.finishList['list' + tab] = [];
      },
      // 滚动加载
      scrollLoad(val) {
        let tab = this.tabs;
        if (!val) {
          this.params['params' + tab].page = 1;
        } else {
          if (this.fullLoading['load' + tab]) return;
          if (this.finishList['list' + tab].length === this.total['total' + tab]) return;
          this.params['params' + tab].page++;
        }
        this.getFinishList(this.tabs);
      },
      // 请求列表
      getFinishList(tab, close = '') {
        let url = '';
        this.fullLoading['load' + tab] = true;

        let params = this.params['params' + tab];
        params = Object.assign({}, params, this.newHighParams);
        if (tab === '1') {
          url = 'runtime/tasks'; //未完成
        } else {
          url = 'history/tasks';  //已完成
          params.finished = true;
        }
        params.assignee = this.personal.staff_id;
        this.$httpZll.getToBeDoneListApi(url, params, close).then(res => {
          this.fullLoading['load' + tab] = false;
          if (res) {
            this.total['total' + tab] = res.total || 0;
            let data = this.groupHandlerListData(res.data);
            if (params.page === 1) {
              this.finishList['list' + tab] = data;
            } else {
              for (let item of data) {
                this.finishList['list' + tab].push(item);
              }
            }
            if (tab === '1') {
              this.listLength = [];
              let index = 1;
              for (let i of this.finishList['list1']) {
                this.listLength.push(index);
                index = index + 3;
              }
            }
          }
        })
      },
      // 列表事件
      goOperates(val, type) {
        let data = {};
        switch (type) {
          case 'noFinish':
            switch (val.taskDefinitionKey) {
              case 'CompleteData':
              case 'CompleteAsset':
                this.noFinishModule = true;
                this.noModuleDetail = val;
                break;
              case 'InputHandoverOrder'://交接单
                sessionStorage.setItem('bulletin_type', '{}');
                data.ewal_contract = val.ewal_contract;
                data.task_id = val.task_id;
                data.bulletin_type = val.bulletin_type;
                sessionStorage.setItem('task_detail', JSON.stringify(data));
                this.routerLink('/deliveryReceipt');
                break;
            }
            break;
          case 'finish':
            // this.finishModule = true;
            // this.moduleDetail = val;
            break;
        }
      },
      // 未完成 模态框
      noFinisHidden(val) {
        this.cancel();
        if (val !== 'close') {
          this.scrollLoad(false);
        }
      },
      // 已完成 模态框
      finisHidden(val) {
        this.cancel();
        if (val !== 'close') {
        }
      },
      // 取消
      cancel() {
        this.searchHigh = false;
        this.noFinishModule = false;
        this.finishModule = false;
      },
      // 筛选条件
      checkChoose(val, key) {
        let type = this.highList[key];
        if (type.type === 'radio') {
          this.highParams[key] = this.highParams[key] === val.id ? '' : val.id;
        } else {
          this.checkChooseCommon(val, this.highParams[key]);
        }
        this.highParams = Object.assign({}, this.highParams);
      },

      // 搜索按钮
      searchBtn(val) {
        switch (val) {
          case 'back':
            this.cancel();
            break;
          case 'reset':
            this.resetting();
            break;
          default:
            // 完成时间的判断
            if (this.tabs == 2) {
              if (this.taskCompleteBefore && this.taskCompleteAfter) {
                if (this.taskCompleteBefore > this.taskCompleteAfter) {
                  this.$prompt("开始时间不能大于结束时间");
                  return;
                }
              }
            }
            // 搜索的时候清空列表数据，页数为1
            this.params['params' + this.tabs].page = 1;
            if (this.tabs == 1) {
              this.finishList['list1'] = [];
            } else {
              this.finishList['list2'] = [];
            }

            this.getFinishList(this.tabs);
            this.cancel();
            break;
        }
      },
      // 重置搜索
      resetting() {
        let list = this.jsonClone(this.highList);
        for (let item of Object.keys(list)) {
          this.highParams[item] = list[item].keyType;
        }
        this.highParams.title = '';
        this.taskCompleteBefore = '';
        this.taskCompleteAfter = '';
        this.newHighParams = {};
        this.highParams = Object.assign({}, this.highParams);
      },
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.routerReplace('/index');
            break;
          case 3:
            this.routerReplace('/houseResource');
            break;
        }
      },


      //待办类型数据获取
      getToDoTypeFun() {
        let params = {
          assignee: this.personal.staff_id,
          taskDefinitionKeyNotIn: this.$taskDefinitionKey()
        };
        this.$httpZll.getToDoTypeList(params).then(res => {
          if (res) {
            // 将数组中的字段转换成id、text
            let arr = res;
            let newArr = [];
            let obj = {id: '', text: ''};
            arr.forEach(element => {
              obj.id = element.key;
              obj.text = element.name;
              newArr.push(obj);
              obj = {id: '', text: ''};
            });
            this.highList.taskDefinitionKeyIn.value = newArr;
          }
        })
      },
      // 将筛选条件中的剩余时间进行处理成时间格式
      setTimeFun(val) {
        let date = {
          dueBefore: '',
          dueAfter: ''
        };
        switch (val) {
          case 1:
            date.dueBefore = '';
            date.dueAfter = new Date().getTime() + 60 * 60 * 1000;
            break;
          case 2:
            date.dueBefore = new Date().getTime() + 60 * 60 * 1000;
            date.dueAfter = new Date().getTime() + 6 * 60 * 60 * 1000;
            break;
          case 3:
            date.dueBefore = new Date().getTime() + 6 * 60 * 60 * 1000;
            date.dueAfter = new Date().getTime() + 12 * 60 * 60 * 1000;
            break;
          case 4:
            date.dueBefore = new Date().getTime() + 12 * 60 * 60 * 1000;
            date.dueAfter = new Date().getTime() + 24 * 60 * 60 * 1000;
            break;
          case 5:
            date.dueBefore = new Date().getTime() + 24 * 60 * 60 * 1000;
            date.dueAfter = '';
            break;
          case '':
            date.dueBefore = '';
            date.dueAfter = '';
            break;
        }
        return date;
      },

      // 完成时间
      chooseDate(val) {
        this.timeModule = true;
        switch (val) {
          case 1:   //开始时间
            this.formatData.dateKey = 'taskCompleteBefore';
            this.formatData.dateVal = this.taskCompleteBefore;
            break;
          case 2:  //结束时间
            this.formatData.dateKey = 'taskCompleteAfter';
            this.formatData.dateVal = this.taskCompleteAfter;
            break;
        }
      },
      // 日期组件的事件
      onConTime(val) {
        this.timeModule = false;
        if (val !== 'close') {
          if (val.dateKey === 'taskCompleteBefore') {
            this.taskCompleteBefore = val.dateVal;
          } else if (val.dateKey === 'taskCompleteAfter') {
            this.taskCompleteAfter = val.dateVal;
          }
        }
      },

      //高级搜索的参数配置
      highParamsHandle() {
        this.newHighParams = {};
        //待办类型由数组转化为字符串
        let taskDefinitionKeyIn = '';
        if (this.highParams.taskDefinitionKeyIn && this.highParams.taskDefinitionKeyIn.length > 0) {
          taskDefinitionKeyIn = this.highParams.taskDefinitionKeyIn.join(',');
        }
        if (this.tabs == 1) {
          let times = this.setTimeFun(this.highParams.times);   //剩余时间的处理
          this.newHighParams = {
            dueBefore: times.dueBefore,
            dueAfter: times.dueAfter,
            taskDefinitionKeyIn: taskDefinitionKeyIn,
            title: this.highParams.title,
          }
        } else if (this.tabs == 2) {
          this.newHighParams = {
            taskCompleteBefore: this.taskCompleteBefore,
            taskCompleteAfter: this.taskCompleteAfter,
            taskDefinitionKeyIn: taskDefinitionKeyIn,
            title: this.highParams.title,
          }
        }
        // this.params['params' + this.tabs] = Object.assign({},this.params['params' + this.tabs], this.newHighParams);
      },

    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/toBeDoneList/index.scss";
</style>
