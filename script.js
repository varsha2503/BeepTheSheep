const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas size to the same as wrapper
let width = screen.width;
c.canvas.width = 0.60 * width;
c.canvas.height = 0.3375 * width;


//all gameObjects of our game
let starsChecked = 0;
const gravity = 0.25;
let condition = false;
class Player {
  constructor() {
    this.position = {
      x: 50,
      y: 50
    }
    //initial velocity of player
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 30
    this.height = 30
    this.color = 'red'
    this.jumpS = 10
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.velocity.x < 0) {
      this.velocity.x++
    } else if (this.velocity.x > 0) {
      this.velocity.x--
    }
    //using v = u + at of Physics
    //adding after as in 1st timeUnit velocity.y = 0
    //adds an effect of being in the air for a moment
    if (this.position.y + this.height + 5 <= c.canvas.height || this.velocity.y < 0) {//making a ground and 10 is offset
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
  jump() {
    //jump only from ground- no air jump or double jump
    if (this.position.y + this.height + 5 > c.canvas.height) {
      this.velocity.y = -1 * this.jumpS;
    }
    //console.log('jump')
  }
  move(left) {
    if (left == 1) {//move left
      this.velocity.x = -10;
    } else {
      //move right
      this.velocity.x = 10;
    }
  }
}


class Sheep {
  constructor() {
    this.position = {
      x: player.position.x - player.width - 10,
      y: c.canvas.height - 15
    }
    //initial velocity of player
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 30
    this.height = 15
    this.color = 'blue'
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw();
    this.position.x = player.position.x - player.width - 10;
  }
}


// class BossM {
//   constructor() {
//     this.position = {
//       x: 100,
//       y: 100
//     }
//     //initial velocity of player
//     this.velocity = {
//       x: 0,
//       y: 0
//     }
//     this.width = 30
//     this.height = 30
//     this.color = 'red'
//     this.colorHurt = 'orange';
//     this.HurtRadius = 100
//     this.height = c.canvas.height
//   }
//   move() {
//     if (player.position.x > this.position.x) {//player to right of boss
//       this.velocity.x = 2;
//     } else if (player.position.x < this.position.x) {//player to left of boss
//       this.velocity.x = -2;
//     } else {
//       this.velocity.x = 0;
//     }
//   }
//   bigHurt(boss) {//AOE skill of boss
//     c.fillStyle = this.colorHurt
//     c.fillRect(boss.position.x, boss.position.y, this.HurtRadius, c.canvas.height)
//   }
//   update() {
//     this.draw();
//     this.position.x += this.velocity.x;
//     // if (this.velocity.x < 0) {
//     //   this.velocity.x++
//     // } else if (this.velocity.x > 0) {
//     //   this.velocity.x--
//     // }

//     //using v = u + at of Physics
//     //adding after as in 1st timeUnit velocity.y = 0
//     //adds an effect of being in the air for a moment
//     // if (this.position.y + this.height + 5 <= c.canvas.height || this.velocity.y < 0) {//making a ground and 10 is offset
//     //   this.velocity.y += gravity;
//     // } else {
//     //   this.velocity.y = 0;
//     // }

//     //no out of bounds
//     if (this.position.x < this.width) {
//       this.velocity.x *= -1
//     }
//     if (this.position.x > c.canvas.width - this.width) {
//       this.velocity.x *= -1
//     }
//   }
// }

class ForeGround {
  constructor() {

  }
  draw(r) {

    c.fillStyle = "black";
    c.beginPath();
    c.arc(player.position.x, player.position.y, r, 0, 2 * Math.PI);
    c.rect(c.canvas.width, 0, -2 * c.canvas.width + 100, c.canvas.height + 100);
    c.fill();
  }
}

class Platform {
  constructor(w, h, xP, yP) {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.position = {
      x: xP,
      y: yP
    }
    this.width = w
    this.height = h
    this.color = 'black'
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  checkCollision() {
    //the exact moment when next moment the player will cross the platform is hitting condition
    if ((player.position.y + player.height <= this.position.y && player.position.y + player.height + player.velocity.y >= this.position.y) && player.position.x <= this.position.x + this.width && player.position.x + player.width >= this.position.x) {
      if (player.velocity.y < 7)
        player.velocity.y += 2
      else {
        player.velocity.y -= .5
      }
      player.velocity.y *= -1;
      player.jumpS = 30
    } else if (player.position.y + player.height >= this.position.y + this.height && player.position.y + player.height + player.velocity.y <= this.position.y + this.height && player.position.x <= this.position.x + this.width && player.position.x + player.width >= this.position.x) {
      player.velocity.y += 10
      player.velocity.y *= -1;
      player.jumpS = 10
    } else {
      player.jumpS = 10

    }
  }
}

class Star {
  constructor(xP, yP) {
    this.position = {
      x: xP,
      y: yP
    }
    this.width = 10
    this.height = 10
    this.color = 'yellow'
    this.passed = false;
  }

