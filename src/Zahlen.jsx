

import { useEffect, useState, useRef } from "react";
import React from "react";
import { db } from "../src/firebase";
import { collection, doc, getDocs, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import logo from '../src/assets/logo.jpg'

const Zahlen = ({ id, setTableData, tableId, onClose }) => {
  const [firebaseData, setFirebaseData] = useState([]);
  const [splitItems, setSplitItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const handleQuantityChange = (itemId, quantity) => {
    setSelectedQuantities({ ...selectedQuantities, [itemId]: quantity });
  };
  const handleRowClick = (item, e) => {
    if (e.target.name === "quantity") return; // Игнорируем клик на инпуте
  
    handleItemSelection(item);
  };
  
  const handleItemSelection = (item) => {
    const itemWithExtras = { ...item };
  
    if (item.extras) {
      itemWithExtras.extras = item.extras.map((extra) => ({ ...extra }));
    }
  
    // Установка начального значения счетчика на 1
    const selectedQuantity = 1;
  
    if (splitItems.some((i) => i.id === item.id)) {
      setSplitItems(splitItems.filter((i) => i.id !== item.id));
      setSelectedQuantities({ ...selectedQuantities, [item.id]: "" });
    } else {
      itemWithExtras.selectedQuantity = Number(selectedQuantity);
      setSplitItems([...splitItems, itemWithExtras]);
      setSelectedQuantities({ ...selectedQuantities, [item.id]: selectedQuantity });
    }
  };
  
  
  
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "tables", tableId, "items"));
      const firebaseData = querySnapshot.docs.map((doc) => doc.data());
      setFirebaseData(firebaseData);
    };

    fetchData();
  }, [tableId]);

  const totalPrice = firebaseData.reduce((acc, item) => {
    const selectedQuantity = selectedQuantities[item.id] || item.quantity;
    let itemTotal = item.price * selectedQuantity;
  
    if (item.extras) {
      itemTotal += item.extras.reduce((extraAcc, extra) => {
        return extraAcc + extra.price * selectedQuantity;
      }, 0);
    }
  
    return acc + itemTotal;
  }, 0);
  
  

  const handleClearTableClick = async () => {
    try {
      const tableItemsRef = collection(db, "tables", tableId, "items");
      const tableItemsSnapshot = await getDocs(tableItemsRef);
      const currentTableItems = tableItemsSnapshot.docs.map(doc => doc.data());
      
      const tableZeroItemsRef = collection(db, "tables", '0', "items");
      const tableZeroItemsSnapshot = await getDocs(tableZeroItemsRef);
      const tableZeroItems = tableZeroItemsSnapshot.docs.map(doc => doc.data());
      
      // Находим общие элементы между текущим столом и столом 0
      const itemsToRemove = tableZeroItems.filter(zeroItem => 
        currentTableItems.some(currentItem => currentItem.id === zeroItem.id)
      );
      
      // Удаляем общие элементы из текущего стола
      for (let item of itemsToRemove) {
        await deleteDoc(doc(collection(db, "tables", tableId, "items"), item.id));
      }
  
      // Удаляем общие элементы из стола 0
      for (let item of itemsToRemove) {
        await deleteDoc(doc(collection(db, "tables", '0', "items"), item.id));
      }
  
      setTableData([]);
      onClose();
    } catch (error) {
      console.error("Error clearing table in Firestore: ", error);
    }
  };
  
  

  const handleBackClick = () => {
    onClose();
  };
  const splitTotalPrice = splitItems.reduce((acc, item) => {
    const selectedQuantity = selectedQuantities[item.id] || item.quantity;
    let itemTotal = item.price * selectedQuantity;
  
    if (item.extras) {
      itemTotal += item.extras.reduce((extraAcc, extra) => {
        return extraAcc + extra.price * selectedQuantity;
      }, 0);
    }
  
    return acc + itemTotal;
  }, 0);
  
  
  
  const handlePaySelectedItems = async () => {
    const newFirebaseData = [...firebaseData];
  
    for (const item of splitItems) {
      const selectedItemQuantity = selectedQuantities[item.id] || item.quantity;
      if (selectedItemQuantity < item.quantity) {
        await updateDoc(
          doc(collection(db, "tables", tableId, "items"), item.id.toString()),
          { quantity: item.quantity - selectedItemQuantity }
        );
  
        // Обновление оставшегося количества элементов в newFirebaseData
        const index = newFirebaseData.findIndex((i) => i.id === item.id);
        newFirebaseData[index].quantity -= selectedItemQuantity;
      } else {
        await deleteDoc(
          doc(collection(db, "tables", tableId, "items"), item.id.toString())
        );
  
        // Удаление оплаченных элементов из newFirebaseData
        const index = newFirebaseData.findIndex((i) => i.id === item.id);
        newFirebaseData.splice(index, 1);
      }
    }
  
    // Обновление состояния FirebaseData
    setFirebaseData(newFirebaseData);
  
    // Очистка выбранных элементов и выбранных количеств
    setSplitItems([]);
    setSelectedQuantities({});
  };
  
  
   
  const incrementQuantity = (itemId) => {
    const item = firebaseData.find((item) => item.id === itemId);
    const maxQuantity = item.quantity;
    const currentQuantity = selectedQuantities[itemId] || 1;
  
    if (currentQuantity < maxQuantity) {
      setSelectedQuantities({ ...selectedQuantities, [itemId]: currentQuantity + 1 });
    }
  };
  
  const decrementQuantity = (itemId) => {
    const currentQuantity = selectedQuantities[itemId] || 1;
  
    if (currentQuantity > 1) {
      setSelectedQuantities({ ...selectedQuantities, [itemId]: currentQuantity - 1 });
    }
  };

  // Drucken 
  const [message, setMessage] = useState(null);
