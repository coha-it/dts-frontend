<template lang="pug">
.card
  .card-header(v-if="title") {{ title }}
  .card-body
    slot
</template>

<script>
export default {
  name: 'Card',

  props: {
    title: { type: String, default: null }
  }
}
</script>
