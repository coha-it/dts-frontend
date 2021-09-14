<template lang="pug">
button.btn(
  :type="nativeType"
  :disabled="loading"
  :class="{[`btn-${type}`]: true, 'btn-block': block, 'btn-lg': large, 'btn-loading': loading}"
)
  slot
</template>

<script>
export default {
  name: 'VButton',

  props: {
    type: {
      type: String,
      default: 'primary'
    },

    nativeType: {
      type: String,
      default: 'submit'
    },

    loading: {
      type: Boolean,
      default: false
    },

    block: {
      type: Boolean,
      default: false
    },

    large: {
      type: Boolean,
      default: false
    }
  }
}
</script>
