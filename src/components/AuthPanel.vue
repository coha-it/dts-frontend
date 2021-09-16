<template lang="pug">
router-link(:to="{ name: route }" style="cursor: pointer;")
  q-card.auth-panel(color="primary" dark v-ripple :class="'bg-'+ color")
    q-card-section
      .row.items-center.no-wrap
        .col
          .text-h6.headline {{ title }}
          .text-subtitle2.subtitle {{ text }}
        .col-auto
          q-icon.icon(x-large :name="icon")
</template>

<script>
export default {
    props: [
        'title',
        'text',
        'color',
        'route',
        'icon'
    ]
}
</script>
