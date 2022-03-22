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
      `https://musixmatch-proxy.herokuapp.com/chart.tracks.get`
    );
    const body = await response.json();
    console.log(body);
    const songCount = body.track_list.length;
    const getRandomName = generateRandomName(songCount);
    const songName = body.track_list[getRandomName].track.track_name; // Correct song name
    const artistName = generateWinArtist(body, getRandomName); // Correct artist name
    const artistName2 = generateArtistName2(body, songCount, artistName);
    const artistName3 = generateArtistName3(
      body,
      songCount,
      artistName,
      artistName2
    );

    const artistArray = [artistName, artistName2, artistName3];

    const mixedArtistOrder = shuffle(artistArray);

    const bottomAndRight = document.querySelector("#bottom-and-right");

    const firstButton = document.createElement("button");
    firstButton.classList.add("optionButton");
    firstButton.setAttribute("id", "firstButton");
    firstButton.textContent = mixedArtistOrder[0];
    bottomAndRight.appendChild(firstButton);

    const secondButton = document.createElement("button");
    secondButton.classList.add("optionButton");
    secondButton.setAttribute("id", "secondButton");
    secondButton.textContent = mixedArtistOrder[1];
    bottomAndRight.appendChild(secondButton);

    const thirdButton = document.createElement("button");
    thirdButton.classList.add("optionButton");
    thirdButton.setAttribute("id", "thirdButton");
    thirdButton.textContent = mixedArtistOrder[2];
    bottomAndRight.appendChild(thirdButton);

    getLyrics(songName, artistName);

    const optionButtons = document.querySelectorAll(".optionButton");
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

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const generateRandomName = (songCount) => getRandomNumber(songCount);

const generateWinArtist = (body, getRandomName) => {
  const winArtist = body.track_list[getRandomName].track.artist_name;
  // console.log("WIN ARTIST:", winArtist);
  if (winArtist === " ") {
    generateWinArtist(body, getRandomName);
    console.log("REGENERATE ARTIST 1");
  } else {
    return winArtist;
  }
};

const generateArtistName2 = (body, songCount, artistName) => {
  const secondArtist =
    body.track_list[getRandomNumber(songCount)].track.artist_name;
  // console.log("SECOND ARTIST:", secondArtist);
  if (secondArtist === artistName || secondArtist === " ") {
    generateArtistName2(body, songCount, artistName);
    console.log("REGENERATE ARTIST 2");
  } else {
    return secondArtist;
  }
};

const generateArtistName3 = (body, songCount, artistName, artistName2) => {
  const thirdArtist =
    body.track_list[getRandomNumber(songCount)].track.artist_name;
  // console.log("THIRD ARTIST:", thirdArtist);
  if (
    thirdArtist === artistName ||
    thirdArtist === artistName2 ||
    thirdArtist === ""
  ) {
    generateArtistName3(body, songCount, artistName, artistName2);
    console.log("REGENERATE ARTIST 3");
  } else {
    return thirdArtist;
  }
};

const playButton = document.querySelector(".playButton");
playButton.addEventListener("click", playGame);

const getLyrics = async (songName, artistName) => {
  try {
    const response = await fetch(
      `https://musixmatch-proxy.herokuapp.com/matcher.lyrics.get?q_track=${songName}&q_artist=${artistName}`
    );
    const body = await response.json();
    const requiredLyrics = body.lyrics.lyrics_body;
    if (requiredLyrics === "") {
      // getLyrics(songName, artistName);
      console.log("BLANK LYRICS");
    } else {
      displayLyrics(body, requiredLyrics);
      // const [lyricsPart1, notCommericalUse] = requiredLyrics.split("*******");
      // const topAndLeft = document.querySelector("#top-and-left");
      // const showLyrics = document.createElement("pre");
      // showLyrics.classList.add("lyrics-container");
      // showLyrics.textContent = lyricsPart1;
      // topAndLeft.appendChild(showLyrics);
      // console.log(body);
    }
  } catch (err) {
    // getLyrics(songName, artistName);
    console.log("ERROR LYRICS");
  }
};

const displayLyrics = (body, requiredLyrics) => {
  const [lyricsPart1, notCommericalUse] = requiredLyrics.split("*******");
  const topAndLeft = document.querySelector("#top-and-left");
  const showLyrics = document.createElement("pre");
  showLyrics.classList.add("lyrics-container");
  showLyrics.textContent = lyricsPart1;
  topAndLeft.appendChild(showLyrics);
  console.log(body);
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
      button.setAttribute("id", "bounce");
      const stage = document.createElement("div");
      stage.classList.add("stage");
      const bottomAndRight = document.querySelector("#bottom-and-right");
      bottomAndRight.removeChild(button);
      bottomAndRight.appendChild(stage);
      stage.appendChild(button);
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
  if (optionSelectedContent === artistName) {
    const newScore = {
      ...score,
      correct: score.correct + 1,
      completed: score.completed + 1,
    };
    setTimeout(() => {
      showCorrectDisplay(optionSelectedContent, bottomAndRight);
      removeOptionButtons(optionButtons, newScore);
      displayNextGameButton(bottomAndRight, newScore);
    }, 3000);
  } else {
    const newScore = {
      ...score,
      correct: score.correct,
      completed: score.completed + 1,
    };
    setTimeout(() => {
      showWrongDisplay(optionSelectedContent, bottomAndRight);
      removeOptionButtons(optionButtons, newScore);
      displayNextGameButton(bottomAndRight, newScore);
    }, 3000);
  }
};

const displayNewScore = (score) => {
  if (score.completed <= 9) {
    const largeScreenDisplay = document.querySelector("#bottomInfo"); //will adjust with css flex
    const showScore = document.createElement("span");
    showScore.classList.add("showScore");
    showScore.textContent = `${score.correct}/${score.completed}`;
    largeScreenDisplay.appendChild(showScore);
  }
};

