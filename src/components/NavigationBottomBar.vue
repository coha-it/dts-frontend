<template lang="pug">
.lt-md
  q-footer.shadow-box.shadow-2.bg-white
    // BottomBar
    q-tabs.bg-white.text-grey-5.coha-bottom-bar(
      v-model="tab",
      dense,
      align="justify",
      active-color="black",
      indicator-color="transparent",
      no-caps,
      style="max-width: 770px; margin: 0 auto"
    )
      q-btn(flat, no-caps, icon="menu", @click="toggleNavigation")
      q-route-tab(
        v-for="item in bottomnav"
        :key="item.title"
        :to="item.route"
        :name="item.title"
        :label="$t(item.title)"
        :icon="item.icon"
      )
</template>

<script>
export default {
  data() {
    return {
      tab: "selectedTab",
      bottomnav: [
        {
          title: "bottombar.settings",
          icon: "settings",
          route: {
            name: "settings"
          },
        },
        {
          title: "bottombar.home",
          icon: "home",
          route: {
            name: "home"
          },
        },
        {
          title: "bottombar.surveys",
          icon: "poll",
          route: {
            name: "surveys"
          },
        },
        {
          title: "bottombar.faq",
          icon: "help",
          route: {
            name: "faq"
          },
        },
      ],
    };
  },

  methods: {
    toggleNavigation: function () {
      this.$emit("toggle-navigation", true);
    },
  },
};
</script>

<style lang="scss">
.coha-bottom-bar .q-tabs__content > * {
  padding: 0;
  flex: 1 1 auto;
  flex-basis: 0 !important;
  height: 100%;
  .q-tab__content {
    min-width: 30px;
  }
  &:not(.q-tab--active) {
    .q-tab__label {
      line-height: 0;
      transform: scale(0);
      font-size: 0;
    }
  }
}
</style>
