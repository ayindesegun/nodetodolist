const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')
let items = ['Buy food', 'Cook food', 'Eat food']
app.get('/', (req, res) => {
  var today = new Date()
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }
  var day = today.toLocaleDateString('en-US', options)

  res.render('list', { listTitle: day, newListItems: items })
})
app.post('/', (req, res) => {
  let item = req.body.newItem
  items.push(item)
  res.redirect('/')
})
app.listen(3000, () => {
  console.log('App is listening on port 3000!')
})
