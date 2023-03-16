import {useState} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai'
const Extra = ({ itemId, onExtraItemSelected, setSelectedItemId}) => {
  
  const extraItem = [
    { id: 1, text: "Ananas", price: 0.60 },
    { id: 2, text: "Creme Fresh", price: 0.60 },
    { id: 3, text: "Gorgonzola", price: 0.60 },
    { id: 4, text: "Kartoffeln", price: 0.60 },
    { id: 5, text: "Knoblauch", price: 0.60 },
    { id: 6, text: "Mozzarella Buffalo", price: 3.30 },
    { id: 7, text: "Paprika", price: 2.30 },
    { id: 8, text: "Pepperoni", price: 0.60 },
    { id: 9, text: "Prosciutto", price: 0.60 },
    { id: 10, text: "Artischocken", price: 0.00 },
    { id: 11, text: "Ei", price: 1.20 },
    { id: 12, text: "Hackfleisch", price: 3.20 },
    { id: 13, text: "Käse", price: 0.60 },
    { id: 14, text: "Lachs", price: 3.30 },
    { id: 15, text: "Oliven", price: 0.60 },
    { id: 16, text: "Parma", price: 0.60 },
    { id: 17, text: "Pesto", price: 0.60 },
    { id: 18, text: "Rucola", price: 0.60 },
    { id: 19, text: "Basilikum", price: 0.60 },
    { id: 20, text: "Funghi", price: 0.60 },
    { id: 21, text: "Kapern", price: 0.50 },
    { id: 22, text: "Kirschtomaten", price: 0.60 },
    { id: 23, text: "Mais", price: 0.60 },
    { id: 24, text: "Oregano", price: 0.00 },
    { id: 25, text: "Parmesan", price: 1.30 },
    { id: 26, text: "Pikant", price: 0.60 },
    { id: 27, text: "Salami", price: 0.60 },
    { id: 28, text: "Salamino", price: 0.60 },
    { id: 29, text: "Speck", price: 0.60 },
    { id: 30, text: "Tonno", price: 0.60 },
    { id: 31, text: "Sardellen", price: 0.60 },
    { id: 32, text: "Spinat", price: 0.60 },
    { id: 33, text: "Zwiebel", price: 0.60 },
    { id: 34, text: "Shrimps", price: 0.60 },
    { id: 35, text: "Tomaten", price: 0.60 },
  ];

  const handleExtraItemSelected = (extra) => {
    onExtraItemSelected(itemId, extra);
  };
  const handleCloseButtonClick = () => {
    setSelectedItemId(null);
  };
  const itemsPerPage = 10;
const totalPages = Math.ceil(extraItem.length / itemsPerPage);
const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const paginatedItems = extraItem.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [clickedItemId, setClickedItemId] = useState(null);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-gray-200 rounded-lg md:w-[60%] w-[90%] flex flex-col">
        <div className="flex justify-between items-start px-4 py-2">
          <div></div>
          <button
            className="rounded-lg my-4 text-[20px] px-2"
            onClick={handleCloseButtonClick}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <ul className="gap-2 grid grid-cols-2 ">
          {paginatedItems.map((item) => (
            <div className={`w-full flex justify-between py-2 px-4 text-white rounded-xl ${
              clickedItemId === item.id ? 'bg-green-500' : 'bg-blue-500'
            }`} 
            key={item.id} 
            onClick={() => {
              handleExtraItemSelected(item);
              setClickedItemId(item.id);
              setTimeout(() => {
                setClickedItemId(null);
              }, 100);
            }}>
              <li>
                {item.text} {item.price.toFixed(2)}c
              </li>
            </div>
          ))}
        </ul>
        <div className="flex justify-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`${
                index + 1 === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              } border border-gray-400 rounded-md px-3 py-1 mx-1`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default Extra;
