const router = require('express').Router();
//import todo model 
const todoItemsModel = require('../models/todoItems');


function strongPasswordChecker(pw, minLength = 6, maxLength = 20, maxRepeat = 2) {
  const re = new RegExp(`(.)\\1{0,${maxRepeat}}(?=\\1{${maxRepeat}})`, 'g');
  const changes = (pw.match(re) || []).map(s => s.length).sort((a, b) => b - a);

  let toRemove = pw.length - maxLength;
  while (changes.at(-1) <= toRemove) {
      toRemove -= changes.pop();
  }

  const numChanges = Math.max(
      changes.length, !/[a-z]/.test(pw) + !/[A-Z]/.test(pw) + !/[0-9]/.test(pw));
  return Math.max(minLength - pw.length, numChanges + Math.max(0, pw.length - maxLength)).toString();
};



//create first route --add Todo Item to database
router.post('/api/item', async (req, res)=>{
  try{
    const newItem = new todoItemsModel({
      item: req.body.item,
      passwordStrength: strongPasswordChecker(req.body.item) 
    })
    //save this item in database
    const saveItem = await newItem.save()
    res.status(200).json(saveItem);
  }catch(err){
    res.json(err);
  }
})

//create second route -- get data from database
router.get('/api/items', async (req, res)=>{
  try{
    const allTodoItems = await todoItemsModel.find({});
    res.status(200).json(allTodoItems)
  }catch(err){
    res.json(err);
  }
})


//update item
router.put('/api/item/:id', async (req, res)=>{
  try{
    //find the item by its id and update it
    const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, {$set: req.body});
    res.status(200).json(updateItem);
  }catch(err){
    res.json(err);
  }
})


//Delete item from database
router.delete('/api/item/:id', async (req, res)=>{
  try{
    //find the item by its id and delete it
    const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Item Deleted');
  }catch(err){
    res.json(err);
  }
})


//export router
module.exports = router;