const secretLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const winningMessage = `Click <a href= '${secretLink}'>here</a> to claim your reward`;
const winningRewardElement = document.querySelector('[data-winning-reward');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

//Initialization
const GUIBoardsCells = {
    player: document.querySelectorAll('.player [data-cell]'),
    cpu: document.querySelectorAll('.cpu [data-cell]')
}

const restartButtons = document.querySelectorAll('.restart-button')

let boards = {
    player: new Board(),
    cpu: new Board()
}

let cpuPlayer = new cpuBrain();

startGame();

function resetGame(){
    for(key in boards){
        boards[key] = new Board();
    }
    cpuPlayer = new cpuBrain();
    resetGUIBoards();
    resetCSS();
    placeGUIShips();
    setupEventListeners();
}

function startGame() {
    for (let button of restartButtons){
        button.addEventListener("click", resetGame);
    }
    restartButtons[1].addEventListener("click", () => {
        winningMessageElement.classList.remove("show");
        winningRewardElement.innerHTML = "";
    });
    putNumberData();
    resetGUIBoards();
    placeGUIShips();
    setupEventListeners();
}

function setupEventListeners(){
    GUIBoardsCells.cpu.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function resetGUIBoards(){
    for(let key in boards){
        for (let i = 0; i < 100; i++) {
            GUIBoardsCells[key][i].setAttribute("data-cell", "");
            GUIBoardsCells[key][i].classList.remove("mark", "sunk");
        }
    }
}

function putNumberData(){
    for (let i = 0; i < 100; i++) {
        GUIBoardsCells.cpu[i].setAttribute("data-number", i);
    }
}

//changing
function placeGUIShips() {
    for(let shipId in boards.player.shipPositions){
        let positions = boards.player.shipPositions[shipId];
        positions.forEach(pos => {
            let index = transformReverse(pos, 10);
            GUIBoardsCells.player[index].setAttribute("data-cell", shipId);
        });
        changeCSS(positions, "player");
    }
}

function transformCoordinates(index, gridSide) {
    let x = Math.floor(index / gridSide);
    let y = index - x * gridSide;
    return [x, y];
}

function transformReverse([x, y], gridSide) {
    return x * gridSide + y;
}

//---------------

function handleClick(event) {
    //player's turn
    let cell = event.target;
    placeMarkCpu(cell);
    if (boards.cpu.checkWin()) displayMessage("You Won!!!", true);

    //cpu's turn
    let move = cpuPlayer.play();
    let i = transformReverse(move, 10);
    cell = GUIBoardsCells.player[i];
    let positions = placeMarkPlayer(cell, "player");
    if (positions !== null) cpuPlayer.update(positions);
    if (boards.player.checkWin()) displayMessage("You Lost...");
}

function displayMessage(message, reward = false){
    winningMessageTextElement.innerText = message;
    if(reward) winningRewardElement.innerHTML = winningMessage;
    winningMessageElement.classList.add('show');
}

function placeMarkPlayer(cell) {
    cell.classList.add("mark");
    let shipId = cell.getAttribute('data-cell');
    if (shipId === "") return null;
    return updateBoard("player", shipId);
}

function placeMarkCpu(cell){
    cell.classList.add("mark");
    let cellIndex = cell.getAttribute('data-number');
    let [x,y] = transformCoordinates(cellIndex, 10);
    let shipId = boards.cpu.board[x][y];
    if (shipId === ""){
        cell.setAttribute("data-cell", "");
        return null;
    }
    cell.setAttribute("data-cell", "ship");
    updateBoard("cpu", shipId);
}

function updateBoard(boardName, shipId){
    boards[boardName].decrementShipCount(shipId);
    if (boards[boardName].checkSunk(shipId)) {
        return sinkShipGUI(shipId, boardName);
    }
    return true;
}

function sinkShipGUI(shipId, boardName) {
    let positions = boards[boardName].shipPositions[shipId];
    positions.forEach(position => {
        let cellIndex = transformReverse(position, 10);
        GUIBoardsCells[boardName][cellIndex].classList.add("sunk");
    });
    if (boardName === "cpu") changeCSS(positions, "cpu");
    return positions;
}

// this function is not used
function darkenRGB(rgb, amount) {
    let colors = rgb.split(",");
    for(let i in colors){
        colors[i] = Math.floor(parseInt(colors[i], 10)*amount);
        if(!colors[i]) colors[i] = 0;
    }
    return `rgb(${colors[0]},${colors[1]},${colors[2]})`;
}

function changeCSS(shipPositions, boardName){
    let style = "5px solid black";
    if(shipPositions[0][0] === shipPositions[1][0]){
        changeCSSAux(shipPositions, "horizontal", boardName, style)
    } 
    else {
        changeCSSAux(shipPositions, "vertical", boardName, style)
    }
}

function changeCSSAux(shipPositions, direction, boardName, style){
    if (direction === "horizontal"){
        direction = ["borderTop", "borderBottom", "borderLeft", "borderRight"];
    } else {
        direction = ["borderLeft", "borderRight", "borderTop", "borderBottom"];
    }
    for(let i in shipPositions){
        let index = transformReverse(shipPositions[i], 10);
        GUIBoardsCells[boardName][index].style[direction[0]] = style;
        GUIBoardsCells[boardName][index].style[direction[1]] = style;
        if(i == 0) GUIBoardsCells[boardName][index].style[direction[2]] = style;
        if(i == shipPositions.length - 1) GUIBoardsCells[boardName][index].style[direction[3]] = style;
    }
}

function resetCSS(){
    for (key in boards) {
        for (let i = 0; i < 100; i++) {
            GUIBoardsCells[key][i].style.border = "1px solid black";
        }
        for (let i = 0; i < 10; i++){
            GUIBoardsCells[key][i].style.borderTop = "2px solid black";
            GUIBoardsCells[key][10*i].style.borderLeft = "2px solid black";
            GUIBoardsCells[key][10*i + 9].style.borderRight = "2px solid black";
            GUIBoardsCells[key][i + 90].style.borderBottom = "2px solid black";
        }
    }
}