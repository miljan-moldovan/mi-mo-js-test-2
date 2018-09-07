export const cancelRequest = (canceler) => {
  if (canceler) {
    canceler();
    return true;
  }
  return true;
};

export default cancelRequest;
