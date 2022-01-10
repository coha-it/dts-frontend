<template lang="pug">
li.nav-item.dropdown
  a.nav-link.dropdown-toggle(
    href="#",
    role="button",
    data-toggle="dropdown",
    aria-haspopup="true",
    aria-expanded="false"
  ) {{ locales[locale] }}

  .dropdown-menu
    a.dropdown-item(
      v-for="(value, key) in locales",
      :key="key",
      href="#",
      @click.prevent="setLocale(key)"
    ) {{ value }}
</template>

<script>
import { mapGetters } from "vuex";
import { loadMessages } from "@/plugins/i18n";

export default {
  computed: mapGetters({
    locale: "lang/locale",
    locales: "lang/locales",
  }),

  methods: {
    setLocale(locale) {
      if (this.$i18n.locale !== locale) {
        loadMessages(locale);

        this.$store.dispatch("lang/setLocale", { locale });
      }
    },
  },
};
</script>
