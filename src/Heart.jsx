import React, { useState, useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { doc, setDoc, updateDoc, collection } from "firebase/firestore"; // Import necessary Firestore methods
import { db } from "./firebase"; // Import your Firestore instance

const Heart = ({ setSelectedItemId, setTableData, tableId, handleCloseHeart }) => { // Add handleCloseHeart here
  const heartItems = [
    { id: 1, text: "Pizza", price: 0.0 },
    { id: 2, text: "Nudeln", price: 0.0 },
    { id: 3, text: "Fleish", price: 0.0 },
    { id: 4, text: "Fish", price: 0.0 },
    { id: 5, text: "Getranke", price: 0.0 },
    { id: 6, text: "Desert", price: 0.0 },
    { id: 7, text: "M1", price: 0.0 },
    { id: 8, text: "M2", price: 0.0 },
    { id: 9, text: "M3", price: 0.0 },
    { id: 10, text: "Küche", price: 0.0 },
    { id: 11, text: "Antipasti", price: 0.0 },
    { id: 12, text: "Wein Fl.", price: 0.0 },
    { id: 13, text: "Wein 0.2", price: 0.0 },
    { id: 14, text: "Wein 0.1", price: 0.0 },
  ];

  
  const [priceInputs, setPriceInputs] = useState({});
  const [clickedItemId, setClickedItemId] = useState(null);
 
  const handlePriceInputChange = (itemId, value) => {
    setPriceInputs((prev) => ({ ...prev, [itemId]: value }));
  };

  const addItem = async (tableId, itemToAdd) => {
    try {
      const docRef = doc(
        collection(db, "tables"),
        tableId,
        "items",
        itemToAdd.id.toString()
      );
      const itemData = { ...itemToAdd, extras: [] };
      await setDoc(docRef, itemData);
    } catch (error) {
      console.error("Error adding item to Firestore: ", error);
    }
  };

  const handleItemSelected = (item) => {
    const uniqueId = Date.now();
    const itemToAdd = {
      ...item,
      id: item.id + "-" + uniqueId,
      price: parseFloat(priceInputs[item.id] || item.price),
      quantity: 1,
      totalPrice: (parseFloat(priceInputs[item.id] || item.price)).toFixed(2),
      extras: [],
      tableId: tableId,
    };
    addItem(tableId, itemToAdd);
    setTableData((prevTableData) => [...prevTableData, item]);
  };
  const handleCloseButtonClick = () => {
    handleCloseHeart(); // Use handleCloseHeart here
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 h-full">
      <div className="rounded-lg md:w-[60%] w-[90%] h-[70%] h-[70%] flex flex-col justify-between bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 shadow-md">
        <div className="flex justify-between items-start px-4 py-2">
          <div></div>
          <button
            className="rounded-lg my-4 text-[30px] px-2 "
            onClick={handleCloseButtonClick}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <ul className="gap-2 grid grid-cols-2 px-2 overflow-y-auto max-h-[80%] py-20"> {/* Add these styles */}
          {heartItems.map((item) => (
            <div
              className={`w-full flex flex-col py-1 px-2 text-white rounded-xl ${
                item.id === clickedItemId ? 'bg-green-500' : 'bg-blue-500'
              }`}
              key={item.id}
            >
              <li>{item.text}</li>
              <input
                type="number"
                value={priceInputs[item.id] || ""}
                onChange={(e) => handlePriceInputChange(item.id, e.target.value)}
                style={{ color: 'black' }}
                placeholder="Price"
              />
              <button
                onClick={() => {
                  handleItemSelected(item);
                  setClickedItemId(item.id);
                  setTimeout(() => {
                    setClickedItemId(null);
                  }, 100);
                }}
              >
                hinzufügen
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );

};

export default Heart;

