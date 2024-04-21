export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
// 이미지 https://image.tmdb.org/t/p
// https://image.tmdb.org/t/p/original/ 원본 크기
// https://image.tmdb.org/t/p/w500/ width지정
