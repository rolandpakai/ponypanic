import Field from "./Field";

class Bullet extends Field {
  constructor(idd, type, action, level, theme, data) {
    super(idd, type, action, level, theme, data);

    this.imgStyleSrc = `./themes/${theme}/bullets/bullet.png`;
  }
}

export default Bullet;
