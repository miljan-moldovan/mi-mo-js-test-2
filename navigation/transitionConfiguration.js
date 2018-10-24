
const SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 1, 1],
  });

  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};

const SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0],
  });

  const slideFromBottom = { transform: [{ translateY }] };
  return slideFromBottom;
};

const TransitionConfiguration = () => ({
  transitionSpec: {
    duration: 400,
    useNativeDriver: true,
  },
  screenInterpolator: (sceneProps) => {
    const { layout, position, scene } = sceneProps;
    const height = layout.initHeight;
    const width = layout.initWidth;
    const { index, route } = scene;
    const params = route.params || {};
    const transition = params.transition || 'default';
    return {
      SlideFromBottom: SlideFromBottom(index, position, height),
      default: SlideFromRight(index, position, width),
    }[transition];
  },
});

export default TransitionConfiguration;
