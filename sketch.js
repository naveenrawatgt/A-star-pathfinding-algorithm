function removeFromArray(arr, ele){
    for (var i = arr.length -1; i >= 0; i--){
        if (arr[i] === ele){
            arr.splice(i, 1);
        };
    };
};

function heuristic(a, b){
    // var d = dist(a.i, a.j, b.i, b.j);
    // var d = abs(a.i - b.i) + abs(a.j + b.j);
    var d = dist(a.i, a.j, b.i, b.j)
    return d;
}

var openSet = [];
var closedSet = [];

var start = 0;
var end = 0;

var rows = 25;
var cols = 25;

var w, h;

var grid = new Array(cols);

var path = [];

function Spot(i, j){
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    
    this.show = function(col){
        fill(col);
        // noStroke(); 
        rect(this.i * w, this.j * h, w - 1, h - 1);
    };

    this.addNeighbors = function(grid){
        var i = this.i;
        var j = this.j;
        if (i < cols - 1){
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0){
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1){
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0){
            this.neighbors.push(grid[i][j - 1]);
        }
        //For diagonals check
        if (i < cols - 1 && j < rows - 1){
            this.neighbors.push(grid[i + 1][j + 1]);
        }
        if (i > 0 && j > 0){
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1){
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols -1 && j > 0){
            this.neighbors.push(grid[i + 1][j - 1]);
        }
    };
} 

function setup(){
    createCanvas(400, 400);
    console.log("A*");
    
    w = width / cols;
    h = height / rows;

    //Making 2-D array for convas.
    for (var i = 0; i < cols; ++i){
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; ++i){
        for (var j = 0; j < rows; ++j){
            grid[i][j] = new Spot(i, j);
        }
    };
    //Add neighbors.
    for (var i = 0; i < cols; ++i){
        for (var j = 0; j < rows; ++j){
            grid[i][j].addNeighbors(grid);
        }
    };
    
    // console.log(grid)
    start = grid[0][0];
    end = grid[cols - 1][3];

    openSet.push(start);

};

function draw() {

    var winner = 0;

    if (openSet.length > 0){
        for (var i=0; i < openSet.length; i++){
            if (openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }
        //We keep going.
    
    var current = openSet[winner];
    if (current === end){
        noLoop();
        console.log("Done!!!");
    };
    
    removeFromArray(openSet, current);

    closedSet.push(current);
    var neighbors = current.neighbors;

    for (var i = 0; i < neighbors.length; i++){
        var neighbor = neighbors[i];
        if (!closedSet.includes(neighbor)){
            var tempG = current.g + 1;
            if (openSet.includes(neighbor)){
                if (tempG < neighbor.g){
                    neighbor.g = tempG;
                }
            }else{
                neighbor.g = tempG;
                openSet.push(neighbor);
            }

            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
        }
    }

    }else{
        //no solution.

    }
    
    background(0)
    
    for (let i = 0; i < cols; ++i){
        for (let j = 0; j < rows; ++j){
            grid[i][j].show(255);
        }
    };

    for (var i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255, 0, 0));
    }
    
    for (var i = 0; i < openSet.length; i++){
        openSet[i].show(color(0, 255, 0));
    }

    //Find the path
    path = []
    var temp = current;
    path.push(temp);
    while (temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }
    for (var i = 0; i < path.length; i++){
        path[i].show(color(0, 0, 255));
    }
};