import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '../src/assets/BG.svg';
import Search from './Search';
import Zahlen from './Zahlen';
import {IoArrowBackCircleOutline} from 'react-icons/io5'

function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [showZahlen, setShowZahlen] = useState(false);
  
  const handleBack = () => {
    navigate('/');
  };

  const handleZahlenClick = () => {
    setShowZahlen(true);
  };
  const handleCloseZahlen = () => {
    setShowZahlen(false);
  }
  return (
    <div className='w-full h-screen   items-center justify-center bg-gray-500 overflow-y-auto font-bold' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      <button onClick={handleBack}className='text-[40px] mt-2 ml-2'><IoArrowBackCircleOutline /></button>
      
      <div className='h-full w-[90%] m-auto mt-[50px] text-center'>
        <h1 className='mb-[100px] text-[30px]'>Tisch #{id}</h1>
        <Search tableId={id} setTableData={setTableData} />
        <button onClick={handleZahlenClick} className='px-4 py-2 rounded-full bg-black mt-10 text-white w-full'>Zahlen</button>
        {showZahlen && <Zahlen tableId={id} setTableData={setTableData} onClose={() => setShowZahlen(false)} />}
      </div>
    </div>
  );
}

export default TableDetails;
