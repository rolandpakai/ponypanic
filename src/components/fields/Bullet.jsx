import Field from "./Field";

class Bullet extends Field {
  constructor(idd, type, level, data) {
    super(idd, type, level, data);

    this.imgSrc = `bullets/bullet.png`;
  }
}

export default Bullet;
