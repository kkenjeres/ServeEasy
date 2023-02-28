import { useNavigate, useParams } from 'react-router-dom';
import bg from '../src/assets/BG.svg'
import Search from './Search';
function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className=" w-full h-screen top-0 left-0 flex items-center justify-center bg-gray-500 overflow-y-auto font-bold " style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover'}}>
      <div className='h-screen'>
        <h1>Стол #{id}</h1>
        <button onClick={handleBack}>Back</button>
        {/* Вывод информации о столе с id */}
        <Search tableId={id} />
              </div>
    </div>
  );
}

export default TableDetails;
