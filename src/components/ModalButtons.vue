<template>
  <button
    class="w-full dark:text-gray-800 dark:hover:bg-gray-100 dark:bg-white sm:w-auto mt-14 text-base leading-4 text-center text-white py-6 px-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 bg-gray-800 hover:bg-black"
    @click="onClickOk"
  >
    Mmm... Sweet!
  </button>
  <a
    href="javascript:void(0)"
    class="mt-6 dark:text-white dark:hover:border-white text-base leading-none focus:outline-none hover:border-gray-800 focus:border-gray-800 border-b border-transparent text-center text-gray-800"
    @click="onClickClose"
    >Nope.. I am on a diet</a
  >
  <button
    class="text-gray-800 dark:text-gray-400 absolute top-8 right-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
    aria-label="close"
    @click="onClickClose"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
<script>
export default {
  props: {},
  emits: {
    closeModal: null,
  },
  methods: {
    onClickOk() {
      this.$emit("closeModal");
    },
    onClickClose() {
      this.$emit("closeModal");
    },
  },
};
</script>
