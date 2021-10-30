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