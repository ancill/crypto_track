<template>
  <div
    class="dark:bg-slate-800 container mx-auto flex flex-col items-center bg-gray-100 p-4"
  >
    <div class="container">
      <add-ticker
        :disabled="tooManyTickersAdded"
        :tickers="tickers"
        @add-ticker="addTicker"
      />
      <template v-if="tickers.length">
        <div class="">
          <hr class="my-4 w-full border-t border-gray-600" />
          <button
            v-if="page > 1"
            class="my-4 mx-2 inline-flex items-center rounded-full border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="page = page - 1"
          >
            Назад
          </button>
          <button
            v-if="hasNextPage"
            class="my-4 mx-2 inline-flex items-center rounded-full border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="page = page + 1"
          >
            Вперед
          </button>
          <div class="my-2 mx-2 dark:text-white">
            Фильтр:
            <input
              v-model="filter"
              class="border-b border-gray-600 bg-transparent"
            />
          </div>
        </div>
        <hr class="my-4 w-full border-t border-gray-600" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="ticker in paginatedTickers"
            :key="ticker.label"
            class="cursor-pointer overflow-hidden rounded-lg border-solid border-purple-800 bg-white shadow"
            :class="selectedTicker === ticker ? 'border-4' : ''"
            @click="select(ticker)"
          >
            <div
              class="px-4 py-5 text-center sm:p-6"
              :class="ticker.price === '-' ? 'bg-red-100' : ''"
            >
              <dt class="truncate text-sm font-medium text-gray-500">
                {{ ticker.label }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(ticker.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200" />
            <button
              class="text-md flex w-full items-center justify-center bg-gray-100 px-4 py-4 font-medium text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-600 hover:opacity-20 focus:outline-none sm:px-6"
              @click="onDelete(ticker.label)"
              @click.stop=""
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="my-4 w-full border-t border-gray-600" />
      </template>
      <price-graph
        :selected-ticker="selectedTicker"
        @unselect-ticker="unselectTicker"
      />
      <button
        class="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 focus:outline-none py-2 px-7 bg-gray-600 text-white rounded text-base hover:bg-black"
        @click="isModalOpen = true"
      >
        Open
      </button>
      <modal-container :is-open="isModalOpen" @close-modal="onClickCloseModal">
        <template #content="{ text }">
          <cookies-content :content="text" />
        </template>

        <template #action="{ confirm }">
          <modal-buttons @click-close="onClickCloseModal" @click-ok="confirm" />
        </template>
      </modal-container>
    </div>
  </div>
</template>

<script>
// todo:
// [X] 1. Watch try refactor - 3
// [X] 2. Still fetching data after ticket delete - 5
// [X] 3. Too much fetch calls - 4
// [X] 4. Calls inside component - 5
// [ ] 5. Api error checking - 5
// [X] 6. State has connected data - 5+
// [ ] 7. Graph looks weird when gets more then 100 prices updates - 4
// [X] 8. When we delete ticket localStorage not updated - 5
// [ ] 9. localStorage inside private tabs -2
// [ ] 10. magic number ( url, milseconds, localStorage key, pageNumber, api key) - 1
// [x] 11. graph broken with same values
// [X] 12. removed tickers has graph to show

import { subscribeToTicker, unsubscribeFromTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";
import PriceGraph from "./components/PriceGraph.vue";
import ModalContainer from "./components/ModalContainer.vue";
import CookiesContent from "./components/CookiesContent.vue";
import ModalButtons from "./components/ModalButtons.vue";
export default {
  name: "App",
  components: {
    AddTicker,
    PriceGraph,
    ModalContainer,
    CookiesContent,
    ModalButtons,
  },
  data() {
    return {
      page: 1,
      filter: "",
      tickers: [],

      isShowTooltipForSameTicker: false,
      selectedTicker: null,
      helloText: "hello",
      isModalOpen: false,
    };
  },
  computed: {
    tooManyTickersAdded() {
      return this.tickers.length > 40;
    },
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    filteredTickers() {
      return this.tickers.filter((t) => t.label.includes(this.filter));
    },
    /** Pagination logic
     * 2 --- 6, 11
     * 1 --- 0, 5
     * (6 * (page - 1), 6 * page - 1)
     */
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    // избавляемся от дублирования
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  watch: {
    // убрали логику из действия (метода) на наблюдателя если это то
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    filter() {
      this.page = 1;
    },
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },

    tickers() {
      // keep updated list in storage
      // при watch значение меняются не зависимо от того как были спровацированны действия на изменение
      localStorage.setItem("cryptoList", JSON.stringify(this.tickers));
      this.filter = "";
    },
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    if (windowData.filter) {
      this.filter = windowData.filter;
    }
    if (windowData.page) {
      this.page = windowData.page;
    }
    const tickersLocalData = localStorage.getItem("cryptoList");
    if (tickersLocalData) {
      this.tickers = JSON.parse(tickersLocalData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.label, (newPrice) => {
          this.updateTicker(ticker.label, newPrice);
        });
      });
    }
  },
  methods: {
    addTicker(ticker) {
      const newTicker = {
        label: ticker,
        price: "-",
      };
      this.tickers = [...this.tickers, newTicker];
      subscribeToTicker(newTicker.label, (newPrice) =>
        this.updateTicker(newTicker.label, newPrice)
      );
    },

    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.label === tickerName)
        .forEach((t) => {
          t.price = price;
        });
    },
    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    showTooltipForSameTicker(ticker) {
      return !!this.tickers.find((el) => el.label === ticker);
    },
    unselectTicker() {
      this.selectedTicker = null;
    },
    select(ticker) {
      this.selectedTicker = ticker;
    },
    focusInput() {
      this.$refs.wallet.focus();
    },
    onDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t.label !== tickerToRemove);
      if (this.selectedTicker?.label === tickerToRemove) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove);
    },
    onClickCloseModal() {
      this.isModalOpen = false;
    },
  },
};
</script>
