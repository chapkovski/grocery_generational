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

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
