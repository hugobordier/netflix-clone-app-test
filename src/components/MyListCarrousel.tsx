import Movie from '../types/movie';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

type MyListCarrouselProps = {
  MovieList: Movie[];
};

const MyListCarrousel = ({ MovieList }: MyListCarrouselProps) => {
  return (
    <div className="w-full my-6">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView="auto"
        navigation
        scrollbar={{ draggable: true }}
        className="h-full"
      >
        {MovieList.map((movie) => (
          <SwiperSlide key={movie.movieId} className="w-1/6">
            <div className="relative h-full">
              <img
                className="object-cover w-auto h-full rounded-lg pointer-events-none"
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MyListCarrousel;
