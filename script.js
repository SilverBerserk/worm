const rows = 10;
const cols = 10;
let wormLength = 2;
let field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
);

let wormHead = [8, 4]

field[8][4] = 2
field[9][4] = 1

let direction = 'Up'

let gameOver = false

const getNextPosition = ([rowIdx, colIdx]) => {
    switch (direction) {
        case 'Left':
            return [rowIdx, colIdx - 1]
        case 'Up':
            return [rowIdx - 1, colIdx]
        case 'Right':
            return [rowIdx, colIdx + 1]
        case 'Down':
            return [rowIdx + 1, colIdx]
    }
}


const addApple = (field) => {
    console.log('addApple')
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    if (field[row][col] === 0)
        field[row][col] = -1
    else addApple(field)
}

const moveWorm = () => {
    console.log('move', direction, wormLength)
    const [nextRow, nextCol] = getNextPosition(wormHead)
    console.log({ nextRow, nextCol })
    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols || field[nextRow][nextCol]>0)
    {    
        gameOver = true
        renderField()
        return
    }
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

const renderField = () => {
    const documentBody = document.querySelector("body")
    document.querySelector('.field')?.remove()

    const fieldDiv = document.createElement('div')
    fieldDiv.classList.add('field')

    field.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement("div")
            tile.classList.add('tile')

       

            if (value == wormLength)
                tile.classList.add('head')

            if (value > 0 && value < wormLength)
                tile.classList.add('tail')

            if (value === -1)
                tile.classList.add('apple')

            if(gameOver && value > 0)
                tile.classList.add('apple')

            fieldDiv.appendChild(tile)
        })
    })

    documentBody.appendChild(fieldDiv)
    // documentBody.replaceChild(documentBody.querySelector('.field'),fieldDiv)
}

document.addEventListener('DOMContentLoaded', () => {
    addApple(field)
    setInterval(() => {
        !gameOver && moveWorm()
    }, 300)
});

const switchDirection = (e) => {
    switch (e.code) {
        case 'KeyW':
            direction = 'Up'
            break;
        case 'KeyS':
            direction = 'Down'
            break;
        case 'KeyA':
            direction = 'Left'
            break;
        case 'KeyD':
            direction = 'Right'
            break;
    }
}

document.addEventListener("keypress", switchDirection);

