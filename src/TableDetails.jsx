import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '../src/assets/BG.svg';
import Search from './Search';
import Zahlen from './Zahlen';
import {BsArrowLeft} from 'react-icons/bs'
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
    <div className="pb-10 w-full h-screen bg-gray-100 overflow-y-auto font-bold flex flex-col">
      <div className="flex relative w-[90%] m-auto pt-4">
          <button
            onClick={handleBack}
            className="text-[16px] bg-white border border-black rounded-[40px] px-4 py-2 flex items-center"
          >
            <BsArrowLeft className='text-[20px]'/>
            <span className='pl-2'>
              zurück
            </span>
          </button>

      </div>
      {tableId !== 0 && (
      <div className='flex justify-end px-10 mt-4'> 
        <AiFillHeart onClick={handleHeartClick} className='w-[40px] h-[40px]'/> {/* Modify this line */}
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
