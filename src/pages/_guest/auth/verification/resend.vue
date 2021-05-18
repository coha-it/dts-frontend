<template>
  <div class="rightsided-content coha--login-wrapper">
    <div class="inner-content">
      <!-- Back and Header -->
      <div>
        <div class="row">
          <div class="col col-12 sm-12 md-12">
            <!-- Alert -->
            <alert-success :form="form" :message="status" />
          </div>
        </div>
        <div class="row">
          <div class="col col-10 sm-10 md-10 align-self">
            <h1>{{ $t('verify_email') }}</h1>
            <p class="subtitle">{{ $t('verify_email_desc') }}</p>
          </div>
        </div>

        <form @submit.prevent="send" @keydown="form.onKeydown($event)">
          <div class="row">
            <div class="col">

                <!-- Email -->
                <q-input
                  v-model="form.email"
                  :label="$t('email_label')"
                  color='black'
                  :error="form.errors.has('email')"
                  type="email"
                  name="email"
                  required
                  ref="email"
                />
            </div>
          </div>
          <div class="row">
              <div class="col col-12 sm-12 md-12 align-right">
                <!-- Submit Button -->
                <q-btn color="primary" large block :loading="form.busy" type="submit" :label="$t('send_verification_link')" />
              </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from 'vform'

export default {
  middleware: 'guest',
  layout: 'RightsidedLayout',

  data: () => ({
    status: '',
    form: new Form({
      email: ''
    })
  }),

  created () {
    if (this.$route.query.email) {
      this.form.email = this.$route.query.email
    }
  },

  methods: {
    async send () {
      const { data } = await this.form.post('/api/email/resend')

      this.status = data.status

      this.form.reset()
    }
  }
}
</script>
