class Event {
    constructor() {
      this.listeners = [];
    }
  
    addListener(listener) {
      this.listeners.push(listener);
    }
  
    trigger(params) {
      this.listeners.forEach(listener => { listener(params); });
    }
}


class Model{
    constructor() {
        this.board = Array(49).fill()
        this.currentPlayer = 'red';
        this.finished = false;
    
        this.updateCellEvent = new Event();
        this.victoryEvent = new Event();
        this.drawEvent = new Event();
      }
    
      play(move) {
        if (this.finished || move < 0 || move > 48 || this.board[move]) { return false;}

        while (!this.board[move] && move < 42 && !this.board[move + 7]) {
            if (!this.board[move + 7]) move += 7;
        }
        console.log(this.board)
    
        this.board[move] = this.currentPlayer;
        this.updateCellEvent.trigger({ move, player: this.currentPlayer });
    
        this.finished = this.victory() || this.draw();
    
        if (!this.finished) { this.switchPlayer(); }
    
        return true;
      }
    
      victory() {
          const lines = [
              //TODO: winning lines
          ]        
    
        const victory = lines.some(l => this.board[l[0]]
          && this.board[l[0]] === this.board[l[1]]
          && this.board[l[1]] === this.board[l[2]]
);
    
        if (victory) {
          this.victoryEvent.trigger(this.currentPlayer);
        }
    
        return victory;
      }
    
      draw() {
        const draw = this.board.every(i => i);
    
        if (draw) {
          this.drawEvent.trigger();
        }
    
        return draw;
      }
    
      switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
      }
}

class View {
    constructor() {
      this.playEvent = new Event();
    }
  
    render() {
      const board = document.createElement('div');
      board.className = 'board';
  
      this.cells = Array(49).fill().map((_, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
  
        cell.addEventListener('click', () => {
          this.playEvent.trigger(i);
        });
  
        board.appendChild(cell);
  
        return cell;
      });
  
      this.message = document.createElement('div');
      this.message.className = 'message';
  
      document.body.appendChild(board);
      document.body.appendChild(this.message);
    }
  
    updateCell(data) {
      this.cells[data.move].style.backgroundColor = data.player;
      this.cells[data.move].style.borderRadius = "50%";
    }
  
    victory(winner) {
      this.message.innerHTML = `${winner} wins!`;
      this.message.style.backgroundColor = winner
    }
  
    draw() {
      this.message.innerHTML = "It's a draw!";
    }
}


class Controller {
    constructor() {
      this.model = new Model();
      this.view = new View();
  
      this.view.playEvent.addListener(move => { this.model.play(move); });
  
      this.model.updateCellEvent.addListener(data => { this.view.updateCell(data); });
      this.model.victoryEvent.addListener(winner => { this.view.victory(winner); });
      this.model.drawEvent.addListener(() => { this.view.draw(); });
    }
  
    run() {
      this.view.render();
    }
}


const app = new Controller();

app.run();