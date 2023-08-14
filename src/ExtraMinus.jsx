import {useState, useEffect} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai'
const ExtraMinus = ({ itemId, onExtraItemSelected, setSelectedItemId, setSelectedItemIdMinus }) => {
  
  const extraItem = [
    { id: 1, text: "Ananas", price: 0.00 },
    { id: 2, text: "Creme Fresh", price: 0.00 },
    { id: 3, text: "Gorgonzola", price: 0.00 },
    { id: 4, text: "Kartoffeln", price: 0.00 },
    { id: 5, text: "Knoblauch", price: 0.00 },
    { id: 6, text: "Mozzarella Buffalo", price: 0.00 },
    { id: 7, text: "Paprika", price: 0.00 },
    { id: 8, text: "Pepperoni", price: 0.00 },
    { id: 9, text: "Prosciutto", price: 0.00 },
    { id: 10, text: "Artischocken", price: 0.00 },
    { id: 11, text: "Ei", price: 0.00 },
    { id: 12, text: "Hackfleisch", price: 0.00 },
    { id: 13, text: "Käse", price: 0.00 },
    { id: 14, text: "Lachs", price: 0.00 },
    { id: 15, text: "Oliven", price: 0.00 },
    { id: 16, text: "Parma", price: 0.00 },
    { id: 17, text: "Pesto", price: 0.00 },
    { id: 18, text: "Rucola", price: 0.00 },
    { id: 19, text: "Basilikum", price: 0.00 },
    { id: 20, text: "Funghi", price: 0.00 },
    { id: 21, text: "Kapern", price: 0.00 },
    { id: 22, text: "Kirschtomaten", price: 0.00 },
    { id: 23, text: "Mais", price: 0.00 },
    { id: 24, text: "Oregano", price: 0.00 },
    { id: 25, text: "Parmesan", price: 0.00 },
    { id: 26, text: "Pikant", price: 0.00 },
    { id: 27, text: "Salami", price: 0.00 },
    { id: 28, text: "Salamino", price: 0.00 },
    { id: 29, text: "Speck", price: 0.00 },
    { id: 30, text: "Tonno", price: 0.00 },
    { id: 31, text: "Sardellen", price: 0.00 },
    { id: 32, text: "Spinat", price: 0.00 },
    { id: 34, text: "Shrimps", price: 0.00 },
    { id: 35, text: "Tomaten", price: 0.00 },
    { id: 33, text: "Zwiebel", price: 0.00 },
  ].sort((a, b) => a.text.localeCompare(b.text));
  ;

  const getUniqueStartingLetters = () => {
    const uniqueLetters = new Set(extraItem.map((item) => item.text[0]));
    return Array.from(uniqueLetters);
  };

  const uniqueStartingLetters = getUniqueStartingLetters();

  const handleExtraItemSelected = (extra) => {
    onExtraItemSelected(itemId, extra);
  };
  const handleCloseButtonClick = () => {
    setSelectedItemIdMinus(null); // добавьте эту строку
  };

  const [currentLetter, setCurrentLetter] = useState(uniqueStartingLetters[0]);

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter);
  };

  const paginatedItems = extraItem.filter((item) => item.text[0] === currentLetter);
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
            <div className={`w-full flex flex-col py-2 px-4 text-white rounded-xl ${
              clickedItemId === item.id ? 'bg-green-500' : 'bg-white shadow-xl'
            }`} 
            key={item.id} 
            onClick={() => {
              handleExtraItemSelected(item);
              setClickedItemId(item.id);
              setTimeout(() => {
                setClickedItemId(null);
              }, 100);
            }}>
              <li className='text-black'>
                {item.text}
              </li>
              <li className='text-black'>
                {item.price.toFixed(2)} c
              </li>
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
</div>

      </div>
    </div>
  );
  
};

export default ExtraMinus;
