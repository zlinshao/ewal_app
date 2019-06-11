<template>
  <div id="searchStaff">
    <van-popup overlay-class="overlay-color" v-model="searchModule" position="bottom" :overlay="true">
      <div class="searchModule" :style="mainListHeight(150)">
        <div class="popupTop">
          <p>请选择员工</p>
          <h3 @click="finish">完成</h3>
        </div>
        <div class="searchInput">
          <div class="input">
            <div>
              <input type="text" v-model="keywords" @keyup.enter="onSearch" placeholder="输入员工姓名">
              <span v-if="keywords" @click="keywords = ''"></span>
            </div>
            <p v-if="keywords" class="searchBtn" @click="onSearch">搜索</p>
            <p v-if="!keywords" @click="searchModule = false">取消</p>
          </div>
        </div>
        <div class="popupSearch">
          <ul v-if="searchList.length">
            <li v-for="item in searchList" @click="pickChoose(item)">
              <p>{{item.name}}</p>
              <div v-if="item.org && item.org.length">
                {{item.org[0].name}}
              </div>
              <div v-else>---</div>
            </li>
          </ul>
          <div class="flex-center" v-else>
            <span v-if="fullLoading">暂无相关数据...</span>
            <span v-if="!keywords && !fullLoading">请输入搜索内容...</span>
          </div>
        </div>
        <div class="items-center alreadyStaff" v-if="config && config.num">
          <p class="items-center" v-for="(item,index) in staffOldValue">
            {{item.name}}
            <i @click="deleteStaff(index)">
              <img src="../../assets/image/common/deletestaff.png" alt="">
            </i>
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "search-staff",
    props: ['module', 'config'],
    data() {
      return {
        searchModule: false,
        fullLoading: false,
        keywords: '',
        searchList: [],
        staffList: {
          id: [],
          name: '',
        },
        staffOldValue: [],
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      keywords(val) {
        this.keywords = val.replace(/\s+/g, '');
        if (!this.keywords) this.close_();
      },
      module(val) {
        this.searchModule = val;
      },
      searchModule(val) {
        if (!val) {
          this.$emit('close', 'close');
          this.fullLoading = false;
        } else {
          if (this.config) {
            this.staffOldValue = this.jsonClone(this.config.preFill || []);
            this.staffHandle();
          }
        }
      },
    },
    computed: {},
    methods: {
      onSearch() {
        let keywords = this.keywords;
        if (!keywords) return;
        this.searchStaff(keywords);
      },
      // 部门人员
      searchStaff(val = '') {
        this.fullLoading = false;
        this.searchList = [];
        let params = {
          search: val,
          org_id: '',
        };
        this.$httpZll.searchStaffList(params).then(res => {
          this.fullLoading = true;
          this.searchList = res.data.data;
        })
      },
      // 确认选择人员
      pickChoose(val) {
        if (this.config) {
          // 人员多选
          let num = this.config.num;
          if (this.staffList.id.includes(val.id)) {
            this.$prompt('该员工已选择');
            return;
          }
          if (num !== 'check' && num === this.staffOldValue.length) {
            this.$prompt(`最多选择${num}个员工`);
            return;
          }
          this.staffOldValue.push(val);
          this.staffHandle();
        } else {
          // 人员单选
          let data = {};
          data.staff_id = val.id || '';
          data.staff_name = val.name || '---';
          if (val.org && val.org.length) {
            data.department_id = val.org[0].id || '';
            data.department_name = val.org[0].name || '---';
          } else {
            data.department_id = '';
            data.department_name = '---';
          }
          this.cancel(data, val);
        }
      },
      // 多选删除
      deleteStaff(index) {
        this.staffOldValue.splice(index, 1);
        this.staffHandle();
      },
      // 多选处理
      staffHandle() {
        let names = [];
        this.staffList.id = [];
        for (let val of this.staffOldValue) {
          this.staffList.id.push(val.id);
          names.push(val.name);
        }
        this.staffList.name = names.join(',');
      },
      // 确定
      finish() {
        this.cancel(this.staffList, this.staffOldValue);
      },
      cancel(data, val) {
        this.$emit('close', data, val);
        this.keywords = '';
        this.staffOldValue = [];
      },
      // 清空
      close_() {
        this.searchList = [];
        this.fullLoading = false;
      }
    },
  }
</script>

<style lang="scss" scoped>
  #searchStaff {
    .alreadyStaff {
      flex-wrap: wrap;
      padding: .2rem 0 0 .2rem;
      p {
        padding: .12rem .22rem;
        text-align: center;
        border-radius: 1rem;
        background-color: #448aff;
        margin: 0 .1rem .2rem;
        color: #FFFFFF;
        font-size: .26rem;
        i {
          width: .26rem;
          height: .26rem;
          margin-left: .1rem;
        }
      }
    }
  }
</style>
