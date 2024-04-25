import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetMovieNowPlayingResult, getMovieNowPlaying } from "../api";
import { makeImagePath } from "../utilis";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
  cursor: pointer;
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

//영화 클릭 시 오버레이
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const ClickMovieDetail = styled(motion.div)`
  width: 50vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  position: fixed;
  overflow: hidden;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const ClickMovieCover = styled.div<{ $ClickedBg: string }>`
  border: 1px solid red;
  width: 100%;
  height: 400px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$ClickedBg});
  background-position: center center;
  background-size: cover;
`;

const ClickMovieTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 38px;
  padding: 10px;
  position: relative;
  top: -100px;
`;

const ClickMovieOverview = styled.p`
  padding: 20px;
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
    transition: { delay: 0.3 },
  },
};
const offset = 6;

function Home() {
  const boxMovieMatch = useMatch("/movies/:movieId");
  // console.log(boxMovieMatch);
  const navigate = useNavigate();
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

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovie =
    boxMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id === Number(boxMovieMatch.params.movieId)
    );
  console.log("clickedMovie", clickedMovie);
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
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover="hover"
                      onClick={() => onBoxClicked(movie.id)}
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
          <AnimatePresence>
            {boxMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <ClickMovieDetail layoutId={boxMovieMatch.params.movieId + ""}>
                  {clickedMovie && (
                    <>
                      <ClickMovieCover
                        $ClickedBg={makeImagePath(clickedMovie.backdrop_path)}
                      />
                      <ClickMovieTitle>{clickedMovie.title}</ClickMovieTitle>
                      <ClickMovieOverview>
                        {clickedMovie.overview}
                      </ClickMovieOverview>
                    </>
                  )}
                </ClickMovieDetail>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
