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
let quantityBlock = document.getElementById('quantity');
let firstClickedBlock = null;
let currentArray;
let lastBlocks = null; // Thì quá khứ ...

function setGame(id) {
    if (firstClickedBlock) firstClickedBlock = null;
    let selector = document.getElementById(id);
    currentSelector.classList.remove('active');
    selector.classList.add('active');
    currentSelector = selector;
    currentId = id;
    currentLevel = level[id];
    currentArray = new Array(currentLevel.row).fill(0).map(() => new Array(currentLevel.col).fill(0))

    renderGame(currentArray,true);
}

function renderGame(currentArray, isLoad) {
    mainContent.innerHTML = '';
    mainContent.style.gridTemplateColumns = `repeat(${currentLevel.col}, 1fr)`;
    mainContent.style.gridTemplateRows = `repeat(${currentLevel.row}, 1fr)`;

    for (let i = 0; i < currentLevel.row; i++) {
        for (let j = 0; j < currentLevel.col; j++) {
            let child = document.createElement('div');
            child.classList.add('block');
            child.dataset.x = i;
            child.dataset.y = j;
            if (firstClickedBlock != null && firstClickedBlock.dataset.x == i && firstClickedBlock.dataset.y == j) {
                child.classList.add('clicked');
            }
            child.innerHTML = `<span>${currentArray[i][j]}</span>`;
            mainContent.appendChild(child);
            if (isLoad) child.addEventListener('click', handleClickBlock)
        }
    }

    if (isLoad) {
        let blocks = document.querySelectorAll('.block');
        if (lastBlocks != null) {
            lastBlocks.forEach(block => {
                block.removeEventListener('click', handleClickBlock);
            });
        }
        lastBlocks = blocks;
    } else{

    }

    quantityBlock.innerHTML = currentLevel.mine;
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
                newArray[i][j] = quantityMinesAround(newArray, i, j);
            }
        }
    }
    console.log(newArray)
    return newArray;
}

function quantityMinesAround(array, x, y) {
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

function handleClickBlock(e) {
    block = e.currentTarget;
    if (block.textContent == -1) {
        alert('Thua rồi');
        newGame();
    } else {
        if (!block.classList.contains('clicked')) {
            block.classList.add('clicked');
            if (firstClickedBlock === null) {
                firstClickedBlock = block;
                loadGame();
            }
        }
        // if (block.textContent == 0) {
        //     aroundBlock(block);
        // }
    }
}

// function aroundBlock(currentArray,block) {
//     let blockArray1D = mainContent.children;
//     for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//             if (i === 0 && j === 0) continue;
//             if (array[x + i] && array[x + i][y + j] !== -1) {
//                 if (array[x + i][y + j] === 0) {
//                     aroundBlock(block);
//                 }
//                 blockArray1D[(x + i) * currentLevel.col + y + j].classList.add('clicked');
//             }
//         }
//     }
// }

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