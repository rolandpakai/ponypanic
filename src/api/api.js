const API_URL = "https://ponypanic.io";

export const apiStoryBegin = async (playerToken) => {
  const headers = new Headers();

  headers.append("player-token", playerToken);

  const options = {
    method: "POST",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/story/begin`,
    options
  );

  const data = await response.json();

  return data;
};

export const apiResetLevel = async (storyPlaythroughToken) => {
  const headers = new Headers();

  headers.append("story-playthrough-token", storyPlaythroughToken);

  const options = {
    method: "POST",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/story/resetLevel`,
    options
  );

  const data = await response.json();

  return data;
};

export const apiNextLevel = async (storyPlaythroughToken) => {
  const headers = new Headers();

  headers.append("story-playthrough-token", storyPlaythroughToken);

  const options = {
    method: "POST",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/story/nextLevel`,
    options
  );

  const data = await response.json();

  return data;
};

export const apiMapResource = async (storyPlaythroughToken) => {
  const headers = new Headers();

  headers.append("story-playthrough-token", storyPlaythroughToken);

  const options = {
    method: "GET",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/play/mapResource`,
    options
  );
  const data = await response.json();

  return data;
};

export const apiMapState = async (storyPlaythroughToken) => {
  const headers = new Headers();

  headers.append("story-playthrough-token", storyPlaythroughToken);

  const options = {
    method: "GET",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/play/mapState`,
    options
  );

  const data = await response.json();

  return data;
};

export const apiApproveHeroTurn = async (storyPlaythroughToken, heroTurn) => {
  const { heroId, action } = heroTurn;

  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("story-playthrough-token", storyPlaythroughToken);

  const params = {
    heroId,
    action,
  };

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/play/approveHeroTurn`,
    options
  );

  const data = await response.json();

  return data;
};

export const apiPlaythroughState = async (storyPlaythroughToken) => {
  const headers = new Headers();

  headers.append("story-playthrough-token", storyPlaythroughToken);

  const options = {
    method: "GET",
    headers,
  };

  const response = await fetch(
    `${API_URL}/playGameApi/v1/story/playthroughState`,
    options
  );

  const data = await response.json();

  return data;
};
