export default (canceler) => {
  if (canceler) {
    canceler();
    return true;
  }
  return true;
};