const [text, setText] = useState("");
const headerRefs = useRef(null);
const rowsRefs = useRef([]);
const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
const getRowRef = (index) => (el) => {
  rowsRefs.current[index] = el;
};

const handlePrint = async () => {
  const addressText =
    "Augsburger Str. 672\n70239 Stuttgart Obertürkheim\nTel: 0711 32 69 83\nSt. Nr. :97396/68694";
  const tableIdText = `Tisch: ${tableId}`;
  const dateText = new Date().toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const ibanText = "IBAN: DE07600501010008770088";
  const bicText = "BIC: SOLADEST600";
  const closingText = "Wir wünsche Ihnen einen schönen Tag";
  
  const headerText = headerRefs.current
    ? [...headerRefs.current.children].map((th) => th.textContent).join(" | ")
    : "";

    const rowsText = firebaseData
  .flatMap((item, index) => {
    const itemRows = [
      [
        item.quantity,
        item.text,
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2),
        item.percent,
      ].join(" | "),
    ];

    if (item.extras) {
      itemRows.push(
        ...item.extras.map((extra) => [
          extra.quantity || "",
          `${extra.isExtraMinus ? "-" : "+"} ${extra.text}`,
          extra.price.toFixed(2),
          extra.price.toFixed(2),
          extra.percent,
        ].join(" | "))
      );
    }

    return itemRows;
  })
  .join("\n");

  

  const splitItemsText = splitItems
    .map(
      (item) =>
        `${item.name} - ${item.price.toFixed(2)} x ${
          selectedQuantities[item.id] || item.quantity
        }`
    )
    .join("\n");
  const totalPriceText = `Zwischensumme: ${totalPrice.toFixed(2)} Euro`;

  const mwstHeadersText = "MwSt % | Netto | MwSt | Brutto";

  const mwstText = firebaseData.length > 0
    ? firebaseData.reduce((acc, item) => {
        const group = acc.find((group) => group.percent === item.percent);
        if (group) {
          group.items.push(item);
        } else {
          acc.push({
            percent: item.percent,
            items: [item],
          });
        }
        return acc;
      }, []).map((group) => (
        [
          group.percent,
          group.items.reduce((total, item) => {
            const totalPrice = item.price * item.quantity;
            const netto = totalPrice / (1 + item.percent / 100);
            return total + netto;
          }, 0).toFixed(2),
          group.items.reduce((total, item) => {
            const totalPrice = item.price * item.quantity;
            const netto = totalPrice / (1 + item.percent / 100);
            const mwst = totalPrice - netto;
            return total + mwst;
          }, 0).toFixed(2),
          group.items.reduce((total, item) => {
            const totalPrice = item.price * item.quantity;
            const brutto = totalPrice;
            return total + brutto;
          }, 0).toFixed(2),
        ].join(" | ")
      )).join("\n")
    : "";
  
  const betragBezahltText = `Betrag bezahlt: ${(splitItems.length ? splitTotalPrice : totalPrice).toFixed(2)} Euro`;
  
  const textToPrint = `
    ${addressText || ""}
    ${tableIdText || ""}
    ${headerText ? `\n${headerText}\n` : ""}
    ${rowsText || ""}
    ${splitItemsText || ""}
    ${totalPriceText || ""}
    ${mwstHeadersText ? `\n${mwstHeadersText}\n` : ""}
    ${mwstText ? `\n${mwstText}\n` : ""}
    ${betragBezahltText || ""}
    ${dateText || ""}
    ${ibanText || ""}
    ${bicText || ""}
    ${closingText || ""}
  `;

  try {
    const response = await fetch(`${apiUrl}/print`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textToPrint }),
    });

    if (response.ok) {
      setMessage("Текст успешно напечатан!");
    } else {
      const errorData = await response.json();
      console.error("Ошибка печати:", errorData);
      setMessage("Ошибка печати, пожалуйста, попробуйте еще раз.");
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    setMessage("Ошибка печати, пожалуйста, попробуйте еще раз.");
  }
};

  // Drucken 


  const logoRef = useRef(null);
