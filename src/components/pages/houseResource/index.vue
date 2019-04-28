<template>
  <div id="houseResource">
    <div class="houseResource" :style="mainListHeight()">
      <!--顶部筛选-->
      <div class="top-search" ref="topSearch">
        <div class="searchInput">
          <div class="input">
            <p @click="chooseClickCity(params.city)">
              {{city_name}}
              <i></i>
            </p>
            <div>
              <input type="text" placeholder="请输入搜索内容" v-model="params.search" @keyup.enter="onSearch()">
              <span v-if="params.search" @click="params.search = ''"></span>
            </div>
            <p class="searchBtn" @click="onSearch()">搜索</p>
          </div>
          <div class="chooseBtn" v-if="chooseCity">
            <p v-for="item in cityList" @click="chooseClickCity(item)">
              <b :class="{'choose': city_name === item.name}">{{item.name}}</b>
            </p>
          </div>
        </div>
        <div class="search-type flex-center">
          <span v-for="tmp in filter_list" :key="tmp.id" @click="handleFilterHouse(tmp)">
            {{ tmp.val }}
            <van-icon name="arrow-down" v-show="!tmp.active"></van-icon>
            <van-icon name="arrow-up" v-show="tmp.active"></van-icon>
          </span>
        </div>
      </div>
      <ExpandContainer :offset-top="offset_top" @close="handleCloseExpand">
        <div class="filter-content scroll_bar">
          <div class="chooseBtn" v-if="current_filter === 1">
            <p v-for="item in house_status" @click="chooseHouseStatus(item)">
              <b :class="{'choose': status_choose === item.id}">{{ item.val }}</b>
            </p>
          </div>
          <div v-if="current_filter === 2" class="house-type">
            <h4>房型</h4>
            <div class="chooseBtn">
              <p v-for="item in house_type" @click="chooseHouseProperty(item,'room')">
                <b :class="{'choose': params.room.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>装修</h4>
            <div class="chooseBtn">
              <p v-for="item in house_decorate" @click="chooseHouseProperty(item,'decorate')">
                <b :class="{'choose': params.decorate.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>朝向</h4>
            <div class="chooseBtn">
              <p v-for="item in house_orientation" @click="chooseHouseProperty(item,'orientation')">
                <b :class="{'choose': params.orientation.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>楼层</h4>
            <div class="chooseBtn">
              <p v-for="item in house_floor" @click="chooseHouseProperty(item,'floor')">
                <b :class="{'choose': params.floor.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>电梯</h4>
            <div class="chooseBtn">
              <p v-for="item in house_lift" @click="chooseHouseProperty(item,'lift')">
                <b :class="{'choose': params.lift.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <div class="commonBtn radioChecksFoot">
              <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type)">
                {{item.label}}
              </p>
            </div>
          </div>
          <div v-if="current_filter === 4" class="house-type">
            <h4>房屋剩余时长</h4>
            <div class="chooseBtn">
              <p v-for="item in residue_time" @click="chooseHouseProperty(item,'residue_time')">
                <b :class="{'choose': params.residue_time.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>预警状态</h4>
            <div class="chooseBtn">
              <p v-for="item in house_warning_status" @click="chooseHouseProperty(item,'house_warning_status')">
                <b :class="{'choose': params.house_warning_status.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <div class="commonBtn radioChecksFoot">
              <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type)">
                {{item.label}}
              </p>
            </div>
          </div>
        </div>
      </ExpandContainer>
      <!--中间房源列表-->
      <div class="main-house-list" :style="mainHeight">
        <scroll-load :remHeight="remHeight" @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <div class="house flex" v-for="(item,key) in house_list" :key="key" @click="handleHouseDetail(item)">
            <div class="leftPic">
              <img src="./detail.png" alt="">
              <!--<a class="writingMode status1">{{ item.house_status_name }}</a>-->
              <a class="writingMode status2">未出租</a>
            </div>
            <div class="rightInfo">
              <h2>{{ item.name }} <a class="notice notice1" :class="['notice' + item.warning_status]"></a></h2>
              <div class="info flex">
                <a>{{ item.area }}㎡</a><i v-if="item.area"></i>
                <a>15/30</a><i></i>
                <a>{{ item.hk }}</a><i v-if="item.hk"></i>
                <a>{{ item.direction && item.direction.name || '/'}}</a><i></i>
                <a>{{ item.decorate }}</a>
              </div>
              <div class="flex tag">
                <a class="tag1">余1年5月12天</a>
                <a class="tag2" v-if="item.quality === 1">低质量</a>
              </div>
              <div class="bottom flex">
                <a></a>
                <h3>已空置15天</h3>
                <span>{{ item.suggest_price }}</span>
              </div>
            </div>
          </div>
          <div class="noMore" v-if="house_list.length === paging && house_list.length > 4">
            <span v-if="!fullLoading">没有更多了</span>
          </div>
          <div class="noData" v-if="!house_list.length">
            <span v-if="!fullLoading">暂无相关数据...</span>
          </div>
        </scroll-load>
      </div>
    </div>
    <div class="commonFooterTag">
      <p v-for="item in 4" :class="['p-'+item]" @click="footerTag(item)"></p>
    </div>
  </div>
</template>

