import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './assets/layout.css'
import './assets/header.css'
import './assets/nav.css'
import './assets/demos.css'
import './assets/form.css'
import vuetify from './plugins/vuetify'
import 'animate.css'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
const router = new VueRouter({ 
  routes:[], 
  mode:'history' 
});

Vue.use(VueRouter)
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
