<template>
  <div>
    <div class="welcome-layout">
      <div class="top-right links">
        <template v-if="authenticated">
          <router-link :to="{ name: 'home' }">
            {{ $t('home') }}
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'auth' }">
            {{ $t('entry') }}
          </router-link>
        </template>
      </div>

      <div class="text-center">
        <div class="title">
          {{ title }}
        </div>

        <div class="links">
          <a>Mitarbeiter-Befragungen Online</a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Footer from '@/components/FooterGuest'

export default {
  layout: 'NakedLayout',
  middleware: 'guest',

  components: {
    Footer
  },

  // This was causing Theme-Problems
  // metaInfo () {
  //   return { title: this.$t('home') }
  // },

  data: () => ({
    title: window.config.appName
  }),

  computed: mapGetters({
    authenticated: 'auth/check'
  })
}
</script>

<style lang="scss" scoped>

.welcome-layout {
  color: #636b6f;
  height: 100vh;
  font-weight: 100;
  position: relative;

  .links > a {
    color: #636b6f;
    padding: 0 25px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .1rem;
    text-decoration: none;
    text-transform: uppercase;
  }
}

.top-right {
  position: absolute;
  right: 10px;
  top: 18px;
}

.title {
  font-size: 85px !important;
  font-weight: 100;
  line-height: 1.125em;
}

.text-center {
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    position: absolute;
    display: flex;
    width: fit-content;
    height: fit-content;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    pointer-events: none;
}

</style>
