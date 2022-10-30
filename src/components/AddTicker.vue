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
            v-model="ticker"
            type="text"
            name="wallet"
            class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex flex-wrap rounded-md bg-white p-1 shadow-md">
          <span
            v-for="tag in tags"
            :key="tag"
            class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
            @click="ticker = tag"
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
      :disabled="disabled || isShowTooltipForSameTicker"
      @click="add"
    />
  </section>
</template>

<script>
// TODO:
// [ ] Fix isShowTooltipForSameTicker

import AddButton from "./AddButton.vue";
import { getCoinsListFullInfo } from "../api";
export default {
  components: {
    AddButton,
  },

  props: {
    disabled: {
      type: Boolean,
      requered: false,
      default: false,
    },
    tickers: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  emits: {
    "add-ticker": (value) => typeof value === "string" && value.length > 0,
  },

  data() {
    return {
      ticker: "",
      tags: ["BTC", "ETH", "DODGE", "TSL"],
      isShowTooltipForSameTicker: false,
      coinList: [],
    };
  },

  watch: {
    ticker() {
      this.ticker = this.ticker.toUpperCase();
      const coinsNames = Object.keys(this.coinList);
      const filteredSimilarCoins = coinsNames
        .filter((el) => el.includes(this.ticker))
        .reverse();

      this.isShowTooltipForSameTicker = !!this.tickers.find(
        (el) => el.label === this.ticker
      );
      // check for suggestions tags
      // const l = filteredSimilarCoins.find((el) => this.tickers.includes(el))
      // if no input set tags to popular tags
      if (!this.ticker) {
        this.tags = ["BTC", "ETH", "DODGE", "TSLE"];
        return;
      }
      this.tags = filteredSimilarCoins.slice(0, 4);
    },
  },

  async mounted() {
    this.coinList = await getCoinsListFullInfo();
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  methods: {
    add() {
      if (this.ticker.length === 0) {
        return;
      }
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
  },
};
</script>
