const express = require('express')
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const path = require('path')
const bodyParser = require('body-parser')
const helpers = require('handlebars-helpers')

const PORT = process.env.PORT || 5003

const app = express()

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error)

const getAllCard = catchErrors(async () => {
    const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?&startdate=01/01/1999&enddate=08/23/2003&dateregion=tcg_date&language=fr')
    const json = await res.json()
    return json 
}) 

const getCard = catchErrors(async (card = '1') => {
    const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${card}&startdate=01/01/1999&enddate=08/23/2003&dateregion=tcg_date&language=fr`)
    const json = await res.json()
    return json 
}) 

app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', catchErrors(async(req, res) => {
        const cards = await getAllCard()
        res.render('home', {cards})
}))

app.post('/search', (req, res) => {
    const search = req.body.search
    res.redirect(`/${search}`)
})

app.get('/notFound', (req, res) => res.render('notFound'))

app.get('/:card', catchErrors(async(req, res) => {
    const search = req.params.card
    const card = await getCard(search)
    if (card) {
        res.render('card', { card: card.data[0].name, type: card.data[0].type, desc: card.data[0].desc, cardImages: card.data[0].card_images[0].image_url_small, cardPrices: `Prix : ${card.data[0].card_prices[0].cardmarket_price} $`})
    } else {
        res.redirect('notFound')
    }
})) 

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))