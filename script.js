import { data } from "./matrix.js";

let correctGameState = data["5x5"]["heart"]["matrix"];
let sizeGameField = correctGameState.length;
let currentGameName = "heart";
let timer;
let time = 0;
let timerStarted = false;

let leftClickSound = new Audio("./sounds/left-click-sound.mp3");
let leftClick2Sound = new Audio("./sounds/left-click2-sound.mp3");
let winSound = new Audio("./sounds/win.mp3");
let rightClickSound = new Audio("./sounds/right-click-sound.mp3");
let rightClick2Sound = new Audio("./sounds/right-click2-sound.mp3");

let isSoundOn = true;
let isSolutionMode = false;

const bodyElem = document.body;

let wrapper = document.createElement("div");
wrapper.classList.add("wrapper");
bodyElem.append(wrapper);

let nameGameContainer = document.createElement("div");
nameGameContainer.className = "name-game-container";
wrapper.append(nameGameContainer);

let nameGame = document.createElement("h1");
nameGame.className = "name-game";
nameGame.textContent = "NONOGRAMS";
nameGameContainer.append(nameGame);

let sizeContainer = document.createElement("div");
sizeContainer.className = "size-container";
wrapper.append(sizeContainer);

let dropdownButtonEasy = document.createElement("button");
dropdownButtonEasy.className = "dropdown-button";
dropdownButtonEasy.textContent = "EASY 5x5";
let dropdownContentEasy = document.createElement("div");
dropdownContentEasy.className = "dropdown-content";
fillSelect(dropdownContentEasy, "5x5");
dropdownButtonEasy.append(dropdownContentEasy);
sizeContainer.append(dropdownButtonEasy);

let dropdownButtonMedium = document.createElement("button");
dropdownButtonMedium.className = "dropdown-button";
dropdownButtonMedium.textContent = "MEDIUM 10x10";
let dropdownContentMedium = document.createElement("div");
dropdownContentMedium.className = "dropdown-content";
fillSelect(dropdownContentMedium, "10x10");
dropdownButtonMedium.append(dropdownContentMedium);
sizeContainer.append(dropdownButtonMedium);

let dropdownButtonHard = document.createElement("button");
dropdownButtonHard.className = "dropdown-button";
dropdownButtonHard.textContent = "HARD 15x15";
let dropdownContentHard = document.createElement("div");
dropdownContentHard.className = "dropdown-content";
fillSelect(dropdownContentHard, "15x15");
dropdownButtonHard.append(dropdownContentHard);
sizeContainer.append(dropdownButtonHard);

let themeContainer = document.createElement("div");
themeContainer.className = "theme-container";
wrapper.append(themeContainer);

let scoreButton = document.createElement("button");
scoreButton.className = "button";
scoreButton.textContent = "SCORE";
themeContainer.append(scoreButton);

let themeSoundPanel = document.createElement("div");
themeSoundPanel.className = "theme-sound-panel";
themeContainer.append(themeSoundPanel);

let soundButton = document.createElement("button");
soundButton.className = "button-sound-and-theme";
soundButton.innerHTML =
  '<img src="svg/sound-off-light.svg"  height="20" alt="Sound Off">';
themeSoundPanel.append(soundButton);

let themeButton = document.createElement("button");
themeButton.className = "button-sound-and-theme";
themeButton.innerHTML = '<img src="svg/moon.svg" height="20" alt="Dark Theme">';
themeSoundPanel.append(themeButton);

let randomButton = document.createElement("button");
randomButton.className = "button";
randomButton.textContent = "RANDOM GAME";
themeContainer.append(randomButton);

let gameContainer = document.createElement("div");
gameContainer.className = "game-container";
wrapper.append(gameContainer);

let currentName = document.createElement("h2");
currentName.className = "current-name";
currentName.textContent = `${currentGameName.toUpperCase()}`;
gameContainer.append(currentName);

let grid = document.createElement("div");
gameContainer.append(grid);

let timerPanel = document.createElement("div");
timerPanel.className = "timer-panel";
wrapper.append(timerPanel);

let timerElement = document.createElement("div");
timerElement.id = "timer";
timerElement.textContent = "00:00";
timerPanel.append(timerElement);

let controlPanel = document.createElement("div");
controlPanel.className = "control-panel";
wrapper.append(controlPanel);

