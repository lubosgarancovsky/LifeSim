class Settings {

  static settings = {
    game:{
        males: 10,
        females: 10,
        hud: true,
        foodInventoryLimit: 35,
        waterInventoryLimit: 35,
        fertility: 1,
        agingSpeed: 0.2,
        pregnancyMeterSpeed: 8,
        adultAge: 18
    },
    world: {
      tileSize: 32,
      waterDensity: 0.4,
      foodDensity: 0.05,
      foodMaxAmount: 400,
      foodGrowingSpeed: 4
    },
    colors: {
      grass: "#00a613",
      grassStroke: "rgba(45, 176, 16, 0.5)",
      water: "#0f38a8",
      waterStroke: "rgba(7, 61, 240, 0.4)",
      food: "#008504",
      human: "#c99073",
      pregnantHuman: "#c98073",
      maleStroke: "#0062ff",
      femaleStroke: "#ff05e6",
      progressbarBG: "rgb(0, 0, 0, 0.4)",
      progressbarFG: "rgb(0, 0, 0)",
      hudWrapper: "rgba(0, 0, 0, 0.1)"
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