  draw() {
    //console.log('star')
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  checkCollision() {
    if ((player.position.y + player.height <= this.position.y && player.position.y + player.height + player.velocity.y >= this.position.y) && player.position.x <= this.position.x + this.width && player.position.x + player.width >= this.position.x && this.passed != true) {
      this.passed = true;
      starsChecked++;
    }
  }
}
//creating gameObjects instances
const player = new Player()
const sheep = new Sheep()
const platform1 = new Platform(200, 20, 200, 270)
const platform2 = new Platform(100, 20, 450, 160)
const platform3 = new Platform(250, 20, 600, 60)
const platform4 = new Platform(50, 20, 100, 200)
const platform5 = new Platform(100, 20, 600, 242)
const star1 = new Star(platform1.position.x + platform1.width / 2, platform1.position.y - platform1.height - 10)
const star2 = new Star(platform4.position.x + platform4.width / 2, platform4.position.y - platform4.height - 10)
const star3 = new Star(platform3.position.x + platform3.width / 2, platform3.position.y - platform3.height - 10)

const foreG = new ForeGround();
//neat first appearance jump
function playerAppear() {

  c.fillStyle = "#1dd0f0";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //render the platform on starting
  platform1.draw();
  platform2.draw();
  platform3.draw();
  platform4.draw();
  platform5.draw();
  star1.draw();
  star2.draw();
  star3.draw();
  player.jump();
  animatePlayer();
}

//animating the player movement
let foreRadius = 100
function animatePlayer() {
  requestAnimationFrame(animatePlayer);
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (starsChecked == 3) {
    //console.log('win')
    c.fillStyle = "#b00029";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.velocity.y = 10;
  } else {
    c.fillStyle = "#1dd0f0";
    c.fillRect(0, 0, canvas.width, canvas.height);
    platform3.draw();
    sheep.update();
  }
  //update places
  player.update();
  //draw
  platform1.draw();//render the platform on starting
  platform2.draw();
  platform4.draw();
  platform5.draw();

  if (star1.passed != true) {
    star1.draw();
  }
  if (star2.passed != true) {
    star2.draw();
  }
  if (star3.passed != true) {
    star3.draw();
  }
  if (starsChecked == 3) {
    if (foreRadius > 0) {
      foreRadius -= 2
      foreG.draw(foreRadius);
    }
    if (foreRadius == 0 || foreRadius < 0) {
      endScreen();
    }
  } else {
    foreG.draw(foreRadius);
  }

  //check for collison
  platform1.checkCollision();
  platform2.checkCollision();
  platform3.checkCollision();
  platform4.checkCollision();
  platform5.checkCollision();

  star1.checkCollision();
  star2.checkCollision();
  star3.checkCollision();
  //console.log('Player is animating');



}
function endScreen() {
  c.fillStyle = "#black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.font = "30px Arial";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.fillText("Beep.....?", canvas.width / 2, canvas.height / 2);

}
playerAppear();

//Input System
addEventListener('keydown', ({ key }) => {
  //console.log(key)
  //could have used switch using keyCodes 
  //but better readability this way
  if (key == "ArrowUp") {
    player.jump();
  } else if (key == "ArrowLeft") {
    player.move(1);
  } else if (key == "ArrowRight") {
    player.move(0);
  } else {
  }
})
//Input System mobile
let touchstartX = 0
let touchendX = 0

function checkDirection() {
  if (touchendX < touchstartX) player.move(1);
  if (touchendX > touchstartX) player.move(0);

}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenY
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenY
  checkDirection()
})
addEventListener('click', () => {
  player.jump();
})
// addEventListener('click', () => {
//   //special ability one
//   console.log('magic')
// })