import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/firebase';
import cafe from '../src/assets/cafe.png';
import logo from '../src/assets/logo.jpg';

const Terrasse = () => {
  const [tableData, setTableData] = useState(
    [
      ...Array.from({ length: 21 }, (_, i) => i + 100).map(id => ({
        id,
        image: cafe,
        tasks: [],
      })),
      {
        id: 500,
        image: cafe,
        tasks:[],
        text:'Getrennt / Zahlen'
      },
    ]
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedTableData = await Promise.all(
          tableData.map(async (table) => {
            const querySnapshot = await getDocs(collection(db, `tables/${table.id}/items`));
            const hasItems = !querySnapshot.empty;
            return {
              ...table,
              color: hasItems ? 'bg-green-500' : 'bg-white',
            };
          })
        );
        setTableData(updatedTableData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (table) => {
    navigate(`/table/${table.id}`);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <img src={logo} alt="Loading logo" />
      </div>
    );
  }

  return (
    <div className='bg-[#21272a]'>
      <div className='gap-2 grid grid-cols-2 md:space-y-0 pt-10 w-[80%] m-auto pb-20 font-bold' >
        {tableData.map((table) => (
          <article
            key={table.id}
            onClick={() => handleClick(table)}
            className={`cursor-pointer cover flex items-center h-[90px] md:items-start md:h-[200px] cursor-pointer rounded-lg ${table.color}`}
          >
            <div className='w-full flex justify-center m-auto'>
              <div className='flex flex-col items-center'>
                <img src={table.image} alt='' className='w-[50px] flex md:w-[100px] py-2' />
                <p className='text-center'>{'Tisch' + ' ' + '#' + table.id}</p>
                {table.text && <p className='text-[10px] text-black bg-yellow-300 px-2 rounded-lg'>{table.text}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Terrasse;
