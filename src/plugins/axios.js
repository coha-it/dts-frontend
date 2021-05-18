import axios from 'axios'
import store from '@/store'
import router from '@/router'
import Swal from 'sweetalert2'
import i18n from '@/plugins/i18n'
import { Notify } from 'quasar'

// Request interceptor
axios.interceptors.request.use(request => {
  const token = store.getters['auth/token']
  if (token) {
    request.headers.common['Authorization'] = `Bearer ${token}`
  }

  const locale = store.getters['lang/locale']
  if (locale) {
    request.headers.common['Accept-Language'] = locale
  }

  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request
})

// Axios Default URL
axios.defaults.baseURL = process.env.VUE_APP_API_DOMAIN

// Response interceptor
axios.interceptors.response.use(response => response, error => {
  const { status } = error.response

  if (status >= 500) {
    Swal.fire({
      type: 'error',
      title: i18n.t('error_alert_title'),
      text: i18n.t('error_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel')
    })
  }

  else if (status === 401 && store.getters['auth/check']) {
    Swal.fire({
      type: 'warning',
      title: i18n.t('token_expired_alert_title'),
      text: i18n.t('token_expired_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel')
    }).then(() => {
      store.commit('auth/LOGOUT')

      router.push({ name: 'login' })
    })
  } else {
    const data = error?.response?.data
    let message = data?.message
    let caption = ''
    
    // Get Caption Alias Errors
    if(data?.errors) {
      const errors = data.errors
      Object.keys(errors).map(key => {
        caption += `<div>${key}: ${errors[key]}</div>`
      });
    }

    console.log('sollte sehen')

    Notify.create({
      type: 'warning',
      progress: true,
      html: true,
      message,
      caption,
      actions: [
        {
          icon: 'close'
        }
      ],
    })
  }

  return Promise.reject(error)
})
