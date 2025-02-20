const createLocaleDateTime = () => {
  const date = new Date();
  return date.toLocaleString();
};

export { createLocaleDateTime };
