const ships = [
    {name: "S1", qtd: 1, length: 5},
    {name: "S2", qtd: 2, length: 4},
    {name: "S3", qtd: 3, length: 3},
    {name: "S4", qtd: 4, length: 2},
]

class Board {
    constructor(side = 10){
        this.side = side;
        this.board = [];
        this.shipPositions = {};
        this.shipCount = {};

        // depends on global const ships
        this.getShipPositions();
        this.makeBoard();
        this.initializeShipCount();
    }

    randomNumber(number){
        return Math.floor(Math.random()*number);
    }

    compareArrays(arr1, arr2){
        if( (arr1[0] === arr2[0]) && (arr1[1] === arr2[1]) ) return true;
        return false;
    }

    placeShipOfType(shipLength, shipId, down = true){
        let [x, y] = [this.randomNumber(this.side), this.randomNumber(this.side)];
        let newShipPositions = [];
        let newPosition;
        for(let i = 0; i < shipLength; i++){
            if(down){
                if (x + i > this.side - 1) return false;
                newPosition = [x + i, y]
            } else {
                if (y + i > this.side - 1) return false;
                newPosition = [x, y + i]
            }
            for (let shipName in this.shipPositions){
                let isThereColision = this.shipPositions[shipName].some(position => {
                    return this.compareArrays(newPosition, position);
                });
                if(isThereColision) return false;
            }
            newShipPositions.push(newPosition);
        }
        this.shipPositions[shipId] = newShipPositions;
        return true;
    }

    getShipPositions(){
        let shipNumber = 0;
        for(let shipType of ships){
            for(let qtdShips = shipType.qtd; qtdShips > 0; qtdShips--){
                shipNumber++;
                let shipId = `S${shipNumber}`;
                //try to place ship. Maximum number of tries is 100.
                for(let i = 0; i < 100; i++){
                    let upOrDown = (Math.random() > 0.5);
                    if ( this.placeShipOfType(shipType.length, shipId, upOrDown) ) break;
                }
            }
        }
    }

    makeBoard(){
        for(let i = 0; i < this.side; i++){
            this.board.push((new Array(this.side)).fill(""));
        }
        for(let shipId in this.shipPositions){
            this.shipPositions[shipId].forEach(pos => {
                let x = pos[0];
                let y = pos[1];
                this.board[x][y] = shipId;
            });
        }
    }

    initializeShipCount(){
        for (let shipId in this.shipPositions){
            this.shipCount[shipId] = this.shipPositions[shipId].length;
        }
    }

    checkWin(){
        let total = 0;
        for (let shipId in this.shipCount){
            total += this.shipCount[shipId];
        }
        return total === 0;
    }

    decrementShipCount(shipId){
        this.shipCount[shipId]--;
    }

    checkSunk(shipId){
        return this.shipCount[shipId] === 0;
    }
}