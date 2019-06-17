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
            <van-icon name="arrow-down" v-show="tmp.active"></van-icon>
            <van-icon name="arrow-up" v-show="!tmp.active"></van-icon>
          </span>
        </div>
      </div>
      <ExpandContainer :offset-top="offset_top" @close="handleCloseExpand">
        <div class="filter-content scroll_bar">
          <div class="chooseBtn" v-if="current_filter === 1">
            <p class="choose-btn-item" v-for="item in house_status" @click="chooseHouseStatus(item)">
              <b :class="{'choose': status_choose === item.id}">{{ item.val }}</b>
            </p>
          </div>
          <div v-if="current_filter === 2" class="house-type">
            <h4>房型</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_type" @click="chooseHouseProperty(item,'room')">
                <b :class="{'choose': params.room.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>装修</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_decorate" @click="chooseHouseProperty(item,'decoration')">
                <b :class="{'choose': params.decoration.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>朝向</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_orientation" @click="chooseHouseProperty(item,'house_toward')">
                <b :class="{'choose': params.house_toward.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>楼层</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_floor" @click="chooseHouseProperty(item,'floor')">
                <b :class="{'choose': params.floor.includes(item.id)}">{{ item.val }}</b>
              </p>
              <p class="choose-btn-item">
                <van-field placeholder="最低层" type="number" @input="handleInputBottom"></van-field>
              </p>
              <a style="margin-top: .2rem">-</a>
              <p class="choose-btn-item">
                <van-field placeholder="最高层" type="number" @input="handleInputTop"></van-field>
              </p>
            </div>
            <h4>电梯</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_lift" @click="chooseHouseProperty(item,'house_lift')">
                <b :class="{'choose': params.house_lift.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <!--<div class="commonBtn">
              <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type,1)">
                {{item.label}}
              </p>
            </div>-->
          </div>
          <div v-if="current_filter === 3" class="house-type">
            <StaffDepartSearch :visible="staff_depart_visible" @close="handleGetStaffDepartInfo"></StaffDepartSearch>
          </div>
          <div v-if="current_filter === 4" class="house-type">
            <h4>房屋剩余时长</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in residue_time" @click="chooseHouseProperty(item,'rent_days')">
                <b :class="{'choose': params.rent_days.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>预警状态</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_warning_status" @click="chooseHouseProperty(item,'warning_status')">
                <b :class="{'choose': params.warning_status.includes(item.id)}">{{ item.val }}</b>
              </p>
            </div>
            <h4>当前空置时长</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_floor" @click="chooseHouseProperty(item,'kong')">
                <b :class="{'choose': params.kong.includes(item.id)}">{{ item.val }}</b>
              </p>
              <p class="choose-btn-item">
                <van-field placeholder="请输入" type="number" @input="handleKongBottom"></van-field>
              </p>
              <a style="margin-top: .2rem">-</a>
              <p class="choose-btn-item">
                <van-field placeholder="请输入" type="number" @input="handleKongTop"></van-field>
              </p>
            </div>
            <h4>出租价格</h4>
            <div class="chooseBtn">
              <p class="choose-btn-item" v-for="item in house_floor" @click="chooseHouseProperty(item,'rent_price')">
                <b :class="{'choose': params.rent_price.includes(item.id)}">{{ item.val }}</b>
              </p>
              <p class="choose-btn-item">
                <van-field placeholder="请输入" type="number" @input="handlePriceBottom"></van-field>
              </p>
              <a style="margin-top: .2rem">-</a>
              <p class="choose-btn-item">
                <van-field placeholder="请输入" type="number" @input="handlePriceTop"></van-field>
              </p>
            </div>
            <!--<div class="commonBtn">
              <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type,2)">
                {{item.label}}
              </p>
            </div>-->
          </div>
          <div class="commonBtn" v-if="current_filter!=3">
            <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="searchBtn(item.type,current_filter)">
              {{item.label}}
            </p>
          </div>
        </div>
      </ExpandContainer>
      <!--中间房源列表-->
      <div class="main-house-list" :style="mainHeight">
        <scroll-load @getLoadMore="scrollLoad" :disabled="!fullLoading">
          <div class="house flex" v-for="(item,key) in house_list" :key="key" @click="handleHouseDetail(item)">
            <div class="leftPic">
              <!--              <img src="./detail.png" alt="">-->
              <img v-if="item.album_photo.length>0" :src="item.album_photo[item.album_photo.length-1].uri" alt="">
              <img v-else src="./detail.png">
              <a class="writingMode status1">{{ item.house_status_name }}</a>
              <!--<a class="writingMode status2">未出租</a>-->
            </div>
            <div class="rightInfo">
              <h2 class="house-name">{{ item.name }} <a class="notice" :class="['notice' + item.warning_status]"></a></h2>
              <div class="info flex">
                <a>{{ parseInt(item.area) || 0}}㎡</a><i></i>
                <a>{{ item.floor && item.floor.this || 0 }}/{{ item.floor && item.floor.all || 0 }}</a><i></i>
                <a>{{ item.hk || '/'}}</a><i></i>
                <a>{{ item.house_toward || '/'}}</a><i></i>
                <a>{{ item.decorate || '/'}}</a>
              </div>
              <div class="flex tag">
                <a class="tag1">余{{ item.remaining_rent_days }}天</a>
                <a class="tag2" v-if="item.quality === 1">低质量</a>
              </div>
              <div class="bottom flex">
                <a></a>
                <h3>{{ item.house_status_content }}</h3>
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
      <p v-for="item in indexBottom" :class="item.icon" @click="footerTag(item.id)"></p>
    </div>
  </div>