const headerRef = useRef(null);
const addressRef = useRef(null);
const tableIdRef = useRef(null);
const steuerdRef = useRef(null);
const summedRef = useRef(null);

return (
  <div className='fixed w-full h-full top-0 left-0 flex  justify-center bg-white overflow-y-auto '>
    <div className='w-full'>
      <div className='bg-white px-4 py-10  flex flex-col items-center justify-center'>
        <img ref={logoRef} src={logo} alt="" className='w-[100px]'/>
        <h1 ref={headerRef} className='text-[30px] mb-10'>Al Vecchio Mulino</h1>
        <div className='flex flex-col text-center mb-10 w-full'>
          <div className='mb-20' ref={addressRef}>
            <p>Augsburger Str. 672</p>
            <p>70239 Stuttgart Obertürkheim</p>
            <p>Tel: 0711 32 69 83</p>
            <p>St. Nr. :97396/68694</p>
          </div>
          <p ref={tableIdRef} className='text-black text-[24px] w-full tex-left mb-4 text-left'>Tisch: {tableId}</p>
            <div className='w-full flex flex-col items-center'>
              <div className='w-full'>

                <table className=' font-normal w-full'>
                  <thead className='text-left'>
                    <tr ref={headerRefs}>
                      <th>M</th>
                      <th>Beschreibung</th>
                      <th className='text-center'>EP</th>
                      <th className='text-center' >Gesamt</th>
                      <th className='text-right'>%</th>
                    </tr>
                  </thead>
                  
                  <tbody>
    {firebaseData.map((item, index) => (
      <React.Fragment key={index}>
        <tr
          className={`text-black text-left ${
            splitItems.some((i) => i.id === item.id) ? "line-through" : ""
          }`}
          onClick={(e) => handleRowClick(item, e)}
        >
          <td>{item.quantity}</td>
          <td className="text-left">{item.text}</td>
          <td className="text-center">{item.price.toFixed(2)}</td>
          <td className="text-center">{(item.price * item.quantity).toFixed(2)}</td>
          <td className="text-right">{item.percent}</td>
        </tr>
        <tr className="">
          <td colSpan="5">
            <div className="flex justify-center items-center">
              {splitItems.some((i) => i.id === item.id) && item.quantity > 1 && (
                <div className="flex space-between w-full">
                  <div className="flex flex-col">
                    <div className="bg-gray-300 px-2 rounded-full items-center flex justify-between gap-8 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementQuantity(item.id, item.quantity);
                        }}
                        className="text-[20px]"
                      >
                        -
                      </button>
                      <span className="text-[16px]">{selectedQuantities[item.id] || item.quantity}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementQuantity(item.id);
                        }}
                        className=" text-[20px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
        {item.extras &&
          item.extras.map((extra, extraIndex) => (
            <tr
            ref={getRowRef(index)}

              key={`${index}-${extraIndex}`}
              className={`text-black text-left ${
                splitItems.some((i) => i.id === item.id) ? "line-through" : ""
              }`}
              onClick={() => handleItemSelection(item)}
            >
              <td>{extra.quantity = ''}</td>
              <td className="text-left pl-2">{extra.isExtraMinus ? '-' : '+'} {extra.text}</td>
              <td className="text-center">{extra.price.toFixed(2)}</td>
              <td className='text-center'>{extra.price.toFixed(2)}</td>
              <td className="text-right">{extra.percent}</td>
            </tr>
          ))}
      </React.Fragment>
    ))}
  </tbody>
