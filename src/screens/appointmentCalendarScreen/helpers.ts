export const getHeaderRoomsOrResources = (arr, type) => {
  const newArray = [];

  arr.forEach((item) => {
    for (let i = 1; i <= item[`${type}Count`]; i++) {

      newArray.push({ ...item, name: `${item.name} #${i}`, id: `${item.id}_${i}` });
    }
  });
  return newArray;
};
