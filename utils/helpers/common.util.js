
const removeNullUndefined = (obj) => {
  for (let prop in obj) {
    if (obj[prop] === null || obj[prop] === undefined) {
      delete obj[prop];
    }
  }
  return obj;
};

const randomString = async (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const titleCase = (string) => {
  const words = string.split(' ');

  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(' ');

};

const createSlug = (title) => {
  var key = title.toString().trim().toLowerCase();
  key = key.replace(/ /g, "-");
  return key;
};
module.exports = {
  removeNullUndefined,
  randomString,
  titleCase,
  createSlug,
};
