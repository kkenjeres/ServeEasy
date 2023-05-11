import {useState, useEffect} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai'
const Extra = ({ itemId, onExtraItemSelected, setSelectedItemId, selectedExtras,setSelectedExtras  }) => {
  
  const extraItem = [
    { id: 1, text: "Ananas", price: 0.60 },
    { id: 2, text: "Creme Fresh", price: 0.60 },
    { id: 3, text: "Gorgonzola", price: 0.60 },
    { id: 4, text: "Kartoffeln", price: 0.60 },
    { id: 5, text: "Knoblauch", price: 0.00 },
    { id: 6, text: "Mozzarella Buffalo", price: 3.30 },
    { id: 7, text: "Paprika", price: 0.60 },
    { id: 8, text: "Pepperoni", price: 0.60 },
    { id: 9, text: "Prosciutto", price: 0.60 },
    { id: 10, text: "Artischocken", price: 0.60 },
    { id: 11, text: "Ei", price: 1.20 },
    { id: 12, text: "Hackfleisch", price: 3.20 },
    { id: 13, text: "Käse", price: 0.60 },
    { id: 14, text: "Lachs", price: 3.30 },
    { id: 15, text: "Oliven", price: 0.60 },
    { id: 16, text: "Parma", price: 2.30 },
    { id: 17, text: "Pesto", price: 0.60 },
    { id: 18, text: "Rucola", price: 0.60 },
    { id: 19, text: "Basilikum", price: 0.60 },
    { id: 20, text: "Funghi", price: 0.60 },
    { id: 21, text: "Kapern", price: 0.60 },
    { id: 22, text: "Kirschtomaten", price: 0.60 },
    { id: 23, text: "Mais", price: 0.60 },
    { id: 24, text: "Oregano", price: 0.00 },
    { id: 25, text: "Parmesan", price: 1.30 },
    { id: 26, text: "Pikant", price: 0.00 },
    { id: 27, text: "Salami", price: 0.60 },
    { id: 28, text: "Salamino", price: 0.60 },
    { id: 29, text: "Speck", price: 0.60 },
    { id: 30, text: "Tonno", price: 0.60 },
    { id: 31, text: "Sardellen", price: 0.60 },
    { id: 32, text: "Spinat", price: 0.60 },
    { id: 33, text: "Zwiebel", price: 0.60 },
    { id: 34, text: "Shrimps", price: 3.30 },
    { id: 35, text: "Tomaten", price: 0.60 },
    { id: 36, text: "Kartoffel", price: 0.00, category:"Beilage" },
    { id: 37, text: "Nudeln", price: 0.00, category:"Beilage" },
    { id: 38, text: "Salat", price: 0.00, category:"Beilage" },
    { id: 39, text: "Gemuse", price: 0.00, category:"Beilage" },
    { id: 40, text: "Kartoffel", price: 4.00, category:"Beilage" },
    { id: 41, text: "Nudeln", price: 4.00, category:"Beilage" },
    { id: 42, text: "Salat", price: 4.00, category:"Beilage" },
    { id: 43, text: "Gemuse", price: 4.00, category:"Beilage" },
  ].sort((a, b) => a.text.localeCompare(b.text));

  const beilageItems = extraItem.filter((item) => item.category === 'Beilage');

  const getUniqueStartingLetters = () => {
    const uniqueLetters = new Set(extraItem.map((item) => item.text[0]));
    return Array.from(uniqueLetters);
  };

  const uniqueStartingLetters = getUniqueStartingLetters();

  const handleExtraItemSelected = (extra) => {
    const updatedExtra = { ...extra };
  
    if (extra.category === 'Beilage') {
      const existingBeilageItems = selectedExtras.filter(
        (selectedExtra) => selectedExtra.category === 'Beilage'
      );
  
      // Update the extra price if there is at least one existing Beilage item
      if (existingBeilageItems.length >= 1) {
        updatedExtra.price = 4;
      }
    }
  
    // Update the parent component
    onExtraItemSelected(itemId, updatedExtra);
  
    setSelectedExtras((prevExtras) => {
      // Update the price of Beilage items in the selectedExtras state
      const updatedExtras = prevExtras.map((selectedExtra) => {
        if (
          selectedExtra.category === 'Beilage' &&
          selectedExtra.id !== updatedExtra.id &&
          selectedExtra.price === 0
        ) {
          return { ...selectedExtra, price: 4 };
        }
        return selectedExtra;
      });
  
      return [...updatedExtras, updatedExtra];
    });
  };
  
  
  const handleCloseButtonClick = () => {
    setSelectedItemId(null);
  };

  const [currentLetter, setCurrentLetter] = useState(uniqueStartingLetters[0]);

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter === 'Beilage' ? null : letter);
  };
  const paginatedItems = currentLetter
  ? extraItem.filter((item) => item.text[0] === currentLetter)
  : beilageItems;
  const [clickedItemId, setClickedItemId] = useState(null);
  const disableBodyScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableBodyScroll = () => {
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    disableBodyScroll();
    return () => {
      enableBodyScroll();
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
      <div className="rounded-lg md:w-[60%] w-[90%] h-[70%] flex flex-col justify-between bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 shadow-md">

        <div className="flex justify-between items-start px-4 py-2">
          <div></div>
          <button
            className="rounded-lg my-4 text-[30px] px-2"
            onClick={handleCloseButtonClick}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <ul className="gap-2 grid grid-cols-2 px-2">
          {paginatedItems.map((item) => (
            <div
              className={`w-full flex flex-col py-2 px-4 text-white rounded-xl ${
                clickedItemId === item.id ? 'bg-green-500' : 'bg-blue-500'
              }`}
              key={item.id}
              onClick={() => {
                handleExtraItemSelected(item);
                setClickedItemId(item.id);
                setTimeout(() => {
                  setClickedItemId(null);
                }, 100);
              }}
            >
              <li>{item.text}</li>
              <li>{item.price.toFixed(2)} c</li>
            </div>
          ))}
        </ul>
        <div className="flex justify-center my-4 gap-2" style={{ flexWrap: 'wrap' }}>
          {uniqueStartingLetters.map((letter, index) => (
            <button
              key={index}
              className={`${
                letter === currentLetter ? 'bg-blue-500 text-white' : 'bg-white'
              } border border-gray-400 rounded-md px-3 py-1 mx-1`}
              onClick={() => handleLetterChange(letter)}
            >
              {letter}
            </button>
          ))}
          <button
            className={`${
              !currentLetter ? 'bg-blue-500 text-white' : 'bg-white'
            } border border-gray-400 rounded-md px-3 py-1 mx-1`}
            onClick={() => handleLetterChange('Beilage')}
          >
            Beilage
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Extra;
