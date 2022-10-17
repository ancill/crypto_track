const API_KEY =
  "f4829e03fd35e85421baf7d5b747d5ccaf6ba31428a825af81659e9f02fb8777"

//refactor to  URLsearchParams
export const loadTicker = (tickerName) => {
  return fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  ).then((r) => r.json())
}
