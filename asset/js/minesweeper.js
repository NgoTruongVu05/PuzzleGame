let level = {
    easyLevel: {
        row: 9,col: 9,mine: 10
    },
    mediumLevel: {
        row: 16,col: 16,mine: 40
    },
    hardLevel: {
        row: 16,col: 30,mine: 99
    }
}
const mainContent = document.querySelector('.main-content');
let idDefault = 'easyLevel';
let currentLevel = level.easyLevel;
let selectorDefault = document.getElementById(idDefault);
let quantityBlock = document.getElementById('quantity');

function setGame(id){
    let selector = document.getElementById(id);
    selectorDefault.classList.remove('active');
    selector.classList.add('active');
    selectorDefault = selector;
    currentLevel = level[id];

    renderGame();
}

function renderGame(){
    mainContent.innerHTML = '';
    mainContent.style.gridTemplateColumns = `repeat(${currentLevel.col}, 1fr)`;
    mainContent.style.gridTemplateRows = `repeat(${currentLevel.row}, 1fr)`;
    let currentArray = Array.from({ length: currentLevel.row }, () => Array(currentLevel.col).fill(0));
    for (let i = 0; i < currentLevel.row; i++) {
        for (let j = 0; j < currentLevel.col; j++) {
            let child = document.createElement('div');
            child.classList.add('block');
            child.innerHTML = `<span></span>`;
            mainContent.appendChild(child);
            child.addEventListener('click',handleClickBlock)
        }
    }

    quantityBlock.innerHTML = currentLevel.mine;
}

function handleClickBlock(e){
    block = e.target;
    if (!block.classList.contains('clicked')) {
        block.classList.add('clicked');
    }
}

function resetGame(){
    let blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        block.classList.remove('clicked');
    });
}

setGame(idDefault);