export const shortenTitle = (title) => {
  if (title.length > 18) {
    let newTitle = title.slice(0, 15);
    newTitle = newTitle.concat('...');
    return newTitle;
  }
  return title;
};

export default shortenTitle;
