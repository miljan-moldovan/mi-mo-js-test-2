import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import ScrollView, {ScrollViewChild} from 'react-native-directed-scrollview';
import {
  values,
  forEach,
  zipObject,
  chain,
  filter,
  get,
  uniqBy,
  keyBy,
  groupBy,
  mapValues,
  reverse,
  mergeWith,
} from 'lodash';
import moment from 'moment';

import CardGrid from '../cardGrid';
import Board from './board';
import Header from './header';
import TimeColumn from './timeColumn';
import Card from './card/index';
import CurrentTime from '../currentTime';
import Buffer from '../calendarBuffer';
import SalonAlert from '../../../SalonAlert';
import BlockTime from './blockCard';
import EmptyScreen from './EmptyScreen';
import {
  getHiddenAddons,
  sortCardsForBoard,
  getRangeExtendedMoment,
  isCardWithGap,
  areDatesInRange,
  areDateRangeOverlapped,
} from '../../../../utilities/helpers';
import DateTime from '../../../../constants/DateTime';
import ViewTypes from '../../../../constants/ViewTypes';
import {
  CHECK_APPT_CONFLICTS,
  CHECK_APPT_CONFLICTS_SUCCESS,
  CHECK_APPT_CONFLICTS_FAILED,
} from '../../../../redux/actions/appointment';

const extendedMoment = getRangeExtendedMoment ();

