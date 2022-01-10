<template lang="pug">
transition(name="page", mode="out-in")
  slot
    router-view
</template>

<script>
export default {
  name: "Child",
};
</script>
