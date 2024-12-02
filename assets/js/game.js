let spaceship;
let obstacles = [];
let score = 0;
let gameOver = false;
let spaceshipImage, obstacleImages = [], backgroundImg;
let gameStarted = false;

class Spaceship {
  constructor() {
    this.size = width * 0.1;
    this.x = width / 2 - this.size / 2;
    this.y = height - this.size - 20;
    this.speed = width * 0.005;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }

    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    image(spaceshipImage, this.x, this.y, this.size, this.size);
  }
}

class Obstacle {
  constructor() {
    this.x = random(width);
    this.y = -random(50, 150);
    this.size = random(width * 0.05, width * 0.1);
    this.speed = random(3, 6);
    this.image = random(obstacleImages);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    image(this.image, this.x, this.y, this.size, this.size);
  }

  offScreen() {
    return this.y > height + this.size;
  }

  hits(spaceship) {
    let d = dist(this.x, this.y, spaceship.x + spaceship.size / 2, spaceship.y + spaceship.size / 2);
    return d < (this.size / 2 + spaceship.size / 2);
  }
}

function preload() {
  spaceshipImage = loadImage('assets/img/spaceship_player.svg');
  obstacleImages.push(loadImage('assets/img/asteroid.svg'));
  obstacleImages.push(loadImage('assets/img/asteroid-2.svg'));
  backgroundImg = loadImage('assets/img/space.png');
}

function setup() {
  const container = document.querySelector('.game-container');
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.id('gameCanvas');
  canvas.parent(container);
  
  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', startGame);
}

function startGame() {
  gameStarted = true;
  spaceship = new Spaceship();
  
  document.getElementById('instructions').style.display = 'none';
  document.querySelector('.game-container').style.display = 'block';
}

function draw() {
  if (!gameStarted) return;

  if (gameOver) {
    displayGameOver();
    return;
  }

  background(0);
  image(backgroundImg, 0, 0, width, height);

  spaceship.update();
  spaceship.show();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].hits(spaceship)) {
      gameOver = true;
    }

    if (obstacles[i].offScreen()) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  if (frameCount % 30 === 0) {
    obstacles.push(new Obstacle());
  }

  document.getElementById('score').innerText = score;
}

function keyPressed() {
  if (gameOver && keyCode === 32) {
    resetGame();
  }
}

function displayGameOver() {
  const gameOverMessage = document.getElementById('gameOverMessage');
  const gameOverScore = document.getElementById('gameOverScore');
  
  gameOverMessage.classList.add('show');
  gameOverScore.innerText = `Score: ${score}`;
}

function resetGame() {
  gameOver = false;
  obstacles = [];
  score = 0;
  spaceship = new Spaceship();
  
  const gameOverMessage = document.getElementById('gameOverMessage');
  gameOverMessage.classList.remove('show');
}
