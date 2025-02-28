const minOption = 3;
const maxOption = 7;
const defaultLevel = 3;
let select = document.getElementById("levelSelect");
for (let i = minOption; i <= maxOption; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} x ${i}`;
    if (i == defaultLevel) {
        option.selected = true;
    }
    select.appendChild(option);
}

document.getElementById("levelSelect").addEventListener("change", function () {
    setTimeout(() => this.blur(), 100);
});

const mainContent = document.querySelector('.main-content');
var count = 0;
var quantity = document.getElementById("quantity");
var quantityCard = document.getElementById("quantityCard");

setGame(defaultLevel);

function setGame(level) {
    count = 0;
    quantity.textContent = count;
    let temp = 0;
    let arrayCurrent = Array.from({ length: level }, () => Array(level).fill(0));
    let array = [];
    let emptyIndex = {};
    for (let i = 1; i < level * level; i++) {
        array.push(i);
    }
    array.push(0);
    for (let i = 0; i < level; i++) {
        for (let j = 0; j < level; j++) {
            arrayCurrent[i][j] = array[temp];
            temp++;
            if (arrayCurrent[i][j] == 0) {
                emptyIndex.row = i;
                emptyIndex.column = j;
            }
        }
    }
    arrayCurrent = randomGame(arrayCurrent, emptyIndex, level);
    renderGame(arrayCurrent, level);
    moveBlock(arrayCurrent, emptyIndex, level);
}

function randomGame(arrayCurrent, emptyIndex, level) {
    const MAX = 1000;
    for (let i = 0; i < MAX; i++) {
        let randomInt = getRandomInt(1, 4);
        switch (randomInt) {
            case 1:
                if (emptyIndex.row + 1 < level) {
                    [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row + 1][emptyIndex.column]] =
                        [arrayCurrent[emptyIndex.row + 1][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                    emptyIndex.row++;
                }
                break;
            case 2:
                if (emptyIndex.row - 1 >= 0) {
                    [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row - 1][emptyIndex.column]] =
                        [arrayCurrent[emptyIndex.row - 1][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                    emptyIndex.row--;
                }
                break;
            case 3:
                if (emptyIndex.column + 1 < level) {
                    [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column + 1]] =
                        [arrayCurrent[emptyIndex.row][emptyIndex.column + 1], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                    emptyIndex.column++;
                }
                break;
            case 4:
                if (emptyIndex.column - 1 >= 0) {
                    [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column - 1]] =
                        [arrayCurrent[emptyIndex.row][emptyIndex.column - 1], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                    emptyIndex.column--;
                }
                break;
        }
    }
    return arrayCurrent;
}

function renderGame(arrayCurrent, level) {
    mainContent.innerHTML = '';
    for (let i = 0; i < level; i++) {
        for (let j = 0; j < level; j++) {
            if (arrayCurrent[i][j] == 0) {
                let child = document.createElement("div");
                child.className = "block non m-1 align-content-center border border-dark rounded-2 bg-info";
                child.textContent = `${arrayCurrent[i][j]}`;
                mainContent.appendChild(child);
            } else {
                let child = document.createElement("div");
                child.className = "block m-1 align-content-center border border-dark rounded-2 bg-info";
                child.textContent = `${arrayCurrent[i][j]}`;
                mainContent.appendChild(child);
            }
        }
        mainContent.appendChild(document.createElement("br"));
    }
}

function moveBlock(arrayCurrent, emptyIndex, level) {
    document.removeEventListener("keydown", function (event) {
        move(arrayCurrent, emptyIndex, level, event);
    });
    document.addEventListener("keydown", function (event) {
        move(arrayCurrent, emptyIndex, level, event);
    });
}
function move(arrayCurrent, emptyIndex, level, event) {
    switch (event.key) {
        case "ArrowUp":
            if (emptyIndex.row + 1 < level) {
                [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row + 1][emptyIndex.column]] =
                    [arrayCurrent[emptyIndex.row + 1][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                emptyIndex.row++;
                count++;
                quantity.textContent = count;
            }
            break;
        case "ArrowDown":
            if (emptyIndex.row - 1 >= 0) {
                [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row - 1][emptyIndex.column]] =
                    [arrayCurrent[emptyIndex.row - 1][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                emptyIndex.row--;
                count++;
                quantity.textContent = count;
            }
            break;
        case "ArrowLeft":
            if (emptyIndex.column + 1 < level) {
                [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column + 1]] =
                    [arrayCurrent[emptyIndex.row][emptyIndex.column + 1], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                emptyIndex.column++;
                count++;
                quantity.textContent = count;
            }
            break;
        case "ArrowRight":
            if (emptyIndex.column - 1 >= 0) {
                [arrayCurrent[emptyIndex.row][emptyIndex.column], arrayCurrent[emptyIndex.row][emptyIndex.column - 1]] =
                    [arrayCurrent[emptyIndex.row][emptyIndex.column - 1], arrayCurrent[emptyIndex.row][emptyIndex.column]];
                emptyIndex.column--;
                count++;
                quantity.textContent = count;
            }
            break;
    }
    renderGame(arrayCurrent, level);
    isWin(arrayCurrent, emptyIndex, level);
}

function isWin(arrayCurrent, emptyIndex, level) {
    if (mainContent.textContent != "") {
        temp = 1;
        flag = true;
        for (let i = 0; i < level; i++) {
            for (let j = 0; j < level; j++) {
                if (i == j && i == level - 1) continue;
                if (arrayCurrent[i][j] != temp) flag = false;
                temp++;
            }
        }
        if (flag) {
            let modal = new bootstrap.Modal(document.getElementById("modalWin"));
            modal.show();
            var btnAgree = document.getElementById('btnAgree');
            var btnDismiss = document.getElementById('btnDismiss');

            btnAgree.onclick = () => {
                arrayCurrent = randomGame(arrayCurrent, emptyIndex, level);
                renderGame(arrayCurrent, level);
                count = 0;
                quantity.textContent = count;
                modal.hide();
            };
            btnDismiss.onclick = () => {
                window.location.href = "../index.html";
            };
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
