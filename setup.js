//Vars
let width = window.innerWidth;
let height = window.innerHeight;
let unit = parseInt(min(height, width) / 10);
let xStart = parseInt((width - (unit * 9)) / 2);
let yStart = parseInt((height - (unit * 9)) / 2);
let selected = false;
let canvas;
let ctx;
let mainBoard;

//Useful Functions
function max(n1, n2) {
  if(n1 > n2) {
    return n1;
  }
  return n2;
}

function min(n1, n2) {
  if(n1 < n2) {
    return n1;
  }
  return n2;
}

function randColor() {
  return 'rgba(' + rand(0,255) + ',' + rand(0,255) + ',' + rand(0,255) + ')';
}

function rand(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + (min);
}
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(rad) {
  return rad / Math.PI * 180;
}

function drawLine(x1, y1, x2, y2, style = white, r = 1) {
  ctx.strokeStyle = style;
  ctx.lineWidth = r;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function equals(arr1, arr2) {
  if(arr1.length != arr2.length) {
    return false;
  }
  for(let i = 0; i < arr1.length; i++) {
    if(arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function copy(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function remove(arr, n) {
  const i = arr.indexOf(n);
  if(i >= 0) {
    arr.splice(i, 1);
    return true;
  }
  return false;
}

//Classes
class Vector {
  constructor(x = 0, y = 0, x0 = 0, y0 = 0) {
    this.x = x - x0;
    this.y = y - y0;
    this.getMag();
  }

  getMag() {
    this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    this.x /= this.mag;
    this.y /= this.mag;
    this.getMag();
  }

  setMag(mag) {
    this.normalize();
    this.x *= mag;
    this.y *= mag;
    this.mag = mag;
  }

  limit(mag) {
    if(this.mag > mag) {
      this.setMag(mag);
    }
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.getMag();
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.getMag();
  }
}

class Board {
  constructor() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.arr = [];
    for(let x = 0; x < 9; x++) {
      const temp = [];
      for(let y = 0; y < 9; y++) {
        temp.push(copy(arr));
      }
      this.arr.push(temp);
    }
  }

  draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    for(let x = 0; x < 9; x++) {
      for(let y = 0; y < 9; y++) {
        const xBeg = xStart + (unit * x);
        const yBeg = yStart + (unit * y);
        ctx.strokeRect(xBeg, yBeg, unit, unit);
      }
    }
    ctx.lineWidth = 5;
    for(let x = 0; x < 3; x++) {
      for(let y = 0; y < 3; y++) {
        const xBeg = xStart + (unit * x * 3);
        const yBeg = yStart + (unit * y * 3);
        ctx.strokeRect(xBeg, yBeg, unit * 3, unit * 3);
      }
    }
    ctx.lineWidth = 1;
    ctx.font = String(parseInt(unit * .9)) + 'pt Courier New';
    for(let x = 0; x < 9; x++) {
      for(let y = 0; y < 9; y++) {
        let num = this.arr[x][y];
        if(num.length != 1) {
          continue;
        }
        num = num[0]
        const text = ctx.measureText(String(num));
        let ht = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
        const xBeg = xStart + (unit * x) + parseInt((unit - text.width) / 2);
        const yBeg = yStart + (unit * y) + unit - ((unit - ht) / 2);
        ctx.strokeText(String(num), xBeg, yBeg);
      }
    }
  }

  copy() {
    const newBoard = new Board();
    newBoard.arr = copy(this.arr);
    return newBoard;
  }

  update() {
    let queue = [];
    for(let x = 0; x < 9; x++) {
      for(let y = 0; y < 9; y++) {
        if(this.arr[x][y].length == 1) {
          queue.push([x, y]);
        }
      }
    }
    while(queue.length > 0) {
      const pos = queue.pop();
      const newArr = this.collapse(pos);
      if(!newArr) {
        return false;
      }
      queue = queue.concat(newArr);
    }
    return true;
  }

  collapse(pos) {
    const n = this.arr[pos[0]][pos[1]][0];
    const ret = [];
    for(let x = 0; x < 9; x++) {
      if(x == pos[0]) {
        continue;
      }
      if(remove(this.arr[x][pos[1]], n) && this.arr[x][pos[1]].length == 1) {
        ret.push([x, pos[1]]);
      }
      if(this.arr[x][pos[1]].length == 0) {
        return false;
      }
    }
    for(let y = 0; y < 9; y++) {
      if(y == pos[1]) {
        continue;
      }
      if(remove(this.arr[pos[0]][y], n) && this.arr[pos[0]][y].length == 1) {
        ret.push([pos[0], y]);
      }
      if(this.arr[pos[0]][y].length == 0) {
        return false;
      }
    }
    let sqInd = [parseInt(pos[0] / 3) * 3, parseInt(pos[1] / 3) * 3];
    for(let x = 0; x < 3; x++) {
      for(let y = 0; y < 3; y++) {
        if(sqInd[0] + x == pos[0] && sqInd[1] + y == pos[1]) {
          continue;
        }

        if(remove(this.arr[sqInd[0] + x][sqInd[1] + y], n) && this.arr[sqInd[0] + x][sqInd[1] + y].length == 1) {
          ret.push([sqInd[0] + x, sqInd[1] + y]);
        }
        if(this.arr[sqInd[0] + x][sqInd[1] + y].length == 0) {
          return false;
        }
      }
    }

    return ret;
  }
}
