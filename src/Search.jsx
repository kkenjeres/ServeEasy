import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { app, db } from "../src/firebase";
import {AiOutlineMinus, AiOutlinePlus, AiOutlineCloseCircle} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import Extra from "./Extra";
import ExtraMinus from './ExtraMinus';

const Search = ({ tableId }) => {
  const [items, setItems] = useState([
    { id: 1, text: "Martini Rosso/Bianco", price: 5.10},
  { id: 2, text: "Cynar Soda", price: 5.20, percent: 19},
  { id: 3, text: "Sherry", price: 4.20, percent: 19},
    { id:4, text: "Aperol Spritz", price: 6.90, percent: 19},
    { id:5, text: "Bitterino", price: 4.60, percent: 19},
    { id:6, text: "Campari Soda/Orange", price: 5.90, percent: 19},
    { id:7, text: "Prosecco", price: 5.60, percent: 19},
    { id:10, text: "Caprese Napoletana", price: 11.10, percent: 7},
    { id:11, text: "Insalata Di Rucola", price: 8.90, percent: 7},
    { id:12, text: "Antipasto Dello Verdure", price: 10.90, percent: 7},
    { id:13, text: "Carpaccio Di Manzo", price: 12.90, percent: 7},
    { id:14, text: "Insalata Di Mare", price: 12.90, percent: 7},
    { id:15, text: "Formaggi Misti", price: 13.90, percent: 7},
    { id:17, text: "Ruccola Gamberetti", price: 12.10, percent: 7},
    { id:18, text: "Antipasto Italiano", price: 13.90, percent: 7},
    { id:19, text: "Insalata Di Rucola Con Gamberetti", price: 12.10, percent: 7},
    { id:20, text: "Minestrone", price: 5.60, percent: 7},
    { id:22, text: "Crema Di Pomodoro", price: 5.60, percent: 7},
    { id:23, text: "Tortellini In Brodo", price: 5.60, percent: 7},
    { id: 31, text: "Spag. Al Pomodoro", price: 9.60, percent: 7 },
    { id: 32, text: "Spag. Bolognese", price: 10.80, percent: 7 },
    { id: 33, text: "Spag. Aglio & Oglio", price: 9.10, percent: 7 },
    { id: 34, text: "Spag. Alla Carbonara", price: 11.30, percent: 7 },
    { id: 35, text: "Spag. Frutti Di Mare", price: 14.90, percent: 7 },
    { id: 37, text: "Penne Al Gorgonzola e Spinaci", price: 11.20, percent: 7 },
    { id: 38, text: "Penne Brocolli", price: 0, percent: 7 },
    { id: 39, text: "Tortelini Alla Panna", price: 11.50, percent: 7 },
    { id: 40, text: "Penne Arabiata", price: 10.80, percent: 7 },
    { id: 41, text: "Bruschetta", price: 6.50, percent: 7 },
    { id: 44, text: "Caprese Pizza", price: 10.60, percent: 7 },
    { id: 43, text: "Penne Formaggi", price: 10.90, percent: 7 },
    { id: 49, text: "Pizzabrot", price: 4.50, percent: 7 },
    { id: 50, text: "Gnocchi Alla Sorentina", price: 10.80, percent: 7 },
    { id: 51, text: "Lasagne Al Forno", price: 10.40, percent: 7 },
    { id: 52, text: "Penne Al Forno", price: 10.90, percent: 7 },
    { id: 53, text: "Torellini Al Forno", price: 10.90, percent: 7 },
    { id: 54, text: "Gnocchi Al Forno", price: 10.90, percent: 7 },
    { id: 55, text: "Ravioli ripieni con Riccotta e Spinaci", price: 11.90, percent: 7 },
    { id: 56, text: "Fettuccine al Salmone", price: 12.60, percent: 7 },
    { id: 57, text: "Ravioli ripieni al Salmone", price: 11.90, percent: 7 },
    { id: 58, text: "Cappelletti Ripieni con Gorgonzola", price: 11.90, percent: 7 },
    { id: 59, text: "Ravioli Ripieni al Porcini", price: 11.90, percent: 7 },
    { id: 60, text: "Tris di Pasta Ripieno, al Burro e Salvia", price: 11.90, percent: 7 },
    { id: 62, text: "Tagliatelle al pesto", price: 12.40, percent: 7 },
    { id: 63, text: "Tonno mit Zwibel", price: 11.10, percent: 7 },
    { id: 72, text: "Insalata verde", price: 5.60, percent: 7 },
    { id: 73, text: "Insalata di pomodoro", price: 5.40, percent: 7 },
    { id: 74, text: "Insalata mista", price: 6.90, percent: 7 },
    { id: 76, text: "Insalata di pomodoro con tonno e cipolla", price: 6.90, percent: 7 },
    { id: 77, text: "Insalata mista con tonno", price: 8.20, percent: 7 },
    { id: 78, text: "Insalata della casa", price: 13.40, percent: 7 },
    { id: 79, text: "Piiza Hawaii", price: 10.90, percent: 7, category:'pizza' },
    { id: 80, text: "Pizza Margherita", price: 8.90, percent: 7, category:'pizza' },
    { id: 81, text: "Pizza della Casa", price: 13.50, percent: 7, category:'pizza' },
    { id: 82, text: "Pizza Prosciutto", price: 9.40, percent: 7, category:'pizza' },
    { id: 83, text: "Pizza Don Padrino", price: 13.50, percent: 7, category:'pizza' },
    { id: 84, text: "Pizza Bianca", price: 10.90, percent: 7, category:'pizza' },
    { id: 85, text: "Pizza Funghi", price: 9.40, percent: 7, category:'pizza' },
    { id: 86, text: "Pizza Salami", price: 9.40, percent: 7, category:'pizza' },
    { id: 87, text: "Pizza Sardele", price: 0, percent: 7, category:'pizza' },
    { id: 88, text: "Pizza Tonno", price: 10.60, percent: 7, category:'pizza' },
    { id: 89, text: "Pizza Pesto", price: 9.40, percent: 7, category:'pizza' },
    { id: 90, text: "Pizza Capricciosa", price: 10.70, percent: 7, category:'pizza' },
    { id: 91, text: "Pizza Gorgonzola e Spinace", price: 10.50, percent: 7, category:'pizza' },
    { id: 93, text: "Pizza Siciliana", price: 11.20, percent: 7, category:'pizza' },
    { id: 94, text: "Pizza Frutti di Mare", price: 13.90, percent: 7, category:'pizza' },
    { id: 96, text: "Pizza Quattro Stagioni", price: 10.90, percent: 7, category:'pizza' },
    { id: 97, text: "Pizza Vegetariana", price: 11.20, percent: 7, category:'pizza' },
    { id: 98, text: "Pizza Diavolo", price: 0, percent: 7, category:'pizza' },
    { id: 99, text: "Pizza Calzone", price: 11.30, percent: 7, category:'pizza' },
    { id: 100, text: "Coca 0.3", price: 3.30, percent: 19 },
    { id: 101, text: "Fanta 0.3", price: 3.30, percent: 19 },
    { id: 102, text: "Spezi 0.3", price: 3.30, percent: 19 },
    { id: 103, text: "Bitter Lemon 0.3", price: 3.80, percent: 19 },
    { id: 104, text: "Saft 0.3", price: 3.60, percent: 19 },
    { id: 105, text: "Saftschorle 0.3", price: 3.30, percent: 19, options: ["Orange", "Maracuja", "Apfel", "Johannes"] },
    { id: 106, text: "Suse Sprudel 0.3", price: 3.30, percent: 19 },
    { id: 108, text: "Vio 0.25", price: 3.10, percent: 19 },
    { id: 210, text: "Vio 0.75", price: 5.10, percent: 19 },
    { id: 109, text: "Teinacher 0.25", price: 3.10, percent: 19 },
    { id: 110, text: "Pellefrino 0.75", price: 5.20, percent: 19 },
    { id: 111, text: "Cola 0.4", price: 4.10, percent: 19 },
    { id: 112, text: "Fanta 0.4", price: 4.10, percent: 19 },
    { id: 113, text: "Spezi 0.4", price: 4.10, percent: 19 },
    { id: 114, text: "Bitter Lemon 0.4", price: 4.50, percent: 19 },
    { id: 115, text: "Bitter Lemon 0.4", price: 4.50, percent: 19 },
    { id: 116, text: "Saftschorle 0.4", price: 4.10, percent: 19, percent: 19, options: ["medium", "medium-", "medium+"]  },
    { id: 117, text: "Safte 0.4", price: 4.40, percent: 19 },
    { id: 118, text: "Suse Sprudel 0.4", price: 4.10, percent: 19 },
    { id: 119, text: "Cola Light 0.3", price: 3.80, percent: 19 },
    { id: 119, text: "Cola Light 0.3", price: 3.80, percent: 19 },
    { id: 120, text: "Cola Light 0.4", price: 4.50, percent: 19 },
    { id: 198, text: "Saftchorle 0.3", price: 3.30, percent: 19 },
    { id: 199, text: "Saftchorle 0.4", price: 4.10, percent: 19 },
    { id: 211, text: "Teinacher 0.5", price: 4.60, percent: 19 },
    { id: 121, text: "Pils 0.3", price: 3.50, percent: 19 },
    { id: 122, text: "Pils 0.4", price: 3.90, percent: 19 },
    { id: 123, text: "Radler 0.3", price: 3.30, percent: 19 },
    { id: 124, text: "Radler 0.4", price: 3.70, percent: 19 },
    { id: 125, text: "Weissbier 0.5", price: 4.30, percent: 19 },
    { id: 126, text: "Kristal 0.5", price: 4.30, percent: 19 },
    { id: 127, text: "Dunkel 0.5", price: 4.30, percent: 19 },
    { id: 128, text: "Alkoholfrei 0.5", price: 4.30, percent: 19 },
    { id: 129, text: "Diesel/Russ 0.5", price: 4.50, percent: 19 },
    // { id: 130, text: "Vino Bianco", price: 0, percent: 19 },
    // { id: 131, text: "Vino Frascati 0.2", price: 0, percent: 19 },
    // { id: 132, text: "Schorle 0.2", price: 5.30, percent: 19 },
    { id: 145, text: "Piccata Milanese", price: 23.90, percent: 7 },
    { id: 146, text: "Paillard - Steak", price: 23.50, percent: 7 },
    { id: 147, text: "Saltimbocca alla Romana", price: 24.90, percent: 7 },
    { id: 148, text: "Scaloppina al Vino Bianco/Limone", price: 24.50, percent: 7 },
    { id: 149, text: "Scaloppina al Limone", price: 24.50, percent: 7 },
    { id: 150, text: "Filetto di Manzo al Gorgonzola", price: 34.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"]  },
    { id: 151, text: "Filetto di Manzo Grill", price: 33.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"]  },
    { id: 152, text: "Filetto di Manzo al Pepe", price: 34.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"]  },
    { id: 153, text: "Calamari alla Grill", price: 22.00, percent: 7 },
    { id: 154, text: "Rana Pescatrice ", price: 28.50, percent: 7 },
    { id: 155, text: "Rana Pescatrice ", price: 28.50, percent: 7 },
    { id: 158, text: "Gamberoni alla Griglia ", price: 26.50, percent: 7 },
    { id: 159, text: "Raa Pescatrice al Pepe ", price: 28.50, percent: 7 },
    { id: 160, text: "Amaretto 0.2", price: 4.20, percent: 19 },
    { id: 161, text: "Sambuca 0.2", price: 4.20, percent: 19 },
    { id: 162, text: "Cynar Spirituosen 0.2", price: 4.20, percent: 19 },
    { id: 163, text: "Fernet Branca 0.2", price: 4.20, percent: 19 },
    { id: 164, text: "Ramazzotti 0.2", price: 4.20, percent: 19 },
    { id: 165, text: "Averna 0.2", price: 4.20, percent: 19 },
    { id: 166, text: "Vecchia Romagnia 0.2", price: 4.20, percent: 19 },
    { id: 167, text: "Amaro Montenegro 0.2", price: 4.20, percent: 19 },
    { id: 168, text: "Limoncello 0.2", price: 4.20, percent: 19 },
    { id: 169, text: "Grappa 0.2", price: 6.50, percent: 19 },
    { id: 175, text: "Salmone alla Griglia", price: 24.50, percent: 7 },
    { id: 180, text: "Tartufo", price: 5.90, percent: 7 },
    { id: 181, text: "Casata", price: 5.90, percent: 7 },
    { id: 182, text: "Tiramisu", price: 5.90, percent: 7 },
    { id: 183, text: "Crem Caramel", price: 5.90, percent: 7 },
    { id: 184, text: "Panna Cotta", price: 5.90, percent: 7 },
    { id: 190, text: "Espresso", price: 2.30, percent: 19 },
    { id: 191, text: "Kaffee", price: 3.00, percent: 19 },
    { id: 192, text: "Espresso Corretto", price: 3.30, percent: 19 },
    { id: 193, text: "Capuccino", price: 3.30, percent: 19 },
    { id: 194, text: "Tee mit Zitrone und Honig", price: 3.60, percent: 19 },
    { id: 195, text: "Tee mit Rum", price: 3.30, percent: 19 },
    { id: 196, text: "Doppio Espresso", price: 3.50, percent: 19 },
    { id: 197, text: "Latte Macchiato", price: 3.50, percent: 19 },
    { id: 202, text: "Williams 0.2", price: 4.50, percent: 19 },
    { id: 209, text: "Vino 0.1", price: 3.80, percent: 19 },
    { id: 501, text: "M1", price: 9.00, percent: 7 },
    { id: 502, text: "M2", price: 9.50, percent: 7 },
    { id: 144, text: "Montepulciano 0.2", price: 6.30, percent: 19 },
    { id: 138, text: "Chianti 0.2", price: 6.30, percent: 19 },
    { id: 999, text: "Nero D'avola 0.2", price: 6.30, percent: 19 },
    { id: 998, text: "Primitivo 0.2", price: 6.30, percent: 19 },
    { id: 140, text: "Lambrusco 0.2", price: 6.30, percent: 19 },
    { id: 132, text: "Frascati 0.2", price: 6.30, percent: 19 },
    { id: 136, text: "Pinot Grigio 0.2", price: 6.30, percent: 19 },
    { id: 137, text: "Vardiccho 0.2", price: 6.30, percent: 19 },
    { id: 131, text: "Frizzantino 0.2", price: 6.30, percent: 19 },
    { id: 134, text: "Rosatello 0.2", price: 6.30, percent: 19 },
    { id: 133, text: "Schorle 0.2", price: 5.30, percent: 19 },
    { id: 997, text: "Leverano Weis/Rot/Rosse 0.2", price: 7.90, percent: 19 },
    { id: 996, text: "Leverano Weis/Rot/Rosse 0.75", price: 26.50, percent: 19 },
    { id: 995, text: "Aglianic Caudium 0.75", price: 38.50, percent: 19 },
    { id: 994, text: "Aglianic Caudium 0.2", price: 13.50, percent: 19 },
    { id: 993, text: "Malvasia 0.75", price: 28.50, percent: 19 },
    { id: 992, text: "Malvasia 0.2", price: 9.80, percent: 19 },
    { id: 991, text: "Frati Weis/Rot/Rosse 0.75", price: 36.50, percent: 19 },
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
  // Добавьте условие для скидки
  const discountedPrice = tableId === "50" ? item.price * 0.9 : item.price;

  const itemToAdd = {
    ...item,
    price: discountedPrice, // Используйте скидочную цену
    quantity: 1,
    totalPrice: discountedPrice.toFixed(2),
    extras: [],
    tableId: tableId,
  };
  setAddedItems([itemToAdd, ...addedItems]);
  addItem(tableId, itemToAdd);
  setSearchTerm("");
  setSelectedItem(null);
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
    const [selectedItemIdMinus, setSelectedItemIdMinus] = useState(null);
    const handleExtraMinusButtonClick = (itemId) => {
      if (selectedItemIdMinus === itemId) {
        setSelectedItemIdMinus(null);
      } else {
        setSelectedItemIdMinus(itemId);
      }
    };
  const handleExtraButtonClick = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };
  const handleExtraItemSelected = (itemId, extra) => {
    const isExtraMinus = selectedItemIdMinus === itemId;
    const newExtra = { ...extra, isExtraMinus };
    const updatedItems = addedItems.map((item) => {
      if (item.id === itemId) {
        const updatedExtras = item.extras
          ? [{ ...newExtra, quantity: 1 }, ...item.extras] // Используйте newExtra здесь и добавьте в начало массива
          : [{ ...newExtra, quantity: 1 }]; // Используйте newExtra здесь
  
        const updatedItem = { ...item, extras: updatedExtras };
        updateItem(tableId, itemId, updatedItem);
        return updatedItem;
      } else {
        return item;
      }
    });
    setAddedItems(updatedItems);
  };
  
  const calculateTotalPriceWithExtras = (item) => {
    const extrasTotalPrice = item.extras.reduce(
      (total, extra) => total + extra.price * extra.quantity,
      0
    );
    return (item.price * item.quantity + extrasTotalPrice).toFixed(2);
  };
  const handleOptionClick = (item, option) => {
    // Здесь вы можете обработать выбранный вариант и добавить его к элементу
    // Например, вы можете добавить выбранный вариант к тексту элемента:
    const newItem = { ...item, text: item.text + ' ' + option };
    handleAddButtonClick(newItem);
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
        <ul className="rounded-lg">
          {filteredItems.map((item) => (
            <div
              className={`w-full p-2 shadow-xl rounded-xl ${
                item.options ? "flex flex-col" : "flex justify-between"
              }`}
              onClick={() => handleAddButtonClick(item)}
            >
              <li key={item.id}>{item.text}{" "}</li>
              {item.options ? item.options.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(item, option);
                  }}
                >
                  {option}
                </button>
              )) : "+"}
            </div>
          ))}
        </ul>
      </div>
      
      )}
  
  <div className="bg-white rounded-lg mt-10">
        <ul>
          {addedItems.slice().reverse().map((item) => (
            <div
              key={item.id}
              className="flex-col w-full justify-between border-b border-gray-300 mt-2 "
            >
              <div className="p-2 font-medium">
              {item.extras && (
                <ul className="mt-2">
                  
                </ul>
              )}
                <ul className="flex justify-between text-left">
                  <li className="text-[16px]" key={item.id}>
                    {item.text}
                  </li>
                  <li className="text-[16px] " key={item.id}>
                  {calculateTotalPriceWithExtras(item) + "€"}

                  </li>
                </ul>
                {item.extras.map((extra) => (
                  <li
                    key={extra.id}
                    className="text-sm text-gray-600 flex justify-between"
                  >
                    {extra.isExtraMinus ? '-' : '+'} {extra.text}
                  </li>
                ))}

                  
                <div className="flex justify-between mt-5 items-center">
                  <div className="flex flex-col">
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
                    <div className='flex flex-col gap-4'>
                      <button onClick={() => handleExtraButtonClick(item.id)}>Extra+</button>
                      <button onClick={() => handleExtraMinusButtonClick(item.id)}>Extra-</button>
                    </div>
                  )}
                  <button onClick={() => handleDeleteButtonClick(item.id)}>
                    Löschen
                  </button>
                </div>
                {selectedItemId === item.id && (
                    <Extra itemId={item.id} onExtraItemSelected={handleExtraItemSelected} setSelectedItemId={setSelectedItemId} />
                  )}
                {selectedItemIdMinus === item.id && (
                  <ExtraMinus itemId={item.id} onExtraItemSelected={handleExtraItemSelected} setSelectedItemIdMinus={setSelectedItemIdMinus} />
                )}         
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}   

export default Search;
