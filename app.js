const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'))

app.use('/', (req, res) => res.render('index', data))

app.listen(3000, () => {
  if (process.env.NODE_ENV !== 'production') console.log('running on port 3000')
})
