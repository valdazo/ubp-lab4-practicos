let time = new Date();
time = new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate()));

module.exports = {
  getTime: (days) => {
    if (days) {
      let aux = new Date();
      aux.setDate(aux.getDate() + days);
      return aux;
    } else {
      return time;
    }
  },
  modifyTime: days => {
    time.setDate(time.getDate() + days);
    return time;
  }
}