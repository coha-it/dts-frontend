<template lang="pug">
.surveys
  h1 {{ $t('surveys') }}
  SurveysList
</template>

<script>
import SurveysList from '@/components/SurveysList'

export default {
  components: {
    SurveysList
  }
}
</script>
