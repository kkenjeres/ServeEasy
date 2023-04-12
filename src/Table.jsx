import { React, useState, useEffect } from 'react';
import tableImg from '../src/assets/tableImg.svg';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db, onAuthStateChanged, signOut } from '../src/firebase';
import bg from '../src/assets/BG.svg'
import logo from '../src/assets/logo.jpg'
import {FiLogOut} from 'react-icons/fi'

const Table = () => {
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const [tableData, setTableData] = useState(
    [
      {
        id: 1,
        image: tableImg,
        tasks:[]
      },
      {
        id: 2,
        image: tableImg,
        tasks:[]
      },
      {
        id: 3,
        image: tableImg,
        tasks:[]
      },
      {
        id: 4,
        image: tableImg,
        tasks:[]
      },
      {
        id: 5,
        image: tableImg,
        tasks:[]
      },
      {
        id: 6,
        image: tableImg,
        tasks:[]
      },
      {
        id: 7,
        image: tableImg,
        tasks:[]
      },
      {
        id: 8,
        image: tableImg,
        tasks:[]
      },
      {
        id: 9,
        image: tableImg,
        tasks:[]
      },
      {
        id: 10,
        image: tableImg,
        tasks:[]
      },
      {
        id: 11,
        image: tableImg,
        tasks:[]
      },
      {
        id: 12,
        image: tableImg,
        tasks:[]
      },
      {
        id: 13,
        image: tableImg,
        tasks:[]
      },
      {
        id: 14,
        image: tableImg,
        tasks:[]
      },
      {
        id: 15,
        image: tableImg,
        tasks:[]
      },
      {
        id: 16,
        image: tableImg,
        tasks:[]
      },
      {
        id: 17,
        image: tableImg,
        tasks:[]
      },
      {
        id: 18,
        image: tableImg,
        tasks:[]
      },
      {
        id: 19,
        image: tableImg,
        tasks:[]
      },
      {
        id: 20,
        image: tableImg,
        tasks:[]
      },
      {
        id: 21,
        image: tableImg,
        tasks:[]
      },
      {
        id: 22,
        image: tableImg,
        tasks:[]
      },
      {
        id: 23,
        image: tableImg,
        tasks:[]
      },
      {
        id: 24,
        image: tableImg,
        tasks:[]
      },
      {
        id: 25,
        image: tableImg,
        tasks:[]
      },
      {
        id: 50,
        image: tableImg,
        tasks:[],
        text:'Getrennt / Zahlen'
      },
    ]);
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
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  
  return (
    <div className='bg-[#edf5ff]'>
      <div className="text-left pt-5 font-bold flex justify-between px-2 items-center">
        <div className='flex flex-col'>
          <span>Hallo 👋</span>
          <span>{userEmail ? ` ${userEmail}` : 'Not logged in'}</span>
        </div>
      
        {userEmail && (
      <div className="text-center ">
        <button
          onClick={handleSignOut}
          className=" text-black rounded text-[26px]"
        >
          <FiLogOut />
        </button>
      </div>
    )}
    </div>
      <div className='gap-2 grid grid-cols-2 md:space-y-0 pt-20 w-[80%] m-auto pb-20 font-bold' >
        {tableData.map((table) => (
          <article
            key={table.id}
            onClick={() => handleClick(table)}
            className={`cursor-pointer cover flex items-center h-[90px] md:items-start md:h-[200px] cursor-pointer rounded-lg ${table.color}`}
          >
            <div className='w-full flex justify-center m-auto'>
              <div className='flex flex-col items-center'>
                <img src={table.image} alt='' className='w-[50px] flex md:w-[100px]' />
                <p className='text-center'>{'Tisch' + ' ' + '#' + table.id}</p>
                <p className='text-[10px] text-black bg-yellow-300 px-2 rounded-lg'>{table.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};

export default Table;
