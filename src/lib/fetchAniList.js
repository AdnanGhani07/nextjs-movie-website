export async function fetchAniListData(id) {
    const query = `
      query ($id: Int) {
        Media(idMal: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          streamingEpisodes {
            title
            thumbnail
            url
            site
          }
        }
      }
    `;
  
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } }),
    });
  
    const json = await response.json();
    return json.data?.Media;
  }
  