</table>

<div style={{width: '100%', height: '2px', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, black 50%, transparent 0%)', backgroundPosition: '0 1px', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', marginTop: '10px', marginBottom: '10px'}}></div>

                <div className='flex font-[500]'>
                  <p ref={summedRef} className='text-black text-[16px] text-center w-full'>Zwischensumme: </p>
                  <p> {totalPrice.toFixed(2)}</p>

                </div>
                
                <div style={{width: '100%', height: '2px', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, black 50%, transparent 0%)', backgroundPosition: '0 1px', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', marginTop: '10px', marginBottom: '10px'}}></div>

                <table className='w-full'>
  <thead >
    <tr className=' '>
      <th className='text-left w-[25%]'>MwSt %</th>
      <th className='text-center w-[25%]'>Netto</th>
      <th className='text-center w-[25%]'>MwSt</th>
      <th className='text-right w-[25%]'>Brutto</th>
    </tr>
  </thead>
  {firebaseData.length > 0 && (
    <tbody>
      {firebaseData.reduce((acc, item) => {
        const group = acc.find((group) => group.percent === item.percent);
        if (group) {
          group.items.push(item);
        } else {
          acc.push({
            percent: item.percent,
            items: [item],
          });
        }
        return acc;
      }, []).map((group) => (
        <tr key={group.percent} className='font-[500] '>
          <td className='text-center w-[25%]'>{group.percent}</td>
          <td className='text-center w-[25%]'>{ 
            group.items.reduce((total, item) => {
              const totalPrice = item.price * item.quantity;
              const netto = totalPrice / (1 + item.percent / 100);
              return total + netto;
            }, 0).toFixed(2)
          }</td>
          <td className='text-center w-[25%]'>{
            group.items.reduce((total, item) => {
              const totalPrice = item.price * item.quantity;
              const netto = totalPrice / (1 + item.percent / 100);
              const mwst = totalPrice - netto;
              return total + mwst;
            }, 0).toFixed(2)
          }</td>
          <td className='text-right w-[25%]'>{
            group.items.reduce((total, item) => {
              const totalPrice = item.price * item.quantity;
              const brutto = totalPrice;
              return total + brutto;
            }, 0).toFixed(2)
          }</td>
        </tr>
      ))}
    </tbody>
  )}
</table>

              </div>
            </div>
            <div style={{width: '100%', height: '2px', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, black 50%, transparent 0%)', backgroundPosition: '0 1px', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', marginTop: '10px', marginBottom: '10px'}}></div>

            <div className='w-full my-4 flex justify-center'>
              <div className='flex justify-between items-center w-full'>
                <p className='text-black text-[20px]'>Betrag bezahlt:</p>
                <p className='text-black text-[24px]'>{(splitItems.length ? splitTotalPrice : totalPrice).toFixed(2) + ' Euro'}</p>
              </div>
              
            </div>
            <div style={{width: '100%', height: '2px', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, black 50%, transparent 0%)', backgroundPosition: '0 1px', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', marginTop: '10px', marginBottom: '10px'}}></div>

            <div className='flex flex-col w-full'>
              <span>{new Date().toLocaleString([], {hour: '2-digit', minute: '2-digit', hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/:\d\d\s/, ' ').replace(',', ' ')} Uhr</span>
              <span>IBAN: DE07600501010008770088</span>
              <span>BIC: SOLADEST600</span>

            </div>
            <div style={{width: '100%', height: '2px', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, black 50%, transparent 0%)', backgroundPosition: '0 1px', backgroundSize: '6px 1px', backgroundRepeat: 'repeat-x', marginTop: '10px', marginBottom: '10px'}}></div>

            <p>Wir wünsche Ihnen einen schönen Tag </p>
            <button onClick={handlePaySelectedItems} className='px-4 py-2 rounded-full bg-black mt-10 text-white'>Getrennt Zahlen</button>
<button className='your-button-styles' onClick={handlePrint}>Drucken</button>

            <button onClick={handleClearTableClick} className='px-4 py-2 rounded-full bg-black mt-10 text-white'>Zahlen</button>
            <button onClick={handleBackClick} className='px-4 py-2 rounded-full bg-white border border-black mt-10 text-black'>Zurück</button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Zahlen;
