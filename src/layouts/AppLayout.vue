<template lang="pug">
.coha-app--view
  q-layout(view="hHh LpR lFf")
    Navigation(ref="childRef" @navigationStateChanged="navigationStateChanged" )
    q-page-container
      q-page
        .main-body.container(fluid)
          .main-layout
            child
        Footer
    NavigationBottomBar(@toggle-navigation="toggleNavigation")
</template>

<script>
import Navigation from "@/components/Navigation";
import NavigationBottomBar from "@/components/NavigationBottomBar";
import Footer from "@/components/AppViewFooter";

export default {
  middlware: "auth",
  name: "AppLayout",

  components: {
    Navigation,
    NavigationBottomBar,
    Footer,
  },

  data() {
    return {
      left: false,
    };
  },

  methods: {
    toggleNavigation(state) {
      this.left = state;
      this.callChild();
    },

    callChild() {
      this.$refs.childRef.setNavigation(this.left);
    },

    navigationStateChanged(state) {
      this.left = state;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 25px;

  .main-layout {
    max-width: 1580px;
  }
}
</style>
