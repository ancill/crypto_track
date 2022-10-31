<template>
  <div
    v-if="isOpen"
    class="relative flex justify-center items-center"
    @click="close"
  >
    <div
      id="menu"
      class="w-full h-full bg-gray-900 bg-opacity-80 top-0 fixed sticky-0 rounded"
    >
      <div
        class="2xl:container 2xl:mx-auto py-48 px-4 md:px-28 flex justify-center items-center"
      >
        <div
          class="w-96 md:w-auto dark:bg-gray-800 relative flex flex-col justify-center items-center bg-white py-16 px-4 md:px-24 xl:py-24 xl:px-36"
          @click.stop
        >
          <slot name="content" :text="$options.COOKIES_TEXT" />
          <slot name="action" :confirm="popUpConfirm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      requered: true,
      default: false,
      type: Boolean,
    },
    click: {
      requered: true,
      default: null,
      type: Function,
    },
  },
  emits: {
    "close-modal": null,
  },
  COOKIES_TEXT: "We use cookies",
  mounted() {
    document.addEventListener("keydown", this.onKeyDownEvent);
  },
  unmounted() {
    document.removeEventListener("keydown", this.onKeyDownEvent);
  },
  methods: {
    close() {
      this.$emit("close-modal");
    },
    onKeyDownEvent(e) {
      if (this.isOpen && e.key === "Escape") {
        console.log("pressed");
        this.close();
      }
    },
    popUpConfirm() {
      alert("CONFIRMED!");
      console.log("conf");
      this.close();
    },
  },
};
</script>
