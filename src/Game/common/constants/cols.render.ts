import { ROWS, TILE_INCREMENT } from "./cols.constants";


const getAppDimensions = () => {
  const appElement = document.getElementById("app");
  if (appElement) {
    return {
      width: appElement.clientWidth,
      height: appElement.clientHeight,
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const SCREEN = {
  WIDTH: 0,
  HEIGHT: 0,
  TILE_SIZE: 0,

  updateDimensions() {
    const dimensions = getAppDimensions();
    this.WIDTH = dimensions.width;
    this.HEIGHT = dimensions.width;
    this.TILE_SIZE = Math.floor(dimensions.width / (ROWS - 2) + TILE_INCREMENT);
  },
};
