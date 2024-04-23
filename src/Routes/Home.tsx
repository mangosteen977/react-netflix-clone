import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetMovieNowPlayingResult, getMovieNowPlaying } from "../api";
import { makeImagePath } from "../utilis";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 23px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 70px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const BoxInfo = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: relative;
  bottom: -100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: { x: 0 },
  exit: { x: -window.outerWidth },
};

const BoxVariants = {
  normal: { scale: 1, type: "tween" },
  hover: {
    scale: 1.3,
    y: -50,
    type: "tween",
    transition: { delay: 0.3 },
  },
};

const boxInfoVariants = {
  hover: {
    opacity: 1,
  },
};
const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMovieNowPlayingResult>(
    ["movies", "nowPlaying"],
    getMovieNowPlaying
  );
  // console.log(data);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              {/*
              onExitComplete : AnimatePresence의 props, exit이 종료시 동작 
              initial : false일 경우, 웹페이지 처음 로딩 시, 하위 객체의 initial 동작을 실행하지 않음.
              */}
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover="hover"
                      initial="normal"
                      $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <BoxInfo variants={boxInfoVariants}>
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
