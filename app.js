const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'))
  res.render('index', data)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') console.log(`running on port ${port}`)
})
