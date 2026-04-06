let r;

let bumpSlider, thetaSlider, phySlider; //bumpSlider.value控制形状的扭曲程度,thetaSlider.value() 和 phySlider.value() 控制扭曲的频率（不同角度变化的模式）
let bumpiness, thetaValue, phyValue;

let angle = 0;
let zoom = 1;
let zoomDirection = -0.1; // 初始方向（缩小）

function setup() {
  createCanvas(700, 700, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);
  stroke(0, 0, 0);
  strokeWeight(3);
  noFill();

  r = width / 3;

  bumpiness = createDiv();
  bumpSlider = createSlider(0, 1.8, 0.2, 0.01);
  bumpSlider.class("Slider");

  thetaValue = createDiv();
  thetaSlider = createSlider(0, 10, 6, 0.1);
  thetaSlider.class("Slider");

  phyValue = createDiv();
  phySlider = createSlider(0, 10, 5, 0.1);
  phySlider.class("Slider");

  pixelDensity(3);
}

function draw() {
  clear();

  orbitControl(4, 4); //Mouse control

  rotateX(65);

  // rotateX(angle);
  // rotateY(angle *0.8);
  // rotateZ(angle++);

  beginShape(POINTS);
  for (let theta = 0; theta < 180; theta += 2) {
    for (let phy = 0; phy < 360; phy += 2) {
      //改变半径，让它在不同的地方变大或变小，从而形成“鼓起”和“凹陷”的效果。
      //Change the radius to make it bigger or smaller in different places to create “bulges” and “depressions”.
      let r_dynamic =
        r *
        (1 +
          bumpSlider.value() *
            sin(thetaSlider.value() * theta) *
            cos(phySlider.value() * phy));

      let x = r_dynamic * sin(1 * theta) * cos(phy);
      let y = r_dynamic * sin(1 * theta) * sin(phy);
      let z = r_dynamic * cos(1 * theta);

      vertex(x, y, z);
    }
  }
  endShape();

  angle += 0.03;
}
