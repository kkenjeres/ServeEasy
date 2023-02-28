import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyACtbBgoL3zMSan0hLsenIUBJJRdKEuy74",

  authDomain: "rest-9be9d.firebaseapp.com",

  projectId: "rest-9be9d",

  storageBucket: "rest-9be9d.appspot.com",

  messagingSenderId: "1071388118345",

  appId: "1:1071388118345:web:52373773bf237cb6e91e98"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Search = ({ tableId }) => {
  const [items, setItems] = useState([
    { id: 1, text: "Martini Rosso/Bianco", price: 5.1, percent: 19 },
    { id: 2, text: "Cynar Soda", price: 5.2, percent: 19 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [addedItems, setAddedItems] = useState([]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const foundItem = items.find((item) => item.id.toString() === value);
    setSelectedItem(foundItem);
  };

  const handleAddButtonClick = () => {
    if (selectedItem) {
      setAddedItems([...addedItems, selectedItem]);
      addItem(tableId, selectedItem);
    }
  };

  const addItem = async (tableId, itemToAdd) => {
    try {
      const docRef = doc(collection(db, "tables"), tableId, "items", itemToAdd.id.toString());
      await setDoc(docRef, itemToAdd);
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

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} />
      <button onClick={handleAddButtonClick}>Add</button>
      <div>
        {addedItems.map((item) => (
          <div key={item.id}>
            {item.text} - {item.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;