let savePanel = document.createElement("div");
savePanel.className = "save-panel";
controlPanel.append(savePanel);

let saveButton = document.createElement("button");
saveButton.className = "button";
saveButton.textContent = "SAVE GAME";
savePanel.append(saveButton);

let continueButton = document.createElement("button");
continueButton.className = "button";
continueButton.textContent = "CONTINUE LAST GAME";
savePanel.append(continueButton);

let resetPanel = document.createElement("div");
resetPanel.className = "reset-panel";
controlPanel.append(resetPanel);

let resetButton = document.createElement("button");
resetButton.className = "button";
resetButton.textContent = "RESET GAME";
resetPanel.append(resetButton);

let solutionButton = document.createElement("button");
solutionButton.className = "button";
solutionButton.textContent = "SOLUTION";
resetPanel.append(solutionButton);

const modalWrapper = document.createElement("div");
modalWrapper.classList.add("modalWrapper");
bodyElem.append(modalWrapper);

const modal = document.createElement("div");
modal.classList.add("modal");
modalWrapper.append(modal);

const modalContent = document.createElement("div");
modalContent.classList.add("modalContent");
modal.append(modalContent);

const modalButton = document.createElement("button");
modalButton.classList.add("button");
modal.append(modalButton);

let gameField = [];

function createGameField() {
  gameField = [];

  grid.innerHTML = "";
  grid.className = "";

  if (sizeGameField === 5) {
    grid.classList.add("grid5");
  } else if (sizeGameField === 10) {
    grid.classList.add("grid10");
  } else if (sizeGameField === 15) {
    grid.classList.add("grid15");
  }

  for (let i = 0; i < sizeGameField + 1; i++) {
    gameField[i] = [];
    for (let j = 0; j < sizeGameField + 1; j++) {
      gameField[i][j] = document.createElement("div");
      gameField[i][j].className = "cell";

      if (j % 5 === 0 && j < sizeGameField && j > 0) {
        gameField[i][j].classList.add("cell-thick-right");
      }
      if (i % 5 === 0 && i < sizeGameField && i > 0) {
        gameField[i][j].classList.add("cell-thick-bottom");
      }

      if (i > 0 && j > 0) {
        gameField[i][j].addEventListener("click", () => cellClick(i, j));
        gameField[i][j].addEventListener("contextmenu", (e) => {
          e.preventDefault();
          cellRightClick(i, j);
        });
      } else {
        let clueContainer = document.createElement("div");
        if (i === 0) {
          gameField[i][j].className += " colClue";
          clueContainer.className = "col-clue-container";
        }
        if (j === 0) {
          gameField[i][j].className += " rowClue";
          clueContainer.className = "row-clue-container";
        }
        gameField[i][j].append(clueContainer);
      }
      grid.append(gameField[i][j]);
    }
  }
}

createGameField();

function cellClick(row, col) {
  if (isSolutionMode) {
    stopTimer();
    return;
  }
  if (gameField[row][col].classList.contains("cell-crossed")) {
    gameField[row][col].classList.remove("cell-crossed");
    gameField[row][col].classList.add("cell-filled");
    playSound(leftClickSound);
  } else if (!gameField[row][col].classList.contains("cell-filled")) {
    gameField[row][col].classList.add("cell-filled");
    playSound(leftClickSound);
  } else {
    gameField[row][col].classList.remove("cell-filled");
    gameField[row][col].textContent = "";
    playSound(leftClick2Sound);
  }
  checkWinCondition();
}

function openModal() {
  modalButton.textContent = "PLAY AGAIN";
  modalWrapper.style.visibility = "visible";
  modalWrapper.style.opacity = "1";
  modalContent.textContent = `Great! You have solved the nonogram in ${time} seconds!`;
  timerStarted = false;
}

function closeModal() {
  resetGame();
  modalWrapper.style.opacity = "0";

  modalWrapper.style.visibility = "hidden";

  time = 0;
  timerStarted = false;
  stopTimer();
  updateTimer();
}

