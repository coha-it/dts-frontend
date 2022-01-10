<template lang="pug">
div
  span(v-if="props && props.row && props.row[val] && props.row[val].length > 0")
    | {{ props.row[val] }}
  span.text-red.c-code-text(v-else) {{ $t('empty') }}
  q-popup-edit(
    v-model="props.row[val]"
    buttons
    @save="save(props.row)"
    :rules="[minChars]"
    single-line
    :label="$t('edit')"
    required
  )
    q-input(v-model="props.row[val]" dense autofocus counter required)
</template>

<script>
export default {
  props: [
    'props',
    'val',
    'save',
    'minChars'
  ]
}
</script>
