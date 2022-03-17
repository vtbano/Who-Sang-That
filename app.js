const initialscore = { correct: 0, completed: 0 };
const playGame = () => {
  const landingPageImage = document.querySelector("#landing-page-img");
  landingPageImage.remove();

  const gameDescription = document.querySelector(".gameDescription");
  gameDescription.remove();

  const playButton = document.querySelector(".playButton");
  playButton.remove();

  nextRound(initialscore);
};

const nextRound = async (score) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${aPiKey2}`
    );
    const data = await response.json();
    const body = data.message.body;
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    const songCount = body.track_list.length;
    const getRandomName = getRandomNumber(songCount);
    const songName = body.track_list[getRandomName].track.track_name; // Correct song name
    const artistName = body.track_list[getRandomName].track.artist_name; // Correct artist name
    const artistName2 =
      body.track_list[getRandomNumber(songCount)].track.artist_name;
    const artistName3 =
      body.track_list[getRandomNumber(songCount)].track.artist_name;

    const artistArray = [artistName, artistName2, artistName3];

    const mixedArtistOrder = shuffle(artistArray);

    const bottomAndRight = document.querySelector("#bottom-and-right");

    const firstButton = document.createElement("button");
    firstButton.classList.add("firstButton");
    firstButton.setAttribute("id", "optionButton");
    firstButton.textContent = mixedArtistOrder[0];
    bottomAndRight.appendChild(firstButton);

    const secondButton = document.createElement("button");
    secondButton.classList.add("secondButton");
    secondButton.setAttribute("id", "optionButton");
    secondButton.textContent = mixedArtistOrder[1];
    bottomAndRight.appendChild(secondButton);

    const thirdButton = document.createElement("button");
    thirdButton.classList.add("thirdButton");
    thirdButton.setAttribute("id", "optionButton");
    thirdButton.textContent = mixedArtistOrder[2];
    bottomAndRight.appendChild(thirdButton);

    getLyrics(songName, artistName);

    const optionButtons = document.querySelectorAll("#optionButton");
    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const optionSelectedContent = button.textContent;
        optionSelectedView(optionSelectedContent, optionButtons);
        optionSelectedSetTimeoutInit(
          artistName,
          optionSelectedContent,
          optionButtons,
          bottomAndRight,
          score
        );
      });
    });
  } catch (err) {
    console.log("ERROR");
  }
};

const playButton = document.querySelector(".playButton");
playButton.addEventListener("click", playGame);

const getLyrics = async (songName, artistName) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songName}&q_artist=${artistName}&apikey=${aPiKey2}`
    );
    const data = await response.json();
    const body = data.message.body;
    const requiredLyrics = body.lyrics.lyrics_body;
    const topAndLeft = document.querySelector("#top-and-left");
    const showLyrics = document.createElement("div");
    showLyrics.classList.add("lyrics-container");
    showLyrics.textContent = requiredLyrics;
    topAndLeft.appendChild(showLyrics);
  } catch (err) {
    console.log("ERROR LYRICS");
  }
};

const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const optionSelectedView = (optionSelectedContent, optionButtons) => {
  optionButtons.forEach((button) => {
    if (button.innerText !== optionSelectedContent) {
      button.remove();
    }
    if (button.innerText === optionSelectedContent) {
      button.classList.remove(`${button.className}`);
      button.removeAttribute("id");
      button.classList.add("optionSelectedContent");
    }
  });
};

const optionSelectedSetTimeoutInit = (
  artistName,
  optionSelectedContent,
  optionButtons,
  bottomAndRight,
  score
) => {
  if (
    (optionSelectedContent === artistName && score.completed === 0) ||
    (optionSelectedContent === artistName && score.completed === 1) ||
    (optionSelectedContent === artistName && score.completed === 2) ||
    (optionSelectedContent === artistName && score.completed === 3) ||
    (optionSelectedContent === artistName && score.completed === 4) ||
    (optionSelectedContent === artistName && score.completed === 5) ||
    (optionSelectedContent === artistName && score.completed === 6) ||
    (optionSelectedContent === artistName && score.completed === 7) ||
    (optionSelectedContent === artistName && score.completed === 8) ||
    (optionSelectedContent === artistName && score.completed === 9)
  ) {
    const newScore = {
      ...score,
      correct: score.correct + 1,
      completed: score.completed + 1,
    };
    setTimeout(() => {
      correctOptionSelected(
        optionSelectedContent,
        bottomAndRight,
        optionButtons,
        newScore
      );
      displayNextGameButton(bottomAndRight, newScore);
    }, 3000);
  } else if (
    (optionSelectedContent !== artistName && score.completed === 0) ||
    (optionSelectedContent !== artistName && score.completed === 1) ||
    (optionSelectedContent !== artistName && score.completed === 2) ||
    (optionSelectedContent !== artistName && score.completed === 3) ||
    (optionSelectedContent !== artistName && score.completed === 4) ||
    (optionSelectedContent !== artistName && score.completed === 5) ||
    (optionSelectedContent !== artistName && score.completed === 6) ||
    (optionSelectedContent !== artistName && score.completed === 7) ||
    (optionSelectedContent !== artistName && score.completed === 8) ||
    (optionSelectedContent !== artistName && score.completed === 9)
  ) {
    const newScore = {
      ...score,
      correct: score.correct,
      completed: score.completed + 1,
    };
    setTimeout(() => {
      wrongOptionSelected(
        optionSelectedContent,
        bottomAndRight,
        optionButtons,
        newScore
      );
      displayNextGameButton(bottomAndRight, newScore);
    }, 3000);
  } else {
    removeDisplayScore(score);
  }
};

