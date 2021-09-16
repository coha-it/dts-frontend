<template lang="pug">
div
  // Alert
  alert-success(:form='form' :message="$t('info_updated')")
  alert-error(:form='form' :message="$t('error_alert_text') + (response)")
  h1 {{ $t('settings') }}
  p {{ $t('your settings') }}
  q-form(style='max-width: 550px;' @submit.prevent='update' @keydown='form.onKeydown($event)')
    .container
      // E-Mail User
      template(v-if='user.is_panuser === false')
        // Form
        .row
          .pa-0.col
            // Email
            q-input(ref='email' v-model='form.email' :label="$t('email_label')" color='black' :error="form.errors.has('email')" type='email' name='email' required outlined style='max-width: 350px;')
              template(v-slot:prepend)
                q-icon(name='email')
            //- br
            //- q-checkbox(ref='newsletter' v-model='form.newsletter' type='checkbox' :label="$t('newsletter.newsletter')")
        br
        br
        //.row(align='center' style='max-width: 350px;')
        //  .pa-0.col.col-12.col-sm-12.col-md-12
        //    h2 Firma
        //    p Passen Sie ihre Firma an
        //    br
        //    select(v-model='user.company_id' @change="profileDataChanged('company', user.company_id, user.companies)")
        //      option(disabled) Bitte auswählen
        //      option(v-for='company in user.companies' v-bind:key='company.id' :value='company.id' :selected='(user.company && user.company.id == company.id)') {{ company.name }}
        //    select(v-model='user.location_id' @change="profileDataChanged('location', user.location_id, user.locations)")
        //      option(disabled) Bitte auswählen
        //      option(v-for='location in user.locations' v-bind:key='location.id' :value='location.id' :selected='(user.location && user.location.id == location.id)') {{ location.name }}
        //    select(v-model='user.department_id' @change="profileDataChanged('department', user.department_id, user.departments)")
        //      option(disabled) Bitte auswählen
        //      option(v-for='department in user.departments' v-bind:key='department.id' :value='department.id' :selected='(user.department && user.department.id == department.id)') {{ department.name }}
        //    combobox(:p_omodel='company' p_smodel='company' p_smodels='companies' :p_ouser='user' p_sinputlabel='profile.company.choose' create_text='profile.company.create')
        //    combobox(create_text='profile.company.create' p_sinputlabel='profile.department.choose' p_smodel='department' p_smodels='departments' :p_omodel='department' :p_ouser='user')
        //    combobox(create_text='profile.location.create' p_sinputlabel='profile.location.choose' p_smodel='location' p_smodels='locations' :p_omodel='location' :p_ouser='user')
      // PAN - User
      template(v-if='user.is_panuser')
        .row
          .pa-0.col
            q-checkbox(v-model='bChangePin' label='Pin Ändern')
            template(v-if='bChangePin')
              br
              br
              q-input(ref='pin' v-model='form.pin' label='Aktuelle Pin' color='black' :error="form.errors.has('pin')" required style='max-width: 350px;' :type="bShowCurrentPin ? 'text' : 'password'" outlined :placeholder="'Ihre bisherige Pin'" mask='####')
                template(v-slot:prepend)
                  q-icon(name='lock')
                template(v-slot:append)
                  q-icon.pointer(name='visibility' @mousedown='bShowCurrentPin = true' @mouseup='bShowCurrentPin = false')
              q-input(ref='new_pin' v-model='form.new_pin' label='Neue Pin' color='black' :error="form.errors.has('new_pin')" required style='max-width: 350px;' :type="bShowNewPin ? 'text' : 'password'" outlined :placeholder="'z.B.: ' + randPin()" mask='####' hint='Mask: Vierstellige Nummern-kombination')
                template(v-slot:prepend)
                  q-icon(name='dialpad')
                template(v-slot:append)
                  q-icon.pointer(name='visibility' @mousedown='bShowNewPin = true' @mouseup='bShowNewPin = false')
            br
            br
      .row
        .pa-0(cols='12' sm='12' md='12')
          // Submit Button
          q-btn(
            color='primary'
            large
            block
            :loading='form.busy'
            type='submit'
            :label="$t('update')"
            unelevated
          )
</template>

<script>
import Form from "vform";
import { mapGetters } from "vuex";
// import UserDataModal from '@/components/Backend/UserDataModal'

export default {
  scrollToTop: false,

  // components: {
  //   UserDataModal
  // },

  data: () => ({
    // Response
    response: "",

    // Hide Show
    bChangePin: false,
    bShowCurrentPin: false,
    bShowNewPin: false,

    // Form
    form: new Form({
      name: "",
      email: "",
      company_id: "",
      department_id: "",
      location_id: "",
      newsletter: false,
      pin: "",
      new_pin: "",
    }),
    company: [],
    department: [],
    location: [],
  }),

  computed: mapGetters({
    user: "auth/user",
  }),

  created() {
    // Fill the form with user data.
    this.form.keys().forEach((key) => {
      this.form[key] = this.user[key];
    });

    this.form.newsletter = this.user.newsletter ? true : false;
  },

  methods: {
    randPin() {
      let max = 9999;
      let min = 1000;

      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    async update() {
      const { data } = await this.form.patch("/api/settings/profile");
      this.$store.dispatch("auth/updateUser", { user: data }).then(() => {
        this.form.pin = "";
        this.form.new_pin = "";
      });
    },
    findById(arr, id) {
      return arr.find((x) => x.id === id);
    },
    profileDataChanged(str, id, arr) {
      var f = this.findById(arr, id);
      this.form[str + "_id"] = f.id;
    },
  },
};
</script>
