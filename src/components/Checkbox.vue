<template lang="pug">
.custom-control.custom-checkbox.d-flex
  input.custom-control-input(
    :id="id || name",
    :name="name",
    :checked="internalValue",
    type="checkbox",
    @click="handleClick"
  )
  label.custom-control-label.my-auto(:for="id || name")
    slot
</template>

<script>
export default {
  name: "Checkbox",

  props: {
    id: { type: String, default: null },
    name: { type: String, default: "checkbox" },
    value: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
  },

  data: () => ({
    internalValue: false,
  }),

  watch: {
    value(val) {
      this.internalValue = val;
    },

    checked(val) {
      this.internalValue = val;
    },

    internalValue(val, oldVal) {
      if (val !== oldVal) {
        this.$emit("input", val);
      }
    },
  },

  created() {
    this.internalValue = this.value;

    if ("checked" in this.$options.propsData) {
      this.internalValue = this.checked;
    }
  },

  methods: {
    handleClick(e) {
      this.$emit("click", e);

      if (!e.isPropagationStopped) {
        this.internalValue = e.target.checked;
      }
    },
  },
};
</script>
