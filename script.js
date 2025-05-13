const ROWS = 10;
const COLS = 10;

const SQUARE_SIDE = 20;

const UP = 'UP'
const DOWN = 'DOWN'
const LEFT = 'LEFT'
const RIGHT = 'RIGHT'

let wormLength = 2;
let wormHead = [8, 4]

let field = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));

field[8][4] = 2
field[9][4] = 1


let direction = UP

let gameOver = false

const getNextPosition = ([rowIdx, colIdx]) => {
    switch (direction) {
        case LEFT:
            return [rowIdx, colIdx - 1]
        case UP:
            return [rowIdx - 1, colIdx]
        case RIGHT:
            return [rowIdx, colIdx + 1]
        case DOWN:
            return [rowIdx + 1, colIdx]
    }
}


const addApple = (field) => {
    console.log('score:' + (wormLength - 2))
    document.querySelector('#score').innerHTML = 'score:' + (wormLength - 2)
    const row = Math.floor(Math.random() * ROWS)
    const col = Math.floor(Math.random() * COLS)

    if (field[row][col] === 0)
        field[row][col] = -1
    else addApple(field)
}

const checkDeath = (row, col) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || field[row][col] > 0) {
        gameOver = true
        renderField()
        return true
    }
}

const moveWorm = () => {
    const [nextRow, nextCol] = getNextPosition(wormHead)
    if (checkDeath(nextRow, nextCol))
        return

    const copyField = JSON.parse(JSON.stringify(field))
    if (field[nextRow][nextCol] === -1) {
        wormLength++
        addApple(copyField)
    }
    else field.forEach((row, rowIdx) => {
        row.forEach((value, colIdx) => {
            if (value > 0)
                copyField[rowIdx][colIdx]--
        })
    })
    copyField[nextRow][nextCol] = wormLength
    wormHead = [nextRow, nextCol]
    field = [...copyField]

    renderField()
}

const createField = () => {
    const documentBody = document.querySelector("body")
    const fieldDiv = document.createElement('div')
    fieldDiv.style.width = `${SQUARE_SIDE * COLS + COLS}px`
    fieldDiv.style.height = `${SQUARE_SIDE * ROWS + ROWS}px`
    fieldDiv.classList.add('field')
    field.forEach((row, rowIdx) => {
        row.forEach((_, colIdx) => {
            const tile = document.createElement("span")
            tile.style.width = `${SQUARE_SIDE}px`
            tile.style.height = `${SQUARE_SIDE}px`
            tile.classList.add('tile')
            tile.id = `${rowIdx}-${colIdx}`
            fieldDiv.appendChild(tile)
        })
    })
    documentBody.appendChild(fieldDiv)
}

const renderField = () => {
    field.forEach((row, rowIdx) => {
        row.forEach((value, colIdx) => {

            const tile = document.getElementById(`${rowIdx}-${colIdx}`)
            if (value === 0)
                tile.classList.remove('head', 'tail', 'apple')

            if (value == wormLength)
                tile.classList.add('head')

            if (value > 0 && value < wormLength)
                tile.classList.add('tail')

            if (value === -1)
                tile.classList.add('apple')

            if (gameOver && value > 0)
                tile.classList.add('apple')

        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    createField()
    addApple(field)
    setInterval(() => {
        !gameOver && moveWorm()
    }, 300)
});

const switchDirection = (e) => {
    switch (e.code) {
        case 'KeyW':
            if (direction !== DOWN)
                direction = UP
            break;
        case 'KeyS':
            if (direction !== UP)
                direction = DOWN
            break;
        case 'KeyA':
            if (direction !== RIGHT)
                direction = LEFT
            break;
        case 'KeyD':
            if (direction !== LEFT)
                direction = RIGHT
            break;
    }
}

document.addEventListener("keypress", switchDirection);

