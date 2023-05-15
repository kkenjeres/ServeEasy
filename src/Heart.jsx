import React, { useState, useEffect } from 'react';
import { AiOutlineCloseCircle, AiOutlinePlus } from 'react-icons/ai'; // Import AiOutlinePlus
import { doc, setDoc, updateDoc, collection } from "firebase/firestore"; // Import necessary Firestore methods
import { db } from "./firebase"; // Import your Firestore instance

const Heart = ({ setSelectedItemId, setTableData, tableId, handleCloseHeart }) => { // Add handleCloseHeart here
  const heartItems = [
    { id: 1, text: "Verpackung", price: 0.50 },
    { id: 2, text: "Teller", price: 1.00 },
    { id: 3, text: "Pizza", price: 0.0, boss:true  },
    { id: 4, text: "Nudeln", price: 0.0 , boss:true },
    { id: 5, text: "Fleish", price: 0.0, boss:true  },
    { id: 6, text: "Fish", price: 0.0, boss:true },
    { id: 7, text: "Getranke", price: 0.0 },
    { id: 8, text: "Desert", price: 0.0, boss:true  },
    { id: 9, text: "M1", price: 0.0, boss:true  },
    { id: 10, text: "M2", price: 0.0, boss:true  },
    { id: 11, text: "M3", price: 0.0, boss:true  },
    { id: 12, text: "Küche", price: 0.0, boss:true  },
    { id: 13, text: "Antipasti", price: 0.0, boss:true  },
    { id: 14, text: "Wein Fl.", price: 0.0 },
    { id: 15, text: "Wein 0.2", price: 0.0 },
    { id: 16, text: "Wein 0.1", price: 0.0 },

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
  
      if (itemToAdd.boss) {
        const brankoDocRef = doc(
          collection(db, "tables"),
          "0",
          "items",
          itemToAdd.id.toString()
        );
        const brankoItemData = { ...itemToAdd, extras: [], originTableId: tableId };
        await setDoc(brankoDocRef, brankoItemData);
      }
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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 ">
      <div className="rounded-lg w-full md:w-[60%] h-[80%] md:h-[70%] flex flex-col justify-between bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 shadow-md overflow-y-auto p-2 md:p-4">
        <div className="flex justify-between items-start">
          <button
            className="rounded-lg text-[30px] md:text-[40px] p-2"
            onClick={handleCloseButtonClick}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10">
          {heartItems.map((item) => (
            <div
              className={`w-full flex flex-col items-center py-2 px-4 text-white rounded-xl ${
                item.id === clickedItemId ? 'bg-green-500' : 'bg-blue-500'
              }`}
              key={item.id}
            >
              <li className="text-lg md:text-xl">{item.text}</li>
              {item.text !== "Verpackung" && item.text !== "Teller" && (
  <input
    type="number"
    value={priceInputs[item.id] || ""}
    onChange={(e) => handlePriceInputChange(item.id, e.target.value)}
    className="w-full mt-2 mb-4 text-center text-black text-lg md:text-xl"
    placeholder="Price"
  />
)}

              <button
                className="flex items-center justify-center text-2xl md:text-3xl"
                onClick={() => {
                  handleItemSelected(item);
                  setClickedItemId(item.id);
                  setTimeout(() => {
                    setClickedItemId(null);
                  }, 100);
                  handleCloseHeart();
                }}
              >
                <AiOutlinePlus />
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Heart;