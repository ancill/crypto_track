const API_KEY =
  "f4829e03fd35e85421baf7d5b747d5ccaf6ba31428a825af81659e9f02fb8777"

//refactor to  URLsearchParams
export const loadTickers = (tickers) => {
  return fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) =>
      Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, 1 / value])
      )
    )
}
// {a: 1, b: 2} => [['a', 1], ['b', 2]] => [['a', 1], ['b', 0.5]]
