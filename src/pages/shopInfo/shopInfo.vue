<template>
<!-- 商品详情页 -->
<div id="shopInfo">
<!-- 顶部导航 -->
  <div class="barTop">
    <van-icon name="arrow-left" size="22px" :class="{'van-icon-left':true}" @click="back"/>
    <van-icon name="share-o" size="22px"/>
  </div>
<!-- 商品大图 -->
  <img :src="shopInfo.img">
<!-- 商品信息 -->
  <div class="info">
    <span>￥{{shopInfo.price}}<van-tag type="danger">{{shopInfo.discount}}</van-tag></span>
    <span>{{shopInfo.font}}</span>
    <span>{{shopInfo.promise}}  </span>
  </div>
<!-- 商品长图展示 -->
  <div class="longImg">
    <img :src="shopInfo.img">
  </div>
<!-- 底部菜单 -->
  <van-goods-action>
    <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
    <van-goods-action-icon icon="cart-o" text="购物车" :badge="shopsNum | isShowBadge" :to="{name:'buyCar'}"/>
    <van-goods-action-icon icon="star" text="已收藏" color="#ff5000" />
    <van-goods-action-button type="warning" text="加入购物车" @click="addBuyCar"/>
    <van-goods-action-button type="danger" text="立即购买" @click="buyShop"/>
  </van-goods-action>
</div>
</template>

<script>
import {GoodsAction, GoodsActionIcon, GoodsActionButton} from 'vant'
import isShowBadge from "@/mixin/isShowBadge"; //混合，内置过滤器、计算属性，用于处理购物车角标

export default {
  name: "shopInfo",
  components:{
    [GoodsAction.name]:GoodsAction,
    [GoodsActionIcon.name]:GoodsActionIcon,
    [GoodsActionButton.name]:GoodsActionButton
  },
  data(){
    return {
      shopInfo:{},//用于储存点击项商品信息
    }
  },
  mixins:[isShowBadge],//混合，内置过滤器、计算属性（获取购物车商品条数），当shopsNum购物车为空时，传值''，即不显示角标
  methods:{
    back(){
      //返回上一页
      this.$router.back();
    },
    addBuyCar(){
      let shopInfo = {shopId:this.shopInfo.id,...this.shopInfo};//将当前的商品赋值给局部变量shopInfo(通过扩展符浅合并)
      delete shopInfo.id;//删除商品id，加入购物车时为区分，将商品id字段名改为shopId，后面会通过处理
      //将当前商品id传给后台
      this.$axios.post(
          'user/addBuyCar',
          shopInfo
      ).then(res=>{
          this.schema(res.data);//验证请求结果
      }).catch(()=>this.$toast('服务器繁忙'))
    },

    buyShop(){
      //因为当前的商品数据没有shopId这个属性，这个属性和当前的id值是一样的，所以新增一个
      //当前也没有num值，新增一个，默认为1
      let shops = [{num:1,shopId:this.shopInfo.id,...this.shopInfo}];
      //修改vuex当商品结算模块数据
      this.$store.commit('buyCar/GetBuyShopInfo',shops);
      //跳转结算页
      this.$router.push('/submitOrders');
    },
    //验证加入购物车请求结果
    schema(data){
      if(!data.code){ //成功情况
        this.$store.dispatch('buyCar/getBuyCarShop');//触发vuex中购物车信息模块数据更新
        this.$toast('已加入购物车');//成功提示
      } else if(data.code === 2){ //失败情况：token失效
        this.$toast(data.msg);//失败提示
        this.$router.push('/login');//跳转登录页
      }else{ //失败情况
        this.$toast(data.msg)//失败提示
      }
    }
  },
  beforeMount() {
    //通过路由传参的id获取商品信息
    this.$axios.post(
        'api/getShopInfo',
        {id:this.$route.params.id},
    ).then(res=>{
      //判断是否成功获取
      if(!res.data.code) return this.shopInfo = res.data.results[0];//将获取的值存到shopInfo
    }).catch(()=>{this.$toast('服务器繁忙')})
  }
}
</script>

<style lang="less" scoped>
#shopInfo{
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0;
  }

  .barTop{
    height: 6%;
    width: 100%;
    padding: 0 2%;
    position: fixed;
    top: 0;
    z-index: 2;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-icon-left{
      opacity: 0.3;
      color: white;
      padding: 1%;
      border-radius: 50%;
      background-color: black;
    }
  }

  img{
    height: 400px;
    min-height: 50%;
    width: 100%;
  }

  //商品详情
  .info{
    width: 100%;
    height: 18%;
    box-sizing: border-box;

    >span{
      display: block;
      width: 100%;
      padding: 0 1%;
      margin-top: 2%;
      box-sizing: border-box;
    }

    span:first-child{
      color: red;
      font-size: 24px;
      display: flex;
      align-items: center;

      .van-tag{
        width: 15.8%;
        height: 75%;
        margin-left: 4%;
        display: inline-block;
        color: white;
        font-size: 15px;
      }
    }

    span:nth-of-type(2){
      font-size: 16px;
      letter-spacing: 1.5px;
      font-weight: bold;
    }

    span:last-child{
      color: green;
    }
  }
}
</style>