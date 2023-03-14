import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { app, db } from "../src/firebase";
import {AiOutlineMinus, AiOutlinePlus, AiOutlineCloseCircle} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import Extra from './Extra'; // Импортируйте компонент Extra здесь, если он находится в другом файле

const Search = ({ tableId }) => {
  const [items, setItems] = useState([
 
    { id: 79, text: "Piiza Hawaii", price: 10.90, percent: 7, category:'pizza' },
    { id: 80, text: "Pizza Margherita", price: 8.90, percent: 7, category:'pizza' },
    { id: 81, text: "Pizza della Casa", price: 13.50, percent: 7, category:'pizza' },
    { id: 82, text: "Pizza Prosciutto", price: 9.40, percent: 7, category:'pizza' },
    { id: 83, text: "Pizza Don Padrino", price: 13.50, percent: 7, category:'pizza' },
    { id: 84, text: "Pizza Bianca", price: 10.90, percent: 7, category:'pizza' },
    { id: 85, text: "Pizza Funghi", price: 9.40, percent: 7, category:'pizza' },
    { id: 86, text: "Pizza Salami", price: 9.40, percent: 7 },
   
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const foundItems = items.filter((item) =>
  item.id.toString().includes(searchTerm)
);
const handleInputChange = (event) => {
  const { value } = event.target;
  setSearchTerm(value);

  const foundItem = items.find(
    (item) =>
      item.id.toString() === value || item.text.toLowerCase().includes(value.toLowerCase())
  );
  if (foundItem) {
    setFilteredItems([foundItem]);
  } else {
    const foundItems = items.filter(
      (item) =>
        item.id.toString().includes(value) ||
        item.text.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(foundItems);
  }
};




const handleAddButtonClick = (item) => {
  const itemToAdd = { ...item, quantity: 1, totalPrice: item.price.toFixed(2) };
  setAddedItems([...addedItems, itemToAdd]);
  addItem(tableId, itemToAdd);
  setSearchTerm("");
  setSelectedItem(null);
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
  const [showExtra, setShowExtra] = useState(false); // Добавьте состояние для отображения компонента Extra
    const [selectedItemId, setSelectedItemId] = useState(null); // Добавьте новое состояние selectedItemId

  const handleExtraButtonClick = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Suchen"
        className="w-full px-2 py-1 mt-10 placeholder:text-gray-500 rounded-lg bg-gray-300 focus:ring-2  focus:outline-none"
      />
  
      {searchTerm !== "" && (
        <div className="bg-white mt-2 rounded-lg">
          <ul className=" rounded-lg">
            {filteredItems.map((item) => (
              <div className="flex justify-between w-full p-2">
                <li key={item.id}>
                  {item.text}{" "}
                </li>
                  <button onClick={() => handleAddButtonClick(item)}><AiOutlinePlus/></button>
              </div>
            ))}
          </ul>
        </div>
      )}
  
  <div className="bg-white rounded-lg mt-10">
        <ul>
          {addedItems.map((item) => (
            <div
              key={item.id}
              className="flex-col w-full justify-between border-b border-gray-300 mt-2 "
            >
              <div className="p-2 font-medium">
                <ul className="flex justify-between text-left">
                  <li className="text-[16px]" key={item.id}>
                    {item.text}
                  </li>
                  <li className="text-[16px] " key={item.id}>
                    {(item.price * item.quantity).toFixed(2) + "€"}
                  </li>
                </ul>
                <div className="flex justify-between">
                  <div className="flex flex-col mt-2">
                    <div className="bg-gray-300 px-2 py-1 rounded-full items-center flex justify-between gap-5">
                      <button
                        onClick={() => handleMinusButtonClick(item.id)}
                        className="text-[20px]"
                      >
                        <AiOutlineMinus />
                      </button>
                      <span>{item.quantity}</span>
  
                      <button
                        onClick={() => handlePlusButtonClick(item.id)}
                        className=" text-[20px]"
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>
                  {item.category === 'pizza' && (
                    <button onClick={() => handleExtraButtonClick(item.id)}>Extra</button>
                  )}
                  <button onClick={() => handleDeleteButtonClick(item.id)}>
                    Löschen
                  </button>
                </div>
                {selectedItemId === item.id && <Extra />} {/* Отобразите компонент Extra, когда selectedItemId равно item.id */}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
          }   

export default Search;
