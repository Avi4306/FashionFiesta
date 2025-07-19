import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFlip, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Rudra from '../../assets/Rudra.jpg'
// import Avi from '../../assets/Avi.jpg'
import Vishva from '../../assets/Vishva.jpg';
import Manthan from '../../assets/Manthan.jpg';

export default function AboutUs(){
    return(
        <div className='bg-[#faf7f3] p-[4rem] '>
            <h1 className='text-3xl/relaxed text-center font-semibold'>"Fashion Fiesta isn't just an e-commerce platform - it's a celebration of self-expression, creativity, and bold individuality. Our mission? To empower everyone to wear their story with confidence."</h1>
            <h1 className='text-xl/relaxed text-left font-medium pb-2 '>Who we are?</h1>
            <p className='text-lg/relaxed pb-4'>Founded by a team of fashion lovers and tech enthusiasts, Fashion Fiesta was born out of a simple idea: fashion should be fun, inclusive, and accessible. Whether you're into streetwear, minimalism, or traditional crafts — you'll find something that feels like you.</p>
        <div className="flex flex-col justify-center items-center py-10">
            <h1  className='text-xl/relaxed text-left font-medium pb-4'>Meet Our Team</h1>
  <Swiper
    effect={'flip'}
    grabCursor={true}
    pagination={{ clickable: true }}
    loop={true}
    modules={[EffectFlip, Pagination]}
    className="w-[12rem] h-[12rem] sm:w-[16rem] sm:h-[16rem] md:w-[20rem] md:h-[20rem] rounded-xl shadow-lg"
  >
    <SwiperSlide>
      <img
        src={Rudra}
        className="w-full h-full object-cover rounded-xl"
        alt="Avi Patel"
      />
      <p className='text-lg/relaxed py-4 text-center' >Avi Patel</p>
    </SwiperSlide>
    <SwiperSlide>
      <img
        src={Rudra}
        className="w-full h-full object-cover rounded-xl"
        alt="Rudra Trivedi"
      />
      <p className='text-lg/relaxed py-4 text-center' >Rudra Trivedi</p>
    </SwiperSlide>
    <SwiperSlide>
      <img
        src={Vishva}
        className="w-full h-full object-cover rounded-xl"
        alt="Vishva Trivedi"
      />
      <p className='text-lg/relaxed py-4 text-center' >Vishva Trivedi</p>
    </SwiperSlide>
    <SwiperSlide>
      <img
        src={Manthan}
        className="w-full h-full object-cover rounded-xl"
        alt="Manthan Laddha"
      />
      <p className='text-lg/relaxed py-4 text-center' >Manthan Laddha</p>
    </SwiperSlide>
  </Swiper>
</div>

            <h1 className='text-xl/relaxed text-left font-medium pb-2 '>What we offer</h1>
            <ul className='text-lg/relaxed pb-4 list-disc list-inside'>
                <li>Shop curated fashion collections from emerging and established designers</li>
                <li> Explore exclusive designer profiles and their creative journeys</li>
                <li>Discover weekly trends, styling tips, and fashion blogs</li>
                <li>Share and vote for “Outfit of the Week”</li>
            </ul>
            <h1 className='text-xl/relaxed text-left font-medium pb-2 '>Why We're Different</h1>
            <ul className='text-lg/relaxed pb-4 list-disc list-inside'>
                <li>Celebrate independent creators and student designers</li>
                <li>Build a community where fashion meets storytelling</li>
                <li>Embrace sustainability and diversity at every step</li>
            </ul>
            <h1 className='text-3xl/relaxed text-center font-semibold'>Thank You for choosing us!!</h1>
        </div>
    );
};