const checkWinnerRemoveScore = (score) => {
  if (score.completed >= 2 && score.completed <= 9) {
    console.log("success score removed");
    const removeScore = document.querySelector(".showScore");
    removeScore.remove();
  } else if (score.completed === 1) {
    console.log("initial play");
  } else if (score.correct >= 6 && score.completed === 10) {
    console.log("WIN");
    removeScoreFinalWinLose();
    winDisplay(score);
    displayNextRoundButton();
    return;
  } else if (score.correct <= 5 && score.completed === 10) {
    console.log("LOSE");
    removeScoreFinalWinLose();
    loseDisplay(score);
    displayNextRoundButton();
    return;
  }
};

removeScoreFinalWinLose = () => {
  const removeScore = document.querySelector(".showScore");
  const bottomAndRight = document.querySelector("#bottom-and-right");
  const topAndLeft = document.querySelector("#top-and-left");
  removeScore.remove();
  bottomAndRight.textContent = "";
  topAndLeft.textContent = "";
};

const removeOptionButtons = (optionButtons, score) => {
  optionButtons.forEach((button) => {
    button.remove();
  });
  checkWinnerRemoveScore(score);
  displayNewScore(score);
};
const showCorrectDisplay = (optionSelectedContent, bottomAndRight) => {
  bottomAndRight.textContent = "";
  const correctAnswerResponse = document.createElement("div");
  correctAnswerResponse.classList.add("correctAnswerResponse");
  correctAnswerResponse.textContent = `YAY! ${optionSelectedContent} sang that song!`;
  bottomAndRight.appendChild(correctAnswerResponse);

  const correctImg = document.createElement("iframe");
  correctImg.classList.add("correctImg");
  correctImg.src = "https://giphy.com/embed/xuXzcHMkuwvf2";
  bottomAndRight.appendChild(correctImg);
};

const showWrongDisplay = (optionSelectedContent, bottomAndRight) => {
  bottomAndRight.textContent = "";
  const wrongAnswerResponse = document.createElement("div");
  wrongAnswerResponse.classList.add("wrongAnswerResponse");
  wrongAnswerResponse.textContent = `SIGH! ${optionSelectedContent} did not sing that song!`;
  bottomAndRight.appendChild(wrongAnswerResponse);

  const wrongImg = document.createElement("iframe");
  wrongImg.classList.add("wrongImg");
  wrongImg.src = "https://giphy.com/embed/dICjAqixKQFnG";
  bottomAndRight.appendChild(wrongImg);
};

const displayNextGameButton = (bottomAndRight, newScore) => {
  if (newScore.completed >= 1 && newScore.completed <= 9) {
    const nextGameButton = document.createElement("button");
    nextGameButton.classList.add("next-round-and-game-button");
    nextGameButton.textContent = "Hit me with the next tune ♫";
    bottomAndRight.appendChild(nextGameButton);
    nextGameButton.addEventListener("click", () => {
      const bottomAndRight = document.querySelector("#bottom-and-right");
      const topAndLeft = document.querySelector("#top-and-left");
      bottomAndRight.textContent = "";
      topAndLeft.textContent = "";
      nextRound(newScore);
    });
  }
};

const winDisplay = (score) => {
  const optionButtons = document.querySelectorAll(".optionButton");
  optionButtons.forEach((button) => {
    button.remove();
  });

  const winFinalScore = document.createElement("div");
  winFinalScore.classList.add("winFinalScore");
  winFinalScore.textContent = `${score.correct}/${score.completed}`;
  const topAndLeft = document.querySelector("#top-and-left");
  topAndLeft.appendChild(winFinalScore);

  const winResponse = document.createElement("div");
  winResponse.classList.add("winResponse");
  winResponse.textContent = `Correct Matches!`;
  topAndLeft.appendChild(winResponse);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const winGif = document.createElement("iframe");
  winGif.classList.add("winGif");
  winGif.src = "https://giphy.com/embed/oHB0VofpRubjW";
  bottomAndRight.appendChild(winGif);
  //Confetti
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};

const loseDisplay = (score) => {
  const optionButtons = document.querySelectorAll(".optionButton");
  optionButtons.forEach((button) => {
    button.remove();
  });
  const topAndLeft = document.querySelector("#top-and-left");
  const only = document.createElement("div");
  only.classList.add("only");
  only.textContent = `Only...`;
  topAndLeft.appendChild(only);

  const loseFinalScore = document.createElement("div");
  loseFinalScore.classList.add("loseFinalScore");
  loseFinalScore.textContent = `${score.correct}/${score.completed}`;
  topAndLeft.appendChild(loseFinalScore);

  const correctCount = document.createElement("div");
  correctCount.classList.add("numberOfMatchesLose");
  correctCount.textContent = `matches`;
  topAndLeft.appendChild(correctCount);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const loseGif = document.createElement("iframe");
  loseGif.classList.add("loseGif");
  loseGif.src = "https://giphy.com/embed/hQ0GvkpZwYcgM";
  bottomAndRight.appendChild(loseGif);
};

const displayNextRoundButton = () => {
  const nextRoundButton = document.createElement("button");
  nextRoundButton.classList.add("next-round-and-game-button");
  nextRoundButton.textContent = "New Round of tunes ♫";
  const bottomAndRight = document.querySelector("#bottom-and-right");
  bottomAndRight.appendChild(nextRoundButton);
  nextRoundButton.addEventListener("click", () => {
    const topAndLeft = document.querySelector("#top-and-left");
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    nextRound({ correct: 0, completed: 0 });
  });
};
