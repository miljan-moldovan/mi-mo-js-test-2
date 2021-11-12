export const isCardWithGap = card => (card.afterTime !== '00:00:00' && card.gapTime !== '00:00:00' && !!card.gapTime);

export default isCardWithGap;
