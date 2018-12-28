import { Easing, Animated } from 'react-native';

const SlideFromRight = (thisSceneIndex, position, layout) => {
  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
    outputRange: [width, 0, 0],
  });

  return { transform: [{ translateX }] };
};

const SlideFromBottom = (thisSceneIndex, position, layout) => {
  const height = layout.initHeight;
  const from = (thisSceneIndex === 0) ? -1 : 0;

  const translateY = position.interpolate({
    inputRange: [from, thisSceneIndex],
    outputRange: [height, 0],
  });

  return { transform: [{ translateY }] };
};

const TransitionConfiguration = () => ({
  transitionSpec: {
    duration: 700,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  screenInterpolator: ({ layout, position, scene, scenes, index: toIndex }) => {
    // TODO: Interpolator is called 22 (!) times during a transition. Either rewrite navigation or optimize interpolator
    const { index: thisSceneIndex, route: { transition } } = scene;
    const transitionAnimation = (transition === 'SlideFromRight') ? SlideFromRight : SlideFromBottom;

    const lastSceneIndex = scenes[scenes.length - 1].index;

    if (lastSceneIndex - toIndex > 1) {
      // don't animate after the transition is over
      if (thisSceneIndex === toIndex) {
        return;
      }
      // don't animate transitions in between
      if (thisSceneIndex !== lastSceneIndex) {
        return { opacity: 0 };
      }
    }
    return transitionAnimation(thisSceneIndex, position, layout);
  },
});

export default TransitionConfiguration;
