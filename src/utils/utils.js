const createLocaleDateTime = () => {
  const date = new Date();
  return date.toLocaleString();
};

module.exports = {
    createLocaleDateTime
}
