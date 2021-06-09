<template lang="pug">
.rightsided-content.coha--login-wrapper
  .inner-content
    // Back and Header
    .container
      .row
        .col-12.col-sm-12.col-md-12
          // Back
          back(:to="{ name: 'login' }")
      .row.self-center
        .col-10.col-sm-10.col-md-10.self-center(align-self='center')
          h1.q-mb-none {{ $t(&quot;prm_title&quot;) }}
          p.subtitle
            | {{ $t(&quot;prm_desc&quot;) }}
        .col-2.col-sm-2.col-md-2.self-center(align-self='center')
          q-icon(name='mdi-email' size='xl')
    // Form
    q-form(@submit.prevent='send' @keydown='form.onKeydown($event)')
      .container
        .row
          .col-12.col-sm-12.col-md-12
            // Email
            q-input(
              ref='email'
              v-model='form.email'
              filled
              :label="$t('email_label')"
              color='black'
              :error="form.errors.has('email')"
              type='email'
              name='email'
              required
            )
        .row
          .col.col-12
            // Submit Button
            q-btn.full-width.q-mb-md(
              color='primary'
              size='medium'
              :loading='form.busy'
              type='submit'
              unelevated
              :label="$t('send_password_reset_link')"
            )
</template>

<script>
import Form from "vform";
import Back from "@/components/AuthBack.vue";

export default {
  middleware: "guest",
  layout: "RightsidedLayout",

  components: {
    Back,
  },

  data: () => ({
    status: "",
    form: new Form({
      email: "",
    }),
  }),

  methods: {
    alertError() {
      this.$q.notify({
        message: this.form.errors,
        position: "top-right",
        color: "error",
        timeout: 3000,
      });
    },
    alertSuccess() {
      this.$q.notify({
        message: this.$t("email sent"),
        caption: this.$t(this.status),
        actions: [{ icon: "close", color: "white" }],
        position: "top-right",
        color: "primary",
        timeout: 10000,
      });
    },
    async send() {
      // Ajax and Set Status
      const { data } = await this.form.post("/api/password/email");
      this.status = data.status;

      // Alerts
      if (this.form.errors.has("email")) {
        this.alertError();
      } else {
        this.alertSuccess();
      }

      // Reset Form
      this.form.reset();
    },
  },
};
</script>
