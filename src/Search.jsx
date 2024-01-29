import React, { useState, useEffect } from "react";
import { itemsData } from "./Data";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app, db } from "../src/firebase";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Extra from "./Extra";
import ExtraMinus from "./ExtraMinus";

function Search({ tableId, setTableData, setSelectedItemId, selectedItemId }) {
  const [items, setItems] = useState(itemsData);
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
        item.id.toString() === value ||
        item.text.toLowerCase().includes(value.toLowerCase())
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
    if (tableId === "0" || tableId === "1000") {
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
        background: "transparent", // always set to transparent when adding to original table
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
          styles: { color: "red" },
          background: "red", // always set to red when adding to table 0
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
          originTableId: tableId, // Здесь мы добавляем поле originTableId
          styles: { color: "red" },
          background: "red", // always set to red when adding to table 100
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
      const docRef = doc(
        collection(db, "tables", tableId, "items"),
        itemId.toString()
      );
      await updateDoc(docRef, dataToUpdate);

      const itemToUpdate = addedItems.find((item) => item.id === itemId);
      if (itemToUpdate && itemToUpdate.boss) {
        // Обновляем элемент в столе 0
        const brankoDocRef = doc(
          collection(db, "tables"),
          "0",
          "items",
          itemId.toString()
        );
        await updateDoc(brankoDocRef, dataToUpdate);

        // Если элемент был обновлён в столе 0, обновляем его и в оригинальном столе
        if (tableId === "0" && itemToUpdate.originTableId) {
          const originTableDocRef = doc(
            collection(db, "tables"),
            itemToUpdate.originTableId,
            "items",
            itemId.toString()
          );
          await updateDoc(originTableDocRef, dataToUpdate);
        }
      }

      if (itemToUpdate && itemToUpdate.pizza) {
        // Обновляем элемент в столе 100
        const pizzaDocRef = doc(
          collection(db, "tables"),
          "1000",
          "items",
          itemId.toString()
        );
        await updateDoc(pizzaDocRef, dataToUpdate);

        // Если элемент был обновлён в столе 100, обновляем его и в оригинальном столе
        if (tableId === "1000" && itemToUpdate.originTableId) {
          const originTableDocRef = doc(
            collection(db, "tables"),
            itemToUpdate.originTableId,
            "items",
            itemId.toString()
          );
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
        const updatedItem = { ...item, quantity: updatedQuantity, totalPrice };
        updateItem(tableId, id, updatedItem);

        if (item.boss) {
          const updatedItemForTable0 = { ...updatedItem, background: "red" };
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
          const updatedItem = {
            ...item,
            quantity: updatedQuantity,
            totalPrice,
          };
          updateItem(tableId, id, updatedItem);

          if (item.boss) {
            const updatedItemForTable0 = { ...updatedItem, background: "red" };
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
      const docRef = doc(
        collection(db, "tables", tableId, "items"),
        id.toString()
      );
      await deleteDoc(docRef);
      setAddedItems(addedItems.filter((item) => item.id !== id));

      const itemToDelete = addedItems.find((item) => item.id === id);

      if (itemToDelete && itemToDelete.boss) {
        const brankoDocRef = doc(
          collection(db, "tables"),
          "0",
          "items",
          id.toString()
        );
        await deleteDoc(brankoDocRef);
      }

      if (itemToDelete && itemToDelete.pizza) {
        const pizzaDocRef = doc(
          collection(db, "tables"),
          "1000",
          "items",
          id.toString()
        );
        await deleteDoc(pizzaDocRef);
      }
    } catch (error) {
      console.error("Error deleting item from Firestore: ", error);
    }
  };

  const deleteItem = async (tableId, itemId) => {
    try {
      const itemToDelete = addedItems.find((item) => item.id === itemId);
      if (itemToDelete) {
        if (tableId === "0" || tableId === "1000") {
          // Обновляем элемент вместо полного удаления
          await updateItem(tableId, itemId, {
            deletedFromTable0: true,
            deletedFromTable100: true,
          });
        } else {
          const docRef = doc(
            collection(db, "tables", tableId, "items"),
            itemId.toString()
          );
          await deleteDoc(docRef);

          if (itemToDelete.boss) {
            const brankoDocRef = doc(
              collection(db, "tables"),
              "0",
              "items",
              itemId.toString()
            );
            await deleteDoc(brankoDocRef);
          }

          if (itemToDelete.pizza) {
            const pizzaDocRef = doc(
              collection(db, "tables"),
              "1000",
              "items",
              itemId.toString()
            );
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

        const updatedItem = {
          ...item,
          extras: updatedExtras,
          background: item.background,
        };
        updateItem(tableId, itemId, updatedItem);

        // Обновление элемента в столе 0, если он является 'boss'
        if (item.boss) {
          const updatedItemForTable0 = { ...updatedItem, background: "red" };
          updateItem("0", itemId, updatedItemForTable0);
        }
        if (item.pizza) {
          const updatedItemForTable0 = { ...updatedItem, background: "red" };
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
    const newItem = { ...item, text: item.text + " " + option };
    handleAddButtonClick(newItem);
  };
  const handleAddButtonClick = (item) => {
    // Проверяем, не является ли товар одним из исключенных (M1 или M2), и находимся ли мы на столе 50
    const isDiscounted = tableId === "50" && !['M1', 'M2'].includes(item.text);
  
    // Применяем скидку, если условие выше истинно, иначе используем обычную цену
    const discountedPrice = isDiscounted ? item.price * 0.9 : item.price;
  
    // Создаем уникальный идентификатор для каждого добавленного элемента
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
      isReady: false, // новое поле
    };
  
    setAddedItems(
      [itemToAdd, ...addedItems].sort((a, b) => b.createdAt - a.createdAt)
    );
    addItem(tableId, itemToAdd);
    setSearchTerm("");
    setSelectedItem(null);
  };
  
  console.log(addedItems);
  const handleOrderClick = async (itemId, event) => {
    // Если кликнули по кнопке, то не меняем цвет и не открываем модальное окно
    if (
      event.target.tagName === "BUTTON" ||
      event.target.parentElement.tagName === "BUTTON"
    )
      return;

    // Изменения разрешены для столов 0 и 100
    if (tableId !== "0" && tableId !== "1000") return;

    const itemToUpdate = addedItems.find((item) => item.id === itemId);

    if (itemToUpdate) {
      const isReady = !itemToUpdate.isReady;
      let background;
      // Если мы на столе 0, переключаем цвет между красным и зеленым
      if (tableId === "0") {
        background = itemToUpdate.background === "green" ? "red" : "green";
      }
      // Если мы на столе 100, переключаем цвет между синим и зеленым
      else if (tableId === "1000") {
        background = itemToUpdate.background === "green" ? "red" : "green";
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
        className="w-full px-2 py-1 mt-4 placeholder:text-black font-[400] shadow-xl rounded-[40px] bg-white border border-gray-300 focus:ring-2  focus:outline-none"
      />

      {searchTerm !== "" && (
        <div className="bg-white mt-2 rounded-[40px]">
          <ul className="rounded-lg">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`w-full p-2 shadow-xl rounded-[40px] ${
                  item.options ? "flex flex-col" : "flex justify-between"
                }`}
                onClick={() => handleAddButtonClick(item)}
              >
                <span>{item.text} </span>
                {item.options
                  ? item.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOptionClick(item, option);
                        }}
                      >
                        {option}
                      </button>
                    ))
                  : "+"}
              </div>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-transparent mt-10">
        {Object.entries(groupedItems).map(([tableId, items]) => (
          <div key={tableId}>
            <div className=" my-4">
              {tableId === "0" || tableId === "1000" ? null : (
                <span className="bg-white text-black rounded-[40px] shadow-xl px-8 text-[26px] ">
                  {`Tisch # ${tableId}`}
                </span>
              )}
            </div>
            <div className="bg-transaprent">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`${
                    item.background === "red"
                      ? "bg-red-500"
                      : item.background === "green"
                      ? "bg-green-300"
                      : "bg-transparent"
                  } mb-2 rounded-xl gap-4 shadow-xl p-2`}
                  onClick={(event) => handleOrderClick(item.id, event)}
                >
                  <div className="p-2 font-medium">
                    {item.extras && <ul className="mt-2"></ul>}
                    <ul className="flex justify-between text-left">
                      <li
                        className={
                          tableId === "0" &&
                          tableId === "1000" &&
                          item.originTableId !== "0" &&
                          item.originTableId !== "1000"
                            ? "text-red-500 text-[30px]"
                            : "text-[16px]"
                        }
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span className="md:text-[40px] text-[24px] lg:text-[40px]">
                            {item.text}
                          </span>
                        </div>
                      </li>

                      {tableId !== "0" && (
                        <li className="md:text-[40px] text-[24px]">
                          {calculateTotalPriceWithExtras(item) + "€"}
                        </li>
                      )}
                    </ul>

                    <div
                      className={`bg-white px-2 rounded-xl mt-4 ${
                        item.extras.length > 0 ? "border border-black" : ""
                      }`}
                    >
                      {item.extras.map((extra) => (
                        <li
                          key={extra.id}
                          className="text-[16px] text-gray-900 flex justify-between md:text-[30px] md:text-black md:mt-4"
                        >
                          {extra.isExtraMinus ? "-" : "+"} {extra.text}
                        </li>
                      ))}
                    </div>

                    {tableId !== "0" && (
                      <div className="flex justify-between mt-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="bg-black  lg:bg-[#6E7780] md:text-black px-2 py-1 rounded-full items-center flex justify-between gap-5 w-[40%] text-white  lg:justify-between md:text-[30px]">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                handleMinusButtonClick(item.id);
                              }}
                              className="text-[20px] text-white  lg:block"
                            >
                              <AiOutlineMinus />
                            </button>

                            <span className="text-white">{item.quantity}</span>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                handlePlusButtonClick(item.id);
                              }}
                              className="text-[20px] text-white lg:block"
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                          <div className="flex justify-between mt-8">
                            {item.category === "pizza" &&
                              tableId !== "0" && ( // Скрываем кнопки для tableId === "0"
                                <div className="flex gap-4 ">
                                  <button
                                    onClick={() =>
                                      handleExtraButtonClick(item.id)
                                    }
                                    className="lg:block bg-white rounded-[40px] px-2 border border-black"
                                  >
                                    Extra+
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleExtraMinusButtonClick(item.id)
                                    }
                                    className=" lg:block bg-white rounded-[40px] px-2 border border-black"
                                  >
                                    Extra-
                                  </button>
                                </div>
                              )}
                            {tableId !== "0" && ( // Скрываем кнопку "Löschen" для tableId === "0"
                              <button
                                onClick={() => handleDeleteButtonClick(item.id)}
                                className=" lg:block flex justify-end w-full underline  md:text-[40px] md:uppercase"
                              >
                                <span className="md:bg-black md:text-white px-2 ">
                                  Löschen
                                </span>
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

export default Search;