function resetGame() {
  stopTimer();
  time = 0;
  timerStarted = false;
  updateTimer();

  for (let i = 1; i < sizeGameField + 1; i++) {
    for (let j = 1; j < sizeGameField + 1; j++) {
      gameField[i][j].classList.remove("cell-filled", "cell-crossed");
      gameField[i][j].textContent = "";
      if (j % 5 === 0 && j < sizeGameField) {
        gameField[i][j].classList.add("cell-thick-right");
      }
      if (i % 5 === 0 && i < sizeGameField) {
        gameField[i][j].classList.add("cell-thick-bottom");
      }
    }
  }
}

function cellRightClick(row, col) {
  if (isSolutionMode) {
    stopTimer();
    return;
  }
  if (gameField[row][col].classList.contains("cell-crossed")) {
    gameField[row][col].classList.remove("cell-crossed");
    gameField[row][col].textContent = "";
    playSound(rightClick2Sound);
  } else {
    gameField[row][col].classList.add("cell-crossed");
    gameField[row][col].textContent = "X";
    playSound(rightClickSound);
  }
  if (time === 0 && !timerStarted) {
    startTimer();
    timerStarted = true;
  }
}

function generateClues() {
  let rowClues = correctGameState.map((row) => {
    let clue = [];
    let count = 0;
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 1) {
        count++;
      }
      if (row[i] === 0 && count > 0) {
        clue.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      clue.push(count);
    }

    if (clue.length === 0) {
      clue.push(0);
    }
    return clue;
  });

  let colClues = correctGameState[0].map((_, colIndex) => {
    let clue = [];
    let count = 0;
    for (let i = 0; i < correctGameState.length; i++) {
      if (correctGameState[i][colIndex] === 1) {
        count++;
      }
      if (correctGameState[i][colIndex] === 0 && count > 0) {
        clue.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      clue.push(count);
    }

    if (clue.length === 0) {
      clue.push(0);
    }
    return clue;
  });

  for (let i = 1; i < sizeGameField + 1; i++) {
    let colClueContainer = gameField[0][i].querySelector(".col-clue-container");
    colClues[i - 1].forEach((clue) => {
      let colClueContainerElement = document.createElement("div");
      colClueContainerElement.classList.add("col-clue-elem");
      let colClueElement = document.createElement("span");
      colClueElement.textContent = clue;
      colClueElement.className = "elem";
      colClueContainerElement.append(colClueElement);
      colClueContainer.append(colClueContainerElement);
    });

    let rowClueContainer = gameField[i][0].querySelector(".row-clue-container");
    rowClues[i - 1].forEach((clue) => {
      let rowClueContainerElement = document.createElement("div");
      rowClueContainerElement.classList.add("row-clue-elem");
      let rowClueElement = document.createElement("span");
      rowClueElement.textContent = clue;
      rowClueElement.className = "elem";
      rowClueContainerElement.append(rowClueElement);
      rowClueContainer.append(rowClueContainerElement);
    });
  }
}

function checkWinCondition() {
  let isCorrect = true;
  for (let i = 1; i < gameField.length; i++) {
    for (let j = 1; j < gameField[i].length; j++) {
      if (
        (gameField[i][j].className === "cell cell-filled" &&
          correctGameState[i - 1][j - 1] !== 1) ||
        ((gameField[i][j].className === "cell" ||
          gameField[i][j].className === "cell cell-crossed") &&
          correctGameState[i - 1][j - 1] !== 0)
      ) {
        isCorrect = false;
        break;
      }
    }
    if (!isCorrect) break;
  }

  if (isCorrect) {
    playSound(winSound);
    openModal();
    stopTimer();
    addRecord(currentGameName, sizeGameField + "x" + sizeGameField, time);
  }
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
}

function updateTimer() {
  timerElement.textContent = formatTime(time);
}

