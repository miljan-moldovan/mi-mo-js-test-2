import PropTypes from 'prop-types';

const reasonTypeModel = {
  key: PropTypes.number,
  name: PropTypes.string,
  allowNoShow: PropTypes.bool,
  allowWalkOut: PropTypes.bool,
  allowRemoval: PropTypes.bool,
  id: PropTypes.number,
  updateStamp: PropTypes.number,
  isDeleted: PropTypes.bool,
};

export default reasonTypeModel;
