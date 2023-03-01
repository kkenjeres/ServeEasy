import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '../src/assets/BG.svg';
import Search from './Search';
import Zahlen from './Zahlen';


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
    <div className='w-full h-screen top-0 left-0 flex items-center justify-center bg-gray-500 overflow-y-auto font-bold' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      <div className='h-screen'>
        <h1>Стол #{id}</h1>
        <button onClick={handleBack}>Back</button>
        <Search tableId={id} setTableData={setTableData} />
        <button onClick={handleZahlenClick}>Open</button>
        {showZahlen && <Zahlen tableId={id} setTableData={setTableData} onClose={() => setShowZahlen(false)} />}
      </div>
    </div>
  );
}

export default TableDetails;
