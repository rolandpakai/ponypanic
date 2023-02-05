import Field from "./Field";

class Obstacle extends Field {
  constructor(idd, type, level, data) {
    super(idd, type, level, data);

    this.imgSrc = `maps/map-${level}/block.png`;
  }
}

export default Obstacle;
