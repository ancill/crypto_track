<template>
  <button
    class="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 focus:outline-none py-2 px-7 bg-gray-600 text-white rounded text-base hover:bg-black"
    @click="handlePopUp"
  >
    Open
  </button>
  <div class="relative flex justify-center items-center">
    <div
      id="menu"
      :class="isShowPopUp ? '' : 'hidden'"
      class="w-full h-full bg-gray-900 bg-opacity-80 top-0 fixed sticky-0 rounded"
    >
      <div
        class="2xl:container 2xl:mx-auto py-48 px-4 md:px-28 flex justify-center items-center"
      >
        <div
          class="w-96 md:w-auto dark:bg-gray-800 relative flex flex-col justify-center items-center bg-white py-16 px-4 md:px-24 xl:py-24 xl:px-36"
        >
          <slot name="content" :text="contentText" />
          <button
            class="w-full dark:text-gray-800 dark:hover:bg-gray-100 dark:bg-white sm:w-auto mt-14 text-base leading-4 text-center text-white py-6 px-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 bg-gray-800 hover:bg-black"
            @click="handlePopUp"
          >
            Mmm... Sweet!
          </button>
          <a
            href="javascript:void(0)"
            class="mt-6 dark:text-white dark:hover:border-white text-base leading-none focus:outline-none hover:border-gray-800 focus:border-gray-800 border-b border-transparent text-center text-gray-800"
            @click="handlePopUp"
            >Nope.. I am on a diet</a
          >
          <button
            class="text-gray-800 dark:text-gray-400 absolute top-8 right-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            aria-label="close"
            @click="handlePopUp"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowPopUp: false,
      contentText: "We use cookies",
    };
  },
  methods: {
    handlePopUp() {
      this.isShowPopUp = !this.isShowPopUp;
    },
  },
};
</script>
