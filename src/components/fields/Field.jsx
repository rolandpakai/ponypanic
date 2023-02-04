class Field {
  constructor(idd, type, action, level, theme, data) {
    this.idd = idd;
    this.action = action;
    this.level = level;
    this.type = type;
    this.theme = theme;
    this.data = data;

    this.popover = false;
  }

  getImgStyleSrc() {
    return this.imgStyleSrc;
  }

  getPopoverContent() {
    return this.popoverContent;
  }

  hasPopover() {
    return this.popover;
  }
}

export default Field;
