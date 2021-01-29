var startClicked = false;
var startTimeout;
var gameLoaded = false;

document.querySelector(".js-start").addEventListener("click", function () {
  if (gameLoaded === false) {
    loadGame();
  }
});

function loadGame() {
  var gameWidth = window.innerWidth < 640 ? window.innerWidth : 640;
  var gameHeight = 320;

  document.body.classList.add("easter");

  var overlay = document.createElement("div");
  overlay.classList.add("easter__overlay");
  document.body.appendChild(overlay);

  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", gameWidth);
  canvas.setAttribute("height", gameHeight);
  canvas.classList.add("easter__canvas");
  canvas.style.marginLeft = "-" + gameWidth / 2 + "px";
  document.body.appendChild(canvas);

  var close = document.createElement("button");
  close.innerText = "Close";
  close.classList.add("easter__close");
  close.style.marginRight = "-" + gameWidth / 2 + "px";
  document.body.appendChild(close);

  close.addEventListener("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    closeGame();
  });

  canvas.focus();

  var ctx = canvas.getContext("2d");

  var mouseDown = false;
  var spaceDown = false;

  var initialAscentRate = 1.0;
  var initialDescentRate = 1.5;
  var descentIncrement = 0.1;
  var ascentIncrement = 0.1;
  var maxVelocity = 5;
  var mainFont = "14px monospace";
  var titleFont = "30px 'Press Start 2P'";

  var asteroid = {
    velocity: 6,
    interval: 60,
    width: 42,
    height: 42,
    frames: 20,
    animationDivider: 4,
    image: new Image(),
  };
  asteroid.image.src = "/static/images/asteroid.png";

  var spaceship = {
    width: 136,
    height: 68,
    image: new Image(),
  };
  spaceship.image.src = "/static/images/spaceship.png";

  var background = {
    width: 400,
    height: 200,
    velocity: 3,
    image: new Image(),
  };
  background.image.src = "/static/images/stars.gif";

  var state;

  function setup() {
    resetState();

    setupControls();

    draw();
  }

  function resetState() {
    state = {
      spaceshipX: 50,
      spaceshipY: 126,
      iterationCount: 0,
      asteroidList: [],
      playing: false,
      gameOver: false,
      score: 0,
      scrollVal: 0,
      ascentRate: initialAscentRate,
      descentRate: initialDescentRate,
    };
  }

  function setupControls() {
    canvas.addEventListener("mousedown", function (e) {
      e.stopPropagation();
      e.preventDefault();
      mouseDown = true;
      if (state.gameOver) {
        restartGame();
      }
    });

    canvas.addEventListener("mouseup", function (e) {
      e.stopPropagation();
      e.preventDefault();
      mouseDown = false;
    });

    canvas.addEventListener("touchstart", function (e) {
      e.stopPropagation();
      e.preventDefault();
      mouseDown = true;
      if (state.gameOver) {
        restartGame();
      }
    });

    canvas.addEventListener("touchend", function (e) {
      e.stopPropagation();
      e.preventDefault();
      mouseDown = false;
    });

    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32) {
        e.stopPropagation();
        e.preventDefault();
        spaceDown = true;
        if (state.gameOver) {
          restartGame();
        }
      }
    });

    window.addEventListener("keyup", function (e) {
      if (e.keyCode === 32) {
        e.stopPropagation();
        e.preventDefault();
        spaceDown = false;
      }
    });
  }

  function draw() {
    if (!state.gameOver) {
      clearScreen();
      drawBackground();
      if (!state.playing && !shouldAscend()) {
        drawTitle();
      } else {
        if (!state.playing) {
          state.playing = true;
        }
        drawSpaceship();
        drawAsteroids();
        drawScore();
        collisionCheck();
      }
      window.requestAnimationFrame(draw);
    } else {
      setTimeout(function () {
        state.canRestart = true;
      }, 250);
    }
  }

  function clearScreen() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
  }

  function drawBackground() {
    if (state.scrollVal >= background.width) {
      state.scrollVal = 0;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    state.scrollVal += background.velocity;

    var tiles = Math.ceil((gameWidth + state.scrollVal) / background.width);

    for (var i = 0; i < tiles; i++) {
      ctx.drawImage(
        background.image,
        i * background.width - state.scrollVal,
        0,
        background.width,
        background.height
      );
      ctx.drawImage(
        background.image,
        i * background.width - state.scrollVal,
        200,
        background.width,
        background.height
      );
    }
  }

  function drawSpaceship() {
    if (!state.gameOver) {
      if (shouldAscend()) {
        state.descentRate = initialDescentRate;
        state.spaceshipY -= state.ascentRate;

        if (state.ascentRate < maxVelocity) {
          state.ascentRate += ascentIncrement;
        }
      } else {
        state.ascentRate = initialAscentRate;
        state.spaceshipY += state.descentRate;

        if (state.descentRate < maxVelocity) {
          state.descentRate += descentIncrement;
        }
      }
    }

    ctx.drawImage(
      spaceship.image,
      state.spaceshipX,
      state.spaceshipY,
      spaceship.width,
      spaceship.height
    );
  }

  function drawAsteroids() {
    state.iterationCount++;

    state.asteroidList.forEach(function (thisAsteroid) {
      if (thisAsteroid.x < 0 - asteroid.width) {
        state.asteroidList.shift();
      } else {
        thisAsteroid.x -= asteroid.velocity;

        thisAsteroid.frame = thisAsteroid.frame + 1;

        if (
          thisAsteroid.frame ===
          asteroid.frames * asteroid.animationDivider
        ) {
          thisAsteroid.frame = 0;
        }

        ctx.drawImage(
          asteroid.image,
          Math.floor(thisAsteroid.frame / asteroid.animationDivider) *
            asteroid.width,
          0,
          asteroid.width,
          asteroid.height,
          thisAsteroid.x,
          thisAsteroid.y,
          asteroid.width,
          asteroid.height
        );
      }
    });

    if (state.iterationCount === asteroid.interval) {
      state.iterationCount = 0;
      state.score += 10;

      state.asteroidList.push({
        x: gameWidth,
        y: Math.floor(Math.random() * (gameHeight - asteroid.height)),
        frame: 0,
      });
    }
  }

  function drawScore() {
    ctx.font = mainFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + state.score, 10, 20);
  }

  function drawTitle() {
    ctx.font = titleFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SPACESHIP!", (gameWidth - 290) / 2, 178);

    ctx.font = mainFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Controls:", 10, 270);
    ctx.fillText("Click/tap or press spacebar to ascend", 10, 290);
    ctx.fillText("Ascend to start", 10, 310);
  }

  function shouldAscend() {
    return mouseDown || spaceDown;
  }

  function collisionCheck() {
    if (
      state.spaceshipY < 0 ||
      state.spaceshipY > gameHeight - spaceship.height
    ) {
      return gameOver();
    }

    for (var i = 0; i < state.asteroidList.length; i++) {
      if (
        state.spaceshipX < state.asteroidList[i].x + asteroid.width &&
        state.spaceshipX + spaceship.width > state.asteroidList[i].x &&
        state.spaceshipY < state.asteroidList[i].y + asteroid.height &&
        state.spaceshipY + spaceship.height > state.asteroidList[i].y
      ) {
        gameOver();
        break;
      }
    }
  }

  function gameOver() {
    state.gameOver = true;

    ctx.font = titleFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("GAME OVER", (gameWidth - 267) / 2, 161);
    ctx.font = mainFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Click/tap or press spacebar", (gameWidth - 227) / 2, 176);
    ctx.fillText("to restart", (gameWidth - 83) / 2, 191);
  }

  function restartGame() {
    if (state.canRestart) {
      resetState();
      draw();
    }
  }

  function closeGame() {
    document.body.classList.remove("easter");
    document.body.removeChild(overlay);
    document.body.removeChild(close);
    document.body.removeChild(canvas);
  }

  setup();
}
