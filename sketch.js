let r;
let angle = 0; //Rotation angle
let zoom = 1;

let song, song2, fft, amp;
let playButton, playButton2, liveButton;
let mic;
let liveMode = false;
let hintText;

let bumpiness = 0.2;
let thetaValue = 6;
let phyValue = 5;

function preload() {
  song = loadSound("music1.mp3");
  song2 = loadSound("music2.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);
  strokeWeight(3);
  noFill();

  r = width / 3;

  pixelDensity(3);

  // analyse music
  fft = new p5.FFT();
  amp = new p5.Amplitude();
  mic = new p5.AudioIn();

  playButton = createButton("Play Music1");
  playButton.position(20, 20);
  playButton.mousePressed(startAudio);

  playButton2 = createButton("Play Music2");
  playButton2.position(20, 60);
  playButton2.mousePressed(startAudio2);

  liveButton = createButton("Live Interaction");
  liveButton.position(20, 100);
  liveButton.mousePressed(toggleLive);

  hintText = createDiv("Clap your hands or Sing!");
  hintText.style("position", "fixed");
  hintText.style("top", "60px");
  hintText.style("width", "100%");
  hintText.style("text-align", "center");
  hintText.style("color", "white");
  hintText.style("font-size", "22px");
  hintText.style("pointer-events", "none");
  hintText.hide();
}

function draw() {
  clear();

  // Get audio level — mic in live mode, amplitude otherwise
  let level = liveMode ? mic.getLevel() * 5 : amp.getLevel();

  // Get music information
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // Change color based on frequency
  let hue = map(bass, 0, 255, 0, 360);
  let saturation = map(mid, 0, 255, 80, 100);
  let brightness = map(treble, 0, 255, 80, 100);

  stroke(hue, saturation, brightness);

  //background color
  let bgColor = map(level * 5, 0, 1, 0, 255);
  background(bgColor, bgColor, bgColor);

  // Change shape based on frequency
  bumpiness = map(bass, 0, 255, 0.2, 1.5);
  thetaValue = map(mid, 0, 255, 4, 10);
  phyValue = map(treble, 0, 255, 4, 10);

  //Control the scaling size based on the amplitude
  let zoom = map(level, 0, 1, 0.5, 0.8);
  // zoom = constrain(zoom, 0.2, 1.5);
  zoom = constrain(zoom, 0.2, 1);
  scale(zoom);

  //Rotate based on frequency
  rotateX(angle * map(bass, 0, 255, 0.5, 2));
  rotateY(angle * map(mid, 0, 255, 0.5, 2));
  rotateZ(angle * map(treble, 0, 255, 0.5, 2));

  //Draw shapes
  if (level > 0.2) {
    beginShape(POINTS);
    for (let theta = 0; theta < 180; theta += 2) {
      for (let phy = 0; phy < 360; phy += 2) {
        let r_dynamic =
          r * (1 + bumpiness * tan(thetaValue * theta) * sin(phyValue * phy));
        let x = r_dynamic * sin(theta) * cos(phy);
        let y = r_dynamic * sin(theta) * sin(phy);
        let z = r_dynamic * cos(theta);
        vertex(x, y, z);
      }
    }
    endShape();
  } else {
    beginShape();
    for (let theta = 0; theta < 180; theta += 2) {
      for (let phy = 0; phy < 360; phy += 2) {
        let r_dynamic =
          r * (1 + bumpiness * sin(thetaValue * theta) * cos(phyValue * phy));
        let x = r_dynamic * sin(theta) * cos(phy);
        let y = r_dynamic * sin(theta) * sin(phy);
        let z = r_dynamic * cos(theta);
        vertex(x, y, z);
      }
    }
    endShape();
  }

  angle += 0.8; // change the rotation angle
}

function toggleLive() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  liveMode = !liveMode;

  if (liveMode) {
    song.pause();
    song2.pause();
    playButton.html("Play Music1");
    playButton2.html("Play Music2");
    mic.start();
    liveButton.html("Stop Live");
    hintText.show();
  } else {
    mic.stop();
    fft.setInput();
    amp.setInput();
    liveButton.html("Live Interaction");
    hintText.hide();
  }
}

function startAudio() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  if (!song.isPlaying()) {
    song2.pause();
    playButton2.html("Play Music2");
    if (liveMode) {
      mic.stop();
      fft.setInput();
      amp.setInput();
      liveMode = false;
      liveButton.html("Live Interaction");
      hintText.hide();
    }
    song.play();
    playButton.html("Pause Music1");
  } else {
    song.pause();
    playButton.html("Play Music1");
  }
}

function startAudio2() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  if (!song2.isPlaying()) {
    song.pause();
    playButton.html("Play Music1");
    if (liveMode) {
      mic.stop();
      fft.setInput();
      amp.setInput();
      liveMode = false;
      liveButton.html("Live Interaction");
      hintText.hide();
    }
    song2.play();
    playButton2.html("Pause Music2");
  } else {
    song2.pause();
    playButton2.html("Play Music2");
  }
}
