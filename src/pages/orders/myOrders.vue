<template>
<div id="myOrders">
<!-- 顶部导航 -->
  <van-nav-bar
      title="我的订单"
      left-text="返回"
      @click-left="goBack"
      @click-right="searchOrder"
      left-arrow
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
<!-- 菜单导航 -->
  <van-tabs class="bar" v-model="active"  animated swipeable sticky offset-top="9vw">
    <van-tab class="barContent" v-for="barName in barName" :key="barName" :title="barName" :swipeable="true">
<!--   空状态   -->
      <van-empty description="还没有相应订单呢！" style="padding-top: 35%" v-if="!fliterOrders.length"/>
<!--  商品订单详情    -->
      <div class="order">
      <!--    单个订单    -->
        <div class="oneByOrder" v-for="item in fliterOrders" :key="item.id">
          <!--    详情展示   点击跳转订单详情页 -->
          <shop-card @click.native="goOrderInfo(item)" :shopInfo="item"/>
          <!--    操作    -->
          <div class="control">
            <!--     商品总价     -->
            <div class="totalPrice"><a>（{{item.orderKind}}）</a>实付：<a>￥</a><span>{{item.totalPrice}} </span>(免运费)</div>
            <!--    待支付订单操作      -->
            <div v-show="item.orderKind === '待支付'">
              <delete-order :id="item.id"/>
              <cancel-order :id="item.id"/>
              <re-pay :order="item"/>
            </div>
            <!--    待发货订单操作      -->
            <div v-show="item.orderKind === '待发货'">
              <refund/>
              <push-shipment/>
            </div>
            <!--    待收货订单操作      -->
            <div v-show="item.orderKind === '待收货'">
              <refund/>
              <check-express/>
              <sure-get/>
            </div>
          <!--     待评价订单操作       -->
            <div v-show="item.orderKind === '待评价'">
              <judge/>
              <delete-order :id="item.id"/>
            </div>
          </div>
        </div>
      </div>
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
import {Tab, Tabs} from 'vant'
import {mapState} from "vuex";
import ShopCard from "@/components/shopCard";
import DeleteOrder from "@/pages/orders/buttons/deleteOrder";
import RePay from "@/pages/orders/buttons/rePay";
import CheckExpress from "@/pages/orders/buttons/checkExpress";
import SureGet from "@/pages/orders/buttons/sureGet";
import Refund from "@/pages/orders/buttons/refund";
import PushShipment from "@/pages/orders/buttons/pushShipment";
import Judge from "@/pages/orders/buttons/judge";
import CancelOrder from "@/pages/orders/buttons/cancelOrder";

export default {
  name: "myOrders",
  components:{
    CancelOrder,
    Judge,
    PushShipment,
    Refund,
    SureGet,
    CheckExpress,
    RePay,
    DeleteOrder,
    ShopCard,
    [Tabs.name]:Tabs,
    [Tab.name]:Tab,
  },
  data(){
    return {
      active:0,//用于绑定点击导航栏的索引
      barName:['全部','待支付','待发货','待收货','待评价'],//用于保存导航栏标题
      // fliterOrders:[],//用于储存商品
    }
  },
  computed:{
    ...mapState('orders',['orders']),//获取vuex中所有订单信息
    //过滤符合要求的订单数据
    fliterOrders(){
      if(!this.active) return this.orders;//当切换到全部时将计算属性所有订单的值赋给orders
      return this.orders.filter(val => val.orderKind === this.barName[this.active]);//当切换到其他导航栏时将过滤出计算属性对应值赋给orders
    }
  },
  methods:{
    //点击后退页面
    goBack(){
      //后退
      this.$router.replace({name:'mine'});
    },
    //搜索订单
    searchOrder(){
      alert('待开发')
    },
    //点击跳转订单详情页，触发vuex点击订单信息更新
    goOrderInfo(item){
      this.$store.commit('orders/orderInfo',item);//触发更新，将点击项信息传递过去
      this.$router.push({name:'orderInfo',params:{index:this.active}});//跳转页面，并将当前导航栏索引传递过去
    }
  },
  mounted() {
    //触发vuex中订单管理模块数据更新
    this.$store.dispatch('orders/getOrders');
    //当组件挂载时 将路由传递过来的索引赋值给本地变量，用于精准匹配订单导航栏以及订单数据
    if(this.$route.params.index)  this.active = this.$route.params.index;
  }
}
</script>

<style lang="less" scoped>
#myOrders{
  height: 100%;
  background-color: #fafafa;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0;
  }

  //顶部导航
  .van-nav-bar{
    height: 6%;
    position: fixed;
    z-index: 3;
    width: 100%;
  }

  //导航
  .bar{
    min-height: 94%;
    position: relative;
    top: 6%;

    //内容
    .barContent{
      height: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar{
        width: 0;
      }

      //订单中心
      .order{
        height: 100%;
        overflow-y: scroll;
        &::-webkit-scrollbar{
          width: 0;
        }

        //单个订单
        .oneByOrder{
          background-color: white;
          margin-bottom: 6px;

          //第一个订单
          &:first-child{
            margin-top: 6px;
          }

          //控制中心
          .control {
            box-sizing: border-box;
            //border: 1px solid red;

            //商品总价
            .totalPrice {
              height: 30px;
              line-height: 30px;
              text-align: right;
              padding-right: 13px;
              font-size: 13px;
              color: #727272;
              border: 1px solid #f6f6f6;

              //订单类型
              a:first-child{
                float: left;
                color: red;
                margin-left: 9%;
                font-size: 12px;
              }

              //人民币标识
              a {
                color: red;
                font-size: 10px;
              }

              //价格
              span {
                color: red;
                font-size: 16px;
              }
            }

            //操作按钮
            > div:not(.totalPrice) {
              height: 38px;
              display: flex;
              align-items: center;
              box-sizing: border-box;
              justify-content: flex-end;

              //按钮样式
              .van-button {
                height: 25px;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>