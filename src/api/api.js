const API_URL = "https://ponypanic.io";

export const apiStoryBegin = async (playerToken) => {
  const headers = new Headers();
  headers.append('player-token', playerToken);

  const options = {
      method: 'POST',
      headers: headers,
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

export const apiApproveHeroTurn = async (heroTurn) => {
  const { storyPlaythroughToken, heroId, action } = heroTurn;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('story-playthrough-token', storyPlaythroughToken);

  const params = {
    heroId,
    action
  };

  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify( params ) 
  };

  return fetch( API_URL + "/playGameApi/v1/play/approveHeroTurn", options )
    .then( response => response.json() )
    .then( response => {
      return response;
  });
}


export const apiPlaythroughState = async (storyPlaythroughToken) => {
  const headers = new Headers();
  headers.append('story-playthrough-token', storyPlaythroughToken);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch( API_URL + "/playGameApi/v1/story/playthroughState", options )
    .then( response => response.json() )
    .then( response => {
      return response;
  });
}
