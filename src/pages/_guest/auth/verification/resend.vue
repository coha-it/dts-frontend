<template lang="pug">
.rightsided-content.coha--login-wrapper
  .inner-content
    // Back and Header
    div
      .row
        .col.col-12.sm-12.md-12
          // Alert
          alert-success(:form='form' :message='status')
      .row
        .col.col-10.sm-10.md-10.align-self
          h1 {{ $t("verify_email") }}
          p.subtitle {{ $t("verify_email_desc") }}
      form(@submit.prevent='send' @keydown='form.onKeydown($event)')
        .row
          .col
            // Email
            q-input(
              v-model='form.email'
              :label="$t('email_label')"
              color='black'
              filled
              :error="form.errors.has('email')"
              type='email'
              name='email'
              required
              ref='email'
            )
        .row
          .col.col-12.sm-12.md-12.align-right
            // Submit Button
            q-btn.full-width(
              color='primary' large block :loading='form.busy' type='submit' :label="$t('send_verification_link')"
              unelevated
            )
</template>

<script>
import Form from "vform";

export default {
  middleware: "guest",
  layout: "RightsidedLayout",

  data: () => ({
    status: "",
    form: new Form({
      email: "",
    }),
  }),

  created() {
    if (this.$route.query.email) {
      this.form.email = this.$route.query.email;
    }
  },

  methods: {
    async send() {
      const { data } = await this.form.post("/api/email/resend");

      this.status = data.status;

      this.form.reset();
    },
  },
};
</script>
