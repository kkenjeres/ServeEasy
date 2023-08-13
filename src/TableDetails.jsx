import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '../src/assets/BG.svg';
import Search from './Search';
import Zahlen from './Zahlen';
import {AiOutlineLeft} from 'react-icons/ai'
import { useHistory } from "react-router-dom"; // Добавьте этот импорт
import {AiFillHeart} from 'react-icons/ai'
import Heart from './Heart';
function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [showZahlen, setShowZahlen] = useState(false);
  const [showHeart, setShowHeart] = useState(false); // Add this line
  const [selectedItemId, setSelectedItemId] = useState(null);
  const tableId = parseInt(id, 10);

  const handleBack = () => {
    navigate('/');
  };

  const handleZahlenClick = () => {
    setShowZahlen(true);
  };

  const handleCloseZahlen = () => {
    setShowZahlen(false);
  }

  const handleHeartClick = () => {
    setShowHeart(true);
  }

  const handleCloseHeart = () => { // Add this function
    setShowHeart(false);
  }
  return (
    <div className="pb-10 w-full h-screen bg-gray-100 overflow-y-auto font-bold  flex flex-col">
      <div className="flex w-full border-b border-gray-300 my-2 relative">
        <button
          onClick={handleBack}
          className="text-[25px] absolute m-auto top-0 bottom-0"
        >
          <AiOutlineLeft />
        </button>
        <h1 className="text-center text-black font-normal border-black border-b text-[25px] w-full ">
          Tisch #{id}
        </h1>
      </div>
      {tableId !== 0 && (
      <div className='flex justify-end px-10 mt-10'> 
        <AiFillHeart onClick={handleHeartClick} className='w-[50px] h-[50px]'/> {/* Modify this line */}
      </div>
      )}
      <div className="w-[90%] mx-auto flex-grow flex flex-col justify-between">
        <div>
          <div>
            <Search tableId={id} setTableData={setTableData} setSelectedItemId={setSelectedItemId} selectedItemId={selectedItemId} />

          </div>
          <div className="w-full">
            <p className="border-1 border-gray-300"></p>
          </div>
        </div>
        {tableId !== 0 && (
          <div className="w-full my-4 text-center ">
            <button
              onClick={handleZahlenClick}
              className="py-2 bg-black text-white w-full rounded-[40px]"
            >
              Zahlen
            </button>
          </div>
        )}
      </div>
      {showZahlen && (
        <Zahlen
          tableId={id}
          setTableData={setTableData}
          onClose={() => setShowZahlen(false)}
        />
      )}
       {showHeart && (
    <Heart setSelectedItemId={setSelectedItemId} setTableData={setTableData} tableId={id} handleCloseHeart={handleCloseHeart} />
  )}
    </div>
  );
  
}

export default TableDetails;
