<template>
  <button
    type="button"
    :disabled="disabled"
    :class="
      $props.disabled
        ? 'cursor-not-allowed bg-gray-300 text-sm '
        : 'bg-gray-600 hover:bg-gray-700'
    "
    class="my-4 inline-flex items-center rounded-full border border-transparent py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
  >
    <svg
      class="-ml-0.5 mr-2 h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="#ffffff"
    >
      <path
        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      />
    </svg>
    Добавить
  </button>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      requered: false,
      default: false,
    },
  },

  created() {},
}
</script>
