import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import axios from 'axios';
Vue.use(Vuex)

const DEFAULT_BUNCHES = 3;
const generalDataUrl = 'https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/generational_bundle'
const personaUrl = "https://blocke-channels-bucket.s3.amazonaws.com/persona.json";
const limitsUrl = "https://blocke-channels-bucket.s3.amazonaws.com/cats.json";
const dataUrl = "https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/random";
const store = new Vuex.Store({
    state: {
        choice_set: [],
        shoppingCart: [],
        urlParams: {},
        independent: false,
        uploading: false,
        category: {},
        persona: {},
        n: null,
        generation: null,
        parentalGeneration: null,
        persona_loaded: false
    },
    getters: {
        totalAmount: (state) => _.sumBy(state.shoppingCart, "price"),
        priceWithinRange: (state, getters) => (state.category.lb <= getters.totalAmount && getters.totalAmount <= state.category.ub),
    },
    mutations: {
        SET_UPLOADING: (state, val) => { state.uploading = val },
        ADD_TO_SHOPPING_CART: (state, itemId) => {
            const obj = _.find(state.choice_set, (i) => i.itemId === itemId)
            state.choice_set = _.reject(state.choice_set, (i) => i.itemId === itemId)
            state.shoppingCart = [...state.shoppingCart, obj]
        },
        REMOVE_FROM_SHOPPING_CART: (state, itemId) => {
            const obj = _.find(state.shoppingCart, (i) => i.itemId === itemId)
            state.shoppingCart = _.reject(state.shoppingCart, (i) => i.itemId === itemId)
            state.choice_set = [...state.choice_set, obj]
        },
        SET_SHOPPING_CART: (state, data) => { state.shoppingCart = data },
        SET_CHOICE_SET: (state, data) => { state.choice_set = data },
        SET_DATA_RETRIEVAL_PARAMS: (state, { persona, category, n, generation }) => {
            state.persona = persona;
            state.category = category;
            state.n = n || DEFAULT_N;
            state.persona_loaded = true;
            state.generation = parseInt(generation);
            state.parentalGeneration = generation - 1;
        },
        SET_URL_PARAMS: (state, params) => {
            state.independent = (!(params.persona_id && params.category));
            state.urlParams = params;
        },


    },
    actions: {
        async setParams({ commit, state }) {
            commit('SET_UPLOADING', true)
            const { category: urlCategory, persona_id: urlPersonaId, generation, n } = state.urlParams
            let chosenCategory, chosenPersona;
            const personas = (await axios.get(personaUrl)).data;
            let categories = (await axios.get(limitsUrl)).data;
            // TODO!!!
            categories = _.filter(categories, (i) => (!i.category.includes('&')))

            if (urlCategory && urlPersonaId) {
                chosenCategory = _.find(categories, _.matches({ category: urlCategory }))
                chosenPersona = _.find(personas, _.matches({ persona_id: parseInt(urlPersonaId) }))
            } else {
                chosenCategory = _.sample(categories)
                chosenPersona = _.sample(personas);
            }

            commit('SET_DATA_RETRIEVAL_PARAMS', {
                persona: chosenPersona,
                category: chosenCategory,
                n: n || DEFAULT_BUNCHES,
                generation: generation
            })
        },
        async getData({ commit, state, dispatch }) {
            const qs = {
                n: state.n,
                category: state.category.category,
                persona_id: state.persona.persona_id,
                generation: state.parentalGeneration

            }
            console.debug('get data', qs)

            const r = await axios.get(
                generalDataUrl,
                { params: qs }
            );
            console.debug(r.status, 'STATUS')
            console.debug(r.data, 'DATA')


            commit('SET_CHOICE_SET', _.map(r.data, (i) => {
                return {
                    itemId: i.item_id,
                    price: i["Price in Bundle"],
                    img: i["Image URL"],
                    name: i["Item Name"],
                    title: i["Item Name"],
                    ounces: i["Ounces"],
                    quantity: i["Quantity in Bundle"],
                    sku: i["SKU"],
                };
            }));
            commit('SET_UPLOADING', false)
        }
    }
})

export default store;