import PropTypes from 'prop-types';

export default PropTypes.shape({
  setParams: PropTypes.func,
  goBack: PropTypes.func,
  navigate: PropTypes.func,
  state: PropTypes.shape({
    params: PropTypes.shape({
      isBtnEnabled: PropTypes.bool,
      handleCancel: PropTypes.func,
    }),
  }),
});
