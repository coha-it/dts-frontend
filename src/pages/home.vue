<template lang="pug">
.main-layout
  h1 {{ $t('home') }}
  SurveysList
</template>

<script>
import SurveysList from '@/components/SurveysList'

export default {
  middleware: 'auth',

  components: {
    SurveysList
  },

  data: function () {
    return {}
  },

  // This was causing Theme-Problems
  // metaInfo () {
  //   return { title: this.$t('home') }
  // },

  mounted: function () {}
}
</script>
