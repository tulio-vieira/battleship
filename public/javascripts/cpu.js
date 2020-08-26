const combinations = {
    up: [-1,0],
    down: [1,0],
    left: [0,-1],
    right: [0,1]
}

class Node{
    constructor(coordX, coordY, sense){
        this.position = [coordX, coordY];
        this.sense = sense;
    }
}

class cpuBrain{
    constructor(boardSide = 10){
        this.boardSide = boardSide;
        this.attemptsToMakeStack = [];
        this.attemptsMade = [];
        this.attemptsAvailable = this.makeCheckerBoard();
        this.intactShipPositions = [];
        this.lastPlay;
    }

    //public------------------------------------------------------------------------------------------

    // returns a position to play
    play(){
        if(this.isStackEmpty()){
            let move = this.getRandomPosition(); //random position already updates attempts made and available
            this.lastPlay = new Node(...move, "up");
            return move;
        }
        this.lastPlay = this.attemptsToMakeStack.pop();
        let move = this.lastPlay.position;
        let index = this.isItemInArray(this.attemptsAvailable, move);
        if (index) this.attemptsAvailable.splice(index,1);
        this.attemptsMade.push(move);
        return move;
    }

    //update is only made if a ship is hit
    //gets information: coordinates of hit in a 2-dimensional array (multiple if ship is destroyed)
    update(hitPos = []){
        if (hitPos.length > 1) return this.updateDestroyed(hitPos);
        this.addToStack();
        this.intactShipPositions.push(this.lastPlay.position);
    }

    //private-----------------------------------------------------------------------------------------
    updateDestroyed(destroyedShipPositions){
        this.decrementIntactShipPositions(destroyedShipPositions);
        let indexes = [];
        for(let i in this.attemptsToMakeStack){
            let attemptToMakePos = this.attemptsToMakeStack[i].position;
            let isCloseToDestroyedShip = destroyedShipPositions.some(position => {
                return this.isCloseTo(attemptToMakePos, position);
            });
            let isCloseToIntactShip = this.intactShipPositions.some(position => {
                return this.isCloseTo(attemptToMakePos, position);
            });            
            if((isCloseToDestroyedShip) && (!isCloseToIntactShip)){
                indexes.push(i);
            }
        }
        for(let i = (indexes.length - 1); i > -1; i--){
            this.attemptsToMakeStack.splice(indexes[i], 1);
        }
    }

    isStackEmpty(){
        return this.attemptsToMakeStack.length === 0;
    }

    getRandomPosition(){
        if(this.attemptsAvailable.length === 0) return false;
        let index = this.randomNumber(this.attemptsAvailable.length);
        let randomPosition = this.attemptsAvailable.splice(index,1)[0];
        this.attemptsMade.push(randomPosition);
        return randomPosition;
    }

    decrementIntactShipPositions(destroyedShipPositions){
        let indexes = [];
        for(let index in this.intactShipPositions){
            for(let destroyedPos of destroyedShipPositions){
                if (this.compareArrays(this.intactShipPositions[index], destroyedPos)){
                    indexes.push(index);
                }
            }
        }
        for(let i = indexes.length - 1; i > -1; i--){
            this.intactShipPositions.splice(indexes[i], 1);
        }
    }

    isCloseTo(arr1, arr2){
        if((arr1[0] === arr2[0]) || (arr1[1] === arr2[1]) ) return true;
        return false;
    }

    randomNumber(number){
        return Math.floor(Math.random()*number);
    }

    makeCheckerBoard(){
        let checkerBoard = [];
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 10; y++){
                if(!((x+y)%2)) checkerBoard.push([x,y]);
            }
        }
        return checkerBoard;
    }

    compareArrays(arr1, arr2){
        if( (arr1[0] === arr2[0]) && (arr1[1] === arr2[1]) ) return true;
        return false;
    }

    addToStack(){
        let temp = this.attemptsToMakeStack.pop();
        let nodeSense = this.lastPlay.sense;
        let [targetX, targetY] = this.lastPlay.position;
        if((nodeSense === "up") || (nodeSense === "down") ){
            this.addInDirection(targetX, targetY, "horizontal");
        } else {
            this.addInDirection(targetX, targetY, "vertical");
        }
        if (temp) this.attemptsToMakeStack.push(temp);
        for(let i of [-1, 1]){
            let X = targetX + combinations[nodeSense][0]*i;
            let Y = targetY + combinations[nodeSense][1]*i;
            this.addNode(X,Y,nodeSense);
        }
    }

    addNode(X,Y,sense){
        //verify X,Y
        for(let coord of [X,Y]){
            if (coord >= this.boardSide) return false;
            if (coord < 0) return false;
        }
        for (let position of this.attemptsMade){
            if (this.compareArrays(position, [X,Y])) return false;
        }
        for (let node of this.attemptsToMakeStack){
            if (this.compareArrays(node.position, [X,Y])) return false;
        }
        //adding node
        this.attemptsToMakeStack.push(new Node(X, Y, sense));
        return true;
    }

    addInDirection(targetX, targetY, direction){
        let senses = ["left", "right"];
        if (direction === "vertical") senses = ["up", "down"];
        for(let sense of senses){
            let X = targetX + combinations[sense][0];
            let Y = targetY + combinations[sense][1];
            this.addNode(X,Y,sense);
        }
    }

    showStack(state){
        let arr = [];
        this.attemptsToMakeStack.forEach(node =>{
            arr.push(node.position);
        });
        console.log(state);
        console.log(arr);
    }

    isItemInArray(twodArray, item) {
        for (let i = 0; i < twodArray.length; i++) {
            if(this.compareArrays(twodArray[i], item)) return i;
        }
        return false;
    }
}