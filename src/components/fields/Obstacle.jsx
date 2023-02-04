import Field from "./Field";

class Obstacle extends Field {
  constructor(idd, type, action, level, theme, data) {
    super(idd, type, action, level, theme, data);

    this.imgStyleSrc = `./themes/${theme}/maps/map-${level}/block.png`;
  }
}

export default Obstacle;
