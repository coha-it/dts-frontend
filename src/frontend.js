// Import Vue
import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/plugins/i18n'
import App from './App'
import MyQuasar from '@/plugins/quasar'
import VueMoment from 'vue-moment'

// Import Additionals
import '@/plugins'
import '@/components'

// Import Mixins
import VueMixins from './plugins/mixins'

// Import Styling
import '@/styles/scss/app.scss'

// Some Config Settings
Vue.config.productionTip = false

// Use Mixins
Vue.mixin(VueMixins)

// Vue Moment
Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  i18n,
  store,
  router,
  MyQuasar,
  render: h => h(App),
  ...App
}).$mount('#app')
