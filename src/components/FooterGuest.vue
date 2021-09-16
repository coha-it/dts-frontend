<template lang="pug">
.footer
  .fit.row.wrap.justify-between.items-center.content-center
    .q-pa-md
      LocaleSwitcher
    .q-pa-md.text-right
      span Corporate Happiness &copy; {{ new Date().getFullYear() }}
</template>

<script>
import LocaleSwitcher from "@/components/LocaleSwitcher";
export default {
  name: "FooterGuest",
  components: {
    LocaleSwitcher,
  },
  props: [],
  created: function () {},
};
</script>
