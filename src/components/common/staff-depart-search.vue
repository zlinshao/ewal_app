<template>
  <div id="staff-depart-search" v-show="module">
    <div class="searchInput">
      <div class="input">
        <p @click="choose_visible = true">
          {{ params.name }}
          <i></i>
        </p>
        <div>
          <input type="text" placeholder="请输入搜索内容" v-model="params.search">
          <span v-if="params.search" @click="params.search = ''"></span>
        </div>
        <p class="searchBtn" @click="onSearch" v-if="params.search">搜索</p>
        <p class="btn-cancel" @click="handleCloseSearch" v-else>取消</p>
      </div>
      <div class="chooseBtn" v-if="choose_visible">
        <p v-for="item in type_list" @click="chooseClickItem(item)">
          <b :class="{'choose': params.choose === item.id}">{{ item.val }}</b>
        </p>
      </div>
    </div>
    <ul class="item-container scroll_bar" v-if="staff_depart_list.length > 0">
      <li
        v-for="(item,key) in staff_depart_list"
        :key="key"
        @click="handleChooseItem(item)">
        {{ item.name }}
        <a>---</a>
      </li>
    </ul>
    <div class="flex choose-item">
      <span v-for="(tmp,idx) in choose_items">
        {{ tmp.name }}
        <i @click="handleDeleteItem(idx)">
          <img src="../../assets/image/common/deletestaff.png">
        </i>
      </span>
    </div>
    <div class="commonBtn" v-show="choose_items.length > 0 || choose_items.length > 0">
      <p :class="['btn ' + item.type || '']" v-for="item of buttons" @click="footerBtn(item.type)">
        {{item.label}}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['visible'],
    data() {
      return {
        buttons: [
          {
            label: '取消',
            type: 'cancel'
          },
          {
            label: '确定',
            type: 'confirm'
          },
        ],
        params: {
          search: '',
          name: '员工',
          choose: 1
        },
        choose_visible: false,
        type_list: [
          {id: 1,val: '员工'},
          {id: 2,val: '部门'},
        ],
        module: false,

        staff_depart_list: [],

        choose_items: [],
      }
    },
    mounted() {
    },
    watch: {
      visible(val) {
        this.module = val;
      },
    },
    computed: {},
    methods: {
      handleInitial() {
        this.staff_depart_list = [];
        this.choose_items = [];
        this.params.search = '';
        this.params.choose = 1;
        this.params.name = '员工';
      },
      footerBtn(type) {
        switch (type) {
          case 'cancel':
            this.handleInitial();
            this.$emit('close','close');
            break;
          case 'confirm':
            this.$emit('close',this.choose_items,this.params.choose === 1 ? 'staff': 'depart');
        }
      },
      handleDeleteItem(idx) {
        this.choose_items.splice(idx,1);
      },
      handleChooseItem(item) {
        for (let tmp of this.choose_items) {
          if (item.id === tmp.id) {
            this.$prompt('已选该员工','warning');
            return false;
          }
        }
        this.choose_items.push(item);
      },
      chooseClickItem(item) {
        this.handleInitial();

        this.params.choose = item.id;
        this.params.name = item.val;
        this.choose_visible = false;
      },
      onSearch() {
        this.choose_visible = false;
        if (this.params.choose === 1) {
          this.$httpZll.searchStaffList({search:this.params.search}).then(res => {
            console.log(res);
            if (Number(res.code) === 20000) {
              this.staff_depart_list = res.data.data;
            }else {
              this.staff_depart_list = [];
              this.$prompt('暂无数据','info');
            }
          })
        }
        if (this.params.choose === 2){
          let search = this.params.search;
          this.$httpHs.getOrganization({search},'加载中...').then(res => {
            console.log(res);
            if (Number(res.code) === 20000) {
              this.staff_depart_list = res.data.data;
            } else {
              this.staff_depart_list = [];
              this.$prompt('暂无数据','info');
            }
          })
        }
      },
      handleCloseSearch() {
        this.$emit('close','close');
        this.module = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  #staff-depart-search {
    display: block !important;
    min-height: 3rem;
    .item-container {
      height: 4rem;
      li {
        padding: .1rem .2rem;
        position: relative;
        a {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .choose-item {
      padding: .2rem 0;
      flex-wrap: wrap;
      span {
        padding: .1rem .2rem;
        background-color: #448aff;
        color: white;
        border-radius: 1.5rem;
        font-size: .25rem;
        margin-bottom: .2rem;
        &:not(:last-child) {
          margin-right: .2rem;
        }
        i {
          display: inline-block;
          width: 5pt;
          height: 5pt;
          vertical-align: top;
          margin-right: .1rem;
          img {
            width: 10pt;
            height: 10pt;
          }
        }
      }
    }
  }
</style>
