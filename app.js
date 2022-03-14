const playGame = async () => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apiKey}`
    );
    const data = await response.json();
    const body = data.message.body;
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    const songCount = body.track_list.length;
    const getRandomName = getRandomNumber(songCount);
    const songName = body.track_list[getRandomName].track.track_name; // const song name
    const artistName = body.track_list[getRandomName].track.artist_name; // const artist name
    const artistName2 =
      body.track_list[getRandomNumber(songCount)].track.artist_name;
    const artistName3 =
      body.track_list[getRandomNumber(songCount)].track.artist_name;

    const artistArray = [artistName, artistName2, artistName3];

    const mixedArtistOrder = shuffle(artistArray);

    const landingPageImage = document.querySelector("#landing-page-img");
    landingPageImage.remove();

    const gameDescription = document.querySelector(".gameDescription");
    gameDescription.remove();

    const playButton = document.querySelector(".playButton");
    playButton.remove();

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
    const optionButtons = document.querySelectorAll("button");
    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const optionSelectedContent = button.textContent;
        optionSelectedView(
          optionSelectedContent,
          artistName,
          bottomAndRight,
          firstButton,
          secondButton,
          thirdButton
        );
      });
    });
  } catch (err) {
    playGame();
  }
};

const playButton = document.querySelector(".playButton");
playButton.addEventListener("click", playGame);

const getLyrics = async (songName, artistName) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songName}&q_artist=${artistName}&apikey=${apiKey}`
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
    getLyrics();
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

const nextRound = async (songName, artistName) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apiKey}`
    );
    const data = await response.json();
    const body = data.message.body;
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    const songCount = body.track_list.length;
    const getRandomName = getRandomNumber(songCount);
    const songName = body.track_list[getRandomName].track.track_name; // const song name
    const artistName = body.track_list[getRandomName].track.artist_name; // const artist name
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

    const optionButtons = document.querySelectorAll("button");
    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const optionSelectedContent = button.textContent;
        optionSelectedView(
          optionSelectedContent,
          artistName,
          bottomAndRight,
          firstButton,
          secondButton,
          thirdButton
        );
      });
    });
  } catch (err) {
    nextRound();
  }
};

const optionSelectedView = (
  optionSelectedContent,
  artistName,
  bottomAndRight,
  firstButton,
  secondButton,
  thirdButton
) => {
  if (firstButton.textContent !== optionSelectedContent) {
    firstButton.remove();
  }
  if (secondButton.textContent !== optionSelectedContent) {
    secondButton.remove();
  }
  if (thirdButton.textContent !== optionSelectedContent) {
    thirdButton.remove();
  }

  if (firstButton.textContent === optionSelectedContent) {
    firstButton.classList.remove("firstButton");
    firstButton.removeAttribute("id");
    firstButton.classList.add("optionSelectedContent");
  }

  if (secondButton.textContent === optionSelectedContent) {
    secondButton.classList.remove("secondButton");
    secondButton.removeAttribute("id");
    secondButton.classList.add("optionSelectedContent");
  }

  if (thirdButton.textContent === optionSelectedContent) {
    thirdButton.classList.remove("thirdButton");
    thirdButton.removeAttribute("id");
    thirdButton.classList.add("optionSelectedContent");
  }

  if (optionSelectedContent === artistName) {
    setTimeout(() => {
      correctOptionSelected(
        optionSelectedContent,
        bottomAndRight,
        firstButton,
        secondButton,
        thirdButton
      );
    }, 3000);
  } else {
    setTimeout(() => {
      wrongOptionSelected(
        optionSelectedContent,
        bottomAndRight,
        firstButton,
        secondButton,
        thirdButton
      );
    }, 3000);
  }
};

const correctOptionSelected = (
  optionSelectedContent,
  bottomAndRight,
  firstButton,
  secondButton,
  thirdButton
) => {
  firstButton.remove();
  secondButton.remove();
  thirdButton.remove();

  const correctAnswerResponse = document.createElement("div");
  correctAnswerResponse.classList.add("correctAnswerResponse");
  correctAnswerResponse.textContent = `YAY! ${optionSelectedContent} sang that song!`;
  bottomAndRight.appendChild(correctAnswerResponse);

  const correctImg = document.createElement("img");
  correctImg.classList.add("correctImg");
  correctImg.src = "images/WinnieTrumpet.png";
  bottomAndRight.appendChild(correctImg);

  const nextGameButton = document.createElement("button");
  nextGameButton.classList.add("nextGameButton");
  nextGameButton.textContent = "Hit me with the next tune ♫";
  bottomAndRight.appendChild(nextGameButton);
  nextGameButton.addEventListener("click", () => {
    const bottomAndRight = document.querySelector("#bottom-and-right");
    const topAndLeft = document.querySelector("#top-and-left");
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    nextRound();
  });
};

const wrongOptionSelected = (
  optionSelectedContent,
  bottomAndRight,
  firstButton,
  secondButton,
  thirdButton
) => {
  firstButton.remove();
  secondButton.remove();
  thirdButton.remove();
  const wrongAnswerResponse = document.createElement("div");
  wrongAnswerResponse.classList.add("wrongAnswerResponse");
  wrongAnswerResponse.textContent = `SIGH! ${optionSelectedContent} did not sing that song!`;
  bottomAndRight.appendChild(wrongAnswerResponse);

  const wrongImg = document.createElement("img");
  wrongImg.classList.add("wrongImg");
  wrongImg.src = "images/sad-face.png";
  bottomAndRight.appendChild(wrongImg);

  const nextGameButton = document.createElement("button");
  nextGameButton.classList.add("nextGameButton");
  nextGameButton.textContent = "Hit me with the next tune ♫";
  bottomAndRight.appendChild(nextGameButton);
  nextGameButton.addEventListener("click", () => {
    const bottomAndRight = document.querySelector("#bottom-and-right");
    const topAndLeft = document.querySelector("#top-and-left");
    bottomAndRight.textContent = "";
    topAndLeft.textContent = "";
    nextRound();
  });
};
