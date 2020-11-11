export const PopularGraph: string = `
query {
	Page(page: 1, perPage: 15) {
  	media(sort:POPULARITY_DESC) {
      id
      idMal
      isAdult
      title{
        romaji
        english
      }
      coverImage{
        extraLarge
      }
    }
  }
}
`;
