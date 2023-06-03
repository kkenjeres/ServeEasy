import React, { useState, useEffect } from "react";
import { collection, doc, setDoc,getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { app, db } from "../src/firebase";
import {AiOutlineMinus, AiOutlinePlus, AiOutlineCloseCircle} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import Extra from "./Extra";
import ExtraMinus from './ExtraMinus';

function Search({ tableId, setTableData, setSelectedItemId, selectedItemId }) {
  const [items, setItems] = useState([
    { id: 1, text: "Martini Rosso/Bianco", price: 5.10, percent: 19},
    { id: 2, text: "Cynar Soda", price: 5.20, percent: 19},
    { id: 3, text: "Sherry", price: 4.20, percent: 19},
      { id:4, text: "Prosecco Aperol", price: 5.90, percent: 19},
      { id:5, text: "Bitterino", price: 4.60, percent: 19},
      { id:6, text: "Campari Soda", price: 5.90, percent: 19},
      { id:7, text: "Campari Orange", price: 5.90, percent: 19},
      { id:8, text: "Prosecco", price: 5.60, percent: 19},
      { id:9, text: "Aperol Spritzz", price: 6.90, percent: 19},
      { id:10, text: "Caprese Napoletana", price: 11.10, percent: 7, category:'pizza', boss:true },
      { id:11, text: "Insalata Di Rucola", price: 8.90, percent: 7, category:'pizza', boss:true },
      { id:12, text: "Antipasto Dello Verdure", price: 10.90, percent: 7, category:'pizza', boss:true },
      { id:13, text: "Carpaccio Di Manzo", price: 12.90, percent: 7, category:'pizza', boss:true },
      { id:14, text: "Insalata Di Mare", price: 12.90, percent: 7, category:'pizza', boss:true },
      { id:15, text: "Formaggi Misti", price: 13.90, percent: 7, category:'pizza', boss:true },
      { id:17, text: "Rucola Gamberetti", price: 12.10, percent: 7, category:'pizza', boss:true },
      { id:18, text: "Antipasto Italiano", price: 13.90, percent: 7, category:'pizza', boss:true },
      { id:19, text: "Insalata Di Rucola Con Gamberetti", price: 12.10, percent: 7, category:'pizza', boss:true },
      { id:20, text: "Minestrone", price: 5.60, percent: 7, category:'pizza', boss:true },
      { id:22, text: "Crema Di Pomodoro", price: 5.60, percent: 7, category:'pizza', boss:true },
      { id:23, text: "Tortellini In Brodo", price: 5.60, percent: 7, category:'pizza', boss:true },
      { id: 31, text: "Spag. Al Pomodoro", price: 9.60, percent: 7, category:'pizza', boss:true  },
      { id: 32, text: "Spag. Bolognese", price: 10.80, percent: 7, category:'pizza', boss:true  },
      { id: 33, text: "Spag. Aglio & Oglio", price: 9.10, percent: 7, category:'pizza', boss:true  },
      { id: 34, text: "Spag. Alla Carbonara", price: 11.30, percent: 7, category:'pizza', boss:true  },
      { id: 35, text: "Spag. Frutti Di Mare", price: 14.90, percent: 7, category:'pizza', boss:true  },
      { id: 37, text: "Penne Al Gorgonzola e Spinaci", price: 11.20, percent: 7, category:'pizza', boss:true  },
      { id: 38, text: "Penne Brocolli", price: 12.5, percent: 7, category:'pizza', boss:true  },
      { id: 39, text: "Tortelini Alla Panna", price: 11.50, percent: 7, category:'pizza' , boss:true },
      { id: 40, text: "Penne Arabiata", price: 10.80, percent: 7, category:'pizza', boss:true  },
      { id: 41, text: "Bruschetta", price: 6.50, percent: 7, category:'pizza' , boss:true },
      { id: 44, text: "Caprese Pizza", price: 10.60, percent: 7, category:'pizza', boss:true, pizza:true },
      { id: 43, text: "Penne Formaggi", price: 10.90, percent: 7, category:'pizza', boss:true  },
      { id: 49, text: "Pizzabrot", price: 4.50, percent: 7, category:'pizza', boss:true, pizza:true   },
      { id: 50, text: "Gnocchi Alla Sorentina", price: 10.80, percent: 7, category:'pizza', boss:true  },
      { id: 51, text: "Lasagne Al Forno", price: 10.40, percent: 7, category:'pizza', boss:true  },
      { id: 52, text: "Penne Al Forno", price: 10.90, percent: 7, category:'pizza', boss:true  },
      { id: 53, text: "Tortelini Al Forno", price: 10.90, percent: 7, category:'pizza', boss:true  },
      { id: 54, text: "Gnocchi Al Forno", price: 10.90, percent: 7, category:'pizza', boss:true  },
      { id: 55, text: "Ravioli ripieni con Riccotta e Spinaci", price: 11.90, percent: 7, category:'pizza', boss:true  },
      { id: 56, text: "Fettuccine al Salmone", price: 12.60, percent: 7, category:'pizza', boss:true  },
      { id: 57, text: "Ravioli ripieni al Salmone", price: 11.90, percent: 7, category:'pizza', boss:true  },
      { id: 58, text: "Cappelletti Ripieni con Gorgonzola", price: 11.90, percent: 7, category:'pizza' , boss:true },
      { id: 59, text: "Ravioli Ripieni al Porcini", price: 11.90, percent: 7, category:'pizza' , boss:true },
      { id: 60, text: "Tris di Pasta", price: 11.90, percent: 7, category:'pizza', boss:true },
      { id: 62, text: "Tagliatelle al pesto", price: 12.40, percent: 7, category:'pizza', boss:true  },
      { id: 63, text: "Tonno mit Zwiebel", price: 11.10, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 72, text: "Insalata verde", price: 5.60, percent: 7, category:'pizza', boss:true  },
      { id: 73, text: "Insalata di pomodoro", price: 5.40, percent: 7, category:'pizza' , boss:true },
      { id: 74, text: "Insalata mista", price: 6.90, percent: 7, category:'pizza' , boss:true },
      { id: 76, text: "Insalata di pomodoro con tonno e cipolla", price: 6.90, percent: 7, category:'pizza' , boss:true },
      { id: 77, text: "Insalata mista con tonno", price: 8.20, percent: 7, category:'pizza' , boss:true },
      { id: 78, text: "Insalata della casa", price: 13.40, percent: 7, category:'pizza' , boss:true },
      { id: 79, text: "Piiza Hawai", price: 10.90, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 80, text: "Pizza Margherita", price: 8.90, percent: 7, category:'pizza' , boss:true , pizza:true},
      { id: 81, text: "Pizza della Casa", price: 13.50, percent: 7, category:'pizza', boss:true , pizza:true },
      { id: 82, text: "Pizza Prosciutto", price: 9.40, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 83, text: "Pizza Don Padrino", price: 13.50, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 84, text: "Pizza Bianca", price: 10.90, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 85, text: "Pizza Funghi", price: 9.40, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 86, text: "Pizza Salami", price: 9.40, percent: 7, category:'pizza', boss:true , pizza:true },
      { id: 87, text: "Pizza Sardele", price: 9.4, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 88, text: "Pizza Tonno", price: 10.60, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 89, text: "Pizza Pesto", price: 9.40, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 90, text: "Pizza Capricciosa", price: 10.70, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 91, text: "Pizza Gorgonzola e Spinaci", price: 10.50, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 93, text: "Pizza Siciliana", price: 11.20, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 94, text: "Pizza Frutti di Mare", price: 13.90, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 96, text: "Pizza Quattro Stagioni", price: 10.90, percent: 7, category:'pizza', boss:true , pizza:true },
      { id: 97, text: "Pizza Vegetariana", price: 11.20, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 98, text: "Pizza Diavolo", price: 10.80, percent: 7, category:'pizza', boss:true, pizza:true  },
      { id: 99, text: "Pizza Calzone", price: 11.30, percent: 7, category:'pizza', boss:true, pizza:true},
      { id: 100, text: "Coca 0.3", price: 3.30, percent: 19 },
      { id: 101, text: "Fanta 0.3", price: 3.30, percent: 19 },
      { id: 102, text: "Spezi 0.3", price: 3.30, percent: 19 },
      { id: 103, text: "Bitter Lemon 0.3", price: 3.80, percent: 19 },
      { id: 104, text: "Saft 0.3", price: 3.60, percent: 19 },
      { id: 105, text: "Saftschorle 0.3", price: 3.30, percent: 19, options: ["Orange", "Maracuja", "Apfel", "Johannes"] },
      { id: 106, text: "Süße Sprudel 0.3", price: 3.30, percent: 19 },
      { id: 108, text: "Vio 0.25", price: 3.10, percent: 19 },
      { id: 210, text: "Vio 0.75", price: 5.10, percent: 19 },
      { id: 109, text: "Teinacher 0.25", price: 3.10, percent: 19 },
      { id: 110, text: "Pellegrino 0.75", price: 5.20, percent: 19 },
      { id: 111, text: "Cola 0.4", price: 4.10, percent: 19 },
      { id: 112, text: "Fanta 0.4", price: 4.10, percent: 19 },
      { id: 113, text: "Spezi 0.4", price: 4.10, percent: 19 },
      { id: 114, text: "Bitter Lemon 0.4", price: 4.50, percent: 19 },
      { id: 115, text: "Bitter Lemon 0.4", price: 4.50, percent: 19 },
      { id: 116, text: "Apfelsaftschorle 0.4", price: 4.10, percent: 19 },
      { id: 117, text: "Säfte 0.4", price: 4.40, percent: 19 },
      { id: 118, text: "Süße Sprudel 0.4", price: 4.10, percent: 19 },
      { id: 119, text: "Cola Light 0.3", price: 3.80, percent: 19 },
      { id: 119, text: "Cola Light 0.3", price: 3.80, percent: 19 },
      { id: 120, text: "Cola Light 0.4", price: 4.50, percent: 19 },
      { id: 198, text: "Saftschorle 0.3", price: 3.30, percent: 19, options: ["Orange", "Maracuja", "Apfel", "Johannes"]},
      { id: 199, text: "Saftschorle 0.4", price: 4.10, percent: 19 , options: ["Orange", "Maracuja", "Apfel", "Johannes"]},
      { id: 211, text: "Teinacher 0.5", price: 4.60, percent: 19 },
      { id: 121, text: "Pils 0.3", price: 3.50, percent: 19 },
      { id: 122, text: "Pils 0.4", price: 3.90, percent: 19 },
      { id: 123, text: "Radler 0.3", price: 3.30, percent: 19 },
      { id: 124, text: "Radler 0.4", price: 3.70, percent: 19 },
      { id: 125, text: "Weissbier 0.5", price: 4.30, percent: 19 },
      { id: 126, text: "Kristall 0.5", price: 4.30, percent: 19 },
      { id: 127, text: "Dunkel 0.5", price: 4.30, percent: 19 },
      { id: 128, text: "Alkoholfrei 0.5", price: 4.30, percent: 19 },
      { id: 129, text: "Diesel/Russ 0.5", price: 4.50, percent: 19 },
      { id: 130, text: "Vino Bianco 0.2", price: 6.30, percent: 19 },
      { id: 135, text: "Vino Bianco 0.2", price: 6.30, percent: 19 },
      { id: 142, text: "Vino Rosso 0.2", price: 6.30, percent: 19 },
      { id: 145, text: "Piccata Milanese", price: 23.90, percent: 7, category:'pizza', boss:true },
      { id: 146, text: "Paillard - Steak", price: 23.50, percent: 7, category:'pizza', boss:true },
      { id: 147, text: "Saltimbocca alla Romana", price: 24.90, percent: 7, category:'pizza', boss:true  },
      { id: 148, text: "Scaloppina al Vino Bianco/Limone", price: 24.50, percent: 7, category:'pizza', boss:true  },
      { id: 149, text: "Scaloppina al Limone", price: 24.50, percent: 7, category:'pizza', boss:true  },
      { id: 150, text: "Filetto di Manzo al Gorgonzola", price: 34.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"], category:'pizza', boss:true  },
      { id: 151, text: "Filetto di Manzo Grill", price: 33.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"], category:'pizza', boss:true   },
      { id: 152, text: "Filetto di Manzo al Pepe", price: 34.00, percent: 7, percent: 19, options: ["medium", "medium-", "medium+"], category:'pizza', boss:true   },
      { id: 153, text: "Calamari alla Grill", price: 22.00, percent: 7, category:'pizza', boss:true  },
      { id: 154, text: "Rana Pescatrice ", price: 28.50, percent: 7, category:'pizza', boss:true  },
      { id: 155, text: "Rana Pescatrice ", price: 28.50, percent: 7, category:'pizza', boss:true  },
      { id: 158, text: "Gamberoni alla Griglia ", price: 26.50, percent: 7, category:'pizza', boss:true  },
      { id: 159, text: "Rana Pescatrice al Pepe ", price: 28.50, percent: 7, category:'pizza', boss:true  },
      { id: 160, text: "Amaretto 0.2", price: 4.20, percent: 19, category:'pizza'  },
      { id: 161, text: "Sambuca 0.2", price: 4.20, percent: 19 },
      { id: 162, text: "Cynar Spirituosen 0.2", price: 4.20, percent: 19 },
      { id: 163, text: "Fernet Branca 0.2", price: 4.20, percent: 19 },
      { id: 164, text: "Ramazzotti 0.2", price: 4.20, percent: 19 },
      { id: 165, text: "Averna 0.2", price: 4.20, percent: 19 },
      { id: 166, text: "Vecchia Romagnia 0.2", price: 4.20, percent: 19 },
      { id: 167, text: "Amaro Montenegro 0.2", price: 4.20, percent: 19 },
      { id: 168, text: "Limoncello 0.2", price: 4.20, percent: 19 },
      { id: 169, text: "Grappa 0.2", price: 6.50, percent: 19 },
      { id: 175, text: "Salmone alla Griglia", price: 24.50, percent: 7, category:'pizza', boss:true  },
      { id: 180, text: "Tartufo", price: 5.90, percent: 7, boss:true  },
      { id: 181, text: "Cassata", price: 5.90, percent: 7, boss:true  },
      { id: 182, text: "Tiramisu", price: 5.90, percent: 7 , boss:true },
      { id: 183, text: "Crem Caramel", price: 5.90, percent: 7, boss:true  },
      { id: 184, text: "Panna Cotta", price: 5.90, percent: 7, boss:true  },
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
      { id: 501, text: "M1", price: 9.00, percent: 7, category:'pizza', boss:true  },
      { id: 502, text: "M2", price: 9.50, percent: 7, category:'pizza', boss:true },
      { id: 144, text: "Montepulciano 0.2", price: 6.30, percent: 19 },
      { id: 138, text: "Chianti 0.2", price: 6.30, percent: 19 },
      { id: 999, text: "Nero D'avola 0.2", price: 6.30, percent: 19 },
      { id: 998, text: "Primitivo 0.2", price: 6.30, percent: 19 },
      { id: 140, text: "Lambrusco 0.2", price: 6.30, percent: 19 },
      { id: 132, text: "Frascati 0.2", price: 6.30, percent: 19 },
      { id: 136, text: "Pinot Grigio 0.2", price: 6.30, percent: 19 },
      { id: 137, text: "Verdiccho 0.2", price: 6.30, percent: 19 },
      { id: 131, text: "Frizzantino 0.2", price: 6.30, percent: 19 },
      { id: 134, text: "Rosatello 0.2", price: 6.30, percent: 19 },
      { id: 133, text: "Schorle 0.2", price: 5.30, percent: 19 },
      { id: 997, text: "Leverano Weis/Rot/Rosse 0.2", price: 7.90, percent: 19 },
      { id: 996, text: "Leverano Weis/Rot/Rosse 0.75", price: 26.50, percent: 19 },
      { id: 995, text: "Aglianic Caudium 0.75", price: 38.50, percent: 19 },
      { id: 994, text: "Aglianic Caudium 0.2", price: 13.50, percent: 19 },
      { id: 993, text: "Malvasia 0.75", price: 28.50, percent: 19 },
      { id: 992, text: "Malvasia 0.2", price: 9.80, percent: 19 },
      { id: 991, text: "Ca de Frati Weis/Rot/Rosse 0.75", price: 36.50, percent: 19 },
    
  ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [addedItems, setAddedItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [beilageCount, setBeilageCount] = useState(0);
    const [groupedItems, setGroupedItems] = useState([]);
    const [readyItems, setReadyItems] = useState({});

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



  useEffect(() => {
    if (tableId === "0" || tableId === "1000" ) {
      const grouped = addedItems.reduce((acc, item) => {
        if (!acc[item.tableId]) {
          acc[item.tableId] = [item];
        } else {
          acc[item.tableId].push(item);
        }
        return acc;
      }, {});

      setGroupedItems(grouped);
    } else {
      setGroupedItems({ [tableId]: addedItems });
    }
  }, [addedItems, tableId]);
  

  const addItem = async (tableId, itemToAdd) => {
    try {
      const docRef = doc(
        collection(db, "tables"),
          tableId,
          "items",
          itemToAdd.id.toString()
      );
  
      const itemData = { 
        ...itemToAdd, 
        extras: [], 
        isReady: false,
        background: 'transparent', // always set to transparent when adding to original table
      };
  
      await setDoc(docRef, itemData);
  
      if (itemToAdd.boss) {
        // Старый код для дублирования в стол 0
        const brankoDocRef = doc(
          collection(db, "tables"),
          "0",
          "items",
          itemToAdd.id.toString()
        );
  
        const brankoItemData = { 
          ...itemToAdd, 
          extras: [], 
          isReady: false, 
          originTableId: tableId,
          styles: {color: 'red'}, 
          background: 'red' // always set to red when adding to table 0
        };
  
        await setDoc(brankoDocRef, brankoItemData);
      }
  
      if (itemToAdd.pizza) {
        // Новый код для дублирования в стол 100
        const pizzaDocRef = doc(
          collection(db, "tables"),
          "1000",
          "items",
          itemToAdd.id.toString()
        );
      
        const pizzaItemData = { 
          ...itemToAdd, 
          extras: [], 
          isReady: false, 
          originTableId: tableId,  // Здесь мы добавляем поле originTableId
          styles: {color: 'red'}, 
          background: 'red' // always set to red when adding to table 100
        };
      
        await setDoc(pizzaDocRef, pizzaItemData);
      }
      
      
        
    } catch (error) {
      console.error("Error adding item to Firestore: ", error);
    }
  };
  
  
  

    

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tables", tableId, "items"),
      (snapshot) => {
        const addedItemsData = snapshot.docs.map((doc) => doc.data());
        setAddedItems(addedItemsData.sort((a, b) => b.createdAt - a.createdAt));
        addedItemsData.forEach((item) => {
          setReadyItems((prev) => ({
            ...prev,
            [item.id]: item.isReady,
          }));
        });
      }
    );
    return () => unsubscribe();
  }, [tableId]);
  
  

  const updateItem = async (tableId, itemId, dataToUpdate) => {
    try {
      const docRef = doc(collection(db, "tables", tableId, "items"), itemId.toString());
      await updateDoc(docRef, dataToUpdate);
  
      const itemToUpdate = addedItems.find(item => item.id === itemId);
      if (itemToUpdate && itemToUpdate.boss) {
        // Обновляем элемент в столе 0
        const brankoDocRef = doc(collection(db, "tables"), "0", "items", itemId.toString());
        await updateDoc(brankoDocRef, dataToUpdate);
  
        // Если элемент был обновлён в столе 0, обновляем его и в оригинальном столе
        if (tableId === "0" && itemToUpdate.originTableId) {
          const originTableDocRef = doc(collection(db, "tables"), itemToUpdate.originTableId, "items", itemId.toString());
          await updateDoc(originTableDocRef, dataToUpdate);
        }
      }
  
      if (itemToUpdate && itemToUpdate.pizza) {
        // Обновляем элемент в столе 100
        const pizzaDocRef = doc(collection(db, "tables"), "1000", "items", itemId.toString());
        await updateDoc(pizzaDocRef, dataToUpdate);
  
      // Если элемент был обновлён в столе 100, обновляем его и в оригинальном столе
      if (tableId === "1000" && itemToUpdate.originTableId) {
        const originTableDocRef = doc(collection(db, "tables"), itemToUpdate.originTableId, "items", itemId.toString());
        await updateDoc(originTableDocRef, dataToUpdate);
      }
    }
  } catch (error) {
    console.error("Error updating item in Firestore: ", error);
  }
};


    
  const handlePlusButtonClick = async (id) => {
    const updatedItems = addedItems.map((item) => {
      if (item.id === id) {
        const updatedQuantity = item.quantity + 1;
        const totalPrice = (item.price * updatedQuantity).toFixed(2);
        const updatedItem = { ...item, quantity: updatedQuantity, totalPrice};
        updateItem(tableId, id, updatedItem);
  
        if (item.boss) {
          const updatedItemForTable0 = { ...updatedItem, background: 'red' };
          updateItem("0", id, updatedItemForTable0);
        }
  
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
          const updatedItem = { ...item, quantity: updatedQuantity, totalPrice};
          updateItem(tableId, id, updatedItem);
  
          if (item.boss) {
            const updatedItemForTable0 = { ...updatedItem, background: 'red' };
            updateItem("0", id, updatedItemForTable0);
          }
  
          return updatedItem;
        }
      } else {
        return item;
      }
    });
    setAddedItems(updatedItems.filter((item) => item !== null));
  };
  
  
  
  const handleDeleteButtonClick = async (id) => {
    try {
      const docRef = doc(collection(db, "tables", tableId, "items"), id.toString());
      await deleteDoc(docRef);
      setAddedItems(addedItems.filter((item) => item.id !== id));
  
      const itemToDelete = addedItems.find(item => item.id === id);
  
      if (itemToDelete && itemToDelete.boss) { 
        const brankoDocRef = doc(collection(db, "tables"), "0", "items", id.toString());
        await deleteDoc(brankoDocRef);
      }
  
      if (itemToDelete && itemToDelete.pizza) { 
        const pizzaDocRef = doc(collection(db, "tables"), "1000", "items", id.toString());
        await deleteDoc(pizzaDocRef);
      }
  
    } catch (error) {
      console.error("Error deleting item from Firestore: ", error);
    }
  };
  
  
  const deleteItem = async (tableId, itemId) => {
    try {
      const itemToDelete = addedItems.find(item => item.id === itemId);
      if (itemToDelete) {
        if (tableId === "0" || tableId === "1000") {
          // Обновляем элемент вместо полного удаления
          await updateItem(tableId, itemId, { deletedFromTable0: true, deletedFromTable100: true });
        } else {
          const docRef = doc(collection(db, "tables", tableId, "items"), itemId.toString());
          await deleteDoc(docRef);
  
          if (itemToDelete.boss) {
            const brankoDocRef = doc(collection(db, "tables"), "0", "items", itemId.toString());
            await deleteDoc(brankoDocRef);
          }
  
          if (itemToDelete.pizza) {
            const pizzaDocRef = doc(collection(db, "tables"), "1000", "items", itemId.toString());
            await deleteDoc(pizzaDocRef);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting item from Firestore: ", error);
    }
  };
  
    
    
    const [showExtra, setShowExtra] = useState(false); // Добавьте состояние для отображения компонента Extra
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
    const [selectedExtras, setSelectedExtras] = useState([]);
    
    const handleExtraItemSelected = (itemId, extra) => {
      const isExtraMinus = selectedItemIdMinus === itemId;
      const newExtra = { ...extra, isExtraMinus };
      const updatedItems = addedItems.map((item) => {
        if (item.id === itemId) {
          const updatedExtras = item.extras
            ? [{ ...newExtra, quantity: 1 }, ...item.extras]
            : [{ ...newExtra, quantity: 1 }];
    
          const updatedItem = { ...item, extras: updatedExtras, background: item.background };
          updateItem(tableId, itemId, updatedItem);
    
          // Обновление элемента в столе 0, если он является 'boss'
          if (item.boss) {
            const updatedItemForTable0 = { ...updatedItem, background: 'red' };
            updateItem("0", itemId, updatedItemForTable0);
          }
          if (item.pizza) {
            const updatedItemForTable0 = { ...updatedItem, background: 'red' };
            updateItem("1000", itemId, updatedItemForTable0);
          }
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
      // Например, вы можете добавить выбранный вариант к тексту элемента:f
      const newItem = { ...item, text: item.text + ' ' + option };
      handleAddButtonClick(newItem);
    };
    const handleAddButtonClick = (item) => {
      // Добавьте условие для скидки
      const discountedPrice = tableId === "50" ? item.price * 0.9 : item.price;
    
      // Создайте уникальный идентификатор для каждого добавленного элемента
      const uniqueId = Date.now();
    
      const itemToAdd = {
        ...item,
        id: item.id + "-" + uniqueId, 
        price: discountedPrice, 
        quantity: 1,
        totalPrice: discountedPrice.toFixed(2),
        extras: [],
        tableId: tableId,
        createdAt: Date.now(),
        isReady: false,  // новое поле
      };
      
      setAddedItems([itemToAdd, ...addedItems].sort((a, b) => b.createdAt - a.createdAt));
      addItem(tableId, itemToAdd);
      setSearchTerm("");
      setSelectedItem(null);
    };
    console.log(addedItems);
    const handleOrderClick = async (itemId, event) => {
      // Если кликнули по кнопке, то не меняем цвет и не открываем модальное окно
      if (event.target.tagName === 'BUTTON' || event.target.parentElement.tagName === 'BUTTON') return;
    
      // Изменения разрешены для столов 0 и 100
      if (tableId !== '0' && tableId !== '1000') return;
      
      const itemToUpdate = addedItems.find(item => item.id === itemId);
      
      if (itemToUpdate) {
        const isReady = !itemToUpdate.isReady;
        let background;
        // Если мы на столе 0, переключаем цвет между красным и зеленым
        if (tableId === '0') {
          background = itemToUpdate.background === 'green' ? 'red' : 'green';
        } 
        // Если мы на столе 100, переключаем цвет между синим и зеленым
        else if (tableId === '1000') {
          background = itemToUpdate.background === 'green' ? 'red' : 'green';
        }
        
        updateItem(tableId, itemId, { isReady, background }); // update both isReady and background
      }
    };
    
    
    
    
    
    
    
    
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Suchen"
        className="w-full px-2 py-1 mt-10 placeholder:text-white font-[400] rounded-lg bg-[#6E7780] focus:ring-2  focus:outline-none"
      />
  
      {searchTerm !== "" && (
        <div className="bg-white mt-2 rounded-lg">
          <ul className="rounded-lg">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`w-full p-2 shadow-xl rounded-xl ${item.options ? "flex flex-col" : "flex justify-between"}`}
                onClick={() => handleAddButtonClick(item)}
              >
                <span>{item.text}{" "}</span>
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
  {Object.entries(groupedItems).map(([tableId, items]) => (
    <div key={tableId}>
      <div>
        {tableId === "0" || tableId === "1000" ? null : (
          <span className="bg-black text-white text-[26px] mb-4">
            {`Tisch # ${tableId}`}
          </span>
        )}
      </div>
      <div>
        {items.map((item, i) => (
          <div
          key={item.id}
          className={`${item.background === "red" ? "bg-red-500" : item.background === "green" ? "bg-green-300" : "bg-transparent"}`}
          onClick={(event) => handleOrderClick(item.id, event)}
        >


     
      
      
      
                <div className="p-2 font-medium">
                  {item.extras && (
                    <ul className="mt-2"></ul>
                  )}
                  <ul className="flex justify-between text-left">
                  <li 
  className={(tableId === "0" && tableId === "1000" && item.originTableId !== "0" && item.originTableId !== "1000") ? "text-red-500 text-[30px]" : "text-[16px]"} // Увеличиваем размер шрифта и меняем цвет текста для элементов, которые были перемещены на стол "0" с других столов
>
  <div style={{display: 'flex', flexDirection: 'column'}}>
    <span className="md:text-[40px] lg:text-[40px]">{item.text}</span>
  </div>
</li>

                    {tableId !== "0" && (
                      <li className="text-[16px]">
                        {calculateTotalPriceWithExtras(item) + "€"}
                      </li>
                    )}
                  </ul>

                  {item.extras.map((extra) => (
                    <li
                      key={extra.id}
                      className="text-sm text-gray-600 flex justify-between md:text-[30px] md:text-black md:mt-4"
                    >
                      {extra.isExtraMinus ? '-' : '+'} {extra.text}
                    </li>
                  ))}

{tableId !== "0" && (
            <div className="flex justify-between mt-5 items-center">
              <div className="flex flex-col w-full">
                <div className="bg-[#6E7780]  lg:bg-[#6E7780] md:text-black px-2 py-1 rounded-full items-center flex justify-between gap-5 w-[40%] text-white  lg:justify-between md:text-[30px]">
                <button
  onClick={(event) => {
    event.stopPropagation();
    handleMinusButtonClick(item.id);
  }}
  className="text-[20px]  lg:block"
>
  <AiOutlineMinus />
</button>


                            <span>{item.quantity}</span>
                            <button
  onClick={(event) => {
    event.stopPropagation();
    handlePlusButtonClick(item.id);
  }}
  className="text-[20px]  lg:block"
>
  <AiOutlinePlus />
</button>
                        </div>
                        <div className="flex justify-between mt-4">
                  {item.category === 'pizza' && tableId !== "0" && ( // Скрываем кнопки для tableId === "0"
                    <div className='flex gap-4'>
                      <button onClick={() => handleExtraButtonClick(item.id)} className="lg:block">Extra+</button>
                      <button onClick={() => handleExtraMinusButtonClick(item.id)} className=" lg:block">Extra-</button>
                    </div>
                  )}
                  {tableId !== "0" &&  ( // Скрываем кнопку "Löschen" для tableId === "0"
                    <button onClick={() => handleDeleteButtonClick(item.id)} className=" lg:block">
                      Löschen
                    </button>
                  )}
                </div>
                      </div>
                      
                      {selectedItemId === item.id && (
                        <Extra
                          itemId={item.id}
                          onExtraItemSelected={handleExtraItemSelected}
                          setSelectedItemId={setSelectedItemId}
                          selectedExtras={selectedExtras}
                          setSelectedExtras={setSelectedExtras}
                        />
                      )}

                      {selectedItemIdMinus === item.id && (
                        <ExtraMinus 
                          itemId={item.id} 
                          onExtraItemSelected={handleExtraItemSelected} 
                          setSelectedItemIdMinus={setSelectedItemIdMinus} 
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search
