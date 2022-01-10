<template lang="pug">
div
  span(v-for="head in stats.header") {{ head }};
  div(v-for="(tr, i) in stats.data")
    span {{ i }}
    span(v-for="td in tr") {{ td }};
</template>

<script>
export default {
  props: ['stats']
}
</script>
