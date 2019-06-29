<template>
  <div id="admin-approvals">
    <div class="admin-approvals">
      <div ref="approvalTop" class="approvalTop">
        <div class="top1">
          <p class="p1" @click="routerLink('/approvals')"></p>
          <p class="p2"></p>
        </div>
        <ul class="items-around">
          <li v-for="item in approvalTerm" @click="changeApproval(item)">
            <p><img :src="item.icon" alt=""></p>
            <h1 :class="[item.id === tabs.tab ? 'hover' : '']">{{item.text}}</h1>
          </li>
        </ul>
      </div>
      <div class="main">
        <div ref="mainTop" class="mainTop">
          <div class="flex">
            <p v-for="item in buttons['tab'+tabs.tab]" @click="tabsTag(item.value)"
               :class="[twoLevel['tab'+tabs.tab] === item.value ? 'hover' : '']">
              {{item.text}}
              <span class="numberFont" v-if="!item.value">{{paging['paging'+tabs.tab]}}</span>
            </p>
          </div>
          <i @click="approvalModule = true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import wofaqide from '../../../assets/image/approvals/wofaqide.png'
  import woshenpide from '../../../assets/image/approvals/woshenpide.png'
  import chaosongwode from '../../../assets/image/approvals/chaosongwode.png'
  import zanbuchuli from '../../../assets/image/approvals/zanbuchuli.png'

  export default {
    name: "admin-approvals",
    components: {},
    data() {
      return {
        mainHeight: '',
        //加载是否结束
        fullLoading: {
          load1: true,
          load2: true,
          load3: true,
          load4: true,
        },
        // 头部切换
        approvalTerm: [
          {
            id: '1',
            text: '我审批的',
            icon: woshenpide,
          },
          {
            id: '2',
            text: '我发起的',
            icon: wofaqide,
          },
          {
            id: '3',
            text: '抄送我的',
            icon: chaosongwode,
          },
          {
            id: '4',
            text: '暂不处理',
            icon: zanbuchuli,
          },
        ],
        // 二级切换
        buttons: {
          tab1: [
            {
              text: '待审批的',
              value: 0,
            },
            {
              text: '已审批的',
              value: 1,
            },
            {
              text: '转交给我的',
              value: 2,
            }
          ],
          tab2: [
            {
              text: '未完成',
              value: 0,
            },
            {
              text: '已完成',
              value: 1,
            },
            {
              text: '待签署',
              value: 2,
            },
            {
              text: '待重签',
              value: 3,
            }
          ],
          tab3: [
            {
              text: '未读',
              value: 0,
            },
            {
              text: '已读',
              value: 1,
            }
          ],
          tab4: [],
        },
        // 数据列表
        approvalList: {
          list1: {
            data0: [],
            data1: [],
          },
          list2: {
            data0: [],
            data1: [],
            data2: [],
            data3: [],
          },
          list3: {
            data0: [],
            data1: [],
          },
          list4: {
            data0: [],
            data1: [],
          }
        },
        // 筛选条件
        urlApi: '',// 接口
        params: {
          params1: {},
          params2: {},
          params3: {},
          params4: {
            page: 1,
            suspended: true,
          },
        },
        // 二级切换 状态
        twoLevel: {
          tab1: 0,
          tab2: 0,
          tab3: 0,
          tab4: 0,
        },
        // 总条数
        total: {
          total1: 0,
          total2: 0,
          total3: 0,
          total4: 0,
        },//判断
        paging: {
          paging1: 0,
          paging2: 0,
          paging3: 0,
          paging4: 0,
        },// 显示
        // 更多操作
        moreOperate: {
          more1: [
            {
              id: '1',
              text: '合同预览',
            },
            {
              id: '2',
              text: '发送电子合同',
            },
          ],
          more2: [
            {
              id: '1',
              text: '合同预览',
            },
            {
              id: '4',
              text: '本地签署',
            },
            {
              id: '5',
              text: '客户手机签署',
            },
            {
              id: '6',
              text: '修改合同',
            },
          ],
          more3: [
            {
              id: '7',
              text: '重新提交',
            },
          ]
        },
      }
    },
    mounted() {
    },
    activated() {
      let approvalTop = this.$refs.approvalTop.offsetHeight;
      let mainTop = this.$refs.mainTop.offsetHeight;
      let top = approvalTop + mainTop;
      this.mainHeight = this.mainListHeight(top);
    },
    computed: {
      tabs() {
        return this.$store.state.app.approvalTab;
      },
    },
    watch: {},
    methods: {
      changeApproval() {

      },
      tabsTag() {

      }
    }
  }
</script>

<style scoped lang="scss">
  #admin-approvals {
    .admin-approvals {

    }
  }
</style>
