class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
}

//funzionalita' di hover e click per la tabella
let cells = document.querySelectorAll("td");
cells.forEach(function(cell) {
    cell.addEventListener("mouseover", function() {
        if (cell.style.backgroundImage == "none") {
            cell.style.backgroundImage = "url(textures/selection.png)"
        }
    });

    cell.addEventListener("mouseout", function() {
        if (cell.style.backgroundImage == "url(textures/selection.png)") {
            cell.style.backgroundImage = "none"
        }
    })

    cell.addEventListener("click", function() {
        cellClick(cell)
    })
})

//localstorage
let wins = localStorage.getItem("wins")
let boardMatrix = localStorage.getItem("board")
let playerTurn = localStorage.getItem("turn")
if (wins == null || boardMatrix == null || playerTurn == null) {
    //stats
    wins = [0, 0]
    localStorage.setItem("wins", JSON.stringify(wins))
    //matrix
    boardMatrix = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1]
    ]
    localStorage.setItem("board", JSON.stringify(boardMatrix))
    //turn
    playerTurn = 0
    localStorage.setItem("turn", JSON.stringify(playerTurn))
} else {
    //stats
    wins = JSON.parse(wins)
    //matrix
    boardMatrix = JSON.parse(boardMatrix)
    cells.forEach(function(targetCell) {
        let position = new Vector(parseInt(targetCell.getAttribute("row")), parseInt(targetCell.getAttribute("col")))

        if (getCell(position) == 0) {
            targetCell.style.backgroundImage = "url(textures/0.png)"
        }
        else if (getCell(position) == 1) {
            targetCell.style.backgroundImage = "url(textures/1.png)"
        }
    })
    //turn
    playerTurn = JSON.parse(playerTurn)
    document.getElementById("turn").style.backgroundImage = "url(textures/turn" + playerTurn + ".png)"
}
document.getElementById("wins0").innerHTML = wins[0]
document.getElementById("wins1").innerHTML = wins[1]

//restituisce i valori del matrix evitando problemi con celle inesistenti
function getCell(position) {
    if (position.x < 0 || position.x > boardMatrix.length - 1) {
        return -1
    }
    if (position.y < 0 || position.y > boardMatrix[0].length - 1) {
        return -1
    }

    return boardMatrix[position.x][position.y]
}

//turni dei giocatori
let playerColors = ["url(textures/0.png)", "url(textures/1.png)"]
function changePlayerTurn() {
    if (playerTurn == 0) {
        playerTurn = 1
    }
    else {
        playerTurn = 0
    }
    localStorage.setItem("turn", JSON.stringify(playerTurn))
    document.getElementById("turn").style.backgroundImage = "url(textures/turn" + playerTurn + ".png)"
}

//calcola la riga su cui posizionare il tassello, aggiorna la tabella e il matrix, trova le combinazioni da 4 formate a seguito, e cambia il turno del giocatore
function cellClick(cell) {
    let position = new Vector(parseInt(cell.getAttribute("row")), parseInt(cell.getAttribute("col")))

    if (boardMatrix[position.x][position.y] != -1) {
        return
    }

    //calcola su quale riga dev'essere messo il tassello
    for (let i = boardMatrix.length - 1; i >= 0; i--) {
        if (boardMatrix[i][position.y] == -1) {
            position.x = i
            break
        }
    }

    //trova la nuova cella della tabella corrispondente alla cella del matrix
    cells.forEach(function(targetCell) {
        if (targetCell.getAttribute("row") == position.x && targetCell.getAttribute("col") == position.y) {
            cell = targetCell
        }
    })

    boardMatrix[position.x][position.y] = playerTurn
    localStorage.setItem("board", JSON.stringify(boardMatrix))
    cell.style.backgroundImage = playerColors[playerTurn]

    findConnections(position, playerTurn)

    changePlayerTurn()
}

//data una cella e il suo stato, trova le combinazioni da 4 che forma
function findConnections(position, state) {
    let connections = {
        horizontal: 1,
        vertical: 1,
        diagonalLeft: 1,
        diagonalRight: 1
    }

    let consideredPosition = new Vector(position.x, position.y + 1)
    while (getCell(consideredPosition) == state) {
        connections.horizontal++
        consideredPosition.y++
    }

    consideredPosition = new Vector(position.x, position.y - 1)
    while (getCell(consideredPosition) == state) {
        connections.horizontal++
        consideredPosition.y--
    }

    consideredPosition = new Vector(position.x + 1, position.y)
    while (getCell(consideredPosition) == state) {
        connections.vertical++
        consideredPosition.x++
    }

    consideredPosition = new Vector(position.x - 1, position.y)
    while (getCell(consideredPosition) == state) {
        connections.vertical++
        consideredPosition.x--
    }

    consideredPosition = new Vector(position.x + 1, position.y + 1)
    while (getCell(consideredPosition) == state) {
        connections.diagonalLeft++
        consideredPosition.x++
        consideredPosition.y++
    }

    consideredPosition = new Vector(position.x - 1, position.y - 1)
    while (getCell(consideredPosition) == state) {
        connections.diagonalLeft++
        consideredPosition.x--
        consideredPosition.y--
    }

    consideredPosition = new Vector(position.x + 1, position.y - 1)
    while (getCell(consideredPosition) == state) {
        connections.diagonalRight++
        consideredPosition.x++
        consideredPosition.y--
    }

    consideredPosition = new Vector(position.x - 1, position.y + 1)
    while (getCell(consideredPosition) == state) {
        connections.diagonalRight++
        consideredPosition.x--
        consideredPosition.y++
    }

    if (connections.horizontal >= 4) {
        endGame()
    }
    if (connections.vertical >= 4) {
        endGame()
    }
    if (connections.diagonalLeft >= 4) {
        endGame()
    }
    if (connections.diagonalRight >= 4) {
        endGame()
    }
}

function endGame() {
    //stats
    wins[playerTurn]++
    localStorage.setItem("wins", JSON.stringify(wins))
    //matrix
    boardMatrix = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1]
    ]
    localStorage.setItem("board", JSON.stringify(boardMatrix))

    location.reload()
}

function reset() {
    localStorage.clear()
    location.reload()
}