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
    "width": 5,
    "height": 5,
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
      },
      {
        "id": 2,
        "position": {
          "x": 4,
          "y": 2
        },
        "name": "Strange object 2",
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

//POST /playGameApi/v1/play/approveHeroTurn
//BODY {
//  "action": "MOVE_UP",
//  "heroId": 51931
//}
export const mockApproveHeroTurn = {
  "didTickHappen": true,
  "tickLogs": [],
  "message": "Wow, what a move! Call the play/mapState endpoint to check out what happened on the map!"
}

export const mockMapStateAfterTurn = {
  "message": "Here is the current state of the map. Use the play/approveHeroTurn endpoint to make your Hero do something!",
  "map": {
    "id": 102939,
    "width": 5,
    "height": 5,
    "elapsedTickCount": 1,
    "status": "PLAYING",
    "treasures": [
      {
        "id": 1,
        "position": {
          "x": 3,
          "y": 2
        },
        "name": "Strange object",
        "collectedByHeroId": null
      },
      {
        "id": 2,
        "position": {
          "x": 4,
          "y": 2
        },
        "name": "Strange object 2",
        "collectedByHeroId": null
      }
    ],
    "enemies": [],
    "bullets": [],
    "isGameOver": false
  },
  "heroes": [
    {
      "id": 51931,
      "playerId": 751,
      "position": {
        "x": 1,
        "y": 3
      },
      "health": 1,
      "score": 0
    }
  ]
}

//GET /playGameApi/v1/play/playthroughState
//param: "story-playthrough-token"
export const mockPlaythroughState = {
  "storyTitle": "Adventures of Your Teeny-Weeny Pony",
  "currentLevel": 1,
  "isCurrentLevelFinished": true,
  "currentMapStatus": "WON", // LOST
  "storyLine": "Oh neigh! What is this place? Am I stuck here? Hey, my fellow developer, do you see that treasure? - it might get us out. Help me to reach it by clicking the arrows!"
}