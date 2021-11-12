export const cancelRequest = (canceler) => {
  if (canceler) {
    canceler();
  }
  return true;
};

export default cancelRequest;
