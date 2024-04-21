const API_KEY = "ff275318efb8d910f3629ae9eb61a692";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
/*
adult: false
backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"
genre_ids: (2) [878, 12]
id: 693134
original_language: "en"
original_title: "Dune: Part Two"
overview: "황제의 모략으로 멸문한 가문의 유일한 후계자 폴. 어머니 레이디 제시카와 간신히 목숨만 부지한 채 사막으로 도망친다. 그곳에서 만난 반란군들과 숨어 지내다 그들과 함께 황제의 모든 것을 파괴할 전투를 준비한다. 한편 반란군들의 기세가 높아질수록 불안해진 황제와 귀족 가문은 잔혹한 암살자 페이드 로타를 보내 반란군을 몰살하려 하는데…"
popularity: 2461.439
poster_path: "/8uUU2pxm6IYZw8UgnKJyx7Dqwu9.jpg"
release_date: "2024-02-27"
title: "듄: 파트 2"
video: false
vote_average: 8.284
vote_count: 3108 
*/

export interface IGetMovieNowPlayingResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovieNowPlaying() {
  return fetch(
    `${BASE_PATH}movie/now_playing?language=ko-kr&page=1&api_key=${API_KEY}`
  ).then((response) => response.json());
}
