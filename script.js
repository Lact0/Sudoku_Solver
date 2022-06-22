window.onresize = changeWindow;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  mainBoard = new Board();
  //setBoard();
  mainBoard.draw();
}

function solve(board) {
  let result = board.update();
  if(!result) {
    return false;
  }
  let min = 10;
  let minInd = [0, 0];
  for(let x = 0; x < 9; x++) {
    for(let y = 0; y < 9; y++) {
      const poss = board.arr[x][y];
      if(poss.length > 1 && poss.length < min) {
        min = poss.length;
        minInd = [x, y];
      }
    }
  }
  //return board;
  if(min != 10) {
    const poss = board.arr[minInd[0]][minInd[1]];
    for(let i = 0; i < poss.length; i++) {
      let newBoard = board.copy();
      newBoard.arr[minInd[0]][minInd[1]] = [poss[i]];
      const res = solve(newBoard);
      if(res) {
        return res;
      }
    }
    return false;
    alert("WHAT JSUT HAPPENDED");
  }
  return board;
}

function setBoard() {
  mainBoard.arr[0][0] = [7];
  mainBoard.arr[0][2] = [5];
  mainBoard.arr[0][4] = [3];
  mainBoard.arr[1][3] = [4];
  mainBoard.arr[1][6] = [9];
  mainBoard.arr[2][0] = [8];
  mainBoard.arr[3][1] = [2];
  mainBoard.arr[3][5] = [1];
  mainBoard.arr[3][6] = [6];
  mainBoard.arr[4][4] = [8];
  mainBoard.arr[4][7] = [7];
  mainBoard.arr[5][1] = [1];
  mainBoard.arr[6][0] = [3];
  mainBoard.arr[6][7] = [5];
  mainBoard.arr[7][3] = [2];
  mainBoard.arr[7][5] = [9];
  mainBoard.arr[8][3] = [6];
  mainBoard.arr[8][6] = [4];
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  unit = parseInt(min(height, width) / 10);
  xStart = parseInt((width - (unit * 9)) / 2);
  yStart = parseInt((height - (unit * 9)) / 2);
  //REDRAW SCREEN
  mainBoard.draw();
  //RESET VARS
  selected = false;
}

function keyPress(key) {
  if(key.keyCode == 32 || key.keyCode == 13) {
    selected = [-1, -1];
    const sol = solve(mainBoard.copy());
    if(sol) {
      mainBoard = sol;
      mainBoard.draw();
    } else {
      alert('NO SOLUTION TO GIVEN PUZZLE');
    }
    return;
  }
  const number = key.keyCode - 48;
  if(number > 9 || number < 0) {
    return;
  }
  if(selected && selected[0] != -1) {
    mainBoard.arr[selected[0]][selected[1]] = [number];
    if(number == 0) {
      mainBoard.arr[selected[0]][selected[1]] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    mainBoard.draw();
  }
}

function leftClick() {
  let x = event.clientX;
  let y = event.clientY;
  x = parseInt((x - xStart) / unit);
  y = parseInt((y - yStart) / unit);
  if(x >= 0 && x < 9 && y >= 0 && y < 9) {
    selected = [x, y];
  }
}
