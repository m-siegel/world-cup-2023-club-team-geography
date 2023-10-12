function Style() {
  let style = {};

  style.pageBackgroundColor = "rgb(26, 21, 11)";
  style.pageTextColor = "rgb(255, 234, 195)";
  style.mapBaseColor = "rgb(80, 77, 70";
  style.accentColor1 = "rgb(255, 0, 76)";
  style.accentColor2 = "rgb(0, 234, 255)";
  style.lowPlayerCountColor = "rgb(225, 255, 224)";
  style.highPlayerCountColor = "rgb(0, 255, 0)";
  style.checkboxColor = "rgb(0, 234, 255)";

  style.setRootVariables = function () {
    let root = document.querySelector(":root");
    root.style.setProperty("--pageBackgroundColor", style.pageBackgroundColor);
    root.style.setProperty("--pageTextColor", style.pageTextColor);
    root.style.setProperty("--mapBaseColor", style.mapBaseColor);
    root.style.setProperty("--accentColor1", style.accentColor1);
    root.style.setProperty("--accentColor2", style.accentColor2);
    root.style.setProperty("--lowPlayerCountColor", style.lowPlayerCountColor);
    root.style.setProperty("--highPlayerCountColor", style.highPlayerCountColor);
    root.style.setProperty("--checkboxColor", style.checkboxColor);
  }
  style.setRootVariables();

  return style;
}

export default Style();
