export const getHeaderRoomsOrResources = (arr) => {
  const newArray = [];

  arr.forEach((item) => {
    for (let i = 1; i <= item.roomCount; i++) {

      newArray.push({ ...item, name: `${item.name} #${i}`, id: `${item.id}_${i}` });
    }
  });
  return newArray;
};
