const initialscore = { correct: 0, completed: 0 };
const playGame = () => {
  const landingPageImage = document.querySelector("#landing-page-img");
  landingPageImage.remove();

  const gameDescription = document.querySelector(".game-description");
  gameDescription.remove();

  const playButton = document.querySelector(".play-button");
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
    if (body.track_list.length === 0) {
      console.log("Initial Track List is blank");
      nextRound(score);
    } else {
      const songCount = body.track_list.length;
      const getArtist = getRandomNumber(songCount);
      const commonTrackId = body.track_list[getArtist].track.commontrack_id; //Correct track id to retrieve lyrics
      const artistName = body.track_list[getArtist].track.artist_name; // Correct artist name
      const artistName2 = generateArtistName2(body, artistName);
      const artistName3 = generateArtistName3(body, artistName, artistName2);

      const artistArray = [artistName, artistName2, artistName3];

      const mixedArtistOrder = shuffle(artistArray);

      const bottomAndRight = document.querySelector("#bottom-and-right");

      const firstButton = document.createElement("button");
      firstButton.classList.add("option-button");
      firstButton.setAttribute("id", "firstButton");
      firstButton.textContent = mixedArtistOrder[0];
      bottomAndRight.appendChild(firstButton);

      const secondButton = document.createElement("button");
      secondButton.classList.add("option-button");
      secondButton.setAttribute("id", "secondButton");
      secondButton.textContent = mixedArtistOrder[1];
      bottomAndRight.appendChild(secondButton);

      const thirdButton = document.createElement("button");
      thirdButton.classList.add("option-button");
      thirdButton.setAttribute("id", "thirdButton");
      thirdButton.textContent = mixedArtistOrder[2];
      bottomAndRight.appendChild(thirdButton);

      getTrackLyrics(commonTrackId, score);

      const optionButtons = document.querySelectorAll(".option-button");
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
    }
  } catch (err) {
    console.log("There is an error when running nextRound", err);
  }
};

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const generateArtistName2 = (body, artistName) => {
  const secondArtist =
    body.track_list[getRandomNumber(body.track_list.length)].track.artist_name;
  if (secondArtist === artistName) {
    console.log("Duplication: Regenerate Artist 2");
    return generateArtistName2(body, artistName);
  } else if (secondArtist.length === 0) {
    console.log("Blank: Regenerate Artist 2");
    return generateArtistName2(body, artistName);
  } else {
    return secondArtist;
  }
};

const generateArtistName3 = (body, artistName, artistName2) => {
  const thirdArtist =
    body.track_list[getRandomNumber(body.track_list.length)].track.artist_name;
  if (thirdArtist === artistName) {
    console.log("Duplication of main artist: Regenerate Artist 3");
    return generateArtistName3(body, artistName, artistName2);
  } else if (thirdArtist === artistName2) {
    console.log("Duplication of second artist: Regenerate Artist 3");
    return generateArtistName3(body, artistName, artistName2);
  } else if (thirdArtist.length === 0) {
    console.log("Blank: Regenerate Artist 3");
    return generateArtistName3(body, artistName, artistName2);
  } else {
    return thirdArtist;
  }
};

const playButton = document.querySelector(".play-button");
playButton.addEventListener("click", playGame);

const getTrackLyrics = async (trackId, score) => {
  try {
    const response = await fetch(
      `https://musixmatch-proxy.herokuapp.com/track.lyrics.get?commontrack_id=${trackId}`
    );
    const body = await response.json();
    const requiredLyrics = body.lyrics.lyrics_body;
    console.log("getTrackLyrics Body:", body);
    if (requiredLyrics === "" || requiredLyrics.length === 0) {
      const bottomAndRight = document.querySelector("#bottom-and-right");
      bottomAndRight.textContent = "";
      nextRound(score);
      console.log("Blank Lyrics with Track.Lyrics.get");
    } else {
      displayLyrics(requiredLyrics);
    }
  } catch (err) {
    getTrackLyrics(trackId);
    console.log("Error calling Lyrics with Track.Lyrics.get", err);
  }
};

const displayLyrics = (requiredLyrics) => {
  const [lyricsPart1, notCommericalUse] = requiredLyrics.split("*******");
  const topAndLeft = document.querySelector("#top-and-left");
  const showLyrics = document.createElement("pre");
  showLyrics.classList.add("lyrics-container");
  showLyrics.textContent = lyricsPart1;
  topAndLeft.appendChild(showLyrics);
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
      button.classList.add("option-selected-content");
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
    const largeScreenDisplay = document.querySelector("#bottom-info");
    const showScore = document.createElement("span");
    showScore.classList.add("show-score");
    showScore.textContent = `${score.correct}/${score.completed}`;
    largeScreenDisplay.appendChild(showScore);
  }
};

const checkWinnerRemoveScore = (score) => {
  if (score.completed >= 2 && score.completed <= 9) {
    console.log("success score removed");
    const removeScore = document.querySelector(".show-score");
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
  const removeScore = document.querySelector(".show-score");
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
  correctAnswerResponse.classList.add("correct-answer-response");
  correctAnswerResponse.textContent = `YAY! ${optionSelectedContent} sang that song!`;
  bottomAndRight.appendChild(correctAnswerResponse);

  const correctImg = document.createElement("iframe");
  correctImg.classList.add("correct-img");
  correctImg.src = "https://giphy.com/embed/xuXzcHMkuwvf2";
  bottomAndRight.appendChild(correctImg);
};

const showWrongDisplay = (optionSelectedContent, bottomAndRight) => {
  bottomAndRight.textContent = "";
  const wrongAnswerResponse = document.createElement("div");
  wrongAnswerResponse.classList.add("wrong-answer-response");
  wrongAnswerResponse.textContent = `SIGH! ${optionSelectedContent} did not sing that song!`;
  bottomAndRight.appendChild(wrongAnswerResponse);

  const wrongImg = document.createElement("iframe");
  wrongImg.classList.add("wrong-img");
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
  const optionButtons = document.querySelectorAll(".option-button");
  optionButtons.forEach((button) => {
    button.remove();
  });

  const winFinalScore = document.createElement("div");
  winFinalScore.classList.add("win-final-score");
  winFinalScore.textContent = `${score.correct}/${score.completed}`;
  const topAndLeft = document.querySelector("#top-and-left");
  topAndLeft.appendChild(winFinalScore);

  const winResponse = document.createElement("div");
  winResponse.classList.add("win-response");
  winResponse.textContent = `Correct Matches!`;
  topAndLeft.appendChild(winResponse);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const winGif = document.createElement("iframe");
  winGif.classList.add("win-gif");
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
  const optionButtons = document.querySelectorAll(".option-button");
  optionButtons.forEach((button) => {
    button.remove();
  });
  const topAndLeft = document.querySelector("#top-and-left");
  const only = document.createElement("div");
  only.classList.add("only");
  only.textContent = `Only...`;
  topAndLeft.appendChild(only);

  const loseFinalScore = document.createElement("div");
  loseFinalScore.classList.add("lose-final-score");
  loseFinalScore.textContent = `${score.correct}/${score.completed}`;
  topAndLeft.appendChild(loseFinalScore);

  const correctCount = document.createElement("div");
  correctCount.classList.add("number-of-matches-lose");
  correctCount.textContent = `matches`;
  topAndLeft.appendChild(correctCount);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const loseGif = document.createElement("iframe");
  loseGif.classList.add("lose-gif");
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

module.exports = {
  getRandomNumber,
  generateArtistName2,
  generateArtistName3,
  displayLyrics,
};
