<template lang="pug">
span(data-app)
  a(href="#", @click="show")
    | {{ getLocale() }}
</template>

<script>
import { mapGetters } from "vuex";
// import { mapActions } from 'vuex'
import { loadMessages } from "@/plugins/i18n";

export default {
  computed: {
    ...mapGetters({
      locale: "lang/locale",
      locales: "lang/locales",
    }),
  },

  methods: {
    setLocale(locale) {
      if (this.$i18n.locale !== locale) {
        loadMessages(locale);
        this.$store.dispatch("lang/setLocale", { locale });
      }
    },
    show() {
      console.log("joghurt 1");
      console.log(this.locale);
      console.log(this.locales);
      this.$q
        .bottomSheet({
          message: "Sprache auswählen",
          actions: this.aLocaleOptions,
        })
        .onOk((action) => {
          this.setLocale(action.id);
        })
        .onCancel(() => {
          // console.log('Dismissed')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    getLocale() {
      const locales = this.locales;
      const locale = this.locale;

      return this.$t(locales[locale]);
    },
  },

  data() {
    return {
      dialogm1: "",
      dialog: false,
      localeRadio: "de",
      aLocaleOptions: [],
      sheet: false,
    };
  },

  mounted() {
    if (this.locale) {
      this.localeRadio = this.locale;

      for (var element in this.locales) {
        this.aLocaleOptions.push({
          label: this.$t(element),
          id: element,
        });
      }
    }
  },
};
</script>
