const cheerio = require('cheerio')
const getStdin = require('get-stdin')

const parseRawHtml = (rawHtml) => {
  const $ = cheerio.load(rawHtml)
  return $('article')
    .map((i, e) => $(e).data())
    .get()
}

const getDiscount = (article) =>
  '-' +
  (article.product.coupon ||
    parseInt(article.product.metric1) -
      parseInt(article.product.price) +
      '.00')

const getWmn = (article) =>
  article.product.name.includes('WMN') || Boolean(article.wmn)

const processArticle = (article) => ({
  name: article.product.name,
  date: article.date,
  price: article.product.price,
  discount: getDiscount(article),
  year: article.year,
  size: article.size.replace(/\|/g,''),
  wmn: getWmn(article),
  id: article.id
})

getStdin()
  .then(parseRawHtml)
  .then(articles => articles.map(processArticle))
  .then(bikes => console.log(JSON.stringify(bikes, null, 4)))
