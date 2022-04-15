//导入vuex
import Vuex from "vuex";
//导入vue
import vue from "vue";
//导入axios
import axios from 'axios'
//注册vuex
vue.use(Vuex);

//全部商品数据
const allShops = {
    namespaced: true,
    actions:{
        getAllShops(context){
            axios.get('/api/getShops')
                .then(res=>{
                     context.commit('updataShops',res.data.results);
                })
                .catch(err=>{
                    console.log(err.message);
                })
        }
    },
    mutations:{
        updataShops(state,val){
            state.allShops = val;
        }
    },
    state:{
        allShops:[]
    }
}

//导出vuex对象   如果有多个模块，添加module项，将模块放入该对象内
export default new Vuex.Store({
    modules:{
        allShops
    }
})