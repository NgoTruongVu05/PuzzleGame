let level = {
    easyLevel: {
        row: 9, col: 9, mine: 10
    },
    mediumLevel: {
        row: 16, col: 16, mine: 40
    },
    hardLevel: {
        row: 16, col: 30, mine: 99
    }
}
const mainContent = document.querySelector('.main-content');
let currentId = 'easyLevel';
let currentLevel = level.easyLevel;
let currentSelector = document.getElementById(currentId);
let quantityMineBlock = document.getElementById('quantity');
let firstClickedBlock = null;
let currentArray;
let lastBlocks = null; // Thì quá khứ ...
let quantityMine = null;
let arrayMine = [];

function setGame(id) {
    if (firstClickedBlock) firstClickedBlock = null;
    let selector = document.getElementById(id);
    currentSelector.classList.remove('active');
    selector.classList.add('active');
    currentSelector = selector;
    currentId = id;
    currentLevel = level[id];
    currentArray = new Array(currentLevel.row).fill(0).map(() => new Array(currentLevel.col).fill(0));
    quantityMine = currentLevel.mine;

    renderGame(currentArray,true);
}

function renderGame(currentArray, isLoad = null) {
    mainContent.innerHTML = '';
    if (isLoad){
        mainContent.style.gridTemplateColumns = `repeat(${currentLevel.col}, 1fr)`;
        mainContent.style.gridTemplateRows = `repeat(${currentLevel.row}, 1fr)`;
    }

    for (let i = 0; i < currentLevel.row; i++) {
        for (let j = 0; j < currentLevel.col; j++) {
            let child = document.createElement('div');
            child.classList.add('block');
            child.dataset.x = i;
            child.dataset.y = j;
            if (firstClickedBlock != null && firstClickedBlock.dataset.x == i && firstClickedBlock.dataset.y == j) {
                child.classList.add('clicked');
            }
            if (currentArray[i][j] == -1){
                child.innerHTML = `<span><i class="fas fa-bomb"></i></span>`;
                arrayMine.push(child);
            } else{
                child.innerHTML = `<span>${currentArray[i][j]}</span>`;
            }
            mainContent.appendChild(child);
            if (isLoad){
                child.addEventListener('click', handleClickBlock);
                child.addEventListener('contextmenu', handleRightClickBlock);
            }
        }
    }

    if (isLoad) {
        let blocks = document.querySelectorAll('.block');
        if (lastBlocks != null) {
            lastBlocks.forEach(block => {
                block.removeEventListener('click', handleClickBlock);
                block.removeEventListener('contextmenu', handleRightClickBlock);
            });
        }
        lastBlocks = blocks;
    }

    quantityMineBlock.innerHTML = quantityMine;
}

function loadGame() {
    currentArray = createArray(currentLevel.row, currentLevel.col, currentLevel.mine);
    renderGame(currentArray,true);
}

function createArray(row, col, mine) {
    let newArray = new Array(row).fill(0).map(() => new Array(col).fill(0));
    let count = 0;
    while (count < mine) {
        let x = Math.floor(Math.random() * row);
        let y = Math.floor(Math.random() * col);
        if (newArray[x][y] === 0 && firstClickedBlock.dataset.x != x && firstClickedBlock.dataset.y != y) {
            if (Math.abs(firstClickedBlock.dataset.x - x) > 1 || Math.abs(firstClickedBlock.dataset.y - y) > 1) {
                newArray[x][y] = -1;
                count++;
            }
        }
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (newArray[i][j] === 0) {
                newArray[i][j] = quantityMineBlocksAround(newArray, i, j);
            }
        }
    }
    return newArray;
}

function quantityMineBlocksAround(array, x, y) {
    let mines = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            if (array[x + i] && array[x + i][y + j] === -1) {
                mines++;
            }
        }
    }
    return mines;
}

function handleRightClickBlock(e){
    e.preventDefault();
    block = e.currentTarget;
    value = currentArray[parseInt(block.dataset.x)][parseInt(block.dataset.y)];
    if (block.classList.contains('clicked')) return;
    if (!block.classList.contains('flag')){
        block.classList.add('flag');
        block.classList.add('appear');
        block.innerHTML = `<span><i class="fas fa-flag" style="color: red"></i></span>`;
        quantityMine--;
        quantityMineBlock.innerHTML = quantityMine;
    } else{
        block.classList.remove('flag');
        block.classList.remove('appear');
        block.innerHTML = `<span>${value}</span>`;
        quantityMine++;
        quantityMineBlock.innerHTML = quantityMine;
    }
    if (isWin()) {
        setTimeout(() => {
            alert('Thắng rồi! Bạn thắng là nhờ thằng code game hay đấy bro!!!');
            newGame();
        }, 200);
    }
}

function handleClickBlock(e) {
    block = e.currentTarget;
    tempValue = currentArray[parseInt(block.dataset.x)][parseInt(block.dataset.y)];
    if (tempValue == -1) {
        setTimeout(() => {
            alert('Thua rồi');
            newGame();
        },200);
    } else {
        if (!block.classList.contains('clicked')) {
            block.classList.add('clicked');
            if (tempValue != 0){
                block.classList.add('appear');
            }
            if (firstClickedBlock === null) {
                firstClickedBlock = block;
                loadGame();
            }
        }
        if (tempValue == 0) {
            aroundBlock(block);
        }
    }
    if (isWin()) {
        setTimeout(() => {
            alert('Thắng rồi! Bạn thắng là nhờ thằng code game hay đấy bro!!!');
            newGame();
        }, 200);
    }
}

function aroundBlock(block) {
    let blockArray1D = mainContent.children;
    let x = parseInt(block.dataset.x);
    let y = parseInt(block.dataset.y);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let newX = x + i;
            let newY = y + j;
            if (newX >= 0 && newX < currentLevel.row && newY >= 0 && newY < currentLevel.col) {
                let tempBlock = blockArray1D[newX * currentLevel.col + newY];
                let tempValue = currentArray[newX][newY];
                if (tempBlock && !tempBlock.classList.contains('clicked')) {
                    if (tempValue != '-1'){
                        tempBlock.classList.add('clicked');
                        if (tempValue != 0){
                            tempBlock.classList.add('appear');
                        }
                    }
                    if (tempValue == '0') {
                        aroundBlock(tempBlock);
                    }
                }
            }
        }
    }
}
function isWin(){
    let tempEmploy = 0;
    let tempFlag = 0;
    let blockArray1D = mainContent.children;
    for (let i = 0; i < blockArray1D.length; i++){
        if (blockArray1D[i].classList.contains('clicked')) tempEmploy++;
        if (blockArray1D[i].classList.contains('flag')) tempFlag++;
    }
    return (tempEmploy+tempFlag) == (currentLevel.row*currentLevel.col);
}

function resetGame() {
    let blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        block.classList.remove('clicked');
    });
}


function newGame() {
    setGame(currentId);
}

setGame(currentId);