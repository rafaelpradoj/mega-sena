let state = {
  board: [],
  currentGame: [],
  savedGames: []
}

const start = () => {
  readLocalStorage()
  createBoard()
  newGame()
}
const readLocalStorage = () => {
  if (!window.localStorage) {
    return
  }

  const savedGamesFromLocalStorage = window.localStorage.getItem('saved-games')

  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage)
  }
}
const writeToLocalStorage = () => {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames))
}
const createBoard = () => {
  state.board = []

  for (let i = 1; i <= 60; i++) {
    state.board.push(i)
  }
}
const newGame = () => {
  resetGame()
  render()
}
const render = () => {
  renderBoard()
  renderButtons()
  renderSavedGames()
}
const renderBoard = () => {
  const divBoard = document.querySelector('.megasena-board')
  divBoard.innerHTML = ''

  const ulNumbers = document.createElement('ul')
  ulNumbers.classList.add('numbers')

  for (let i = 0; i < state.board.length; i++) {
    const currentNumber = state.board[i]

    const liNumber = document.createElement('li')
    liNumber.textContent = currentNumber
    liNumber.classList.add('number')

    liNumber.addEventListener('click', handleNumberClick)
    
    if (isNumberInGame(Number(currentNumber))) {
      liNumber.classList.add('selected-number')
    }

    ulNumbers.append(liNumber)
  }

  divBoard.append(ulNumbers)
}
const handleNumberClick = event => {
  const value = Number(event.target.textContent)
  
  if (isNumberInGame(value)) {
    removeNumberFromGame(value)
  } else {
    addNumberToGame(value)
  }
  render()
}
const renderButtons = () => {
  const divButtons = document.querySelector('.megasena-buttons')
  divButtons.innerHTML = ''

  const buttonNewGame = createNewGameButton()
  const buttonRandomGame = createRandomGameButton()
  const buttonSaveGame = createSaveGameButton()

  divButtons.append(buttonNewGame)
  divButtons.append(buttonRandomGame)
  divButtons.append(buttonSaveGame)
}
const createNewGameButton = () => {
  const button = document.createElement('button')
  button.textContent = 'Novo jogo'

  button.addEventListener('click', newGame)

  return button
}
const createRandomGameButton = () => {
  const button = document.createElement('button')
  button.textContent = 'Jogo aleatório'

  button.addEventListener('click', randomGame)

  return button
}
const createSaveGameButton = () => {
  const button = document.createElement('button')
  button.textContent = 'Salvar jogo'
  button.disabled = !isGameComplete()

  button.addEventListener('click', saveGame)

  return button
}
const renderSavedGames = () => {
  const divSavedGames = document.querySelector('.megasena-saved-games')
  divSavedGames.innerHTML = ''

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>'
  } else {
    const ulSavedGames = document.createElement('ul')

    for (let i = 0; i < state.savedGames.length; i++) {
      const currentGame = state.savedGames[i]

      const liGame = document.createElement('li')
      liGame.textContent = currentGame
        .sort((a, b) => a - b)  
        .join(' - ')
      ulSavedGames.append(liGame)
    }

    divSavedGames.append(ulSavedGames)
  }
}
const addNumberToGame = numberToAdd => {
  const currentGameSize = state.currentGame.length
  const isInvalidNumber = numberToAdd < 1 || numberToAdd > 60

  if (isInvalidNumber) {
    console.error('Número inválido', numberToAdd)
    return
  }

  if (currentGameSize >= 6) {
    console.error('O jogo já está completo.')
    return
  }

  if (isNumberInGame(numberToAdd)) {
    console.error('Este número já está no jogo', numberToAdd)
    return
  }

  state.currentGame.push(numberToAdd)
}
const removeNumberFromGame = numberToRemove => {
  let newGame = []
  
  if (!isNumberInGame(numberToRemove)) {
    console.error('Número não existe no jogo', numberToRemove)
    return
  }

  for (let i = 0; i < state.currentGame.length; i++) {
    const currentNumber = state.currentGame[i]

    if (currentNumber === numberToRemove) {
      continue
    }

    newGame.push(currentNumber)
  }

  state.currentGame = newGame
}
const isNumberInGame = numberToCheck => {
  return state.currentGame.includes(numberToCheck)
}
const saveGame = () => {
  if (!isGameComplete()) {
    console.error('O jogo não está completo!')
    return
  }

  state.savedGames.push(state.currentGame)
  writeToLocalStorage()
  newGame()
}
const resetGame = () => {
  state.currentGame = []
}
const isGameComplete = () => {
  return state.currentGame.length === 6
}
const randomGame = () => {
  resetGame()

  while (!isGameComplete()) {
    const randomNumber = Math.ceil(Math.random() * 60)
    addNumberToGame(randomNumber)
  }
  render()
}

start()