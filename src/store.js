import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import axios from 'axios';
Vue.use(Vuex)
const DEFAULT_N = 18;
const personaUrl = "https://blocke-channels-bucket.s3.amazonaws.com/persona.json";
const limitsUrl = "https://blocke-channels-bucket.s3.amazonaws.com/cats.json";
const dataUrl = "https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/random";
const store = new Vuex.Store({
    state: {
        choice_set: [],
        chosenItems: [],
        urlParams: {},
        independent: false,
       
        category: {},
        persona: {},
        n: null,
        persona_loaded: false
    },
    getters: {
        getChosen: (state) => () => { return state.chosenItems },
    },
    mutations: {
        SET_CHOICE_SET: (state, data) => { state.choice_set = data },
        SET_DATA_RETRIEVAL_PARAMS: (state, { persona, category, n }) => {
            state.persona = persona;
            state.category = category;
            state.n = n || DEFAULT_N;
            state.persona_loaded = true;
        },
        SET_URL_PARAMS: (state, params) => {

            ({ independent: state.independent, } = params);
            state.urlParams = params
        },


    },
    actions: {
        async setParams({ commit, state }) {
            const { category: urlCategory, persona_id: urlPersonaId } = state.urlParams
            let chosenCategory, chosenPersona;
            const personas = (await axios.get(personaUrl)).data;
            const categories = (await axios.get(limitsUrl)).data;
            if (urlCategory && urlPersonaId) {
                chosenCategory = _.find(categories, { category: urlCategory })
                chosenPersona = _.find(personas, { persona_id: urlPersonaId })
            } else {
                chosenCategory = _.sample(categories)
                chosenPersona = _.sample(personas);
            }

            commit('SET_DATA_RETRIEVAL_PARAMS', {
                persona: chosenPersona,
                category: chosenCategory,
                n: DEFAULT_N
            })
        },
        async getData({ commit, state, dispatch }) {
            const qs = {
                n: state.n,
                category: state.category.category
            }

            const r = await axios.get(
                dataUrl,
                { params: qs }
            );
            console.debug(r.status, 'STATUS')


            commit('SET_CHOICE_SET', _.map(r.data, (i) => {
                return {
                    itemId: i.item_id,
                    price: i.Price,
                    img: i["Image URL"],
                    name: i["Item Name"],
                    title: i["Item Name"],
                    ounces: i["Ounces"],
                    quantity: i["Quantity in Bundle"],
                    sku: i["SKU"],
                };
            }));
        }
    }
})

export default store;