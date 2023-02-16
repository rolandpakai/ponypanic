class Field {
  constructor(idd, type, level, data) {
    this.idd = idd;
    this.level = level;
    this.type = type;
    this.data = data;

    this.popover = false;
    this.popoverContent = "";
  }

  getImgSrc() {
    return this.imgSrc;
  }

  getPopoverContent() {
    return this.popoverContent;
  }

  hasPopover() {
    return this.popover;
  }
}

export default Field;
