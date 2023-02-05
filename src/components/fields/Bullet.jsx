import Field from "./Field";

class Bullet extends Field {
  constructor(idd, type, level, theme, data) {
    super(idd, type, level, theme, data);

    this.imgSrc = `./themes/${theme}/bullets/bullet.png`;
  }
}

export default Bullet;
