const API_URL = "https://ponypanic.io";

export const apiStoryBegin = async (playerToken) => {
  /*const params = {
    "player-token": "755_I2goWlc7TitRaFhCOigzVkBGJVpCfn1LY1JnZzoqUFBiWzlRZiNQREU=",
  };*/

  const headers = new Headers();
  headers.append('player-token', playerToken);
  
  //headers.append("Access-Control-Allow-Origin", API_URL);
  //headers.append("Access-Control-Allow-Credentials", "true");
  //headers.append("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  //headers.append("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

  const options = {
      method: 'POST',
      headers: headers,
      //body: JSON.stringify( params ) 
  };
  
  return fetch( API_URL + "/playGameApi/v1/story/begin", options )
    .then( response => response.json() )
    .then( response => {
      return response;
  });
}

export const apiMapResource = async (storyPlaythroughToken) => {
  const headers = new Headers();
  headers.append('story-playthrough-token', storyPlaythroughToken);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch( API_URL + "/playGameApi/v1/play/mapResource", options )
    .then( response => response.json() )
    .then( response => {
      return response;
  });
}

export const apiMapState = async (storyPlaythroughToken) => {
  const headers = new Headers();
  headers.append('story-playthrough-token', storyPlaythroughToken);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch( API_URL + "/playGameApi/v1/play/mapState", options )
    .then( response => response.json() )
    .then( response => {
      return response;
  });
}
