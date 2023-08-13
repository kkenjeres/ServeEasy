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
  <div className='w-[80%] m-auto'>
    <ul className='flex gap-4 justify-center text-xl'>
      {slideNames.map((name, index) => (
        <li
          key={index}
          className={`py-2 px-4 rounded ${index === activeIndex ? 'bg-blue-500 text-white' : 'cursor-pointer '}`}
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
