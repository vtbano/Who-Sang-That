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

if (typeof module !== "undefined") {
  module.exports = {
    getRandomNumber,
    generateArtistName2,
    generateArtistName3,
  };
}
