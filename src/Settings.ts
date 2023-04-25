class Settings {

  static settings = {
    game:{
        males: 5,
        females: 5,
        foodInventoryLimit: 35,
        waterInventoryLimit: 35,
        fertility: 1
    },
    world: {
      tileSize: 32,
      waterDensity: 0.4,
      foodDensity: 0.05,
      foodMaxAmount: 100
    },
    colors: {
      grass: "#00a613",
      grassStroke: "rgba(45, 176, 16, 0.5)",
      water: "#0f38a8",
      waterStroke: "rgba(7, 61, 240, 0.4)",
      food: "#008504",
      human: "#c99073",
      maleStroke: "#0062ff",
      femaleStroke: "#ff05e6",
      progressbarBG: "rgb(0, 0, 0, 0.4)",
      progressbarFG: "rgb(0, 0, 0)",
    },
    debug: {
      viewRange: false,
      path: false,
      resources: false,
      resourceAmount: false,
      resourceItem: false,
    },
  };
}

export default Settings;