const findOverlappingAppointments = (cardId, intermediateResultDict) => {
  const otherCardsOverlapping = intermediateResultDict[
    cardId
  ].overlappingCards.reduce (
    (accumulator, item) => [
      ...accumulator,
      ...findOverlappingAppointments (item.id, intermediateResultDict),
    ],
    []
  );

  return uniqBy (
    [
      ...intermediateResultDict[cardId].overlappingCards,
      ...otherCardsOverlapping,
    ],
    'id'
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 1000,
    width: 1000,
    borderColor: '#C0C1C6',
  },
  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  boardContainer: {
    marginLeft: 36,
  },
  columnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

const screenWidth = Dimensions.get ('window').width;
const screenHeight = Dimensions.get ('window').height;
const dayWidth = screenWidth - 36;
const weekWidth = (screenWidth - 36) / 7;
const providerWidth = 130;
const headerHeight = 40;

export default class Calendar extends React.Component {
  constructor (props) {
    super (props);
    this.offset = {x: 0, y: 0};
    this.setCellsByColumn (props);
    this.state = {
      cardsArray: [],
      overlappingCardsMap: null,
      alert: null,
      calendarMeasure: {
        width: 0,
        height: 0,
      },
      calendarOffset: {
        x: 0,
        y: 0,
      },
      buffer: [],
      pan: new Animated.ValueXY ({x: 0, y: 0}),
      pan2: new Animated.ValueXY ({x: 0, y: 0}),
      isResizeing: false,
    };
    this.size = {width: 0, height: 0};
    this.panResponder = PanResponder.create ({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        (this.state.activeBlock || this.state.activeCard) && !this.state.alert,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        (this.state.activeBlock || this.state.activeCard) && !this.state.alert,
      onPanResponderMove: (e, gesture) => {
        const {dy, dx} = gesture;
        if (this.state.activeBlock || this.state.activeCard) {
          if (!this.state.isResizeing) {
            this.moveX = dx;
            this.moveY = dy;
            return Animated.event ([
              null,
              {
                dx: this.state.pan.x,
                dy: this.state.pan.y,
              },
              {
                dx: this.state.pan2.x,
                dy: this.state.pan2.y,
              },
            ]) (e, gesture, gesture);
          }
          const size = this.moveY ? dy - this.moveY : dy;
          this.moveY = dy;
          if (this.resizeCard) {
            const lastIndex =
              this.state.activeCard.verticalPositions.length - 1;
            const newHeight = this.resizeCard.resizeCard (size);
            this.state.activeCard.verticalPositions[
              lastIndex
            ].height = newHeight;
            this.state.activeCard.height = newHeight;
          } else if (this.resizeBlock) {
            this.state.activeBlock.height = this.resizeBlock.resize (size);
          }
        }
        return null;
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.state.activeCard || this.state.activeBlock) {
          if (this.state.isResizeing) {
            this.handleResizeCard ();
          } else if (this.moveX && this.moveY) {
            this.handleCardDrop ();
          }
        }
      },
    });
  }

  componentDidMount () {
    const {appointments, blockTimes} = this.props;
    this.setGroupedAppointments (this.props);
  }

  componentWillReceiveProps (nextProps) {
    const {
      appointments,
      blockTimes,
      selectedFilter,
      selectedProvider,
      displayMode,
    } = nextProps;
    if (
      this.props.selectedFilter !== selectedFilter ||
      this.props.selectedProvider !== selectedProvider ||
      this.props.displayMode !== displayMode ||
      this.props.appointments !== appointments ||
      this.props.blockTimes !== blockTimes
    ) {
      this.setGroupedAppointments (nextProps);
    }
  }

  componentWillUpdate (nextProps) {
    if (
      (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading) ||
      nextProps.displayMode !== this.props.displayMode
    ) {
      this.setCellsByColumn (nextProps);
    }
    if (
      nextProps.displayMode !== this.props.displayMode ||
      nextProps.selectedProvider !== this.props.selectedProvider
    ) {
      this.state.buffer = [];
      nextProps.manageBuffer (false);
    }
    if (nextProps.isLoading) {
      this.clearActive ();
    }
    if (
      nextProps.startDate.format ('YYYY-MM-DD') !==
      this.props.startDate.format ('YYYY-MM-DD')
    ) {
      this.board.scrollTo ({x: 0, y: 0});
    }
  }

  componentDidUpdate () {
    if (this.goToPosition && !this.props.isLoading) {
      const top = this.goToPosition.top - this.state.calendarMeasure.height / 2;
      const left =
        this.goToPosition.left - this.state.calendarMeasure.width / 2;
      this.board.scrollTo ({
        x: left >= 0 ? left : 0,
        y: top >= 0 ? top : 0,
        animated: true,
      });
      this.goToPosition.highlightCard ();
      this.props.clearGoToAppointment ();
      this.goToPosition = null;
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.displayMode !== this.props.displayMode ||
      this.props.isLoading !== nextProps.isLoading ||
      this.state.alert !== nextState.alert ||
      this.state.activeCard !== nextState.activeCard ||
      this.state.activeBlock !== nextState.activeBlock ||
      this.props.bufferVisible !== nextProps.bufferVisible
    );
  }

  setGroupedAppointments = ({
    blockTimes,
    appointments,
    selectedFilter,
    selectedProvider,
    displayMode,
  }) => {
    let groupByCondition = ViewTypes[selectedFilter];
    if (selectedFilter === 'providers') {
      if (selectedProvider === 'all') {
        groupByCondition = groupByCondition[selectedProvider];
      } else {
        groupByCondition = groupByCondition[displayMode];
      }
    }

    const groupedAppointments = groupBy (
      appointments,
      groupByCondition !== 'date'
        ? groupByCondition
        : item => moment (item.date).format (DateTime.date)
    );
    const groupedBlocks = groupBy (
      blockTimes,
      groupByCondition !== 'date'
        ? groupByCondition
        : item => moment (item.date).format (DateTime.date)
    );

    const cardsArray = mergeWith (
      {...groupedAppointments},
      {...groupedBlocks},
      (objValue, srcValue) =>
        (objValue && objValue.concat (srcValue)) || srcValue
    );

    const overlappingCardsMap = this.setCardsOverlappingMap (cardsArray);
    this.setState ({
      groupedAppointments,
      groupedBlocks,
      overlappingCardsMap,
      cardsArray,
    });
  };

  setCardsOverlappingMap = (groupedCards = null) => {
    const processedCardsIds = [];
    return mapValues (groupedCards, cards => {
      const intermediateResult = sortCardsForBoard (cards).map (card => {
        const sT = moment (card.fromTime, DateTime.timeOld);
        const eT = moment (card.toTime, DateTime.timeOld);
        processedCardsIds.push (card.id);

        const overlappingCards = cards.filter (item => {
          // filter out itself
          if (card.id === item.id) {
            return false;
          }

          // filter out already processed cards
          if (processedCardsIds.includes (item.id)) {
            return false;
          }

          const itemStartTime = moment (item.fromTime, DateTime.timeOld);

          // do not consider appointments after this one
          if (!itemStartTime.isSameOrBefore (sT)) {
            return false;
          }

          const itemEndTime = moment (item.toTime, DateTime.timeOld);
          const range1 = extendedMoment.range (itemStartTime, itemEndTime);
          const range2 = extendedMoment.range (sT, eT);
          const containsConfig = {excludeStart: true, excludeEnd: true};

          // consider only appointments which are overlapping each other
          if (
            !range1.intersect (range2) &&
            !(range1.contains (sT, containsConfig) ||
              range1.contains (eT, containsConfig))
          ) {
            return false;
          }

          // do not take into account appointments with a gap if this one falls with in their gap
          const itemGapStartTime = itemStartTime.add (
            moment.duration (item.afterTime)
          );
          const itemGapEndTime = itemGapStartTime
            .clone ()
            .add (moment.duration (item.gapTime));

          return (
            (isCardWithGap (item) &&
              !areDatesInRange (itemGapStartTime, itemGapEndTime, sT, eT)) ||
            !isCardWithGap (item)
          );
        });

        return {
          cardId: card.id,
          overlappingCards,
        };
      });

      const intermediateResultDict = keyBy (intermediateResult, 'cardId');

      const result = intermediateResult.map (item => {
        const previousCardsOverlapping = item.overlappingCards.reduce (
          (accumulator, overlappingCard) => [
            ...accumulator,
            ...findOverlappingAppointments (
              overlappingCard.id,
              intermediateResultDict
            ),
          ],
          []
        );

        return {
          cardId: item.cardId,
          overlappingCardsLength: uniqBy (
            [...item.overlappingCards, ...previousCardsOverlapping],
            'id'
          ).length,
        };
      });
      return keyBy (result, 'cardId');
    });
  };

  setGoToPositon = ({left, top, highlightCard}) => {
    this.goToPosition = {
      left,
      top,
      highlightCard,
    };
  };

  setCellsByColumn = nextProps => {
    const {
      apptGridSettings,
      headerData,
      selectedFilter,
      selectedProvider,
      displayMode,
    } = nextProps;

    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      if (
        selectedFilter === 'providers' ||
        selectedFilter === 'deskStaff' ||
        selectedFilter === 'rebookAppointment'
      ) {
        if (selectedProvider === 'all') {
          const firstColumnWidth = selectedFilter === 'providers' ? 166 : 36;
          this.size = {
            width: headerData.length * providerWidth + firstColumnWidth,
            height: apptGridSettings.numOfRow * 30 + headerHeight,
          };
          this.cellWidth = providerWidth;
        } else if (displayMode === 'week') {
          this.size = {
            width: headerData.length * weekWidth + 36,
            height: apptGridSettings.numOfRow * 30 + headerHeight,
          };
          this.cellWidth = weekWidth;
        } else {
          this.size = {
            width: headerData.length * dayWidth + 36,
            height: apptGridSettings.numOfRow * 30,
          };
          this.cellWidth = dayWidth;
        }
      } else {
        this.size = {
          width: headerData.length * providerWidth + 36,
          height: apptGridSettings.numOfRow * 30 + headerHeight,
        };
        this.cellWidth = providerWidth;
      }
    }
  };

  setBufferCollapsed = isCollapsed => {
    this.isBufferCollapsed = isCollapsed;
  };

  getOnDragState = (
    isScrollEnabled,
    data,
    left,
    cardWidth,
    verticalPositions,
    isBuffer
  ) => {
    let newState;
    this.moveX = null;
    this.moveY = null;
    if (!isScrollEnabled) {
      const offsetY = isBuffer ? -this.calendarPosition.y : 40 - this.offset.y;
      const offsetX = isBuffer ? 0 : 36 - this.offset.x;
      this.fixOffsetY = offsetY;
      const {pan, pan2} = this.state;
      const newVerticalPositions = [];
      for (let i = 0; i < verticalPositions.length; i += 1) {
        const item = verticalPositions[i];
        const newItem = {...item, top: item.top + offsetY};
        newVerticalPositions.push (newItem);
      }
      const newTop = newVerticalPositions[0].top;
      const newLeft = left + offsetX;
      this.state.pan.setOffset ({x: newLeft, y: newTop});
      this.state.pan.setValue ({x: 0, y: 0});
      if (verticalPositions.length > 1) {
        const newTop = newVerticalPositions[1].top;
        this.state.pan2.setOffset ({x: newLeft, y: newTop});
        this.state.pan2.setValue ({x: 0, y: 0});
      }
      let {height} = verticalPositions[0];
      if (verticalPositions.length > 1) {
        const reversePosition = reverse (verticalPositions);
        height = 0;
        for (let i = 0; i < reversePosition.length; i += 1) {
          const item = reversePosition[i];
          if (i === 0) {
            height = item.top + item.height;
          } else {
            height -= item.top;
          }
        }
      }

      return {
        data,
        left: isBuffer ? 0 : left,
        cardWidth,
        verticalPositions: newVerticalPositions,
        isBuffer,
        height,
      };
    }
    return null;
  };

  measureScrollView = ({nativeEvent: {layout: {width, height}}}) => {
    const {calendarMeasure} = this.state;
    const newWidth = width - 36;
    const newHeight = height - 40;
    if (
      calendarMeasure.width === newWidth ||
      calendarMeasure.height !== newHeight
    ) {
      this.calendar.measureInWindow ((x, y) => {
        this.calendarPosition = {x, y};
      });
      this.setState ({
        calendarMeasure: {
          height: newHeight,
          width: newWidth,
        },
      });
    }
  };

  createAlert = alert => {
    this.setState ({alert});
  };

  scrollAnimation = () => {
    const {cellWidth, moveX, moveY} = this;
    const {
      selectedProvider,
      headerData,
      apptGridSettings,
      bufferVisible,
      displayMode,
      isRoom,
      isResource,
    } = this.props;
    const {calendarMeasure, pan, activeCard, activeBlock} = this.state;
    const moveableCard = activeCard || activeBlock;
    let dx = 0;
    let dy = 0;
    const boundLength = 20;
    const maxScrollChange = 15;
    const bufferHeights = this.isBufferCollapsed ? 35 : 110;
    const bufferHeight = bufferVisible ? bufferHeights : 0;
    if (moveableCard) {
      if (moveX && moveY) {
        if (!this.props.bufferVisible && this.moveY > 10) {
          this.props.manageBuffer (true);
        }
        const {cardWidth} = moveableCard;
        const maxWidth =
          headerData.length * cellWidth - calendarMeasure.width + 130;
        const scrollHorizontalBoundRight =
          calendarMeasure.width - boundLength - cardWidth + 36;
        const scrollHorizontalBoundLeft = boundLength + 36;
        const newMoveX = moveX + pan.x._offset;
        if (scrollHorizontalBoundRight < newMoveX) {
          dx = newMoveX - scrollHorizontalBoundRight;
        } else if (scrollHorizontalBoundLeft > newMoveX) {
          dx = newMoveX - scrollHorizontalBoundLeft;
        }
        if (selectedProvider === 'all' && dx !== 0) {
          dx = Math.abs (dx) > boundLength ? boundLength * Math.sign (dx) : dx;
          dx = dx * maxScrollChange / boundLength;
          this.offset.x += dx;
          if (this.offset.x > maxWidth) {
            this.offset.x = maxWidth;
          }
          if (this.offset.x < 0) {
            this.offset.x = 0;
          }
          this.scrollToX (this.offset.x);
        } else {
          const headerSize = displayMode === 'week' ||
            selectedProvider === 'all' ||
            isRoom ||
            isResource
            ? headerHeight
            : 0;
          const maxHeigth =
            apptGridSettings.numOfRow * 30 -
            calendarMeasure.height +
            bufferHeight;
          const scrollVerticalBoundTop =
            calendarMeasure.height -
            boundLength -
            moveableCard.height -
            bufferHeight +
            headerSize;
          const scrollVerticalBoundBottom = headerHeight + boundLength;
          const newMoveY = moveY + pan.y._offset;
          const isInBufferArea =
            bufferVisible &&
            newMoveY >
              calendarMeasure.height -
                bufferHeight -
                moveableCard.height +
                headerSize;
          if (scrollVerticalBoundTop < newMoveY && !isInBufferArea) {
            dy = newMoveY - scrollVerticalBoundTop;
          } else if (scrollVerticalBoundBottom > newMoveY) {
            dy = newMoveY - scrollVerticalBoundBottom;
          }
          if (dy !== 0) {
            dy = Math.abs (dy) > boundLength
              ? boundLength * Math.sign (dy)
              : dy;
            dy = dy * maxScrollChange / boundLength;
            this.offset.y += dy;
            if (this.offset.y > maxHeigth) {
              this.offset.y = maxHeigth;
            }
            if (this.offset.y < 0) {
              this.offset.y = 0;
            }
            this.scrollToY (this.offset.y);
          }
        }
      }
      requestAnimationFrame (this.scrollAnimation);
    }
  };

  scrollAnimationResize = () => {
    const {
      selectedProvider,
      apptGridSettings,
      bufferVisible,
      displayMode,
      isRoom,
      isResource,
    } = this.props;
    const {calendarMeasure, activeCard, activeBlock, isResizeing} = this.state;
    const resizeingCard = activeCard || activeBlock;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    if (isResizeing) {
      if (this.moveY) {
        const verticalPositions = activeCard
          ? activeCard.verticalPositions
          : [{top: activeBlock.top, height: activeBlock.height}];
        const lastIndex = verticalPositions.length - 1;
        const headerSize = displayMode === 'week' ||
          selectedProvider === 'all' ||
          isRoom ||
          isResource
          ? headerHeight
          : 0;

        const coordinatesY = verticalPositions[lastIndex].top - this.fixOffsetY;
        const maxHeigth =
          apptGridSettings.numOfRow * 30 - calendarMeasure.height;
        const scrollVerticalBoundTop =
          this.offset.y + calendarMeasure.height - boundLength; // - headerSize;
        const scrollVerticalBoundBottom = this.offset.y + boundLength;
        const newMoveY = coordinatesY + verticalPositions[lastIndex].height;
        if (scrollVerticalBoundTop < newMoveY) {
          dy = this.offset.y < maxHeigth
            ? newMoveY - scrollVerticalBoundTop
            : 0;
        } else if (scrollVerticalBoundBottom > newMoveY) {
          dy = newMoveY - scrollVerticalBoundBottom;
        }
        if (dy !== 0) {
          dy = Math.abs (dy) > boundLength ? boundLength * Math.sign (dy) : dy;
          dy = dy * maxScrollChange / boundLength;
          this.offset.y += dy;
          if (this.offset.y > maxHeigth) {
            this.offset.y = maxHeigth;
          }
          if (this.offset.y < 0) {
            this.offset.y = 0;
          }
          if (activeCard) {
            this.state.activeCard.verticalPositions[
              lastIndex
            ].height = this.resizeCard.resizeCard (dy);
          } else if (activeBlock) {
            this.state.activeBlock.height = this.resizeBlock.resize (dy);
          }
          this.scrollToY (this.offset.y);
        }
      }
      requestAnimationFrame (this.scrollAnimationResize);
    }
  };

  handleOnDrag = (
    isScrollEnabled,
    appointment,
    left,
    cardWidth,
    verticalPositions,
    isBuffer
  ) => {
    const newState = {
      activeCard: this.getOnDragState (
        isScrollEnabled,
        appointment,
        left,
        cardWidth,
        verticalPositions,
        isBuffer
      ),
    };
    this.setState (newState, this.scrollAnimation);
  };

  handleOnDragBlock = (
    isScrollEnabled,
    block,
    blockLeft,
    blockCardWidth,
    blockVerticalPositions,
    isBufferCard
  ) => {
    const {
      data,
      left,
      cardWidth,
      verticalPositions,
      isBuffer,
      height,
    } = this.getOnDragState (
      isScrollEnabled,
      block,
      blockLeft,
      blockCardWidth,
      blockVerticalPositions,
      isBufferCard
    );
    const newState = {
      activeBlock: {
        data: {
          ...data,
          isBlockTime: true,
        },
        left,
        cardWidth,
        height,
        isBuffer,
        top: verticalPositions[0].top,
      },
    };
    this.setState (newState, this.scrollAnimation);
  };

  handleOnResize = () => {
    const {isResizeing} = this.state;
    if (!isResizeing) {
      this.moveX = 0;
      this.moveY = 0;
      const newState = {
        isResizeing: true,
      };
      this.setState (newState, this.scrollAnimationResize);
    }
  };

  handleScroll = ev => {
    const {activeCard} = this.state;
    if (!activeCard) {
      this.offset.x = ev.nativeEvent.contentOffset.x;
      this.offset.y = ev.nativeEvent.contentOffset.y;
    }
  };

  scrollToX = dx => {
    this.board.scrollTo ({x: dx, y: this.offset.y, animated: false});
  };

  scrollToY = dy => {
    this.board.scrollTo ({y: dy, x: this.offset.x, animated: false});
  };

  handleDrop = (appointmentId, params) => {
    this.props.onDrop (appointmentId, params);
  };

  handleDropBlock = (blockId, params) => {
    this.props.onDrodBlock (blockId, params);
  };

  handleResizeCard = () => {
    this.moveX = null;
    this.moveY = null;
    const {apptGridSettings} = this.props;
    const {activeCard, activeBlock} = this.state;
    const {data} = activeBlock || activeCard;
    const verticalPositions = activeCard
      ? activeCard.verticalPositions
      : [{top: activeBlock.top, height: activeBlock.height}];
    const lastIndex = verticalPositions.length - 1;
    const newHeight = Math.round (verticalPositions[lastIndex].height / 30);
    const params = {newLength: newHeight};

    const date = moment (data.date, 'YYYY-MM-DD').format ('MMM DD');

    const fromTime = moment (data.fromTime, 'HH:mm').format ('h:mma');
    const oldToTime = moment (data.toTime, 'HH:mm').format ('h:mma');
    const newToTimeMoment = moment (data.fromTime, 'HH:mm').add (
      newHeight * apptGridSettings.step,
      'm'
    );
    const newToTime = newToTimeMoment.format ('h:mma');
    const timeHasChanged = oldToTime !== newToTime;
    if (timeHasChanged) {
      if (activeCard) {
        const clientName = `${activeCard.data.client.name} ${activeCard.data.client.lastName}`;
        const alert = {
          title: 'Resize Appointment',
          description: `Resize ${clientName} Appt. from ${date} ${fromTime}-${oldToTime} to ${date} ${fromTime}-${newToTime}?`,
          btnLeftText: 'Cancel',
          btnRightText: 'Resize',
          onPressRight: () => {
            this.handleRresizeConfirmation ({
              id: data.id,
              date: data.date,
              fromTime: data.fromTime,
              toTime: newToTimeMoment.format (DateTime.timeOld),
              employeeId: data.employee.id,
              params,
              oldAppointment: data,
            });
          },
        };
        this.createAlert (alert);
      } else {
        const alert = {
          title: 'Resize Block Time',
          description: `Resize Block Time from ${date} ${fromTime}-${oldToTime} to ${date} ${fromTime}-${newToTime}?`,
          btnLeftText: 'Cancel',
          btnRightText: 'Resize',
          onPressRight: () => {
            this.handleRresizeBlockConfirmation ({
              id: data.id,
              date: data.date,
              fromTime: data.fromTime,
              toTime: newToTimeMoment.format (DateTime.timeOld),
              employeeId: data.employee.id,
              params,
              oldAppointment: data,
            });
          },
        };
        this.createAlert (alert);
      }
    } else {
      this.setState ({
        alert: null,
        activeCard: null,
        activeBlock: null,
        isResizeing: false,
      });
    }
  };

  handleRresizeConfirmation = ({
    id,
    date,
    fromTime,
    toTime,
    employeeId,
    params,
    oldAppointment,
  }) => {
    const conflictData = {
      actionName: CHECK_APPT_CONFLICTS,
      actionNameSuccess: CHECK_APPT_CONFLICTS_SUCCESS,
      actionNameFailed: CHECK_APPT_CONFLICTS_FAILED,
      conflictData: {
        date,
        items: [
          {
            fromTime,
            toTime,
            appointmentId: id,
            employeeId,
          },
        ],
      },
    };
    this.props.checkConflicts (conflictData).then (({data: {conflicts}}) => {
      if (conflicts && conflicts.length > 0) {
        const navParams = {
          date,
          startTime: fromTime,
          endTime: toTime,
          conflicts,
          handleDone: () => this.props.onResize (id, params, oldAppointment),
          headerProps: {
            btnRightText: 'Resize anyway',
          },
        };
        this.props.navigation.navigate ('Conflicts', navParams);
      } else {
        this.props.onResize (id, params, oldAppointment);
      }
    });
    this.hideAlert ();
  };

  handleRresizeBlockConfirmation = ({
    id,
    date,
    fromTime,
    toTime,
    employeeId,
    params,
    oldAppointment,
  }) => {
    const conflictData = {
      actionName: CHECK_APPT_CONFLICTS,
      actionNameSuccess: CHECK_APPT_CONFLICTS_SUCCESS,
      actionNameFailed: CHECK_APPT_CONFLICTS_FAILED,
      conflictData: {
        scheduleBlockId: id,
        date,
        fromTime,
        toTime,
        employeeId,
      },
    };
    this.props
      .checkConflictsBlock (conflictData)
      .then (({data: {conflicts}}) => {
        if (conflicts && conflicts.length > 0) {
          const navParams = {
            date,
            startTime: fromTime,
            endTime: toTime,
            conflicts,
            handleDone: () =>
              this.props.onResizeBlock (id, params, oldAppointment),
            headerProps: {
              btnRightText: 'Resize anyway',
            },
          };
          this.props.navigation.navigate ('Conflicts', navParams);
        } else {
          this.props.onResizeBlock (id, params, oldAppointment);
        }
      });
    this.hideAlert ();
  };

  handleCardDrop = () => {
    if (this.props.bufferVisible) {
      const {
        buffer,
        activeCard,
        activeBlock,
        pan,
        calendarMeasure: {height},
      } = this.state;
      const droppedCard = activeBlock || activeCard;
      const {data} = droppedCard;
      const top = pan.y._value + pan.y._offset;
      const bufferHeight = 110;
      if (top > height - bufferHeight) {
        if (!droppedCard.isBuffer && buffer.length < 4) {
          buffer.push (data);
          this.moveX = null;
          this.moveY = null;
        }
        this.setState ({activeCard: null, activeBlock: null});
      } else {
        this.handleReleaseCard ();
      }
    } else {
      this.handleReleaseCard ();
    }
  };

  handleMove = ({
    date,
    newTime,
    employeeId,
    id,
    resourceId = null,
    resourceOrdinal = null,
    roomId = null,
    roomOrdinal = null,
    newToTime,
  }) => {
    const {onDrop, appointments} = this.props;
    const {buffer} = this.state;
    const index = buffer.findIndex (appt => appt.id === id);
    let oldAppointment = null;
    if (index > -1) {
      oldAppointment = buffer[index];
      buffer.splice (index, 1);
      if (buffer.length < 1) {
        this.props.manageBuffer (false);
      }
    } else {
      oldAppointment = appointments.find (item => item.id === id);
    }
    const conflictData = {
      actionName: CHECK_APPT_CONFLICTS,
      actionNameSuccess: CHECK_APPT_CONFLICTS_SUCCESS,
      actionNameFailed: CHECK_APPT_CONFLICTS_FAILED,
      conflictData: {
        date,
        items: [
          {
            resourceId,
            resourceOrdinal,
            roomId,
            roomOrdinal,
            employeeId,
            fromTime: newTime,
            toTime: newToTime,
            appointmentId: oldAppointment.id,
          },
        ],
      },
    };

    this.props.checkConflicts (conflictData).then (({data: {conflicts}}) => {
      if (conflicts && conflicts.length > 0) {
        const params = {
          date,
          startTime: newTime,
          endTime: newToTime,
          conflicts,
          handleDone: () =>
            onDrop (
              id,
              {
                date,
                newTime,
                employeeId,
                resourceId,
                resourceOrdinal,
                roomId,
                roomOrdinal,
              },
              oldAppointment
            ),
          headerProps: {
            btnRightText: 'Move anyway',
          },
        };
        this.props.navigation.navigate ('Conflicts', params);
      } else {
        onDrop (
          id,
          {
            date,
            newTime,
            employeeId,
            resourceId,
            resourceOrdinal,
            roomId,
            roomOrdinal,
          },
          oldAppointment
        );
      }
    });
    this.hideAlert ();
  };

  handleMoveBlock = ({
    date,
    newTime,
    employeeId,
    id,
    resourceId = null,
    resourceOrdinal = null,
    roomId = null,
    roomOrdinal = null,
    newToTime,
  }) => {
    const {onDropBlock, blockTimes} = this.props;
    const {buffer} = this.state;
    const index = buffer.findIndex (blk => blk.id === id);
    let oldBlockTime = null;
    if (index > -1) {
      oldBlockTime = buffer[index];
      buffer.splice (index, 1);
      if (buffer.length < 1) {
        this.props.manageBuffer (false);
      }
    } else {
      oldBlockTime = blockTimes.find (item => item.id === id);
    }
    const conflictData = {
      actionName: CHECK_APPT_CONFLICTS,
      actionNameSuccess: CHECK_APPT_CONFLICTS_SUCCESS,
      actionNameFailed: CHECK_APPT_CONFLICTS_FAILED,
      conflictData: {
        scheduleBlockId: id,
        date,
        fromTime: newTime,
        toTime: newToTime,
        employeeId,
        blockTypeId: 121,
      },
    };

    this.props
      .checkConflictsBlock (conflictData)
      .then (({data: {conflicts}}) => {
        if (conflicts && conflicts.length > 0) {
          const params = {
            date,
            startTime: newTime,
            endTime: newToTime,
            conflicts,
            handleDone: () =>
              onDropBlock (
                id,
                {
                  date,
                  newTime,
                  employeeId,
                  resourceId,
                  resourceOrdinal,
                  roomId,
                  roomOrdinal,
                },
                oldBlockTime
              ),
            headerProps: {
              btnRightText: 'Move anyway',
            },
          };
          this.props.navigation.navigate ('Conflicts', params);
        } else {
          onDropBlock (
            id,
            {
              date,
              newTime,
              employeeId,
              resourceId,
              resourceOrdinal,
              roomId,
              roomOrdinal,
            },
            oldBlockTime
          );
        }
      });
    this.hideAlert ();
  };

  handleReleaseCard = () => {
    this.moveX = null;
    this.moveY = null;
    const cellHeight = 30;
    const {pan, activeCard, activeBlock, buffer} = this.state;
    const {
      cellWidth,
      headerData,
      apptGridSettings,
      onDrop,
      selectedProvider,
      selectedFilter,
      startDate,
      displayMode,
    } = this.props;
    const active = activeBlock || activeCard;
    const {data} = active;
    const {toTime, fromTime, id} = data;
    const headerOffset = selectedProvider !== 'all' && displayMode === 'day'
      ? 0
      : 40;
    const dx = pan.x._value + pan.x._offset + this.offset.x;
    const dy = pan.y._value + pan.y._offset + this.offset.y - headerOffset;
    const xIndex = (dx / this.cellWidth).toFixed () - 1;
    const yIndex = (dy / cellHeight).toFixed ();
    const isOutOfBounds =
      xIndex < 0 ||
      xIndex >= headerData.length ||
      yIndex < 0 ||
      yIndex >= apptGridSettings.schedule.length;
    if (!isOutOfBounds) {
      const employeeId = selectedFilter === 'providers' &&
        selectedProvider === 'all'
        ? headerData[xIndex].id
        : selectedProvider.id;
      const dateMoment = selectedProvider === 'all' || displayMode === 'day'
        ? startDate
        : moment (headerData[xIndex], 'YYYY-MM-DD');
      const newTimeMoment = moment (
        apptGridSettings.schedule[yIndex],
        'h:mm A'
      );
      const oldDate = moment (data.date, 'YYYY-MM-DD').format ('MMM DD');
      const oldFromTime = moment (fromTime, 'HH:mm');
      const oldToTime = moment (toTime, 'HH:mm');
      const duration = oldToTime.diff (oldFromTime, 'minutes');
      const newToTimeMoment = moment (newTimeMoment).add (duration, 'm');
      const newToTime = newToTimeMoment.format ('h:mma');
      const newTime = newTimeMoment.format ('HH:mm');
      const date = dateMoment.format ('YYYY-MM-DD');
      if (activeCard) {
        const clientName = `${data.client.name} ${data.client.lastName}`;
        this.setState ({
          alert: {
            title: 'Move Appointment',
            description: `Move ${clientName} Appt. from ${oldDate} ${oldFromTime.format ('h:mma')}-${oldToTime.format ('h:mma')} to ${dateMoment.format ('MMM DD')} ${newTimeMoment.format ('h:mma')}-${newToTime}?`,
            btnLeftText: 'Cancel',
            btnRightText: 'Move',
            onPressRight: () =>
              this.handleMove ({
                date,
                newTime,
                employeeId,
                id,
                newToTime: newToTimeMoment.format (DateTime.timeOld),
              }),
          },
        });
      } else {
        this.setState ({
          alert: {
            title: 'Move Block Time',
            description: `Move Block Appt. from ${oldDate} ${oldFromTime.format ('h:mma')}-${oldToTime.format ('h:mma')} to ${dateMoment.format ('MMM DD')} ${newTimeMoment.format ('h:mma')}-${newToTime}?`,
            btnLeftText: 'Cancel',
            btnRightText: 'Move',
            onPressRight: () =>
              this.handleMoveBlock ({
                date,
                newTime,
                employeeId,
                id,
                newToTime: newToTimeMoment.format (DateTime.timeOld),
              }),
          },
        });
      }
    } else {
      this.setState ({activeCard: null});
    }
  };

  hideAlert = () => {
    if (this.props.bufferVisible && this.state.buffer.length < 1) {
      this.props.manageBuffer (false);
    }
    this.setState ({
      alert: null,
      activeCard: null,
      activeBlock: null,
      isResizeing: false,
    });
  };

  closeBuffer = () => {
    const {buffer} = this.state;
    const alert = buffer.length > 0
      ? {
          title: 'Close Move Bar',
          description: 'You still have appointments in the move bar. Do you want to return all of these appointments to their original place and close the move bar?',
          btnLeftText: 'No',
          btnRightText: 'Yes',
          onPressRight: () => {
            this.props.manageBuffer (false);
            this.setState ({
              buffer: [],
              alert: null,
              activeCard: null,
              activeBlock: null,
              isResizeing: false,
            });
            this.isBufferCollapsed = false;
          },
        }
      : null;

    if (!alert) {
      this.props.manageBuffer (false);
      this.isBufferCollapsed = false;
      this.setState ({
        buffer: [],
        activeCard: null,
        activeBlock: null,
        isResizeing: false,
      });
    } else {
      this.createAlert (alert);
    }
  };

  clearActive = () => {
    if (this.state.activeCard) {
      this.setState ({activeCard: null});
    }
  };

  handleCellPressed = (cell, colData) => {
    this.clearActive ();
    this.props.onCellPressed (cell, colData);
  };

  handleOnPressAvailability = startTime => {
    this.clearActive ();
    const firstAvailableProvider = {
      isFirstAvailable: true,
      id: 0,
      name: 'First',
      lastName: 'Available',
    };
    this.props.onCellPressed (startTime, firstAvailableProvider);
  };

  convertFromTimeToMoment = time => moment (time, DateTime.timeOld);

  renderCards = (cards, headerIndex, headerId) => {
    const {
      selectedFilter,
      selectedProvider,
      displayMode,
      startDate,
    } = this.props;
    if (cards && cards.length) {
      return cards.map (
        card =>
          card.isBlockTime
            ? this.renderBlock (card, headerIndex, headerId)
            : this.renderCard (card, headerIndex, headerId)
      );
    }
    return null;
  };

  renderBlock = (blockTime, headerIndex, headerId) => {
    const {
      apptGridSettings,
      selectedProvider,
      selectedFilter,
      displayMode,
      isLoading,
      providers,
      startDate,
    } = this.props;
    const {
      calendarOffset,
      activeBlock,
      activeCard,
      buffer,
      overlappingCardsMap,
    } = this.state;
    const isInBuffer = buffer.findIndex (bck => bck.id === blockTime.id) > -1;
    const isActive = activeBlock && activeBlock.data.id === blockTime.id;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = isAllProviderView
      ? providers.find (
          item => item.id === get (blockTime.employee, 'id', false)
        )
      : selectedProvider;
    if (isAllProviderView) {
      if (!provider) {
        return null;
      }
    }
    if (blockTime) {
      const panResponder = (activeBlock &&
        activeBlock.data.id !== blockTime.id) ||
        isInBuffer ||
        activeCard
        ? null
        : this.panResponder;
      const firstCellWidth = isAllProviderView ? 130 : 0;

      const gap =
        get (
          overlappingCardsMap,
          [headerId, blockTime.id, 'overlappingCardsLength'],
          0
        ) * 8;

      const delta = headerIndex * this.cellWidth + firstCellWidth + gap;

      const overlap = {
        left: delta,
        width: this.cellWidth - gap,
      };
      return (
        <BlockTime
          left={overlap.left}
          width={overlap.width}
          onPress={this.props.onCardPressed}
          isResizeing={this.state.isResizeing}
          isActive={isActive}
          key={blockTime.id}
          block={blockTime}
          apptGridSettings={apptGridSettings}
          onDrag={this.handleOnDragBlock}
          calendarOffset={calendarOffset}
          onDrop={this.handleDrop}
          onResize={this.handleOnResize}
          isLoading={isLoading}
          displayMode={displayMode}
          selectedFilter={selectedFilter}
          startDate={startDate}
          panResponder={panResponder}
        />
      );
    }
    return null;
  };

  renderActiveBlock = () => {
    const {
      apptGridSettings,
      headerData,
      selectedProvider,
      displayMode,
      appointments,
      filterOptions,
      startDate,
    } = this.props;
    const {activeBlock, calendarMeasure, isResizeing, pan, pan2} = this.state;
    if (activeBlock) {
      return (
        <BlockTime
          left={activeBlock.left}
          width={activeBlock.cardWidth}
          pan={pan}
          activeBlock={activeBlock}
          panResponder={this.panResponder}
          block={activeBlock.data}
          apptGridSettings={apptGridSettings}
          onScrollY={this.scrollToY}
          calendarOffset={this.offset}
          onResize={this.handleOnResize}
          height={activeBlock.height}
          onDrop={this.handleCardDrop}
          isActive
          opacity={isResizeing ? 0 : 1}
          isResizeing={this.state.isResizeing}
          startDate={startDate}
        />
      );
    }
    return null;
  };

  renderResizeBlock = () => {
    const {
      apptGridSettings,
      selectedProvider,
      displayMode,
      providers,
      selectedFilter,
    } = this.props;
    const {activeBlock, isResizeing} = this.state;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = activeBlock && isAllProviderView
      ? providers.find (
          item => item.id === get (activeBlock.data.employee, 'id', false)
        )
      : selectedProvider;
    if (provider && isResizeing && activeBlock) {
      return (
        <BlockTime
          left={activeBlock.left}
          width={activeBlock.cardWidth}
          ref={block => {
            this.resizeBlock = block;
          }}
          panResponder={this.panResponder}
          block={activeBlock.data}
          apptGridSettings={apptGridSettings}
          onScrollY={this.scrollToY}
          calendarOffset={this.offset}
          onResize={this.handleOnResize}
          height={activeBlock.height}
          onDrop={this.handleCardDrop}
          opacity={isResizeing ? 1 : 0}
          isActive
          isResizeing={this.state.isResizeing}
          isBufferBlock={activeBlock.isBuffer}
          top={activeBlock.top}
          pan={this.state.pan}
          pan2={this.state.pan2}
          isResizeBlock
          activeBlock={activeBlock}
          selectedFilter={selectedFilter}
          displayMode={displayMode}
          selectedProvider={selectedProvider}
        />
      );
    }
    return null;
  };

  renderCard = (appointment, headerIndex, headerId) => {
    const {toTime, fromTime} = appointment;
    const {
      apptGridSettings,
      selectedProvider,
      selectedFilter,
      displayMode,
      appointments,
      isLoading,
      filterOptions,
      providers,
      goToAppointmentId,
      startDate,
      crossedAppointmentAfter,
    } = this.props;
    const {
      calendarOffset,
      activeCard,
      buffer,
      activeBlock,
      overlappingCardsMap,
    } = this.state;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = isAllProviderView
      ? providers.find (
          item => item.id === get (appointment.employee, 'id', false)
        )
      : selectedProvider;
    if (isAllProviderView) {
      if (!provider) {
        return null;
      }
    }
    const duration = moment (toTime, 'HH:mm').diff (
      moment (fromTime, 'HH:mm'),
      'minutes'
    );
    if (duration === 0) {
      return null;
    }
    const isActive = activeCard && activeCard.data.id === appointment.id;
    const isInBuffer =
      buffer.findIndex (appt => appt.id === appointment.id) > -1;
    const panResponder = (activeCard &&
      activeCard.data.id !== appointment.id) ||
      isInBuffer ||
      activeBlock
      ? null
      : this.panResponder;
    if (appointment.employee) {
      const firstCellWidth = isAllProviderView ? 130 : 0;

      const gap =
        get (
          overlappingCardsMap,
          [headerId, appointment.id, 'overlappingCardsLength'],
          0
        ) * 8;

      const delta = headerIndex * this.cellWidth + firstCellWidth + gap;

      const overlap = {
        left: delta,
        width: this.cellWidth - gap,
      };
      const hiddenAddons = getHiddenAddons (appointments, appointment);
      const cardHeight = appointment.duration / apptGridSettings.step * 30;
      return (
        <Card
          height={cardHeight}
          left={overlap.left}
          width={overlap.width}
          hiddenAddonsLength={hiddenAddons.length}
          setGoToPositon={this.setGoToPositon}
          goToAppointmentId={goToAppointmentId}
          provider={provider}
          panResponder={panResponder}
          onPress={this.props.onCardPressed}
          isResizeing={this.state.isResizeing}
          isMultiBlock={filterOptions.showMultiBlock}
          showAssistant={filterOptions.showAssistantAssignments}
          isActive={isActive}
          isInBuffer={isInBuffer}
          key={appointment.id}
          appointment={appointment}
          apptGridSettings={apptGridSettings}
          onDrag={this.handleOnDrag}
          onScrollX={this.scrollToX}
          onScrollY={this.scrollToY}
          calendarOffset={calendarOffset}
          onDrop={this.handleDrop}
          onResize={this.handleResize}
          cellWidth={this.cellWidth}
          selectedFilter={selectedFilter}
          displayMode={displayMode}
          selectedProvider={selectedProvider}
          isLoading={isLoading}
          startDate={startDate}
          hiddenCard={crossedAppointmentAfter.includes (appointment.id)}
        />
      );
    }
    return null;
  };

  renderActiveCard = () => {
    const {
      apptGridSettings,
      appointments,
      filterOptions,
      startDate,
    } = this.props;
    const {activeCard, isResizeing, pan, pan2} = this.state;
    if (activeCard) {
      const hiddenAddons = getHiddenAddons (appointments, activeCard.data);
      return (
        <Card
          left={activeCard.left}
          width={activeCard.cardWidth}
          hiddenAddonsLength={hiddenAddons.length}
          pan={pan}
          pan2={pan2}
          activeCard={activeCard}
          panResponder={this.panResponder}
          appointment={activeCard.data}
          apptGridSettings={apptGridSettings}
          onScrollY={this.scrollToY}
          calendarOffset={this.offset}
          onResize={this.handleOnResize}
          cardWidth={activeCard.cardWidth}
          height={activeCard.height}
          onDrop={this.handleCardDrop}
          isActive
          opacity={isResizeing ? 0 : 1}
          isResizeing={this.state.isResizeing}
          isMultiBlock={filterOptions.showMultiBlock}
          showAssistant={filterOptions.showAssistantAssignments}
          startDate={startDate}
        />
      );
    }
    return null;
  };

  renderResizeCard = () => {
    const {
      apptGridSettings,
      selectedProvider,
      displayMode,
      appointments,
      filterOptions,
      providers,
      selectedFilter,
    } = this.props;
    const {activeCard, isResizeing} = this.state;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = activeCard && isAllProviderView
      ? providers.find (
          item => item.id === get (activeCard.data.employee, 'id', false)
        )
      : selectedProvider;
    if (provider && isResizeing && activeCard) {
      const hiddenAddons = getHiddenAddons (appointments, activeCard.data);
      return (
        <Card
          ref={card => {
            this.resizeCard = card;
          }}
          hiddenAddonsLength={hiddenAddons.length}
          panResponder={this.panResponder}
          appointment={activeCard.data}
          apptGridSettings={apptGridSettings}
          onScrollY={this.scrollToY}
          calendarOffset={this.offset}
          onResize={this.handleOnResize}
          width={activeCard.cardWidth}
          height={activeCard.height}
          onDrop={this.handleCardDrop}
          opacity={isResizeing ? 1 : 0}
          isActive
          isResizeing={this.state.isResizeing}
          isBufferCard={activeCard.isBuffer}
          top={activeCard.top}
          left={activeCard.left}
          pan={this.state.pan}
          pan2={this.state.pan2}
          isResizeCard
          activeCard={activeCard}
          provider={provider}
          onPress={this.props.onCardPressed}
          isMultiBlock={filterOptions.showMultiBlock}
          showAssistant={filterOptions.showAssistantAssignments}
          onDrag={this.handleOnDrag}
          selectedFilter={selectedFilter}
          displayMode={displayMode}
        />
      );
    }
    return null;
  };

  render () {
    const {
      isLoading,
      headerData,
      apptGridSettings,
      dataSource,
      selectedFilter,
      selectedProvider,
      displayMode,
      providerSchedule,
      availability,
      bufferVisible,
      isRoom,
      isResource,
      filterOptions,
      setSelectedProvider,
      setSelectedDay,
      startDate,
      storeScheduleExceptions,
      rooms,
    } = this.props;
    const isDate = selectedProvider !== 'all' && selectedFilter === 'providers';
    const showHeader =
      displayMode === 'week' ||
      selectedProvider === 'all' ||
      isRoom ||
      isResource;
    const {
      alert,
      activeCard,
      activeBlock,
      overlappingCardsMap,
      cardsArray,
    } = this.state;

    const startTime = moment (apptGridSettings.minStartTime, DateTime.timeOld);
    let size = {
      width: this.size.width,
      height: bufferVisible ? this.size.height + 110 : this.size.height,
    };
    const showAvailability =
      selectedFilter === 'providers' && selectedProvider === 'all';

    const areProviders =
      apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0;
    size = areProviders ? size : {width: 0, height: 0, opacity: 0};
    return (
      <View
        style={{flex: 1}}
        ref={view => {
          this.calendar = view;
        }}
      >
        {!areProviders && !isLoading ? <EmptyScreen /> : null}
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            size,
            {borderTopWidth: !showHeader ? 1 : 0},
          ]}
          style={styles.container}
          scrollEnabled={!activeCard && !activeBlock && !isLoading}
          onScroll={this.handleScroll}
          ref={board => {
            this.board = board;
          }}
          onLayout={this.measureScrollView}
          scrollEventThrottle={16}
        >
          <ScrollViewChild
            scrollDirection="both"
            style={[
              styles.boardContainer,
              {marginTop: showHeader ? headerHeight : 0},
            ]}
          >
            <Board
              createAlert={this.createAlert}
              startDate={startDate}
              onPressAvailability={this.handleOnPressAvailability}
              onCellPressed={this.handleCellPressed}
              columns={headerData}
              rooms={rooms}
              startTime={startTime}
              apptGridSettings={apptGridSettings}
              showAvailability={showAvailability}
              cellWidth={this.cellWidth}
              displayMode={displayMode}
              selectedProvider={selectedProvider}
              selectedFilter={selectedFilter}
              showRoomAssignments={filterOptions.showRoomAssignments}
              providerSchedule={providerSchedule}
              availability={availability}
              isLoading={isLoading}
              hideAlert={this.hideAlert}
              storeScheduleExceptions={storeScheduleExceptions}
            />
            <CardGrid
              cardsArray={cardsArray}
              isLoading={isLoading}
              headerData={headerData}
              selectedFilter={selectedFilter}
              selectedProvider={selectedProvider}
              renderCard={this.renderCard}
              renderBlock={this.renderBlock}
              cardActive={this.state.activeBlock || this.state.activeCard}
            />
            {this.renderResizeCard ()}
            {this.renderResizeBlock ()}
          </ScrollViewChild>
          <ScrollViewChild
            scrollDirection="vertical"
            style={[
              styles.columnContainer,
              {top: showHeader ? headerHeight : 0},
            ]}
          >
            <TimeColumn schedule={apptGridSettings.schedule} />
            <CurrentTime
              apptGridSettings={apptGridSettings}
              startTime={startTime}
            />
          </ScrollViewChild>
          {showHeader
            ? <ScrollViewChild
                scrollDirection="horizontal"
                style={styles.headerContainer}
              >
                <Header
                  dataSource={headerData}
                  isDate={isDate}
                  selectedFilter={selectedFilter}
                  cellWidth={this.cellWidth}
                  setSelectedProvider={setSelectedProvider}
                  setSelectedDay={setSelectedDay}
                />
              </ScrollViewChild>
            : null}
        </ScrollView>
        <Buffer
          panResponder={this.panResponder}
          dataSource={this.state.buffer}
          visible={this.props.bufferVisible}
          manageBuffer={this.props.manageBuffer}
          onCardLongPress={this.handleOnDrag}
          onBlockLongPress={this.handleOnDragBlock}
          screenHeight={screenHeight}
          closeBuffer={this.closeBuffer}
          setBufferCollapsed={this.setBufferCollapsed}
          activeCard={activeCard}
          startDate={startDate}
        />
        {this.renderActiveCard ()}
        {this.renderActiveBlock ()}
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={this.hideAlert}
          onPressRight={alert ? alert.onPressRight : null}
        />
      </View>
    );
  }
}
