const colors = ['purple', 'yellow', 'orange', 'blue', 'aqua', 'green', 'red'];

class Tetrijs {
  constructor() {    
    this.arena = new Arena();
    this.player = new Player(this.arena);
        
    this.canvas = document.getElementById('tetris');
    this.context = this.canvas.getContext('2d');
    this.context.scale(20, 20);
  
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.lastTime = 0;

    this.addKeyBindings();
  }

  addKeyBindings() {
    document.addEventListener('keydown', event => {
      if (event.keyCode === 37) {
        //left
        //playerMove(-1);
        this.player.move(-1);
      }
      if (event.keyCode === 39) {
        //right
        //playerMove(1);
        this.player.move(1);
      }
      if (event.keyCode === 40) {
        //down
        //playerDrop();
        this.player.drop();
      }
      if (event.keyCode == 81) {
        // q
        //playerRotate(-1);
        this.player.rotate(-1);
      }
      if (event.keyCode == 87) {
        // 1
        //playerRotate(1);
        this.player.rotate(1)
      }
    });
  }

  start() {
    this.player.reset();
    this.updateScore();
    this.update();
  }

  clear() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clear();
    this.drawMatrix(this.arena.matrix, {
      x: 0,
      y: 0
    });
    this.drawMatrix(this.player.matrix, this.player.pos);
  }

  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = colors[value - 1];
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  update(time = 0) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
  
    this.dropCounter += deltaTime;
    if (this.dropCounter >= this.dropInterval) {
      this.player.drop();
      this.dropCounter = 0;
      this.updateScore();
    }
  
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  updateScore() {
    document.getElementById('score').innerText = this.player.score;
  }
}
