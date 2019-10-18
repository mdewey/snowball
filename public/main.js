const $ = document

const state = {
  words: ['abdomen', 'aborted', 'abought', 'achiest', 'acolyte', 'aconite'],
  selectedWord: '',
  lettersGuessed: [],
  remainingLetters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  lastCount: 0
}

const setSelectedWord = async () => {
  const resp = await fetch('https://sdg-words.herokuapp.com/api/words/random')
  const json = await resp.json()
  state.selectedWord = json.word
}

const createLetterHtml = letter => {
  const rv = document.createElement('span')
  rv.textContent = letter
  return rv
}

const printGameBoard = () => {
  // loop over selected word
  const parent = $.querySelector('.user-guesses')
  parent.textContent = ''

  state.selectedWord.split('').forEach(letter => {
    if (state.lettersGuessed.includes(letter)) {
      parent.appendChild(createLetterHtml(letter))
      console.log('success')
    } else {
      parent.appendChild(createLetterHtml('_'))
    }
  })
  // if letter is in selected word, add the the letter
  // else add an underscore
}

const createButton = letter => {
  const rv = document.createElement('button')
  rv.onclick = () => {
    const _letter = letter
    console.log('clicked ' + _letter)
    state.lettersGuessed.push(_letter)
    logState()
    printRemainingButtons()
    printGameBoard()
    setSnowImage()
    checkEndGame()
  }
  rv.textContent = letter
  if (state.lettersGuessed.includes(letter)) {
    rv.disabled = true
  }
  return rv
}

const printRemainingButtons = () => {
  const parent = $.querySelector('.button-container')
  parent.textContent = ''
  state.remainingLetters.forEach(letter => {
    parent.appendChild(createButton(letter))
  })
}
const getCountOfLettersCorrectlyGuessed = () =>
  state.selectedWord.split('').reduce((total, item) => {
    if (state.lettersGuessed.includes(item)) {
      total++
    }
    return total
  }, 0)

const initializeGame = async () => {
  $.querySelector('.message').textContent = ''
  $.querySelector('.reset-container').textContent = ''

  // select random word
  await setSelectedWord()
  // reset
  state.lettersGuessed = []
  state.remainingLetters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  state.lastCount = -1
  //
  printGameBoard()
  printRemainingButtons()
  setSnowImage()
}

const checkEndGame = () => {
  const count = getCountOfLettersCorrectlyGuessed()
  if (count === state.selectedWord.length) {
    console.log('game ended')
    // display message
    $.querySelector('.message').textContent = 'Congrats! You won!'
    // disable all buttons
    $.querySelectorAll('button').forEach(button => (button.disabled = true))
    // show reset button
    const reset = $.createElement('button')
    reset.textContent = 'playagains?'
    reset.onclick = async () => {
      await initializeGame()
    }
    $.querySelector('.reset-container').appendChild(reset)
  }
}
const setSnowImage = () => {
  // count the mathing letters
  const count = getCountOfLettersCorrectlyGuessed()

  if (state.lastCount !== count) {
    const parent = $.querySelector('.snow-man')
    parent.textContent = ''
    const img = $.createElement('img')
    img.src = `/images/snowman/step_${count}.png`
    parent.appendChild(img)
    state.lastCount = count
  }
}

const logState = () => console.log(state)

document.addEventListener('DOMContentLoaded', async () => {
  await setSelectedWord()
  logState()
  printGameBoard()
  printRemainingButtons()
  setSnowImage()
})
