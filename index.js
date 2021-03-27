const express = require('express')
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const path = require('path')

const PORT = process.env.PORT || 5003

const app = express()

const getAllCard = async () => {
    try {
    const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=Jan%2001%202000&&enddate=Jan%2001%202004&&language=fr')
    const json = await res.json()
    console.table(json.data)
    return json 
} catch (err) {
    console.log(err)
}
} 

app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.get('/', async(req, res) => {
    try {
        const card = await getAllCard()
        res.render('home', {card})
    } catch (err) {
        console.log(err)
    }
})

app.get('/:title', (req, res) => {
    const title = req.params.title
    res.render('title', { title, subTitle: `My page ${title}` })
}) 

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))