<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700" />
        <h3 class="text-sm font-bold dark:text-white">Тикер</h3>
        <div class="relative mt-1 rounded-md shadow-md">
          <input
            id="wallet"
            ref="wallet"
            v-model="tickerInputValue"
            type="text"
            name="wallet"
            class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            placeholder="Например DOGE"
            @keyup.enter="!isShowTooltipForSameTicker ? add() : null"
          />
        </div>
        <div class="flex flex-wrap rounded-md bg-white p-1 shadow-md shadow-md">
          <span
            v-for="tag in tags"
            :key="tag"
            class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
            @click="tickerInputValue = tag"
          >
            {{ tag }}
          </span>
        </div>
        <div v-if="isShowTooltipForSameTicker" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>

    <add-button
      :is-disabled="isShowTooltipForSameTicker"
      @click="!isShowTooltipForSameTicker ? add() : null"
    />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue"

export default {
  components: {
    AddButton,
  },

  data() {
    return {
      ticker: "",
    }
  },

  methods: {
    add() {
      const newTicker = {
        label: this.tag ? this.tag : this.tickerInputValue,
        price: "-",
      }
      this.tickers = [...this.tickers, newTicker]
      subscribeToTicker(newTicker.label, (newPrice) =>
        this.updateTicker(newTicker.label, newPrice)
      )
    },
  },
}
</script>
