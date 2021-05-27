<template lang="pug">
div
  h1 {{ $t('Groups') }}
  UserGroups
</template>

<script>
import UserGroups from '@/components/Backend/UserGroups'

export default {
  middleware: 'canCreateGroups',

  components: {
    UserGroups
  }
}
</script>
