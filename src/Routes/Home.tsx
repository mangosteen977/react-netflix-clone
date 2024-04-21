import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetMovieNowPlayingResult, getMovieNowPlaying } from "../api";
import { makeImagePath } from "../utilis";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMovieNowPlayingResult>(
    ["movies", "nowPlaying"],
    getMovieNowPlaying
  );
  console.log(data);
  // 이미지 https://image.tmdb.org/t/p
  // https://image.tmdb.org/t/p/original/ 원본 크기
  // https://image.tmdb.org/t/p/w500/ width지정
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
