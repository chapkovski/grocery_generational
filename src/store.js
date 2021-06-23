import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        chosenItems:[]
    },
    getters: {
      
        getChosen: (state) => () => { return state.chosenItems },
       
    },
    mutations: {
        ADD_ITEM_TO_CART: (state, { trans }) => {
            state.transactions.push(
                trans
            )
        },
      
    },
    actions: {
        setNumAward(context, obj) { context.commit('SET_NUM_AWARD', obj) },
       

    }
})

export default store;