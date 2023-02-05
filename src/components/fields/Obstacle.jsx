import Field from "./Field";

class Obstacle extends Field {
  constructor(idd, type, level, theme, data) {
    super(idd, type, level, theme, data);

    this.imgSrc = `./themes/${theme}/maps/map-${level}/block.png`;
  }
}

export default Obstacle;
