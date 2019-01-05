import Vue from 'vue'
import VueTooltip from 'v-tooltip'
import VueFlashMessage from 'vue-flash-message'
import axios from 'axios'
import Todos from './Todos'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(VueTooltip)
Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 3000,
    important: true,
    pauseOnInteract: true
  }
})

new Vue({
  render: h => h(Todos),
}).$mount('#app')