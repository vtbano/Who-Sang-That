const {
  getRandomNumber,
  generateArtistName2,
  generateArtistName3,
} = require("./util.js");

const trackListMockResponse = {
  track_list: [
    {
      track: { track_id: 1234, artist_name: "Abby Test" },
    },
    {
      track: { track_id: 5678, artist_name: "Bob Test" },
    },
    {
      track: { track_id: 91011, artist_name: "Carol Test" },
    },

    {
      track: { track_id: 21314, artist_name: "Dave Test" },
    },
    {
      track: { track_id: 151617, artist_name: "Eric Test" },
    },

    {
      track: { track_id: 181920, artist_name: "Frank Test" },
    },
  ],
};

const songCount = trackListMockResponse.track_list.length;
const getArtist = getRandomNumber(songCount);
const artistName = trackListMockResponse.track_list[0].track.artist_name;
const artistNameTest2 = trackListMockResponse.track_list[1].track.artist_name;
const artistNameTest3 = trackListMockResponse.track_list[2].track.artist_name;
const artistName2 = generateArtistName2(trackListMockResponse, artistName);
const artistName3 = generateArtistName3(
  trackListMockResponse,
  artistName,
  artistName2
);
console.log("----------");
console.log("Test for getRandomNumber");
console.log(getRandomNumber(songCount) !== 7);
console.log(getRandomNumber(songCount) !== 100);
console.log(getRandomNumber(songCount) >= 0 <= 5);

console.log("----------");
console.log("Test for generateArtistName2");
console.log(
  generateArtistName2(trackListMockResponse, artistName) !== artistName
);
console.log(
  generateArtistName2(trackListMockResponse, artistNameTest2) !== artistName2
);
console.log(
  generateArtistName2(trackListMockResponse, artistNameTest3) !== artistName3
);
console.log("----------");
console.log("Test for generateArtistName3");
console.log(
  generateArtistName3(trackListMockResponse, artistName, artistName2) !==
    artistName || artistName2
);
console.log(
  generateArtistName3(trackListMockResponse, artistNameTest2, artistName2) !==
    artistNameTest2 || artistName2
);
console.log(
  generateArtistName3(trackListMockResponse, artistNameTest3, artistName2) !==
    artistNameTest3 || artistName2
);
console.log("----------");
