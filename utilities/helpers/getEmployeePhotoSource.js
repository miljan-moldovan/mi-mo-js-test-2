import { get, isNull } from 'lodash';

export default employee => (!isNull(get(employee, 'imagePath', null)) && !isNull(get(employee, 'imageName', null)) ?
  { uri: `${employee.imagePath}/${employee.imageName}`.replace('http:', 'https:') } :
  null);