<script>
  import ExpandContainer from './expand-container.vue';

  export default {
    name: "index",
    components: { ExpandContainer },
    data() {
      return {
        buttons: [
          {
            label: '重置',
            type: 'reset'
          },
          {
            label: '确定',
            type: 'confirm'
          },
        ],
        server: globalConfig.server_market,
        offset_top: 0,

        mainHeight: '',
        paging: 0,
        remHeight: 0,
        fullLoading: false,

        //房屋筛选
        filter_list: [
          {id: 1,val: '房屋状态',active: false},
          {id: 2,val: '房屋属性',active: false},
          {id: 3,val: '部门员工',active: false},
          {id: 4,val: '筛选',active: false},
        ],
        current_filter: 0,
        house_status: [
          {id: 0,val: '不限'},
          {id: 1,val: '未出租'},
          {id: 2,val: '已预订'},
          {id: 3,val: '已出租'},
          {id: 4,val: '待入住'},
          {id: 5,val: '已结束'},
        ],
        status_choose: '',

        house_type: [
          {id: 0,val: '不限'},
          {id: 1,val: '一室'},
          {id: 2,val: '两室'},
          {id: 3,val: '两室+'},
        ],
        house_decorate: [
          {id: 0,val: '不限'},
          {id: 1,val: '毛坯'},
          {id: 2,val: '简装'},
          {id: 3,val: '精装'},
          {id: 4,val: '豪装'},
        ],
        house_orientation: [
          {id: 0,val: '不限'},
          {id: 1,val: '东'},
          {id: 2,val: '南'},
          {id: 3,val: '西'},
          {id: 4,val: '北'},
        ],
        house_floor: [
          {id: 0,val: '不限'},
          {id: 1,val: '低楼层'},
          {id: 2,val: '中楼层'},
          {id: 3,val: '高楼层'},
        ],
        house_lift: [
          {id: 0,val: '不限'},
          {id: 1,val: '有电梯'},
          {id: 2,val: '无电梯'},
        ],
        residue_time: [
          {id: 0,val: '不限'},
          {id: 1,val: '一年以下'},
          {id: 2,val: '1-2年'},
          {id: 3,val: '2年以上'},
        ],
        house_warning_status: [
          {id: 0,val: '不限'},
          {id: 1,val: '正常'},
          {id: 2,val: '黄色预警'},
          {id: 3,val: '橙色预警'},
          {id: 4,val: '红色预警'},
        ],
        //城市选择
        cityList: [],
        chooseCity: false,
        city_name: '',
        searchList: [],

        params: {
          page: 1,
          limit: 12,
          search: '',
          name: '',
          city: [],
          room: [], //房型
          decorate:[], //装修
          orientation: [], //朝向
          floor: [],// 楼层
          lift: [], //电梯
          residue_time: [], //剩余时长
          house_warning_status: [] //预警
        },
        house_list: [], //房屋列表
      }
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.topSearch.offsetHeight;
        this.remHeight = top;
        this.mainHeight = this.mainListHeight(top + 50);
      });
      this.$http.getCityList().then(res => {
        this.cityList = res.data;
        this.getBeforeCity(res.data).then(res => {
          this.params.city = res.city;
          this.city_name = res.name;
        })
      });
      this.handleGetHouseResource();
    },
    watch: {},
    computed: {},
    methods: {
      //请求房屋详情
      handleHouseDetail(item) {
        this.routerLink('/houseDetail',{id: item.id});
        // this.routerLink('/houseDetail',{id: 248073});
      },
      //按钮
      searchBtn(type) {
        console.log(type);
        switch (type) {
          case 'reset':
            this.params.lift = [];
            this.params.floor = [];
            this.params.decorate = [];
            this.params.orientation = [];
            this.params.room = [];
            break;
        }
      },
      //选择房屋属性
      chooseHouseProperty(item,type) {
        if (this.params[type].indexOf(item.id) !== -1) {
          this.params[type].splice(this.params[type].indexOf(item.id),1);
        } else {
          this.params[type].push(item.id);
        }
      },
      //选择房屋状态
      chooseHouseStatus(tmp) {
        this.status_choose = tmp.id;
      },
      handleCloseExpand() {
        this.offset_top = 0;
        for (var item of this.filter_list) {
          item.active = false;
        }
      },
      //搜索
      onSearch() {
        this.handleGetHouseResource(this.params);
      },
      //获取房源列表
      handleGetHouseResource() {
        this.fullLoading = true;
        this.$http.get(this.server + 'v1.0/market/house',this.params,'加载中...').then(res => {
          this.fullLoading = false;
          if (res.code === 200) {
            // this.house_list = res.data.data;
            for (var item of res.data.data) {
              this.house_list.push(item);
            }
            this.paging = res.data.all_count;
          } else {
            this.house_list = [];
          }
        })
      },
      //滚动
      scrollLoad(val) {
        console.log(val);
        if (!val) {
          this.house_list = [];
          this.params.page = 1;
          this.handleGetHouseResource();
        } else {
          if (this.fullLoading) return;
          if (this.house_list.length === this.paging) return;
          this.params.page++;
          this.handleGetHouseResource();
        }
      },
      //房屋筛选
      handleFilterHouse(tmp) {
        console.log(tmp);
        this.offset_top = this.current_filter === tmp.id ? 0 : 117;
        this.filter_list[tmp.id - 1].active = this.offset_top <= 0;
        switch (tmp.id) {
          case 1:
            break;
        }
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
      },
      // 选择城市
      chooseClickCity(item) {
        this.chooseCity = !this.chooseCity;
        if (this.params.city === item) return;
        this.params.city = [];
        if (Array.isArray(item.code)) {
          this.params.city = item.code;
        } else {
          this.params.city.push(item.code);
        }
        this.city_name = item.name;
        this.searchList = [];
      },
      // 底部按钮跳转
      footerTag(val) {
        switch (val) {
          case 1:
            this.routerLink('/index');
            break;
          case 4:
            this.routerLink('/toBeDoneList', {status: 'noFinish'});
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/houseResource/index.scss";

</style>
