<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label
              for="wallet"
              class="block text-sm font-medium text-gray-700"
            ></label>
            <h3 class="text-sm font-bold">Тикер</h3>
            <div class="relative mt-1 rounded-md shadow-md">
              <input
                type="text"
                name="wallet"
                id="wallet"
                ref="wallet"
                @keyup.enter="addTicker(null)"
                v-model="tickerInputValue"
                class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="Например DOGE"
              />
            </div>
            <div
              class="flex flex-wrap rounded-md bg-white p-1 shadow-md shadow-md"
            >
              <span
                class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
                v-for="tag in tags"
                @click="addTicker(tag)"
              >
                {{ tag }}
              </span>
            </div>
            <div class="text-sm text-red-600" v-if="isShowTooltipForSameTicker">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="addTicker(null)"
          :class="
            isShowTooltipForSameTicker
              ? 'cursor-not-allowed bg-gray-300 text-sm '
              : 'bg-gray-600 hover:bg-gray-700'
          "
          class="my-4 inline-flex items-center rounded-full border border-transparent py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <!-- Heroicon name: solid/mail -->
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
            ></path>
          </svg>
          Добавить
        </button>
      </section>
      <template v-if="tickers.length">
        <div class="">
          <hr class="my-4 w-full border-t border-gray-600" />
          <button
            v-if="page > 1"
            @click="page = page - 1"
            class="my-4 mx-2 inline-flex items-center rounded-full border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Назад
          </button>
          <button
            @click="page = page + 1"
            v-if="hasNextPage"
            class="my-4 mx-2 inline-flex items-center rounded-full border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Вперед
          </button>
          <div class="my-2 mx-2">
            Фильтр:
            <input
              class="border-b border-gray-600 bg-transparent"
              v-model="filter"
            />
          </div>
        </div>
        <hr class="my-4 w-full border-t border-gray-600" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            class="cursor-pointer overflow-hidden rounded-lg border-solid border-purple-800 bg-white shadow"
            v-for="ticker in filteredTickers"
            :key="ticker.label"
            @click="select(ticker)"
            :class="sel === ticker ? 'border-4' : ''"
          >
            <div class="px-4 py-5 text-center sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">
                {{ ticker.label }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ ticker.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click="onDelete(ticker.label)"
              @click.stop=""
              class="text-md flex w-full items-center justify-center bg-gray-100 px-4 py-4 font-medium text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-600 hover:opacity-20 focus:outline-none sm:px-6"
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
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="my-4 w-full border-t border-gray-600" />
      </template>

      <section class="relative" v-if="sel">
        <h3 class="my-8 text-lg font-medium leading-6 text-gray-900">
          {{ sel.label }} - USD
        </h3>
        <div class="flex h-64 items-end border-b border-l border-gray-600">
          <div
            v-for="(bar, idx) in normalizeGraph()"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="h-24 w-10 border bg-purple-800"
          ></div>
        </div>
        <button
          type="button"
          class="absolute top-0 right-0"
          @click="sel = null"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
// @ts-nocheck

// todo:
// [ ] 1. Watch try refactor - 3
// [ ] 2. Still fetching data after ticket delete - 5
// [ ] 3. Too much fetch calls - 4
// [ ] 4. Calls inside component - 5
// [ ] 5. Api error checking - 5
// [ ] 6. State has connected data - 5+
// [ ] 7. Graph looks weird when gets more then 100 prices updates - 4
// [ ] 8. When we delete ticket localStorage not updated - 5
// [ ] 9. localStorage inside private tabs -2
// [ ] 10. magic number ( url, milseconds, localStorage key, pageNumber, api key) - 1

import { onMounted, ref } from 'vue'

const api_key =
  'f4829e03fd35e85421baf7d5b747d5ccaf6ba31428a825af81659e9f02fb8777'

const getCoins = async () => {
  const f = await fetch(
    'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
  )
  const data = await f.json()
  return data.Data
}

export default {
  name: 'App',
  watch: {
    filter(val) {
      this.filter = val.toUpperCase()

      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      )
      this.page = 1
    },
    page(val) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      )
    },
    tickerInputValue(val, oldVal) {
      this.tickerInputValue = val.toUpperCase()
      const coinsNames = Object.keys(this.coinList)
      const filteredSimilarCoins = coinsNames
        .filter((el) => el.includes(val))
        .reverse()

      this.isShowTooltipForSameTicker = this.tickers.find(
        (el) => el.label === val
      )

      // check for suggestions tags
      const l = filteredSimilarCoins.find((el) => this.tickers.includes(el))

      // if no input set tags to popular tags
      if (!val) {
        this.tags = ['BTC', 'ETH', 'DODGE', 'TSLE']
        return
      }
      this.tags = filteredSimilarCoins.slice(0, 4)
    },
  },
  computed: {
    filteredTickers() {
      // 1 --- 0, 5
      // 2 --- 6, 11
      // (6 * (page - 1), 6 * page - 1)

      const start = (this.page - 1) * 6
      const end = this.page * 6

      const filteredTickers = this.tickers.filter((t) =>
        t.label.includes(this.filter)
      )

      this.hasNextPage = filteredTickers.length > end

      return filteredTickers.slice(start, end)
    },
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    )

    if (windowData.filter) {
      this.filter = windowData.filter
    }

    if (windowData.page) {
      this.page = windowData.page
    }

    const tickersLocalData = localStorage.getItem('cryptoList')

    if (tickersLocalData) {
      this.tickers = JSON.parse(tickersLocalData)
      this.tickers.forEach((t) => {
        this.subscribeToUpdates(t)
      })
    }
  },
  setup() {
    const coinList = ref({})
    onMounted(async () => {
      coinList.value = await getCoins()
    })

    return {
      coinList,
    }
  },
  data() {
    return {
      page: 1,
      filter: '',
      tickers: [],
      graph: [],
      tickerInputValue: '',
      isShowTooltipForSameTicker: false,
      sel: null,
      tags: ['BTC', 'ETH', 'DODGE', 'TSL'],
      hasNextPage: true,
    }
  },
  methods: {
    focusInput() {
      this.$refs.wallet.focus()
    },
    subscribeToUpdates(newTicker) {
      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${newTicker.label}&tsyms=USD&api_key=${api_key}`
        )

        const data = await f.json()
        const currentTicker = this.tickers.find(
          (t) => t.label === newTicker.label
        )

        if (data.USD && currentTicker?.price) {
          currentTicker.price =
            data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2)
        }

        if (this.sel?.label === newTicker.label) this.graph.push(data.USD)
      }, 5000)
    },
    addTicker(tickerName = null) {
      const label = tickerName ? tickerName : this.tickerInputValue
      const fullTokenInfo = this.coinList[label]
      const newTicker = {
        label,
        price: '-',
        fullName: fullTokenInfo?.FullName,
        pic: fullTokenInfo?.ImageUrl,
      }

      if (this.isShowTooltipForSameTicker || !newTicker.label) {
        this.focusInput()
        return
      }

      this.tickers.push(newTicker)
      this.subscribeToUpdates(newTicker)

      // keep updated list in storage
      localStorage.setItem('cryptoList', JSON.stringify(this.tickers))

      this.tickerInputValue = ''
      this.filter = ''
    },
    showTooltipForSameTicker(ticker) {
      return !!this.tickers.find((el) => el.label === ticker)
    },
    select(ticker) {
      this.sel = ticker
      this.graph = []
    },
    onDelete(idLabel) {
      this.tickers = this.tickers.filter((t) => t.label !== idLabel)
      this.sel = null
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      )
    },
  },
}
</script>