function startTimer() {
  timer = setInterval(function () {
    time++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function saveGame() {
  let gameState = {
    currentGameName: currentGameName,
    correctGameState: correctGameState,
    sizeGameField: sizeGameField,
    time: time,
    timerStarted: timerStarted,
    gameField: gameField.map((row, i) =>
      row.map((cell, j) =>
        i > 0 && j > 0
          ? { className: cell.className, textContent: cell.textContent }
          : null
      )
    ),
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function continueGame() {
  let savedGameState = JSON.parse(localStorage.getItem("gameState"));
  if (savedGameState) {
    stopTimer();
    currentGameName = savedGameState.currentGameName;
    correctGameState = savedGameState.correctGameState;
    sizeGameField = savedGameState.sizeGameField;
    time = savedGameState.time;
    timerStarted = savedGameState.timerStarted;

    currentName.textContent = currentGameName;

    createGameField();
    generateClues();

    savedGameState.gameField.forEach((row, i) =>
      row.forEach((cellState, j) => {
        if (cellState) {
          gameField[i][j].className = cellState.className;
          gameField[i][j].textContent = cellState.textContent;
        }
      })
    );

    if (timerStarted) {
      startTimer();
    } else {
      updateTimer();
    }
  } else {
    console.log("No saved game found");
    startNewGame();
  }
}

function addRecord(gameName, difficulty, time) {
  let records = JSON.parse(localStorage.getItem("records")) || [];

  records.push({ gameName, difficulty, time });

  if (records.length > 5) {
    records.shift();
  }

  localStorage.setItem("records", JSON.stringify(records));
}

function showRecords() {
  modalButton.textContent = "EXIT";
  let records = JSON.parse(localStorage.getItem("records")) || [];

  records.sort((a, b) => a.time - b.time);

  modalContent.innerHTML = "";

  let table = document.createElement("table");
  table.className = "table";
  let headerRow = document.createElement("tr");
  headerRow.className = "headerRow";
  ["PUZZLE", "DIFFICULTY", "TIME"].forEach((header) => {
    let th = document.createElement("th");
    th.className = "th";
    th.textContent = header;
    headerRow.append(th);
  });
  table.append(headerRow);

  records.forEach((record) => {
    let row = document.createElement("tr");
    [
      record.gameName.toUpperCase(),
      record.difficulty,
      formatTime(record.time),
    ].forEach((text) => {
      let td = document.createElement("td");
      td.className = "td";
      td.textContent = text;
      row.append(td);
    });
    table.append(row);
  });

  modalContent.append(table);
}

function playSound(sound) {
  if (isSoundOn) {
    sound.play();
  }
}

function fillSelect(dropdownContent, size) {
  let games = data[size];
  for (let game in games) {
    let dropdownOption = document.createElement("a");
    dropdownOption.textContent = game.toUpperCase();
    dropdownOption.href = "#";
    dropdownOption.addEventListener("click", function () {
      currentGameName = game.toUpperCase();
      currentName.textContent = currentGameName;
      correctGameState = data[size][game]["matrix"];
      sizeGameField = correctGameState.length;

      createGameField();
      generateClues();

      time = 0;
      timerStarted = false;
      stopTimer();
      updateTimer();

      dropdownContentEasy.classList.add("hide");
      dropdownContentMedium.classList.add("hide");
      dropdownContentHard.classList.add("hide");
    });
    dropdownContent.append(dropdownOption);
  }
}

function resetGameAndExitSolutionMode() {
  resetGame();
  exitSolutionMode();
}

function continueGameAndExitSolutionMode() {
  continueGame();
  exitSolutionMode();
}

function exitSolutionMode() {
  isSolutionMode = false;
  saveButton.disabled = false;
}

dropdownButtonEasy.onchange = function () {
  exitSolutionMode();
  let game = this.value;
  currentGameName = game.toUpperCase();
  currentName.textContent = currentGameName;
  correctGameState = data["5x5"][game]["matrix"];
  sizeGameField = correctGameState.length;

  createGameField();
  generateClues();

  time = 0;
  timerStarted = false;
  stopTimer();
  updateTimer();
};

dropdownButtonMedium.onchange = function () {
  exitSolutionMode();
  let game = this.value;
  currentGameName = game.toUpperCase();
  currentName.textContent = currentGameName;
  correctGameState = data["10x10"][game]["matrix"];
  sizeGameField = correctGameState.length;

  createGameField();
  generateClues();

  time = 0;
  timerStarted = false;
  stopTimer();
  updateTimer();
};

dropdownButtonHard.onchange = function () {
  exitSolutionMode();
  let game = this.value;
  currentGameName = game.toUpperCase();
  currentName.textContent = currentGameName;
  correctGameState = data["15x15"][game]["matrix"];
  sizeGameField = correctGameState.length;

  createGameField();
  generateClues();

  time = 0;
  timerStarted = false;
  stopTimer();
  updateTimer();
};

dropdownButtonEasy.addEventListener("mouseover", function () {
  dropdownContentEasy.classList.remove("hide");
});

dropdownButtonMedium.addEventListener("mouseover", function () {
  dropdownContentMedium.classList.remove("hide");
});

dropdownButtonHard.addEventListener("mouseover", function () {
  dropdownContentHard.classList.remove("hide");
});

resetButton.addEventListener("click", resetGameAndExitSolutionMode);

modalButton.onclick = function () {
  closeModal();
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

modalWrapper.addEventListener("click", (event) => {
  if (event.target === modalWrapper) {
    closeModal();
  }
});

grid.addEventListener("click", function (event) {
  if (
    !event.target.classList.contains("cell") ||
    event.target.classList.contains("rowClue") ||
    event.target.classList.contains("colClue")
  ) {
    return;
  }

  if (time === 0 && !timerStarted) {
    startTimer();
    timerStarted = true;
  }
});

randomButton.addEventListener("click", function () {
  let allGames = Object.keys(data["5x5"]).concat(
    Object.keys(data["10x10"]),
    Object.keys(data["15x15"])
  );

  let randomIndex = Math.floor(Math.random() * allGames.length);

  let randomGame = allGames[randomIndex];

  let size;
  if (data["5x5"][randomGame]) {
    size = "5x5";
  } else if (data["10x10"][randomGame]) {
    size = "10x10";
  } else {
    size = "15x15";
  }

  currentGameName = randomGame.toUpperCase();
  currentName.textContent = currentGameName;
  correctGameState = data[size][randomGame]["matrix"];
  sizeGameField = correctGameState.length;

  createGameField();
  generateClues();

  time = 0;
  timerStarted = false;
  stopTimer();
  updateTimer();
});

solutionButton.addEventListener("click", function () {
  isSolutionMode = !isSolutionMode;
  if (isSolutionMode) {
    saveButton.disabled = true;
    resetGame();
    for (let i = 0; i < sizeGameField; i++) {
      for (let j = 0; j < sizeGameField; j++) {
        if (correctGameState[i][j] === 1) {
          gameField[i + 1][j + 1].className = "cell cell-filled";
        }
      }
    }
    solutionButton.textContent = "HIDE SOLUTION";
  } else {
    resetGame();
    solutionButton.textContent = "SOLUTION";
  }
});

themeButton.addEventListener("click", function () {
  if (document.body.classList.contains("dark-theme")) {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeButton.innerHTML =
      '<img src="svg/moon.svg" height="20" alt="Dark Theme">';
    if (isSoundOn) {
      soundButton.innerHTML =
        '<img src="svg/sound-off-light.svg" height="20" alt="Sound Off" class="sound-icon">';
    } else {
      soundButton.innerHTML =
        '<img src="svg/sound-on-light.svg" height="20" alt="Sound On" class="sound-icon">';
    }
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeButton.innerHTML =
      '<img src="svg/sun.svg" height="20" alt="Light Theme">';
    if (isSoundOn) {
      soundButton.innerHTML =
        '<img src="svg/sound-off-dark.svg" height="20" alt="Sound Off" class="sound-icon">';
    } else {
      soundButton.innerHTML =
        '<img src="svg/sound-on-dark.svg" height="20" alt="Sound On" class="sound-icon">';
    }
  }
});

saveButton.addEventListener("click", saveGame);

continueButton.addEventListener("click", continueGameAndExitSolutionMode);

modalButton.onclick = function () {
  closeModal();
  showRecords();
};

scoreButton.addEventListener("click", function () {
  modalWrapper.style.visibility = "visible";
  modalWrapper.style.opacity = "1";

  showRecords();
});

soundButton.addEventListener("click", function () {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    if (document.body.classList.contains("dark-theme")) {
      soundButton.innerHTML =
        '<img src="svg/sound-off-dark.svg" height="20" alt="Sound Off" class="sound-icon">';
    } else {
      soundButton.innerHTML =
        '<img src="svg/sound-off-light.svg" height="20" alt="Sound Off" class="sound-icon">';
    }
  } else {
    if (document.body.classList.contains("dark-theme")) {
      soundButton.innerHTML =
        '<img src="svg/sound-on-dark.svg" height="20" alt="Sound On" class="sound-icon">';
    } else {
      soundButton.innerHTML =
        '<img src="svg/sound-on-light.svg" height="20" alt="Sound On" class="sound-icon">';
    }
  }
});

window.onload = generateClues;
