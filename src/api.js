const API_KEY =
  "f4829e03fd35e85421baf7d5b747d5ccaf6ba31428a825af81659e9f02fb8777"

const tickersHandlers = new Map()
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
)

const AGGREGATE_INDEX = "5"

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data)
  if (type !== AGGREGATE_INDEX) {
    return
  }
  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach((fn) => fn(newPrice))
})

export const getCoinsListFullInfo = () => {
  return fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((r) => r.json())
    .then((data) => data.Data)
}

// OLD method to loadTickers / refactor to  URLsearchParams
export const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return
  }

  return fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      )
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? []
        handlers.forEach((fn) => fn(newPrice))
      })
    })
}
// {a: 1, b: 2} => [['a', 1], ['b', 2]] => [['a', 1], ['b', 0.5]] => {a: 1, b: 0.5}

function sendToWebSocket(message) {
  const stringifyMessage = JSON.stringify(message)

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyMessage)
    return
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifyMessage)
    },
    { once: true }
  )
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

function unsubscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

// subscribers is functions that we store in tickersHandlers
export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [] // get all func from ticker
  tickersHandlers.set(ticker, [...subscribers, cb]) // set all old funcs and new one
  subscribeToTickerOnWs(ticker)
}

export const unsubscribeFromTickers = (ticker) => {
  tickersHandlers.delete(ticker)
  unsubscribeToTickerOnWs(ticker)
}

window.tickers = tickersHandlers
