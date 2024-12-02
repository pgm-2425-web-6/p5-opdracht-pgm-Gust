let stars = [];
let rockets = [];
let moonX;
let moonY;
let moonGlowAlpha = 150;
let moonGlowDirection = 1;
let moonSize = 150;
let rocketImage;

function preload() {
  rocketImage = loadImage('assets/img/spaceship.svg');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('backgroundCanvas');
  noCursor();
  document.body.style.overflow = 'hidden';

  moonX = width * 0.1;
  moonY = height * 0.2;

  for (let i = 0; i < 2; i++) {
    rockets.push(createRocket());
  }

  for (let i = 0; i < 10; i++) {
    stars.push({
      x: random(width),
      y: random(-height, 0),
      speedX: random(-2, 2),
      speedY: random(2, 5),
      size: random(3, 6),
      originalSize: random(3, 6),
      hoverEffect: false,
      originalSpeedX: random(-2, 2),
      originalSpeedY: random(2, 5),
    });
  }
}

function draw() {
  background(0, 20); 

  drawMoon();

  for (let i = rockets.length - 1; i >= 0; i--) {
    moveRocket(rockets[i]);
    drawRocket(rockets[i]);
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    let star = stars[i];

    star.x += star.speedX;
    star.y += star.speedY;

    let d = dist(mouseX, mouseY, star.x, star.y);
    
    if (d < 50) {
      let angle = atan2(mouseY - star.y, mouseX - star.x);
      let moveSpeed = 0.5;
      star.speedX += cos(angle) * moveSpeed;
      star.speedY += sin(angle) * moveSpeed;
    } else {
      star.speedX = star.originalSpeedX;
      star.speedY = star.originalSpeedY;
    }

    fill(255, 255, 255, 200); 
    ellipse(star.x, star.y, star.size, star.size);

    if (star.x < 0 || star.x > width) {
      star.speedX = -star.speedX;
    }

    if (star.y > height) {
      stars.splice(i, 1);
      stars.push({
        x: random(width),
        y: random(-height, 0),
        speedX: random(-2, 2),
        speedY: random(2, 5),
        size: random(3, 6),
        originalSize: random(3, 6),
        hoverEffect: false,
        originalSpeedX: random(-2, 2),
        originalSpeedY: random(2, 5),
      });
    }
  }
}

function drawMoon() {
  moonX += 0.3;

  if (moonX > width * 0.2 || moonX < width * 0.05) {
    moonGlowDirection *= -1;
  }

  moonGlowAlpha += moonGlowDirection;

  if (moonGlowAlpha > 200 || moonGlowAlpha < 130) {
    moonGlowDirection *= -1;
  }

  fill(0, 0, 0, 50);
  noStroke();
  ellipse(moonX + 10, moonY + 10, moonSize + 20, moonSize + 20);

  fill(255, 255, 255, moonGlowAlpha);
  noStroke();
  ellipse(moonX, moonY, moonSize, moonSize);

  fill(255);
  ellipse(moonX, moonY, moonSize - 20, moonSize - 20);

  let gradient = drawingContext.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonSize / 2);
  gradient.addColorStop(0, color(255, 255, 255));
  gradient.addColorStop(1, color(180, 180, 180));
  drawingContext.fillStyle = gradient;
  ellipse(moonX, moonY, moonSize, moonSize);
}

function createRocket() {
  return {
    x: random(width),
    y: random(height),
    speedX: random(-2, 2),
    speedY: random(-1, 1),
    size: 50,
  };
}

function moveRocket(rocket) {
  rocket.x += rocket.speedX;
  rocket.y += rocket.speedY;

  if (rocket.x > width || rocket.x < 0) {
    rocket.speedX *= -1;
  }
  if (rocket.y > height || rocket.y < 0) {
    rocket.speedY *= -1;
  }
}

function drawRocket(rocket) {
  imageMode(CENTER);
  image(rocketImage, rocket.x, rocket.y, rocket.size, rocket.size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
