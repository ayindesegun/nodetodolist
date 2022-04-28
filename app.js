const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb+srv://admin-segun:ayinseg@cluster0.gebxu.mongodb.net/todolistDB')
/* let items = ['Buy food', 'Cook food', 'Eat food'] */
const itemsSchema = {
  name: String,
}
const Item = mongoose.model('Item', itemsSchema)
const item1 = new Item({
  name: 'Welcome to your todo list',
})
const item2 = new Item({
  name: 'Hit the + button to add to the list',
})
const item3 = new Item({
  name: '<--- Hit this to delete an item',
})

const defaultItems = [item1, item2, item3]
const listSchema = {
  name: String,
  items: [itemsSchema],
}
const List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Success!')
        }
      })
      res.redirect('/')
    } else {
      res.render('list', { listTitle: 'Today', newListItems: foundItems })
    }
  })
})

app.get('/:customRoute', (req, res) => {
  const customRoute = _.capitalize(req.params.customRoute)
  List.findOne({ name: customRoute }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create new list
        const list = new List({
          name: customRoute,
          items: defaultItems,
        })

        list.save()
        res.redirect('/' + customRoute)
      } else {
        // Show an existing list
        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        })
      }
    }
  })
})

app.post('/', (req, res) => {
  let itemName = req.body.newItem
  const listName = req.body.list
  const item = new Item({
    name: itemName,
  })
  if (listName === 'Today') {
    item.save()
    res.redirect('/')
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect('/' + listName)
    })
  }
})
app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log('Successfully deleted item')
        res.redirect('/')
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull : {items: {_id: checkedItemId }}}, (err, foundList) => {
      if (!err){
        res.redirect('/' + listName)
      }
    })
  }
})
app.listen(3000, () => {
  console.log('App is listening on port 3000!')
})
