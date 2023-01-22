//POST /playGameApi/v1/story/begin
// param: "player-token":

export const mockStoryBegin = {
  "storyPlaythroughId": 686,
  "storyPlaythroughToken": "686_I2J8eykySCo0QW8mNEVWVGkqWDxKZ2xEZSleZypCJGtzPilKIiRwKkM=",
  "message": "Well done! Now use the play/mapResource endpoint to get resources of your first map and solve it",
  "playthroughState": {
    "storyTitle": "Adventures of Your Teeny-Weeny Pony",
    "currentLevel": 1,
    "isCurrentLevelFinished": false,
    "currentMapStatus": "CREATED",
    "storyLine": "Oh neigh! What is this place? Am I stuck here? Hey, my fellow developer, do you see that treasure? - it might get us out. Help me to reach it by clicking the arrows!"
  }
}

//GET /playGameApi/v1/play/mapResource
//param: "story-playthrough-token"
export const mockMapResource = {
  "message": "Here are the immutable resources belonging to the map. They'll stay the same while you play this map so you should not call this endpoint anymore. Go on, get the current mutable state of your map by the play/mapState endpoint!",
  "mapId": 102936,
  "compressedObstacles": {
    "coordinateMap": {
      "1": [1],
      "2": [1,2]
    }
  }
}

//GET /playGameApi/v1/play/mapState
//param: "story-playthrough-token"
export const mockMapState = {
  "message": "Here is the current state of the map. Use the play/approveHeroTurn endpoint to make your Hero do something!",
  "map": {
    "id": 102932,
    "width": 10,
    "height": 10,
    "elapsedTickCount": 0,
    "status": "CREATED",
    "treasures": [
      {
        "id": 1,
        "position": {
          "x": 3,
          "y": 2
        },
        "name": "Strange object",
        "collectedByHeroId": null
      }
    ],
    "enemies": [],
    "bullets": [],
    "isGameOver": false
  },
  "heroes": [
    {
      "id": 51924,
      "playerId": 746,
      "position": {
        "x": 1,
        "y": 2
      },
      "health": 1,
      "score": 0
    }
  ]
}