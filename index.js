const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')

const PORT = process.env.PORT || 5003

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.get('/', (req, res) => res.render('home', { title: 'Home', subTitle: 'Ma home page' }))

app.get('/:title', (req, res) => {
    const title = req.params.title
    res.render('title', { title, subTitle: `My page ${title}` })
}) 

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))