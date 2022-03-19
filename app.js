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
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apiKey3}`
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
    const artistName3 = generateArtistName3(body, songCount);

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

const generateArtistName3 = (body, songCount) => {
  const thirdArtist =
    body.track_list[getRandomNumber(songCount)].track.artist_name;
  if (thirdArtist === artistName || thirdArtist === artistName2) {
    return generateArtistName3();
  } else {
    return thirdArtist;
  }
};
const playButton = document.querySelector(".playButton");
playButton.addEventListener("click", playGame);

const getLyrics = async (songName, artistName) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songName}&q_artist=${artistName}&apikey=${apiKey3}`
    );
    const data = await response.json();
    const body = data.message.body;
    console.log(body);
    const requiredLyrics = body.lyrics.lyrics_body;
    const [lyricsPart1, notCommericalUse] = requiredLyrics.split("*******");
    const topAndLeft = document.querySelector("#top-and-left");
    const showLyrics = document.createElement("pre");
    showLyrics.classList.add("lyrics-container");
    showLyrics.textContent = lyricsPart1;
    topAndLeft.appendChild(showLyrics);
  } catch (err) {
    // catch (){}

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
  if (optionSelectedContent === artistName) {
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
  } else {
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
  }
};

const displayNewScore = (score) => {
  if (score.completed <= 9) {
    const smallScreenDisplay = document.querySelector("#pageTitle"); //will adjust with css flex
    const largeScreenDisplay = document.querySelector("#bottomInfo"); //will adjust with css flex
    const showScore = document.createElement("span");
    showScore.classList.add("showScore");
    showScore.textContent = `${score.correct}/${score.completed}`;
    smallScreenDisplay.appendChild(showScore);
    largeScreenDisplay.appendChild(showScore);
  }
};

const removeDisplayScore = (score) => {
  if (
    score.completed >= 2 &&
    score.completed <= 9
    // score.completed === 2 ||
    // score.completed === 3 ||
    // score.completed === 4 ||
    // score.completed === 5 ||
    // score.completed === 6 ||
    // score.completed === 7 ||
    // score.completed === 8 ||
    // score.completed === 9
  ) {
    console.log("success score removed");
    const removeScore = document.querySelector(".showScore");
    removeScore.remove();
  } else if (score.completed === 1) {
    console.log("initial play");
  } else if (score.correct >= 6 && score.completed === 10) {
    console.log("WIN");
    const removeScore = document.querySelector(".showScore");
    const bottomAndRight = document.querySelector("#bottom-and-right");
    const topAndLeft = document.querySelector("#top-and-left");
    console.log("removeScore from win:", removeScore);
    removeScore.remove();
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    winDisplay(score);
    displayNextRoundButton();
    return;
  } else if (score.correct <= 5 && score.completed === 10) {
    console.log("LOSE");
    const removeScore = document.querySelector(".showScore");
    const bottomAndRight = document.querySelector("#bottom-and-right");
    const topAndLeft = document.querySelector("#top-and-left");
    console.log("removeScore from LOSE:", removeScore);
    removeScore.remove();
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    loseDisplay(score);
    displayNextRoundButton();
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
  // <iframe src="https://giphy.com/embed/xuXzcHMkuwvf2" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/90s-the-girls-are-in-charge-xuXzcHMkuwvf2">via GIPHY</a></p>
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
  //jigglypuff slapping pikachew
  // <iframe src="https://giphy.com/embed/dICjAqixKQFnG" width="480" height="372" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/dICjAqixKQFnG">via GIPHY</a></p>
};

const displayNextGameButton = (bottomAndRight, newScore) => {
  if (
    newScore.completed >= 1 &&
    newScore.completed <= 9
    // newScore.completed === 1 ||
    // newScore.completed === 2 ||
    // newScore.completed === 3 ||
    // newScore.completed === 4 ||
    // newScore.completed === 5 ||
    // newScore.completed === 6 ||
    // newScore.completed === 7 ||
    // newScore.completed === 8 ||
    // newScore.completed === 9
  ) {
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
  }
};

const winDisplay = (score) => {
  const optionButtons = document.querySelectorAll("#optionButton");
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
  // <iframe src="https://giphy.com/embed/oHB0VofpRubjW" width="480" height="372" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jigglypuff-sig-oHB0VofpRubjW">via GIPHY</a></p>
  bottomAndRight.appendChild(winGif);

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
  const optionButtons = document.querySelectorAll("#optionButton");
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
  correctCount.classList.add("correctCount");
  correctCount.textContent = `correct matches`;
  topAndLeft.appendChild(correctCount);

  const bottomAndRight = document.querySelector("#bottom-and-right");
  const loseGif = document.createElement("iframe");
  loseGif.classList.add("loseGif");
  loseGif.src = "https://giphy.com/embed/hQ0GvkpZwYcgM";
  bottomAndRight.appendChild(loseGif);
};

const displayNextRoundButton = () => {
  const nextRoundButton = document.createElement("button");
  nextRoundButton.classList.add("nextRoundButton");
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
