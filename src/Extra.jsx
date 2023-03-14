import React from 'react';

const Extra = ({ itemId, onExtraItemSelected }) => {
  const extraItem = [
    { id: 1, text: "Ananas", price: 1 },
    { id: 2, text: "Olivie", price: 2 },
  ];

  const handleExtraItemSelected = (extra) => {
    onExtraItemSelected(itemId, extra);
  };

  return (
    <div className='bg-gray-200'>
      <ul>
        {extraItem.map((item) => (
          <li className='w-full flex justify-between px-20 border-b border-black py-6' key={item.id}>
            {item.text} : {item.price}€
            <button onClick={() => handleExtraItemSelected(item)}>+</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Extra;
