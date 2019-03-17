let socket;
let saveFlock = [];
let flock = [];
let alignSlider, cohesionSlider, separationSlider;
let flag = false;

window.onload = function() {
  socket = io.connect("http://24.16.255.56:8888");
  socket.on("load", function(data) {
    saveFlock = data.data;
    // flock = [];
    for (let i = 0; i < 50; i++) {
      // let boi = new Boid();
      flock[i].position.x = saveFlock[i].position.x;
      flock[i].position.y = saveFlock[i].position.y;

      flock[i].velocity.x = saveFlock[i].velocity.x;
      flock[i].velocity.y = saveFlock[i].velocity.y;

      flock[i].acceleration.x = saveFlock[i].acceleration.x;
      flock[i].acceleration.y = saveFlock[i].acceleration.y;

      // flock.push(boi);

    }
    draw();
    alert("Loading last saved boid state...\n\n\n\nClick OK");
  });
};

function setup() {

  createCanvas(640, 360);

  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);

  var save = createButton("Save State");
  save.position(400, 500);
  save.style("font-size", "15px");
  save.mousePressed(saveState);

  var play = createButton("Pause/Play");
  play.position(150, 500);
  play.style("font-size", "15px");
  play.mousePressed(flip);

  var load = createButton("Load State");
  load.position(550, 500);
  load.style("font-size", "15px");
  load.mousePressed(loadState);

  for (let i = 0; i < 50; i++) {
    flock.push(new Boid());
  }
}
function loadState() {
  if (!flag) {
    alert("Hit Pause button before loading the state!");
  } else {
    socket.emit("load", {
      studentname: "Andrew Kim",
      statename: "andyflocking491"
    });
  }
}

function saveState() {
  if (!flag) {
    alert("Hit Pause button before saving the state!");
  } else {
    console.log(saveFlock);

    saveFlock = [];
    for (let boid of flock) {
      let position = {x: boid.position.x, y: boid.position.y}
      let velocity = {x: boid.velocity.x, y: boid.velocity.y}
      let acceleration = {x: boid.acceleration.x, y: boid.acceleration.y}
      let state = {position: position, velocity: velocity, acceleration: acceleration }
      saveFlock.push(state);
    }
    socket.emit("save", {
      studentname: "Andrew Kim",
      statename: "andyflocking491",
      data: saveFlock
    });

    alert("Saved current flocking state!");
  }
}
function flip() {
  if (!flag) {
    noLoop();
  } else {
    loop();
  }
  flag = !flag;
}

function draw() {
  background(20);

  for (let boid of flock) {

    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}

