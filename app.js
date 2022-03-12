const playGame = async () => {
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

  const getLyrics = async () => {
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
  };

  getLyrics();
};

const playButton = document.querySelector(".playButton");
playButton.addEventListener("click", playGame);

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

const optionButtons = document.querySelectorAll("#optionButton");
optionButtons.forEach((button) => {
  button.addEventListener("click");
});
//ATTEMPT AT FUNCTIONAL PROGRAMMING SOLUTION FOR RANDOM ARRAY
// const array1 = ["bananas", "apples", "peaches"];

// const shuffleArtists = (array) =>
//   array.reduce((acc, x) => {
//     const currentIndex = array.length;
//     const randomIndex = Math.floor(Math.random() * currentIndex + 1);
//     return currentIndex !== randomIndex
//       ? [...acc, array[randomIndex + 1]]
//       : [...acc, x];
//   }, []);

// shuffleArtists(array1);
// console.log(shuffleArtists(array1));

//POSSIBLE SOLUTION FOR DUPLICATES

// const artistName3 = (body, songCount) => {
//   const thirdArtist =
//     body.track_list[getRandomNumber(songCount)].track.artist_name;
//   if (thirdArtist === artistName || thirdArtist === artistName2) {
//     return alternateArtistName3();
//   } else {
//     return thirdArtist;
//   }
// };

//GET ARRAY COUNT
// (async () => {
//   const response = await fetch(
//     "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apiKey}"
//   );
//   const data = await response.json();
//   const body = data.message.body;
//   console.log(body.track_list.length);
//   // const getRandomNumber = (max) => Math.floor(Math.random() * max);
//   // const getRandomName = getRandomNumber(50);
// })();

//OLD CODE WITHOUT SHUFFLE
// chart.tracks.get with math.random()

// (async () => {
//   const response = await fetch(
//     "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apiKey}"
//   );
//   const data = await response.json();
//   const body = data.message.body;
//   const getRandomNumber = (max) => Math.floor(Math.random() * max);
//   const songCount = body.track_list.length;
//   const getRandomName = getRandomNumber(songCount);
//   const songName = body.track_list[getRandomName].track.track_name; // const song name
//   const artistName = body.track_list[getRandomName].track.artist_name; // const artist name
//   // console.log("Song Name:", songName);
//   // console.log("Artist Name:", artistName);
//   // console.log("Alternate Ariststs:");
//   const correctArtistName = document.querySelector(".first");
//   correctArtistName.textContent = artistName;
//   const alternateArtistName2 =
//     body.track_list[getRandomNumber(songCount)].track.artist_name;
//   const showArtistName2 = document.querySelector(".second");
//   showArtistName2.textContent = alternateArtistName2;
//   // console.log("2:", alternateArtistName2);

//   const artistName3 = (body, songCount) => {
//     const thirdArtist =
//       body.track_list[getRandomNumber(songCount)].track.artist_name;
//     if (thirdArtist === artistName || thirdArtist === alternateArtistName2) {
//       return artistName3();
//     } else {
//       return thirdArtist;
//     }
//   };
//   // const alternateArtistName3 =
//   //   body.track_list[getRandomNumber(songCount)].track.artist_name;
//   // // console.log("3:", alternateArtistName3);
//   const showArtistName3 = document.querySelector(".third");
//   showArtistName3.textContent = artistName3;

//   const getLyrics = async () => {
//     const response = await fetch(
//       `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songName}&q_artist=${artistName}&apikey=${apiKey}`
//     );
//     const data = await response.json();
//     const body = data.message.body;
//     const requiredLyrics = body.lyrics.lyrics_body;
//     const showLyrics = document.querySelector(".lyrics-container");
//     showLyrics.textContent = requiredLyrics;
//     // console.log(requiredLyrics);
//   };

//   getLyrics();
// })();
