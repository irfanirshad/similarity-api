import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import strongPasswordChecker from './strongPasswordChecker';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      // Call the strongpasswordchecker function with the input value
      const strength = strongPasswordChecker(itemText);
      setPasswordStrength(strength);

      const res = await axios.post('http://localhost:5500/api/item', { item: itemText, passwordStrength: strength })
      setListItems(prev => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Update item
  const updateItem = async (e) => {
    e.preventDefault()
    try {
      // Call the strongpasswordchecker function with the input value
      const strength = strongPasswordChecker(updateItemText);
      setPasswordStrength(strength);

      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText,  passwordStrength: strength })
      console.log(res.data)
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  }


  // delete item
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };


  // Create function to render password strength message
  const renderPasswordStrength = () => {
    if (passwordStrength === '') {
      return null;
    } else if (passwordStrength >= 3) {
      return <p className="password-strength strong">Strong password as result is `{passwordStrength}`</p>;
    } else {
      return <p className="password-strength weak">Weak password as result is `{passwordStrength}`</p>;
    }
  }

  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )


  return (
    <div className="App">
      <h1>Simple PasswordStrength Checker </h1>
      <h3>Type in input and have your password strength displayed to you . </h3>
      <h5> Here PasswordStrength is the minimum number of steps required to make password strong. </h5>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => {setItemText(e.target.value)} } value={itemText} />
        {renderPasswordStrength()} {/* Render password strength message */}
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {
          listItems.map(item => (
          <div className="todo-item">
            {
              isUpdating === item._id
              ? renderUpdateForm()
              : <>
                  <p className="item-content">Input String: {item.item} <br/>    PasswordStrength: {item.passwordStrength}</p>
                  {/* <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button> */}
                  <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button>
                </>
            }
          </div>
          ))
        }
        

      </div>
    </div>
  );
}

export default App;