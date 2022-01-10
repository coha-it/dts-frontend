<template lang="pug">
router-link.small.ml-auto.my-auto(
    :to="{ path: $store.state.route.from.fullPath }"
) {{ $t('back') }}
</template>
