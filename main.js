const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")
const gameOver = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart-button");
const nextButton = document.querySelector(".next-button");

const tileCount = 16;

let tiles = [];
const dragged = {
    el: null,
    class: null,
    index: null,
}
let isPlaying = false;
let timeInterval = null;
let time = 60;
let currentImageNumber = 1;

// functions
function checkStatus() {
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
    if(unMatchedList.length === 0) {
        gameOver.style.display = "flex";
        gameText.innerText = "성공";
        gameText.classList.remove("fail");
        isPlaying = false;
        clearInterval(timeInterval)
    }
}

function setGame() {
    isPlaying = true;
    time = 60;
    container.innerHTML = "";
    gameOver.style.display = 'none';
    clearInterval(timeInterval)

    tiles = createImageTiles(currentImageNumber);
    tiles.forEach(tile => container.appendChild(tile))
    setTimeout(() => {
        container.innerHTML = "";
        shuffle(tiles).forEach(tile => container.appendChild(tile))
        timeInterval = setInterval(() => {
            playTime.innerText = time;
            if (time > 0) {
                time--;
            } else {
                gameOver.style.display = "flex";
                gameText.innerText = "실패";
                gameText.classList.add("fail");
                isPlaying = false;
                clearInterval(timeInterval)
            }
        },1000)
    }, 3000)
}

function createImageTiles(imageNumber){
    const tempArray = [];
    Array(tileCount).fill().forEach( (_, i) => { 
        const li = document.createElement("li");
        li.setAttribute('data-index', i)
        li.setAttribute('draggable', 'true');
        li.classList.add(`list${i}`);
        li.style.backgroundImage = `url(./images/img${imageNumber}.png)`;
        tempArray.push(li)
    })
    return tempArray
}

function shuffle(array) {
    let index = array.length -1;
    while(index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--;
    }
    return array;
}

function restartGame() {
    setGame();
}

function nextGame() {
    currentImageNumber = (currentImageNumber % 6) + 1;
    setGame();
}

// events
container.addEventListener('dragstart', e => {
    if(!isPlaying) return;
    const obj = e.target
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj)
})
container.addEventListener('dragover', e => {
    e.preventDefault()
})
container.addEventListener('drop', e => {
    if(!isPlaying) return;
    const obj = e.target;
    if(obj.className !== dragged.class) {
        let originPlace;
        let isLast = false;

        if(dragged.el.nextSibling) {
            originPlace = dragged.el.nextSibling
        } else {
            originPlace = dragged.el.previousSibling
            isLast = true
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj)
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
        isLast ? originPlace.after(obj) : originPlace.before(obj)
    }
    checkStatus();
})

startButton.addEventListener('click', () => {
    setGame()
})

restartButton.addEventListener('click', restartGame);
nextButton.addEventListener('click', nextGame);