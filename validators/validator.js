// sólo números
let ID = /^[0-9]+$/;
// mayúsculas, minúsculas o espacios
let STRING = /^[A-Za-z ?]+$/;

module.exports = {
  id: id => {
    return ID.test(id);
  },
  string: str => {
    return STRING.test(str);
  }
}