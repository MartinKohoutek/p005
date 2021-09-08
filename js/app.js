document.addEventListener('DOMContentLoaded', () => {
    
    const startBtn = document.querySelector('button')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('.score-display')    
    const speedDisplay = document.querySelector('.speed-display')    
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let squares = Array.from(grid.querySelectorAll('div'))
    const width = 10
    const height = 20
    let currentPosition = 4     
    let currentIndex = 0
    let timerId
    let score = 0
    let lines =  0
    let currentTime = 1000

    function createBoard() {
        for (let i = 0; i < width*height; i++) {
            const square = document.createElement('div')        
            if ((i >= width*(height-1)) && (i < width*height)) {
                square.setAttribute('class','block3')
            }
            grid.appendChild(square)
            squares.push(square)
        }        
    }

    createBoard()

    //osetreni stisku klaves
    function control(e) {
        if (e.keyCode === 39) {
            moveRight()            
        } else if (e.keyCode === 38)  {
            rotate()
        } else if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)


    //Tetromina
    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2], 
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const l2Tetromino = [
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, 2],
        [1, width+1, width*2+1, width*2+2],
        [width*3, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2 + 1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const z2Tetromino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, l2Tetromino, z2Tetromino]

    //vyber nahodne tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let currentRotation = 0
    let current = theTetrominoes[random][currentRotation]

    //nakresli
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')              
        })
    }

    //smaz kresbu
    function undraw() {
        current.forEach(index => {            
            squares[currentPosition + index].classList.remove('block')            
        })
    }

    //posun tetromino dolu
    function moveDown() {
        undraw()
        currentPosition = currentPosition += width        
        draw()
        freeze()
    }

    //posun doprava a zabran kolizim
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1
        }
        draw()
    }

    //posun doleva a zabran kolizim
    function moveLeft() {        
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1
        }
        draw()
    }

    //rotace Tetromina
    function rotate() {
        undraw()        
        currentRotation++        
        if (currentRotation === current.length) {
            currentRotation = 0
        }   
        //odstraneni nepovolenych rotaci
        if (currentPosition % 10 === 8 && random===0 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 9 && random===0 && currentRotation === 1) currentRotation = 0
        else if (currentPosition % 10 === 8 && random===1 && currentRotation === 1) currentRotation = 0
        else if (currentPosition % 10 === 8 && random===1 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 8 && random===2 && currentRotation === 0) currentRotation = 3
        else if (currentPosition % 10 === 8 && random===2 && currentRotation === 2) currentRotation = 1
        else if (currentPosition % 10 === 9 && random===2 && currentRotation === 2) currentRotation = 1
        else if (currentPosition % 10 === 9 && random===4 && currentRotation === 1) currentRotation = 0
        else if (currentPosition % 10 === 9 && random===4 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 8 && random===4 && currentRotation === 1) currentRotation = 0
        else if (currentPosition % 10 === 8 && random===4 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 7 && random===4 && currentRotation === 1) { currentPosition-- }
        else if (currentPosition % 10 === 7 && random===4 && currentRotation === 3) { currentPosition-- }
        else if (currentPosition % 10 === 8 && random===5 && currentRotation === 1) currentRotation = 0
        else if (currentPosition % 10 === 9 && random===5 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 8 && random===6 && currentRotation === 3) currentRotation = 2
        else if (currentPosition % 10 === 8 && random===6 && currentRotation === 1) currentRotation = 0
            
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //ukaz dalsi tetromino
    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = 0

    const smallTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],                   /* lTetromino */
        [0, displayWidth, displayWidth+1, displayWidth*2+1],        /* zTetromino */
        [1, displayWidth, displayWidth+1, displayWidth+2],          /* tTetromino */
        [0, 1, displayWidth, displayWidth+1],                       /* oTetromino */
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],    /* iTetromino */
        [0, 1, displayWidth+1, displayWidth*2+1],                   /* l2Tetromino */
        [1, displayWidth, displayWidth+1, displayWidth*2]           /* z2Tetromino */
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('block')
        })
        smallTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block')
        })
    }

   //zmrazeni 
   function freeze() {
      if (current.some(index => squares[currentPosition + index + width].classList.contains('block3')
      || squares[currentPosition + index + width].classList.contains('block2'))) {
          current.forEach(index => squares[index + currentPosition].classList.add('block2'))

          random = nextRandom
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          current = theTetrominoes[random][currentRotation]
          currentPosition = 4
          draw()
          displayShape()
          gameOver()
          addScore()
      }
   }

   startBtn.addEventListener('click', () => {        
       if (timerId) {
           clearInterval(timerId)
           timerId = null
       } else {
           draw()
           if (score >= 10) { currentTime = 100 }                              
           timerId = setInterval(moveDown, currentTime/(score+1))           
           nextRandom = Math.floor(Math.random() * theTetrominoes.length)
           displayShape()
       }
   })

   function changeSpeed() {
       draw()
       clearInterval(timerId)
       currentTime-=100
       timerId = setInterval(moveDown, currentTime)
       nextRandom = Math.floor(Math.random() * theTetrominoes.length)
       displayShape()
   }

   //konec hry
   function gameOver() {
       if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
           scoreDisplay.innerHTML = 'konec'
           clearInterval(timerId)
       }
   }
   
   //aktualizuj skore
   function addScore() {
        for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
            const row = [currentIndex, currentIndex+1, currentIndex+2, currentIndex+3, currentIndex+4, currentIndex+5, 
            currentIndex+6, currentIndex+7, currentIndex+8, currentIndex+9]

            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1                
                if(document.getElementById('audio').paused){
                    document.getElementById('audio').play();
                   }
                   else{ 
                    document.getElementById('audio').pause;
                  }
                changeSpeed()
                scoreDisplay.innerHTML = score                
                speedDisplay.innerHTML = 1 + (900 - currentTime)/100              
                row.forEach(index => {
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                })
                
                const squaresRemoved = squares.splice(currentIndex, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
   }
})