import { get, isNull } from 'lodash';

export const getEmployeePhotoSource = (employee) => {
  const img = (!isNull(get(employee, 'imagePath', null)) && !isNull(get(employee, 'imageName', null)) ?
    {
      uri: `${employee.imagePath}/${employee.imageName}`.replace('http:', 'https:').replace('zenithpos.qa.cicd.salondev.net', 'nw.qa.sg.salondev.net'),
    } :
    null);
  return img;
};

export default getEmployeePhotoSource;
