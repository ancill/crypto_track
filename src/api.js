const API_KEY =
  "f4829e03fd35e85421baf7d5b747d5ccaf6ba31428a825af81659e9f02fb8777"

const tickersHandlers = new Map()

export const getCoinsListFullInfo = () => {
  return fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((r) => r.json())
    .then((data) => data.Data)
}

//refactor to  URLsearchParams
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

// subscribers is functions that we store in tickersHandlers
export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [] // get all func from ticker
  tickersHandlers.set(ticker, [...subscribers, cb]) // set all old funcs and new one
}

export const unsubscribeFromTickers = (ticker) => {
  // const subscribers = tickersHandlers.get(ticker) || []
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cb)
  // )

  const isDeleted = tickersHandlers.delete(ticker)
  console.log(isDeleted, ticker)
}

setInterval(loadTickers, 5000)

window.tickers = tickersHandlers
