
export default [
    //登录页路由
    {
        path:"/login",
        component: ()=>import("@/pages/login/login") //路由懒加载
    },
    //搜索页路由
    {
        path:"/search",
        component: ()=>import("@/pages/search/searchShop")
    },
    //商品详情页
    {
        path:'/shopInfo/:id',
        name:'shopInfo',
        component:()=> import('@/pages/shopInfo/shopInfo')
    },
    //用户信息管理
    {
        path:'/userInfo',
        component: ()=> import("@/pages/userInfo/userInfo"),
        meta:{
            isAuth:true
        }
    },
    //添加收货地址
    {
        path:'/addAddress',
        name:'addAddress',
        component: ()=> import('@/pages/userAddress/addAddress'),
        meta:{
            isAuth:true
        },
        props:true
    },
    //查看收货地址
    {
        path:'/myAddress',
        name:'myAddress',
        component: ()=> import('@/pages/userAddress/myAddress'),
        meta:{
            isAuth:true
        },
        props: true
    },
    //提交订单
    {
        path: '/submitOrders',
        name: 'submitOrders',
        component: ()=> import('@/pages/buy/submitOrders'),
        props: true
    },
    //我的订单
    {
        path: '/myOrders',
        name:'myOrders',
        component: ()=> import('@/pages/orders/myOrders'),
        props: true
    },
    //订单详情
    {
        path: '/orderInfo',
        name:'orderInfo',
        component: ()=> import('@/pages/orders/orderInfo/orderInfo'),
        props: true
    },
    //闪购钱包
    {
        path: '/wallet',
        component:()=>import('@/pages/wallet/wallet')
    },
    //我的收藏
    {
        path: '/myCollect',
        component:()=>import('@/pages/myCollect/myCollect')
    }
]