const displayNewScore = (score) => {
  const smallScreenDisplay = document.querySelector("#pageTitle"); //will adjust with css flex
  const largeScreenDisplay = document.querySelector("#bottomInfo"); //will adjust with css flex
  const showScore = document.createElement("span");
  showScore.classList.add("showScore");
  showScore.textContent = `${score.correct}/${score.completed}`;
  smallScreenDisplay.appendChild(showScore);
  largeScreenDisplay.appendChild(showScore);
};

const removeDisplayScore = (score) => {
  if (
    score.completed === 2 ||
    score.completed === 3 ||
    score.completed === 4 ||
    score.completed === 5 ||
    score.completed === 6 ||
    score.completed === 7 ||
    score.completed === 8 ||
    score.completed === 9
  ) {
    console.log("success score removed");
    const removeScore = document.querySelector(".showScore");
    removeScore.remove();
  } else if (score.completed === 1) {
    console.log("initial play");
  } else if (score.correct >= 6 && score.completed === 10) {
    winDisplay(score);
    displayNextRoundButton();
    console.log("WIN");
    const removeScore = document.querySelector(".showScore");
    removeScore.remove();
    return;
  } else if (score.correct <= 5 && score.completed === 10) {
    loseDisplay(score);
    displayNextRoundButton();
    console.log("LOSE");
    const removeScore = document.querySelector(".showScore");
    removeScore.remove();
    return;
  }
};

const correctOptionSelected = (
  optionSelectedContent,
  bottomAndRight,
  optionButtons,
  score
) => {
  optionButtons.forEach((button) => {
    button.remove();
  });

  const correctAnswerResponse = document.createElement("div");
  correctAnswerResponse.classList.add("correctAnswerResponse");
  correctAnswerResponse.textContent = `YAY! ${optionSelectedContent} sang that song!`;
  bottomAndRight.appendChild(correctAnswerResponse);

  const correctImg = document.createElement("img");
  correctImg.classList.add("correctImg");
  correctImg.src = "images/WinnieTrumpet.png";
  bottomAndRight.appendChild(correctImg);
  removeDisplayScore(score);
  displayNewScore(score);
};

const wrongOptionSelected = (
  optionSelectedContent,
  bottomAndRight,
  optionButtons,
  score
) => {
  optionButtons.forEach((button) => {
    button.remove();
  });

  const wrongAnswerResponse = document.createElement("div");
  wrongAnswerResponse.classList.add("wrongAnswerResponse");
  wrongAnswerResponse.textContent = `SIGH! ${optionSelectedContent} did not sing that song!`;
  bottomAndRight.appendChild(wrongAnswerResponse);

  const wrongImg = document.createElement("img");
  wrongImg.classList.add("wrongImg");
  wrongImg.src = "images/sad-face.png";
  bottomAndRight.appendChild(wrongImg);
  removeDisplayScore(score);
  displayNewScore(score);
};

const displayNextGameButton = (bottomAndRight, newScore) => {
  const nextGameButton = document.createElement("button");
  nextGameButton.classList.add("nextGameButton");
  nextGameButton.textContent = "Hit me with the next tune ♫";
  bottomAndRight.appendChild(nextGameButton);
  nextGameButton.addEventListener("click", () => {
    const bottomAndRight = document.querySelector("#bottom-and-right");
    const topAndLeft = document.querySelector("#top-and-left");
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    nextRound(newScore);
  });
};

const winDisplay = (score) => {
  const optionButtons = document.querySelectorAll("#optionButton");
  optionButtons.forEach((button) => {
    button.remove();
  });

  const winFinalScore = document.createElement("div");
  winFinalScore.classList.add("winResponse");
  winFinalScore.textContent = `${score.correct}/${score.completed}`;
  const topAndLeft = document.querySelector("#top-and-left");
  topAndLeft.appendChild(winFinalScore);

  const winResponse = document.createElement("div");
  winResponse.classList.add("winResponse");
  winResponse.textContent = `Correct Matches!`;
  topAndLeft.appendChild(winResponse);
};

const loseDisplay = (score) => {
  const optionButtons = document.querySelectorAll("#optionButton");
  optionButtons.forEach((button) => {
    button.remove();
  });
  const topAndLeft = document.querySelector("#top-and-left");
  const only = document.createElement("div");
  only.classList.add("only");
  only.textContent = `Only!`;
  topAndLeft.appendChild(only);

  const loseFinalScore = document.createElement("div");
  loseFinalScore.classList.add("loseFinalScore");
  loseFinalScore.textContent = `${score.correct}/${score.completed}`;
  topAndLeft.appendChild(loseFinalScore);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const loseGif = document.createElement("iframe");
  loseGif.classList.add("loseGif");
  loseGif.src = "https://giphy.com/embed/hQ0GvkpZwYcgM"; //<a href="https://giphy.com/gifs/pokemon-psyduck-s01e71-hQ0GvkpZwYcgM">
  bottomAndRight.appendChild(loseGif);
};

const displayNextRoundButton = () => {
  const nextRoundButton = document.createElement("button");
  nextRoundButton.classList.add("nextGameButton");
  nextRoundButton.textContent = "New Round of tunes ♫";
  const bottomAndRight = document.querySelector("#bottom-and-right");
  bottomAndRight.appendChild(nextRoundButton);
  nextRoundButton.addEventListener("click", () => {
    const topAndLeft = document.querySelector("#top-and-left");
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    nextRound();
  });
};