</template>

<script>
  import ExpandContainer from './expand-container.vue';
  import StaffDepartSearch from '../../common/staff-depart-search.vue';

  export default {
    name: "index",
    components: {ExpandContainer, StaffDepartSearch},
    data() {
      return {
        staff_depart_visible: false, //员工部门选择


        indexBottom: [
          {
            id: 1,
            icon: 'p-1',
          },
          // {
          //   id: '2',
          //   icon: tab_home2,
          // },
          {
            id: 3,
            icon: 'p-3',
          },
          {
            id: 4,
            icon: 'p-4',
          },
        ],


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
        fullLoading: false,

        //房屋筛选
        filter_list: [
          {id: 1, val: '房屋状态', active: false},
          {id: 2, val: '房屋属性', active: false},
          {id: 3, val: '部门员工', active: false},
          {id: 4, val: '筛选', active: false},
        ],
        current_filter: 0,
        house_status: [
          {id: 0, val: '不限'},
          {id: 1, val: '未出租'},
          {id: 2, val: '已预订'},
          {id: 3, val: '已出租'},
          {id: 4, val: '待入住'},
          {id: 5, val: '已结束'},
        ],
        status_choose: '',

        house_type: [
          {id: 0, val: '不限'},
          {id: 1, val: '一室'},
          {id: 2, val: '两室'},
          {id: 3, val: '两室+'},
        ],
        house_decorate: [
          {id: 0, val: '不限'},
          {id: 1, val: '毛坯'},
          {id: 2, val: '简装'},
          {id: 3, val: '精装'},
          {id: 4, val: '豪装'},
        ],
        house_orientation: [
          {id: 0, val: '不限'},
          {id: 1, val: '东'},
          {id: 2, val: '南'},
          {id: 3, val: '西'},
          {id: 4, val: '北'},
        ],
        house_floor: [
          {id: 0, val: '不限'},
        ],
        house_lift: [
          {id: 0, val: '不限'},
          {id: 1, val: '有电梯'},
          {id: 2, val: '无电梯'},
        ],
        residue_time: [
          {id: 0, val: '不限'},
          {id: 1, val: '一年以下'},
          {id: 2, val: '1-2年'},
          {id: 3, val: '2年以上'},
        ],
        house_warning_status: [
          {id: 0, val: '不限'},
          {id: 1, val: '正常'},
          {id: 2, val: '黄色预警'},
          {id: 3, val: '橙色预警'},
          {id: 4, val: '红色预警'},
        ],
        //城市选择
        chooseCity: false,
        city_name: '',
        searchList: [],

        params: {
          page: 1,
          limit: 12,
          search: '',
          name: '',
          status: [],
          city: [],
          room: [], //房型
          decoration: [], //装修
          house_toward: [], //朝向
          floor: [],// 楼层
          house_lift: [], //电梯
          rent_days: [], //剩余时长
          warning_status: [], //预警
          rent_price: [],
          kong: [], //空置天数
          is_org_user: 0,
          org_user_id: [],
          city_id:'',
        },
        house_list: [], //房屋列表
      }
    },
    mounted() {
      this.$nextTick(function () {
        let top = this.$refs.topSearch.offsetHeight;
        this.mainHeight = this.mainListHeight(top + 50);
      });
    },

    activated() {
      let kong = this.$route.query.kong;
      if(kong && kong.constructor==Array) {
        this.params.kong = kong;
      }
      this.params.city_id = this.personal.city_id;
      delete this.params.is_org_user;
      this.handleGetHouseResource(true);
    },

    deactivated() {
      this.params.kong = [];
    },

    watch: {},
    computed: {
      personal() {
        return this.$store.state.app.personalDetail;
      },
      cityList() {
        return this.$store.state.app.allCityList;
      }
    },
    methods: {
      handleGetStaffDepartInfo(val, type) {
        if (val !== 'close') {
          this.params.org_user_id = [];
          this.params.is_org_user = type === 'staff' ? 2 : 1;
          for (let item of val) {
            this.params.org_user_id.push(item.id);
          }
          this.handleGetHouseResource(true);
        }
        this.staff_depart_visible = false;
        this.offset_top = 0;
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
      },
      handleKongBottom(val) {
        this.params.kong[0] = val;
      },
      handleKongTop() {
        this.params.kong[1] = val;
      },
      handlePriceBottom() {
        this.params.rent_price[0] = val;
      },
      handlePriceTop() {
        this.params.rent_price[1] = val;
      },
      handleInputBottom(val) {
        this.params.floor[0] = val;
      },
      handleInputTop(val) {
        this.params.floor[1] = val;
      },
      //请求房屋详情
      handleHouseDetail(item) {
        sessionStorage.setItem('fromHouseIndex','true');
        this.routerLink('/houseDetail',{id: item.id});
        //this.routerLink('/houseDetail', {id: 248073});
      },

      //重置params
      resetParams() {
        this.params = {
          page: 1,
          limit: 12,
          search: '',
          name: '',
          status: [],
          city: [],
          room: [], //房型
          decoration: [], //装修
          house_toward: [], //朝向
          floor: [],// 楼层
          house_lift: [], //电梯
          rent_days: [], //剩余时长
          warning_status: [], //预警
          rent_price: [],
          kong: [], //空置天数
          is_org_user: 0,
          org_user_id: [],
          city_id:'',
        };
      },

      //按钮
      searchBtn(type, idx) {
        console.log(type);

        if(idx===1) {
          switch (type) {
            case 'reset':
              this.resetParams();
              //this.params.status = [];
              this.status_choose = null;
              break;
            case 'confirm':
              this.onSearch();
              break;
          }
        } else if (idx === 2) {
          switch (type) {
            case 'reset':
              /*this.params.house_lift = [];
              this.params.house_toward = [];
              this.params.floor = [];
              this.params.decoration = [];
              this.params.room = [];*/
              this.resetParams();
              break;
            case 'confirm':
              this.onSearch();
              break;
          }
        } else if(idx===3) {

        }else {
          this.filter_list[3].active = false;
          switch (type) {
            case 'reset':
             /* this.params.rent_price = [];
              this.params.rent_days = [];
              this.params.warning_status = [];*/
              this.resetParams();
              break;
            case 'confirm':
              this.onSearch();
              break;
          }
        }
      },
      //选择房屋属性
      chooseHouseProperty(item, type) {
        if (this.params[type].indexOf(item.id) !== -1) {
          this.params[type].splice(this.params[type].indexOf(item.id), 1);
        } else {
          this.params[type].push(item.id);
        }
      },
      //选择房屋状态
      chooseHouseStatus(item) {
        this.status_choose = item.id;
        //console.log(item);
        if(item.id==0) {
          this.params.status = null;
        }else {
          this.params.status = [item.id];
        }

        /*if (this.params.status.indexOf(item.id) !== -1) {
          this.params.status.splice(this.params.status.indexOf(item.id), 1);
        } else {
          this.params.status.push(item.id);
        }*/
      },
      handleCloseExpand() {
        this.offset_top = 0;
        for (let item of this.filter_list) {
          item.active = false;
        }
      },
      //搜索
      onSearch() {
        this.offset_top = 0;
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
        this.house_list = [];
        this.handleGetHouseResource();
      },
      /*
      * 获取房源列表
      * params: cleanData  是否清除列表 默认false
      * */
      async handleGetHouseResource(cleanData = false) {
        if(cleanData) {
          this.house_list = [];
        }
        this.fullLoading = true;
        await this.$httpZll.get(this.server + 'v1.0/market/house', this.params, '加载中...').then(res => {
          this.fullLoading = false;
          if (res.code === 200) {
            _.forEach(res.data.data,(o)=> {
              this.house_list.push(o);
            })
            this.paging = res.data.all_count;
          } else {
            this.house_list = [];
          }
        })
      },
      //滚动
      scrollLoad(val) {
        if (!val) {
          //this.house_list = [];
          this.params.page = 1;
          //this.handleGetHouseResource();
        } else {
          if (this.fullLoading) return;
          if (this.house_list.length === this.paging) return;
          this.params.page++;
          this.handleGetHouseResource();
        }
      },
      //房屋筛选
      handleFilterHouse(tmp) {
        this.offset_top = this.current_filter === tmp.id ? 0 : 117;
        //this.filter_list[tmp.id - 1].active = this.offset_top <= 0;
        this.filter_list.forEach(o=> {
          o.active = false;
        });
        this.filter_list[tmp.id - 1].active = !this.filter_list[tmp.id - 1].active;
        this.staff_depart_visible = tmp.id === 3;
        this.current_filter = this.offset_top <= 0 ? '' : tmp.id;
        if(!this.current_filter) {//上拉按钮朝上
          this.filter_list[tmp.id - 1].active = false;
        }
        if(this.current_filter!=3) {//不选部门员工下拉搜索框时重置参数
          this.params.org_user_id = [];
          this.params.is_org_user = 0;
        }
      },
      // 选择城市
      chooseClickCity(item) {
        this.offset_top = 0;
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
            this.routerReplace('/index');
            break;
          case 4:
            this.routerReplace('/toBeDoneList');
            break;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/houseResource/index.scss";

</style>
