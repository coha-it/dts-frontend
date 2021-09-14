<template lang="pug">
card(:title="$t('your_info')")
  form(@submit.prevent="update" @keydown="form.onKeydown($event)")
      alert-success(:form="form" :message="$t('info_updated')")

      // Name
      .form-group.row
        label.col-md-3.col-form-label.text-md-right {{ $t('name') }}
        .col-md-7
          input(v-model="form.name" :class="{ 'is-invalid': form.errors.has('name') }" class="form-control" type="text" name="name")
          has-error(:form="form" field="name")
              
      // Email
      .form-group.row
        label(class="col-md-3 col-form-label text-md-right") {{ $t('email') }}
        .col-md-7
          input(v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" class="form-control" type="email" name="email")
          has-error(:form="form" field="email")
              
      // Submit Button
      .form-group.row
        .col-md-9.ml-md-auto
          q-btn(:loading="form.busy" dense round flat type="success" :label="$t('update')")
</template>

<script>
import Form from 'vform'
import { mapGetters } from 'vuex'

export default {
  scrollToTop: false,

  data: () => ({
    form: new Form({
      name: '',
      email: ''
    })
  }),

  computed: mapGetters({
    user: 'auth/user'
  }),

  created () {
    // Fill the form with user data.
    this.form.keys().forEach(key => {
      this.form[key] = this.user[key]
    })
  },

  methods: {
    async update () {
      const { data } = await this.form.patch('/api/settings/profile')

      this.$store.dispatch('auth/updateUser', { user: data })
    }
  }
}
</script>
