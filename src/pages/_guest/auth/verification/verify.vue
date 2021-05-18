<template>
  <div class="rightsided-content coha--login-wrapper">
    <div class="inner-content">

      <!-- Back and Header -->
      <div class="container">


        <div class="row">
          <div class="col col-12 sm-12 md-12">
            <h1>{{ $t('verify_email') }}</h1>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 sm-12 md-12">
            <!-- Alert -->
            <template v-if="success">
              <div>
                  <q-alert
                  color="blue-grey"
                  dark
                  icon="mdi-email-mark-as-unread"
                  prominent
                  dismissible
                  v-if="success"
                  class="animated tdDropInLeft"
                >
                  <div v-html="$t(success)"></div>
                </q-alert>

                <router-link :to="{ name: 'login' }" class="btn btn-primary">
                  {{ $t('login') }}
                </router-link>
              </div>
            </template>
            <!-- Error -->
            <template v-else>
              <div>
                <q-alert
                  color="warning"
                  dark
                  icon="mdi-email-mark-as-unread"
                  prominent
                  dismissible
                  class="animated tdDropInLeft"
                >
                  <span v-html="error || $t('failed_to_verify_email')"></span>
                </q-alert>

                <router-link :to="{ name: 'verification.resend' }" class="small float-right">
                  {{ $t('resend_verification_link') }}
                </router-link>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const qs = (params) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export default {
  middleware: 'guest',
  layout: 'RightsidedLayout',

  async beforeRouteEnter (to, from, next) {
    try {
      const { data } = await axios.post(`/api/email/verify/${to.params.id}?${qs(to.query)}`)

      next(vm => { vm.success = data.status })
    } catch (e) {
      next(vm => { vm.error = e.response.data.status })
    }
  },

  data: () => ({
    error: '',
    success: ''
  })
}
</script>
