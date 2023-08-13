import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import Table from './Table';
import Terrasse from './Terrasse';
import UserAuth from './UserAuth';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleSwiperChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const components = [<Table />, <Terrasse />]; // Список компонентов
  const slideNames = ['Restaurant', 'Terrasse']; // Список названий слайдов

  const handleItemClick = (index) => {
    swiperRef.current.swiper.slideTo(index);
  };

  return (
    <div>
        <UserAuth/>
        <div className='bg-gray-100 pt-20'>
        <div className='w-[90%] m-auto bg-white rounded-[40px]'>
    <ul className='flex justify-center text-xl'>
      {slideNames.map((name, index) => (
        <li
          key={index}
          className={`
            py-2 
            w-full  
            text-center 
            ${index === activeIndex ? 'bg-black text-white' : 'cursor-pointer'}
            ${index === 0 ? 'rounded-l-[40px]' : 'border-l border-black'}  // Apply left border for all items except the first
            ${index === slideNames.length - 1 ? 'rounded-r-[40px]' : 'border-r border-black'}  // Apply right border for all items except the last
          `}
          onClick={() => handleItemClick(index)}
        >
          {name}
        </li>
      ))}
    </ul>
</div>



</div>

      <Swiper
        ref={swiperRef}
        onSlideChange={handleSwiperChange}
        spaceBetween={0}
        slidesPerView={1}
        autoHeight={true} // Добавьте эту строку
        >
        {components.map((component, index) => (
          <SwiperSlide key={index}>
            {component}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;
