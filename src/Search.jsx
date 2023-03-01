import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { app, db } from "../src/firebase";
import {AiFillMinusCircle, AiFillPlusCircle, AiOutlineCloseCircle} from 'react-icons/ai'

const Search = ({ tableId }) => {
  const [items, setItems] = useState([
    { id: 1, text: "Martini Rosso/Bianco", price: 5.1, percent: 19 },
    { id: 2, text: "Cynar Soda", price: 5.2, percent: 19 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const foundItems = items.filter((item) =>
  item.id.toString().includes(searchTerm)
);
  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const foundItem = items.find((item) => item.id.toString() === value);
    setSelectedItem(foundItem);
  };

  const handleAddButtonClick = () => {
    if (selectedItem) {
      const itemToAdd = { ...selectedItem, quantity: 1, totalPrice: selectedItem.price.toFixed(2) };
      setAddedItems([...addedItems, itemToAdd]);
      addItem(tableId, itemToAdd);
    }
  };

  const addItem = async (tableId, itemToAdd) => {
    try {
      const docRef = doc(collection(db, "tables"), tableId, "items", itemToAdd.id.toString());
      const itemData = { ...itemToAdd }; // Добавляем свойство quantity со значением 1
      await setDoc(docRef, itemData);
    } catch (error) {
      console.error("Error adding item to Firestore: ", error);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tables", tableId, "items"),
      (snapshot) => {
        const addedItemsData = snapshot.docs.map((doc) => doc.data());
        setAddedItems(addedItemsData);
      }
    );
    return () => unsubscribe();
  }, [tableId]);
  const updateItem = async (tableId, itemId, dataToUpdate) => {
    try {
      const docRef = doc(collection(db, "tables", tableId, "items"), itemId.toString());
      await updateDoc(docRef, dataToUpdate);
    } catch (error) {
      console.error("Error updating item in Firestore: ", error);
    }
  };
  
  const handlePlusButtonClick = async (id) => {
    const updatedItems = addedItems.map((item) => {
      if (item.id === id) {
        const updatedQuantity = item.quantity + 1;
        const totalPrice = (item.price * updatedQuantity).toFixed(2);
        const updatedItem = { ...item, quantity: updatedQuantity, totalPrice };
        updateItem(tableId, id, updatedItem);
        return updatedItem;
      } else {
        return item;
      }
    });
    setAddedItems(updatedItems);
  };
  
  const handleMinusButtonClick = async (id) => {
    const updatedItems = addedItems.map((item) => {
      if (item.id === id) {
        const updatedQuantity = item.quantity - 1;
        if (updatedQuantity === 0) {
          deleteItem(tableId, id);
          return null;
        } else {
          const totalPrice = (item.price * updatedQuantity).toFixed(2);
          const updatedItem = { ...item, quantity: updatedQuantity, totalPrice };
          updateItem(tableId, id, updatedItem);
          return updatedItem;
        }
      } else {
        return item;
      }
    });
    setAddedItems(updatedItems.filter((item) => item !== null));
  };
  const deleteItem = async (tableId, itemId) => {
    try {
      const docRef = doc(collection(db, "tables", tableId, "items"), itemId.toString());
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting item from Firestore: ", error);
    }
  };
  const handleDeleteButtonClick = async (id) => {
    try {
      const docRef = doc(collection(db, "tables", tableId, "items"), id.toString());
      await deleteDoc(docRef);
      setAddedItems(addedItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item from Firestore: ", error);
    }
  };
  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Suchen"
        className='w-full px-2 rounded-lg'/>
      
      <button onClick={handleAddButtonClick}>Add</button>
      <div className="bg-white px-2 rounded-lg">
        <ul>
          {addedItems.map((item) => (
            <div key={item.id} className='flex-col w-full justify-between border-b border-black mt-2 '>
              <div className="p-2">
                <ul className='flex justify-between'>
                  <li className='text-[18px]' key={item.id}>{item.quantity + "x" + ' ' + item.text}</li>
                  <li className='font-bold' key={item.id}>{(item.price * item.quantity ).toFixed(2) +'€'}</li>
                </ul>
                <div className='flex justify-between'>
                  <div className="flex flex-col mt-2">
                    <div>
                      <button onClick={() => handleMinusButtonClick(item.id)} className='text-[24px]'><AiFillMinusCircle /></button>
                      <button onClick={() => handlePlusButtonClick(item.id)} className='ml-4 text-[24px]'><AiFillPlusCircle/></button>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteButtonClick(item.id)}>Löschen</button>
                </div>
              </div>
              
            </div>
          ))}

        </ul>
      </div>
    </div>
  );
};

export default Search;
