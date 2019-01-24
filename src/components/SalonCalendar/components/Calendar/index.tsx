import * as React from 'react';
import {
  View,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
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
import Board from '../board';
import Header from '../header';
import TimeColumn from '../timeColumn';
import Card from '../card';
import CurrentTime from '../currentTime';
import Buffer from '../calendarBuffer';
import SalonAlert from '@/components/SalonAlert';
import BlockTime from '../blockCard';
import EmptyScreen from '../EmptyScreen';
import {
  getHiddenAddons,
  sortCardsForBoard,
  getRangeExtendedMoment,
  isCardWithGap,
  areDatesInRange,
} from '@/utilities/helpers';
import DateTime from '@/constants/DateTime';
import ViewTypes from '@/constants/ViewTypes';
import { addToBufferState } from '@/constants';
import {
  CHECK_APPT_CONFLICTS,
  CHECK_APPT_CONFLICTS_SUCCESS,
  CHECK_APPT_CONFLICTS_FAILED,
} from '@/redux/actions/appointment';
import { CalendarProps, CalendarState } from '@/models/appointment-book/calendar';
import HeightHelper from '@/components/slidePanels/SalonCardDetailsSlide/helpers/heightHelper';
import styles from './styles';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  TYPE_FILTER_PROVIDERS,
  TYPE_FILTER_DESK_STAFF,
  TYPE_PROVIDER,
  GROUP_BY_DATE,
} from '@/constants/filterTypes';

import { findOverlappingAppointments } from './helpers';

const extendedMoment = getRangeExtendedMoment();
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const dayWidth = screenWidth - 36;
const weekWidth = (screenWidth - 36) / 7;
const providerWidth = 130;
const headerHeight = 40;
const timeColumnWidth = 36;
const cellHeight = 30;
const initialHeightOfHeader = 300;
const defaultBufferHeight = 110;
const MASSAGE_OF_DAY_ALREADY_PASSED = 'Cannot move an appointment to a day that has already passed';

export default class Calendar extends React.Component<CalendarProps, CalendarState> {
  constructor(props) {
    super(props);
    // the scrolled offset is saved in memory, this is needed when resizeing or dragging appoitnments
    this.offset = { x: 0, y: 0 };
    this.setCellsByColumn(props);
    this.state = {
      // arrays of appointments and blocktimes
      cardsArray: [],
      overlappingCardsMap: null,
      alert: null,
      // needed for doing calcultion when dragging or resizing a card
      calendarMeasure: {
        width: 0,
        height: 0,
      },
      // appoitnments that are in the bottom move bar
      buffer: [],
      // pan responder used for appointmets cards and block times
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      // Appointments with gaps are composed by 2 cards components the second one uses this pan responder
      pan2: new Animated.ValueXY({ x: 0, y: 0 }),
      isResizeing: false,
    };
    this.size = { width: 0, height: 0 };
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      // pan reponder only captures gestures when there is an active blocktime or appoitnemnt
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      // pan reponder only captures gestures when there is an active blocktime or appoitnemnt
      onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
    });
  }

  onMoveShouldSetPanResponder = (e, gesture) => (this.state.activeBlock || this.state.activeCard);

  onMoveShouldSetPanResponderCapture = (e, gesture) => (this.state.activeBlock || this.state.activeCard);

  onPanResponderMove = (e, gesture) => {
    const { dy, dx } = gesture;
    if (this.state.activeBlock || this.state.activeCard) {
      if (!this.state.isResizeing) {
        this.moveX = dx;
        this.moveY = dy;
        return Animated.event([
          null,
          {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          },
          {
            dx: this.state.pan2.x,
            dy: this.state.pan2.y,
          },
        ])(e, gesture, gesture);
      }
      // calculate size every time card is draged for resize,
      // this is done by calculating the difference between previoud dy and new dy
      const size = this.moveY ? dy - this.moveY : dy;
      // save current dy for calulating the size above
      this.moveY = dy;
      if (this.resizeCard) {
        const lastIndex =
          this.state.activeCard.verticalPositions.length - 1;
        // call resizeCard function from card componet
        // that calulate the hieght set it on the card and return it
        const newHeight = this.resizeCard.resizeCard(size);
        // updates height on the active card
        // Update the hieght only in the last card component,
        // in case the appoinment have a gap there will be 2 cards componets
        this.state.activeCard.verticalPositions[
          lastIndex
          ].height = newHeight;
        this.state.activeCard.height = newHeight;
      } else if (this.resizeBlock) {
        this.state.activeBlock.height = this.resizeBlock.resize(size);
      }
    }
    return null;
  };

  onPanResponderRelease = (e, gesture) => {
    if (this.state.activeCard || this.state.activeBlock) {
      if (this.state.isResizeing) {
        this.handleResizeCard();
      } else {
        this.handleCardDrop();
      }
    }
  };

  componentDidMount() {
    // group block times and appointment filterOption
    this.setGroupedAppointments(this.props);
  }

  componentWillReceiveProps(nextProps) {
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
      // if filters or appoinments changed grup appts again
      this.setGroupedAppointments(nextProps);
    }

    if (this.props.displayMode !== displayMode) {
      if (this.state.isResizeing || this.state.activeCard || this.state.activeBlock) {
        this.cancelResize();
      }
    }

    if (!this.props.bufferVisible && nextProps.bufferVisible) {
      this.handelHidePanel();
    }
  }

  cancelResize = () => {
    this.setState({
      activeCard: null,
      activeBlock: null,
      isResizeing: false,
      alert: null,
    });
    this.props.setResizing(false);
  };

  componentWillUpdate(nextProps) {
    if (
      (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading) ||
      nextProps.displayMode !== this.props.displayMode ||
      !nextProps.isDetailsVisible && this.props.isDetailsVisible !== nextProps.isDetailsVisible
    ) {
      // calculate grid size every time the loading prop changes
      this.setCellsByColumn(nextProps);
    }
    if (nextProps.isLoading) {
      this.clearActive();
    }
    if (
      nextProps.startDate.format('YYYY-MM-DD') !==
      this.props.startDate.format('YYYY-MM-DD')
    ) {
      // scroll to the begiing every time date changes. This is a solution to remove a gray space that appear wehn you
      // were at the end of the calendar and you changed to a date with less columns or rows.
      this.board.scrollTo({ x: 0, y: 0 });
    }
  }

  componentDidUpdate(prevProps) {
    // scroll to appts position and highlight it
    if (this.goToPosition && !this.props.isLoading) {
      const top = this.goToPosition.top - this.state.calendarMeasure.height / 2;
      const left =
        this.goToPosition.left - this.state.calendarMeasure.width / 2;
      this.board.scrollTo({
        x: left >= 0 ? left : 0,
        y: top >= 0 ? top : 0,
        animated: true,
      });
      this.goToPosition.highlightCard();
      this.props.clearGoToAppointment();
      this.goToPosition = null;
    }
    // center selected card
    if (!this.props.isDetailsVisible && this.props.isDetailsVisible !== prevProps.isDetailsVisible) {
      if (this.offset.y + this.state.calendarMeasure.height > this.size.height) {
        requestAnimationFrame(() => this.board.scrollTo({
          x: this.offset.x,
          y: this.size.height - this.state.calendarMeasure.height - headerHeight,
          animated: true,
        }));
      }
    }
  }

  handelScrollToDefault = () => {
    this.props.refsSliderPanel &&
    this.props.refsSliderPanel.transitionTo(this.props.refsSliderPanel.props.defaultYPosition);
  };

  handelHidePanel = () => {
    this.props.refsSliderPanel && this.props.refsSliderPanel.transitionTo(0);
  };

  shouldComponentUpdate(nextProps, nextState) {
    // only update when this props changes for better performance
    return (
      nextProps.displayMode !== this.props.displayMode ||
      this.props.isLoading !== nextProps.isLoading ||
      this.state.alert !== nextState.alert ||
      this.state.activeCard !== nextState.activeCard ||
      this.state.activeBlock !== nextState.activeBlock ||
      this.props.bufferVisible !== nextProps.bufferVisible ||
      this.props.isDetailsVisible !== nextProps.isDetailsVisible ||
      this.props.filterOptions.showFirstAvailable !== nextProps.filterOptions.showFirstAvailable ||
      this.state.isResizeing !== nextState.isResizeing
    );
  }

// group appoitnments and block time by filterOption
  setGroupedAppointments = (data) => {
    const { groupedAppointments, groupedBlocks } = this.prepareDataForUpdate(data);

    const cardsArray = mergeWith(
      { ...groupedAppointments },
      { ...groupedBlocks },
      (objValue, srcValue) =>
        (objValue && objValue.concat(srcValue)) || srcValue,
    );

    const overlappingCardsMap = this.setCardsOverlappingMap(cardsArray);

    this.setState({
      groupedAppointments,
      groupedBlocks,
      overlappingCardsMap,
      cardsArray,
    });
  };

  prepareDataForUpdate = (data) => {
    const {
      blockTimes,
      appointments,
      selectedFilter,
      selectedProvider,
      displayMode,
    } = data;

    const groupByCondition = this.getGroupByCondition(selectedFilter, selectedProvider, displayMode);

    return this.groupBy(groupByCondition, blockTimes, appointments);
  };

  getGroupByCondition = (selectedFilter, selectedProvider, displayMode) => {

    const isCanBeOnlyUser = selectedFilter === TYPE_FILTER_PROVIDERS || selectedFilter === TYPE_FILTER_DESK_STAFF;

    if (isCanBeOnlyUser) {
      if (selectedProvider === TYPE_PROVIDER) {
        return ViewTypes[selectedFilter][selectedProvider];
      } else {
        return ViewTypes[selectedFilter][displayMode];
      }
    }

    return ViewTypes[selectedFilter];
  };

  groupBy = (groupByCondition, blockTimes, appointments) => {
    const groupedAppointments = groupBy(
      appointments,
      groupByCondition !== GROUP_BY_DATE
        ? groupByCondition
        : item => moment(item.date).format(DateTime.date),
    );

    const groupedBlocks = groupBy(
      blockTimes,
      groupByCondition !== GROUP_BY_DATE
        ? groupByCondition
        : item => moment(item.date).format(DateTime.date),
    );

    return {
      groupedAppointments,
      groupedBlocks,
    };
  };

  setCardsOverlappingMap = (groupedCards = null) => {
    const processedCardsIds = [];
    return mapValues(groupedCards, cards => {
      const intermediateResult = sortCardsForBoard(cards).map(card => {
        const sT = moment(card.fromTime, DateTime.timeOld);
        const eT = moment(card.toTime, DateTime.timeOld);
        processedCardsIds.push(card.id);

        const overlappingCards = cards.filter(item => {
          // filter out itself
          if (card.id === item.id) {
            return false;
          }

          // filter out already processed cards
          if (processedCardsIds.includes(item.id)) {
            return false;
          }

          const itemStartTime = moment(item.fromTime, DateTime.timeOld);

          // do not consider appointments after this one
          if (!itemStartTime.isSameOrBefore(sT)) {
            return false;
          }

          const itemEndTime = moment(item.toTime, DateTime.timeOld);
          const range1 = extendedMoment.range(itemStartTime, itemEndTime);
          const range2 = extendedMoment.range(sT, eT);
          const containsConfig = { excludeStart: true, excludeEnd: true };

          // consider only appointments which are overlapping each other
          if (
            !range1.intersect(range2) &&
            !(range1.contains(sT, containsConfig) ||
              range1.contains(eT, containsConfig))
          ) {
            return false;
          }

          // do not take into account appointments with a gap if this one falls with in their gap
          const itemGapStartTime = itemStartTime.add(
            moment.duration(item.afterTime),
          );
          const itemGapEndTime = itemGapStartTime
            .clone()
            .add(moment.duration(item.gapTime));

          return (
            (isCardWithGap(item) &&
              !areDatesInRange(itemGapStartTime, itemGapEndTime, sT, eT)) ||
            !isCardWithGap(item)
          );
        });

        return {
          cardId: card.id,
          overlappingCards,
        };
      });

      const intermediateResultDict = keyBy(intermediateResult, 'cardId');

      const result = intermediateResult.map(item => {
        const previousCardsOverlapping = item.overlappingCards.reduce(
          (accumulator, overlappingCard) => [
            ...accumulator,
            ...findOverlappingAppointments(
              overlappingCard.id,
              intermediateResultDict,
            ),
          ],
          [],
        );

        return {
          cardId: item.cardId,
          overlappingCardsLength: uniqBy(
            [...item.overlappingCards, ...previousCardsOverlapping],
            'id',
          ).length,
        };
      });
      return keyBy(result, 'cardId');
    });
  };

  setGoToPositon = ({ left, top, highlightCard }) => {
    this.goToPosition = {
      left,
      top,
      highlightCard,
    };
  };

  // calculate grid size and cell width
  setCellsByColumn = (nextProps, extraHeight = 0) => {
    const {
      apptGridSettings,
      headerData,
      selectedFilter,
      selectedProvider,
      displayMode,
      availability,
    } = nextProps;

    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      if (
        selectedFilter === 'providers' ||
        selectedFilter === 'deskStaff' ||
        selectedFilter === 'rebookAppointment'
      ) {
        if (selectedProvider === 'all') {
          const showAvailability = availability &&
            selectedFilter === 'providers' && selectedProvider === 'all';

          const firstColumnWidth = showAvailability ? providerWidth + timeColumnWidth : timeColumnWidth;
          this.size = {
            width: headerData.length * providerWidth + firstColumnWidth,
            height: apptGridSettings.numOfRow * cellHeight + headerHeight + extraHeight,
          };
          this.cellWidth = providerWidth;
        } else if (displayMode === 'week') {
          this.size = {
            width: headerData.length * weekWidth + timeColumnWidth,
            height: apptGridSettings.numOfRow * cellHeight + headerHeight + extraHeight,
          };
          this.cellWidth = weekWidth;
        } else {
          this.size = {
            width: headerData.length * dayWidth + timeColumnWidth,
            height: apptGridSettings.numOfRow * cellHeight + extraHeight,
          };
          this.cellWidth = dayWidth;
        }
      } else {
        this.size = {
          width: headerData.length * providerWidth + timeColumnWidth,
          height: apptGridSettings.numOfRow * cellHeight + headerHeight + extraHeight,
        };
        this.cellWidth = providerWidth;
      }
    }
  };

  setBufferCollapsed = isCollapsed => {
    this.isBufferCollapsed = isCollapsed;
  };

  // calculate active card inital position
  getOnDragState = (
    isScrollEnabled,
    data,
    left,
    cardWidth,
    verticalPositions,
    isBuffer,
  ) => {
    let newState;
    this.moveX = null;
    this.moveY = null;
    if (!isScrollEnabled) {
      const offsetY = isBuffer ? -this.calendarPosition.y : headerHeight - this.offset.y;
      const offsetX = isBuffer ? 0 : timeColumnWidth - this.offset.x;
      this.fixOffsetY = offsetY;
      const { pan, pan2 } = this.state;
      const newVerticalPositions = [];
      for (let i = 0; i < verticalPositions.length; i += 1) {
        const item = verticalPositions[i];
        const newItem = { ...item, top: item.top + offsetY };
        newVerticalPositions.push(newItem);
      }
      const newTop = newVerticalPositions[0].top;
      const newLeft = left + offsetX;
      this.state.pan.setOffset({ x: newLeft, y: newTop });
      this.state.pan.setValue({ x: 0, y: 0 });
      if (verticalPositions.length > 1) {
        const newTop = newVerticalPositions[1].top;
        this.state.pan2.setOffset({ x: newLeft, y: newTop });
        this.state.pan2.setValue({ x: 0, y: 0 });
      }
      let { height } = verticalPositions[0];
      if (verticalPositions.length > 1) {
        const reversePosition = reverse(verticalPositions);
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

  measureScrollView = ({ nativeEvent: { layout: { width, height } } }) => {
    const { calendarMeasure } = this.state;
    const newWidth = width - timeColumnWidth;
    const newHeight = height - headerHeight;
    if (
      calendarMeasure.width === newWidth ||
      calendarMeasure.height !== newHeight
    ) {
      this.calendar.measureInWindow((x, y) => {
        this.calendarPosition = { x, y };
      });
      this.setState({
        calendarMeasure: {
          height: newHeight,
          width: newWidth,
        },
      });
    }
  };

  createAlert = alert => {
    this.setState({ alert });
  };

  scrollAnimation = () => {
    const { cellWidth, moveX, moveY } = this;
    const {
      selectedProvider,
      headerData,
      apptGridSettings,
      bufferVisible,
      displayMode,
      isRoom,
      isResource,
    } = this.props;
    const { calendarMeasure, pan, activeCard, activeBlock } = this.state;
    const moveableCard = activeCard || activeBlock;
    let dx = 0;
    let dy = 0;
    const boundLength = 20;
    const maxScrollChange = 15;
    // the 35 is the move bar height when it is collapsed, to collapse the move bar press the grey rectangle located at the top and centered
    const bufferHeights = this.isBufferCollapsed ? 35 : 110;
    const bufferHeight = bufferVisible ? bufferHeights : 0;
    if (moveableCard) {
      if (moveX && moveY) {
        if (!this.props.bufferVisible && this.moveY > 10) {
          this.props.manageBuffer(true);
        }
        const { cardWidth } = moveableCard;
        const maxWidth =
          headerData.length * cellWidth - calendarMeasure.width + providerWidth;
        const scrollHorizontalBoundRight =
          calendarMeasure.width - boundLength - cardWidth + timeColumnWidth;
        const scrollHorizontalBoundLeft = boundLength + timeColumnWidth;
        const newMoveX = moveX + pan.x._offset;
        if (scrollHorizontalBoundRight < newMoveX) {
          dx = newMoveX - scrollHorizontalBoundRight;
        } else if (scrollHorizontalBoundLeft > newMoveX) {
          dx = newMoveX - scrollHorizontalBoundLeft;
        }
        // dx !== 0 means the card is on the bounds so we need to scroll
        if (selectedProvider === 'all' && dx !== 0) {
          dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
          dx = dx * maxScrollChange / boundLength;
          this.offset.x += dx;
          if (this.offset.x > maxWidth) {
            this.offset.x = maxWidth;
          }
          if (this.offset.x < 0) {
            this.offset.x = 0;
          }
          this.scrollToX(this.offset.x);
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
            dy = Math.abs(dy) > boundLength
              ? boundLength * Math.sign(dy)
              : dy;
            dy = dy * maxScrollChange / boundLength;
            this.offset.y += dy;
            if (this.offset.y > maxHeigth) {
              this.offset.y = maxHeigth;
            }
            if (this.offset.y < 0) {
              this.offset.y = 0;
            }
            this.scrollToY(this.offset.y);
          }
        }
      }
      requestAnimationFrame(this.scrollAnimation);
    }
  };

  // calculation for rezise are different from move so we created anotuer function
  scrollAnimationResize = () => {
    const {
      selectedProvider,
      apptGridSettings,
      bufferVisible,
      displayMode,
      isRoom,
      isResource,
    } = this.props;
    const { calendarMeasure, activeCard, activeBlock, isResizeing } = this.state;
    const resizeingCard = activeCard || activeBlock;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    if (isResizeing) {
      if (this.moveY) {
        const verticalPositions = activeCard
          ? activeCard.verticalPositions
          : [{ top: activeBlock.top, height: activeBlock.height }];
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
          dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
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
              ].height = this.resizeCard.resizeCard(dy);
          } else if (activeBlock) {
            this.state.activeBlock.height = this.resizeBlock.resize(dy);
          }
          this.scrollToY(this.offset.y);
        }
      }
      requestAnimationFrame(this.scrollAnimationResize);
    }
  };

  centerCard = (left, top, slideHieght) => {
    const x = this.calculateXPositionScrollView(left);
    const y = this.calculateYPositionScrollView(top, slideHieght);
    this.board.scrollTo({ x, y });
  };

  calculateXPositionScrollView = (left) => {
    const { calendarMeasure } = this.state;
    const x = left + (this.cellWidth - calendarMeasure.width) / 2;
    if (this.isLastRow(left)) {
      return this.size.width - this.cellWidth * (screenWidth / this.cellWidth);
    }
    return this.checkEdgeOfScree(x);
  };

  isLastRow = (left) => {
    return left + this.cellWidth + timeColumnWidth === this.size.width;
  };

  calculateYPositionScrollView = (top, slideHieght) => {
    const { calendarMeasure } = this.state;
    const y = top - (calendarMeasure.height - slideHieght) / 2 - headerHeight;
    if (this.isElementInEndOfList(top)) {
      return top - (this.props.workHeight - (isIphoneX() ? 255 : 315));
    }
    return this.checkEdgeOfScree(y);
  };

  isElementInEndOfList = (top) => {
    const { numOfRow } = this.props.apptGridSettings;
    return top > numOfRow * cellHeight - 390;
  };

  checkEdgeOfScree = (position) => {

    if (position < 0) {
      return 0;
    }

    return position;
  };

  handleCardPressed = (appt, left, top) => {
    // this is the height of the detials slide
    const height = HeightHelper.setPositionToMinimalOption();
    const fixHeight = 118;
    this.props.onCardPressed(appt);
    this.setCellsByColumn(this.props, height - fixHeight);
    requestAnimationFrame(() => this.centerCard(left, top, height));
  };

  handleOnDrag = (
    isScrollEnabled,
    appointment,
    left,
    cardWidth,
    verticalPositions,
    isBuffer,
  ) => {
    const newState = {
      activeCard: this.getOnDragState(
        isScrollEnabled,
        appointment,
        left,
        cardWidth,
        verticalPositions,
        isBuffer,
      ),
    };
    // when drags start we set the active card in the state and call scrill function
    this.props.setResizing(true);
    this.setState(newState, this.scrollAnimation);
  };

  handleOnDragBlock = (
    isScrollEnabled,
    block,
    blockLeft,
    blockCardWidth,
    blockVerticalPositions,
    isBufferCard,
  ) => {
    const {
      data,
      left,
      cardWidth,
      verticalPositions,
      isBuffer,
      height,
    } = this.getOnDragState(
      isScrollEnabled,
      block,
      blockLeft,
      blockCardWidth,
      blockVerticalPositions,
      isBufferCard,
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
    this.setState(newState, this.scrollAnimation);
  };

  handleOnResize = () => {
    const { isResizeing } = this.state;
    if (!isResizeing) {
      this.moveX = 0;
      this.moveY = 0;
      const newState = {
        isResizeing: true,
      };
      this.props.setResizing(true);
      this.setState(newState, this.scrollAnimationResize);
      return;
    }
    this.props.setResizing(isResizeing);
  };

  handleScroll = ev => {
    const { activeCard } = this.state;
    if (!activeCard) {
      this.offset.x = ev.nativeEvent.contentOffset.x;
      this.offset.y = ev.nativeEvent.contentOffset.y;
    }
  };

  scrollToX = dx => {
    this.board.scrollTo({ x: dx, y: this.offset.y, animated: false });
  };

  scrollToY = dy => {
    this.board.scrollTo({ y: dy, x: this.offset.x, animated: false });
  };

  handleDrop = (appointmentId, params) => {
    this.props.onDrop(appointmentId, params);
  };

  handleDropBlock = (blockId, params) => {
    this.props.onDrodBlock(blockId, params);
  };

  handleResizeCard = () => {
    this.moveX = null;
    this.moveY = null;
    const { apptGridSettings } = this.props;
    const { activeCard, activeBlock } = this.state;
    const { data } = activeBlock || activeCard;
    const verticalPositions = activeCard
      ? activeCard.verticalPositions
      : [{ top: activeBlock.top, height: activeBlock.height }];
    const lastIndex = verticalPositions.length - 1;
    const newHeight = Math.round(verticalPositions[lastIndex].height / 30);
    const params = { newLength: newHeight };

    const date = moment(data.date, 'YYYY-MM-DD').format('MMM DD');

    const fromTime = moment(data.fromTime, 'HH:mm').format('h:mma');
    const oldToTime = moment(data.toTime, 'HH:mm').format('h:mma');
    const newToTimeMoment = moment(data.fromTime, 'HH:mm').add(
      newHeight * apptGridSettings.step,
      'm',
    );
    const newToTime = newToTimeMoment.format('h:mma');
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
            this.handleResizeConfirmation({
              id: data.id,
              date: data.date,
              fromTime: data.fromTime,
              toTime: newToTimeMoment.format(DateTime.timeOld),
              employeeId: data.employee.id,
              params,
              oldAppointment: data,
            });
          },
        };
        this.createAlert(alert);
      } else {
        const alert = {
          title: 'Resize Block Time',
          description: `Resize Block Time from ${date} ${fromTime}-${oldToTime} to ${date} ${fromTime}-${newToTime}?`,
          btnLeftText: 'Cancel',
          btnRightText: 'Resize',
          onPressRight: () => {
            this.handleRresizeBlockConfirmation({
              id: data.id,
              date: data.date,
              fromTime: data.fromTime,
              toTime: newToTimeMoment.format(DateTime.timeOld),
              employeeId: data.employee.id,
              params,
              oldAppointment: data,
            });
          },
        };
        this.createAlert(alert);
      }
    } else {
      this.cancelResize();
    }
  };

  handleResizeConfirmation = ({
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
    this.props.checkConflicts(conflictData).then(({ data: { conflicts } }) => {
      if (conflicts && conflicts.length > 0) {
        const navParams = {
          date,
          startTime: fromTime,
          endTime: toTime,
          conflicts,
          handleDone: () => this.props.onResize(id, params, oldAppointment),
          headerProps: {
            btnRightText: 'Resize anyway',
          },
        };
        this.props.navigation.navigate('Conflicts', navParams);
      } else {
        this.props.onResize(id, params, oldAppointment);
      }
    });
    this.hideAlert();
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
      .checkConflictsBlock(conflictData)
      .then(({ data: { conflicts } }) => {
        if (conflicts && conflicts.length > 0) {
          const navParams = {
            date,
            startTime: fromTime,
            endTime: toTime,
            conflicts,
            handleDone: () =>
              this.props.onResizeBlock(id, params, oldAppointment),
            headerProps: {
              btnRightText: 'Resize anyway',
            },
          };
          this.props.navigation.navigate('Conflicts', navParams);
        } else {
          this.props.onResizeBlock(id, params, oldAppointment);
        }
      });
    this.hideAlert();
  };

  // If client has more appt that day ask for moving them all
  showMoveAllClientsAppointmentsConfirmModal = (appointment, clientAppointments, result) => {
    const onPressRight = () => {
      this.setState({ alert: null }, () => {
        this.addItemToMoveBar(appointment, [...result, ...clientAppointments], addToBufferState.checkOtherPartyAppointments);
      });
    };
    const onPressLeft = () => {
      this.setState({ alert: null }, () => {
        this.addItemToMoveBar(appointment, result, addToBufferState.checkOtherPartyAppointments);
      });
    };
    const alert = {
      onPressRight,
      onPressLeft,
      title: 'Question',
      description: 'The client has other appointments scheduled today, would you like to move them all?',
      btnLeftText: 'No',
      btnRightText: 'Move them all',
    };
    this.setState({ alert });
  };

  // If client is in a party ask for move the hole party
  showMovePartyAppointmentsConfirmModal = (appointment, partyAppointments, result) => {
    const onPressRight = () => {
      this.setState({ alert: null }, () => {
        this.addItemToMoveBar(appointment, [...result, ...partyAppointments], addToBufferState.finish);
      });
    };
    const onPressLeft = () => {
      this.setState({ alert: null }, () => {
        this.addItemToMoveBar(appointment, result, addToBufferState.finish);
      });
    };
    const alert = {
      onPressRight,
      onPressLeft,
      title: 'Question',
      description: `There are other appointments in the party of ${appointment.client.name} ${appointment.client.lastName}, would you like to move them all?`,
      btnLeftText: 'No',
      btnRightText: 'Move them all',
    };
    this.setState({ alert });
  };

  // state machine that adds items to the move bar
  addItemToMoveBar = (appointment, result, state) => {
    const { appointments } = this.props;
    const { buffer } = this.state;
    const resultIds = result.map(item => item.id);
    const itemIds = buffer.map(item => item.id);
    switch (state) {
      case addToBufferState.checkExistenceInMoveBar: {
        if (!itemIds.includes(appointment.id)) {
          this.addItemToMoveBar(appointment, [], addToBufferState.checkBlockTime);
        }
        break;
      }

      case addToBufferState.checkBlockTime: {
        const newResult = appointment.isBlockTime ? [...result, appointment] : result;
        this.addItemToMoveBar(appointment, newResult, addToBufferState.checkOtherClientAppointments);
        break;
      }

      case addToBufferState.checkOtherClientAppointments: {
        const clientAppointments = appointments.filter(item => {
          return appointment.id !== item.id
            && !itemIds.includes(item.id)
            && !resultIds.includes(item.id)
            && !item.isFirstAvailable
            && item.client.id === appointment.client.id;
        });

        if (!clientAppointments[0]) {
          this.addItemToMoveBar(appointment, result, addToBufferState.checkOtherPartyAppointments);
        } else {
          this.showMoveAllClientsAppointmentsConfirmModal(appointment, clientAppointments, result);
        }

        break;
      }

      case addToBufferState.checkOtherPartyAppointments: {
        const partyAppointments = !!appointment.appointmentGroupId ? appointments.filter(item => {
          return appointment.id !== item.id
            && !!item.appointmentGroupId
            && !itemIds.includes(item.id)
            && !resultIds.includes(item.id)
            && !item.isFirstAvailable
            && item.appointmentGroupId === appointment.appointmentGroupId;
        }) : [];

        if (!partyAppointments[0]) {
          this.addItemToMoveBar(appointment, result, addToBufferState.finish);
        } else {
          this.showMovePartyAppointmentsConfirmModal(appointment, partyAppointments, result);
        }

        break;
      }

      case addToBufferState.finish: {
        this.moveX = null;
        this.moveY = null;
        this.setState(prevState => ({
          activeCard: null,
          activeBlock: null,
          buffer: [...prevState.buffer, appointment, ...result],
        }));
      }
    }
  };

  handleCardDrop = () => {
    if (this.props.bufferVisible) {
      this.addToBufferOrHandelRelease();
    } else {
      this.handleReleaseCard();
    }
  };

  addToBufferOrHandelRelease = () => {
    const { pan, calendarMeasure: { height } } = this.state;

    const top = pan.y._value + pan.y._offset;

    if (this.isPositionIntersectBuffer(top, height)) {
      this.addItemToBufferOrResetActiveCard();
    } else {
      this.handleReleaseCard();
    }
  };

  addItemToBufferOrResetActiveCard = () => {
    const { activeCard, activeBlock } = this.state;

    const droppedCard = activeBlock || activeCard;
    const { data } = droppedCard;

    if (!droppedCard.isBuffer) {
      this.addItemToMoveBar(data, [], addToBufferState.checkExistenceInMoveBar);
    } else {
      this.setState({
        activeCard: null,
        activeBlock: null,
      });
    }
  };

  isPositionIntersectBuffer = (top, height) => {
    return top > height - defaultBufferHeight;
  };

  // logic after dropping the card
  handleMove = (data) => {
    const { id } = data;
    const { buffer } = this.state;
    const {
      conflictsForPreviousDay: conflicts, dataForConflictsScreen, conflictData,
      oldAppointment, dataForOnDrop, isPreviousDay,
    } = this.getDataForHandelDropAppointment(data, buffer);

    if (isPreviousDay) {
      const params = this.generateParamsForConflictScreenAfterDropAppointment(
        conflicts,
        dataForConflictsScreen,
        buffer,
      );
      this.hideAlert();
      return this.props.navigation.navigate('Conflicts', params);
    }
    // check for conflicts after moveing the card
    this.props.checkConflicts(conflictData).then(({ data: { conflicts } }) => {
      if (conflicts && conflicts.length > 0) {
        const params = this.generateParamsForConflictScreenAfterDropAppointment(
          conflicts,
          dataForConflictsScreen,
          buffer,
        );
        this.props.navigation.navigate('Conflicts', params);
      } else {
        this.handelDropWithoutConflicts(id, dataForOnDrop, oldAppointment, buffer);
      }
    });

    this.hideAlert();
  };

  getDataForHandelDropAppointment = (data, buffer) => {
    const {
      date,
      newTime,
      employeeId,
      id,
      resourceId = null,
      resourceOrdinal = null,
      roomId = null,
      roomOrdinal = null,
      newToTime,
    } = data;
    const index = buffer.findIndex(appt => appt.id === id);
    const oldAppointment = this.getOldAppointment(index, id, buffer);

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
            appointmentId: oldAppointment && oldAppointment.id,
          },
        ],
      },
    };

    const conflictsForPreviousDay = [{
      associativeKey: null,
      bookAnyway: false,
      canBeSkipped: false,
      date: moment(date),
      duration: oldAppointment && oldAppointment.service && oldAppointment.service.duration,
      employeeFullName: oldAppointment && oldAppointment.employee && oldAppointment.employee.fullName,
      fromTime: oldAppointment && oldAppointment.fromTime,
      notes: null,
      overlap: null,
      price: 0,
      reason: MASSAGE_OF_DAY_ALREADY_PASSED,
      serviceDescription: null,
      toTime: oldAppointment && oldAppointment.toTime,
    }];

    const dataForOnDrop = {
      date,
      newTime,
      employeeId,
      resourceId,
      resourceOrdinal,
      roomId,
      roomOrdinal,
    };

    const dataForConflictsScreen = {
      index,
      oldAppointment,
      dataForOnDrop,
      id,
      date,
      newTime,
      newToTime,
    };

    const isPreviousDay = moment(date).isBefore(moment(), 'day');

    return {
      conflictData,
      conflictsForPreviousDay,
      dataForConflictsScreen,
      oldAppointment,
      index,
      dataForOnDrop,
      isPreviousDay,
    };
  };

  getOldAppointment = (index, id, buffer) => {
    const { appointments } = this.props;


    if (index > -1) {
      const element = buffer.splice(index, 1);
      return element[0];
    }

    return appointments.find(item => item.id === id);
  };

  generateParamsForConflictScreenAfterDropAppointment = (conflicts, dataForConflictsScreen, buffer) => {
    const { onDrop, manageBuffer } = this.props;

    const { index, oldAppointment, dataForOnDrop, id, date, newTime, newToTime } = dataForConflictsScreen;

    if (index > -1) {
      buffer.splice(index, 0, oldAppointment);
    }

    return {
      date,
      startTime: newTime,
      endTime: newToTime,
      conflicts,
      handleDone: () => {
        if (index > -1) {
          buffer.splice(index, 1);
        }
        if (buffer.length > 0) {
          manageBuffer(true);
        }
        onDrop(id, dataForOnDrop, oldAppointment);
      },
      handleGoBack: () => {
        if (buffer.length > 0) {
          manageBuffer(true);
        }
      },
      headerProps: {
        btnRightText: 'Move anyway',
      },
    };
  };

  handelDropWithoutConflicts = (id, dataForOnDrop, oldAppointment, buffer) => {
    const { onDrop, manageBuffer } = this.props;

    if (buffer.length < 1) {
      manageBuffer(false);
    }

    onDrop(id, dataForOnDrop, oldAppointment);
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
    const { onDropBlock, blockTimes } = this.props;
    const { buffer } = this.state;
    const index = buffer.findIndex(blk => blk.id === id);
    let oldBlockTime = null;
    if (index > -1) {
      oldBlockTime = buffer[index];
      buffer.splice(index, 1);
      if (buffer.length < 1) {
        this.props.manageBuffer(false);
      }
    } else {
      oldBlockTime = blockTimes.find(item => item.id === id);
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
      .checkConflictsBlock(conflictData)
      .then(({ data: { conflicts } }) => {
        if (conflicts && conflicts.length > 0) {
          const params = {
            date,
            startTime: newTime,
            endTime: newToTime,
            conflicts,
            handleDone: () =>
              onDropBlock(
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
                oldBlockTime,
              ),
            headerProps: {
              btnRightText: 'Move anyway',
            },
          };
          this.props.navigation.navigate('Conflicts', params);
        } else {
          onDropBlock(
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
            oldBlockTime,
          );
        }
      });
    this.hideAlert();
  };

  // calculation of the new position of the card. Here we calculate new time, new column and new height.
  handleReleaseCard = () => {
    this.resetMove();
    const { xIndex, yIndex } = this.calculateIndex();

    if (this.isInOfBounds(xIndex, yIndex)) {
      this.handelDrop(xIndex, yIndex);
    } else {
      this.setState({ activeCard: null });
    }
  };

  resetMove = () => {
    this.moveX = null;
    this.moveY = null;
  };

  calculateIndex = () => {
    const { pan } = this.state;

    const dx = pan.x._value + pan.x._offset + this.offset.x;
    const dy = pan.y._value + pan.y._offset + this.offset.y - this.calculateHeaderOffset();

    return {
      xIndex: (dx / this.cellWidth).toFixed() - 1,
      yIndex: (dy / cellHeight).toFixed(),
    };
  };

  calculateHeaderOffset = () => {
    const { selectedProvider, displayMode } = this.props;
    return selectedProvider !== 'all' && displayMode === 'day' ? 0 : 40;
  };

  isInOfBounds = (xIndex, yIndex) => {
    const { headerData, apptGridSettings } = this.props;
    return !(xIndex < 0 || xIndex >= headerData.length || yIndex < 0 || yIndex >= apptGridSettings.schedule.length);
  };

  handelDrop = (xIndex, yIndex) => {

    const { activeCard } = this.state;

    const {
      id, employee, newToTimeMoment, newTime,
      date, clientName, employeeId, newAndLodDateObject,
    } = this.generationDateForHandelDrop(xIndex, yIndex);

    if (this.isTheSamePlace(newAndLodDateObject, employee.id, employeeId)) {
      return this.setState({ activeCard: null });
    }
    if (activeCard) {
      this.setState({
        alert: {
          title: 'Move Appointment',
          description: `Move ${clientName} Appt. from ${this.generateDescription(newAndLodDateObject)}`,
          btnLeftText: 'Cancel',
          btnRightText: 'Move',
          onPressRight: () =>
            this.handleMove({
              date,
              newTime,
              employeeId,
              id,
              newToTime: newToTimeMoment.format(DateTime.timeOld),
            }),
        },
      });
    } else {
      this.setState({
        alert: {
          title: 'Move Block Time',
          description: `Move Block Appt. from ${this.generateDescription(newAndLodDateObject)}`,
          btnLeftText: 'Cancel',
          btnRightText: 'Move',
          onPressRight: () =>
            this.handleMoveBlock({
              date,
              newTime,
              employeeId,
              id,
              newToTime: newToTimeMoment.format(DateTime.timeOld),
            }),
        },
      });
    }
  };

  generationDateForHandelDrop = (xIndex, yIndex) => {
    const { activeCard, activeBlock } = this.state;
    const { startDate, displayMode, apptGridSettings, headerData, selectedProvider, selectedFilter } = this.props;

    const active = activeBlock || activeCard;
    const { data } = active;
    const { toTime, fromTime, id, employee } = data;

    const dateMoment = selectedProvider === 'all' || displayMode === 'day'
      ? startDate
      : moment(headerData[xIndex], 'YYYY-MM-DD');

    const employeeId = selectedFilter === 'providers' && selectedProvider === 'all'
      ? headerData[xIndex].id
      : selectedProvider.id;

    const newTimeMoment = moment(
      apptGridSettings.schedule[yIndex],
      'h:mm A',
    );

    const oldDate = moment(data.date, 'YYYY-MM-DD').format('MMM DD');
    const oldFromTime = moment(fromTime, 'HH:mm');
    const oldToTime = moment(toTime, 'HH:mm');
    const duration = oldToTime.diff(oldFromTime, 'minutes');
    const newToTimeMoment = moment(newTimeMoment).add(duration, 'm');
    const newToTime = newToTimeMoment.format('h:mma');
    const newTime = newTimeMoment.format('HH:mm');
    const date = dateMoment.format('YYYY-MM-DD');
    const clientName = `${data.client.name} ${data.client.lastName}`;

    return {
      id,
      employee,
      newToTimeMoment,
      newTime,
      date,
      clientName,
      employeeId,
      newAndLodDateObject: {
        oldDate,
        oldFromTime: oldFromTime.format('h:mma'),
        oldToTime: oldToTime.format('h:mma'),
        dateMoment: dateMoment.format('MMM DD'),
        newTimeMoment: newTimeMoment.format('h:mma'),
        newToTime,
      },
    };
  };

  isTheSamePlace = (dateObject, oldEmployeeId, newEmployeeId) => {
    const { oldDate, dateMoment, oldFromTime, newTimeMoment, oldToTime, newToTime } = dateObject;

    return oldEmployeeId === newEmployeeId && oldDate === dateMoment
      && oldFromTime === newTimeMoment
      && oldToTime === newToTime;
  };

  generateDescription = (dateObject) => {
    const {
      oldDate, oldFromTime, oldToTime,
      dateMoment, newTimeMoment, newToTime,
    } = dateObject;

    return `${oldDate} ${oldFromTime}-${oldToTime} to ${dateMoment} ${newTimeMoment}-${newToTime}?`;
  };

  hideAlert = () => {
    if (this.props.bufferVisible && this.state.buffer.length < 1) {
      this.props.manageBuffer(false);
    }
    this.cancelResize();
  };

  closeBuffer = () => {
    const { buffer } = this.state;
    const alert = buffer.length > 0
      ? {
        title: 'Close Move Bar',
        description: 'You still have appointments in the move bar. Do you want to return all of these appointments to their original place and close the move bar?',
        btnLeftText: 'No',
        btnRightText: 'Yes',
        onPressRight: () => {
          this.props.manageBuffer(false);
          this.cancelResize();
          this.isBufferCollapsed = false;
        },
      }
      : null;

    if (!alert) {
      this.props.manageBuffer(false);
      this.isBufferCollapsed = false;
      this.setState({
        buffer: [],
        activeCard: null,
        activeBlock: null,
        isResizeing: false,
      });
      this.props.setResizing(false);
    } else {
      this.createAlert(alert);
    }
  };

  clearActive = () => {
    if (this.state.activeCard) {
      this.setState({ activeCard: null });
    }
  };

  handleCellPressed = (cell, colData) => {
    this.clearActive();
    this.props.onCellPressed(cell, colData);
  };

  handleOnPressAvailability = startTime => {
    this.clearActive();
    const firstAvailableProvider = {
      isFirstAvailable: true,
      id: 0,
      name: 'First',
      lastName: 'Available',
    };
    this.props.onCellPressed(startTime, firstAvailableProvider);
  };

  // render blocks inthe grid
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
      activeBlock,
      activeCard,
      buffer,
      overlappingCardsMap,
    } = this.state;
    const isInBuffer = buffer.findIndex(bck => bck.id === blockTime.id) > -1;
    const isActive = activeBlock && activeBlock.data.id === blockTime.id;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = isAllProviderView
      ? providers.find(
        item => item.id === get(blockTime.employee, 'id', false),
      )
      : selectedProvider;
    if (isAllProviderView) {
      if (!provider) {
        return null;
      }
    }

    //Show blocktime only if they belong to the current provider - IP-1047
    const blocktimeBelongsToEmployee = provider.id === get(blockTime.employee, 'id', false);

    if (blockTime && blocktimeBelongsToEmployee) {
      const panResponder = (activeBlock &&
        activeBlock.data.id !== blockTime.id) ||
      isInBuffer ||
      activeCard
        ? null
        : this.panResponder;
      const firstCellWidth = isAllProviderView ? 130 : 0;

      // the gap is the space at the left of the card, card have this gap when they overlaps other ones.
      const gap =
        get(
          overlappingCardsMap,
          [headerId, blockTime.id, 'overlappingCardsLength'],
          0,
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
          onPress={this.handleCardPressed}
          isResizeing={this.state.isResizeing}
          isActive={isActive}
          key={blockTime.id}
          block={blockTime}
          apptGridSettings={apptGridSettings}
          onDrag={this.handleOnDragBlock}
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

  // renders block being move if any
  renderActiveBlock = () => {
    const {
      apptGridSettings, startDate,
    } = this.props;

    const {
      activeBlock, isResizeing, pan,
    } = this.state;

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

  // render block being reiseze if any
  renderResizeBlock = () => {
    const {
      apptGridSettings,
      selectedProvider,
      displayMode,
      providers,
      selectedFilter,
    } = this.props;
    const { activeBlock, isResizeing } = this.state;
    const isCanBeOnlyUser = selectedFilter === 'providers' || selectedFilter === 'deskStaff';
    const isAllProviderView = isCanBeOnlyUser && selectedProvider === 'all';
    const provider = activeBlock && isAllProviderView
      ? providers.find(
        item => item.id === get(activeBlock.data.employee, 'id', false),
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

  // render card in the grid
  renderCard = (appointment, headerIndex, headerId) => {
    const { toTime, fromTime } = appointment;
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
      availability,
      crossedAppointmentAfter,
    } = this.props;
    const {
      activeCard,
      buffer,
      activeBlock,
      overlappingCardsMap,
    } = this.state;
    const isAllProviderView =
      selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = isAllProviderView
      ? providers.find(
        item => item.id === get(appointment.employee, 'id', false),
      )
      : selectedProvider;
    if (isAllProviderView) {
      if (!provider) {
        return null;
      }
    }
    const duration = moment(toTime, 'HH:mm').diff(
      moment(fromTime, 'HH:mm'),
      'minutes',
    );
    if (duration === 0) {
      return null;
    }
    const isActive = activeCard && activeCard.data.id === appointment.id;
    const isInBuffer =
      buffer.findIndex(appt => appt.id === appointment.id) > -1;
    const panResponder = (activeCard &&
      activeCard.data.id !== appointment.id) ||
    isInBuffer ||
    activeBlock
      ? null
      : this.panResponder;
    if (appointment.employee) {
      const firstCellWidth = isAllProviderView && availability ? 130 : 0;

      const gap =
        get(
          overlappingCardsMap,
          [headerId, appointment.id, 'overlappingCardsLength'],
          0,
        ) * 8;

      const delta = headerIndex * this.cellWidth + firstCellWidth + gap;

      const overlap = {
        left: delta,
        width: this.cellWidth - gap,
      };
      const hiddenAddons = getHiddenAddons(appointments, appointment);
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
          step={apptGridSettings.step}
          onPress={this.handleCardPressed}
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
          onDrop={this.handleDrop}
          onResize={this.handleResize}
          cellWidth={this.cellWidth}
          selectedFilter={selectedFilter}
          displayMode={displayMode}
          selectedProvider={selectedProvider}
          isLoading={isLoading}
          startDate={startDate}
          hiddenCard={crossedAppointmentAfter.includes(appointment.id)}
        />
      );
    }
    return null;
  };

  // render card being dragged
  renderActiveCard = () => {
    const {
      apptGridSettings,
      appointments,
      filterOptions,
      startDate,
    } = this.props;
    const { activeCard, isResizeing, pan, pan2 } = this.state;
    if (activeCard) {
      const hiddenAddons = getHiddenAddons(appointments, activeCard.data);
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

  // render card being resized
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
    const { activeCard, isResizeing } = this.state;
    const isCanBeOnlyUser = selectedFilter === 'providers' || selectedFilter === 'deskStaff';
    const isAllProviderView = isCanBeOnlyUser && selectedProvider === 'all';
    const provider = activeCard && isAllProviderView
      ? providers.find(
        item => item.id === get(activeCard.data.employee, 'id', false),
      )
      : selectedProvider;
    if (provider && isResizeing && activeCard) {
      const hiddenAddons = getHiddenAddons(appointments, activeCard.data);
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
          onPress={this.handleCardPressed}
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

  render() {
    const {
      isLoading,
      headerData,
      apptGridSettings,
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
      isNeedShowCurrentTime,
    } = this.props;
    const isCanBeOnlyUser = selectedFilter === 'providers' || selectedFilter === 'deskStaff';
    const isDate = selectedProvider !== 'all' && isCanBeOnlyUser;
    const showHeader =
      displayMode === 'week' ||
      selectedProvider === 'all' ||
      isRoom ||
      isResource;
    const {
      alert,
      activeCard,
      activeBlock,
      cardsArray,
      overlappingCardsMap,
    } = this.state;

    const startTime = moment(apptGridSettings.minStartTime, DateTime.timeOld);
    let size = {
      width: this.size.width,
      height: bufferVisible ? this.size.height + 110 : this.size.height,
    };
    const showAvailability = availability &&
      selectedFilter === 'providers' && selectedProvider === 'all';

    const areProviders =
      apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0;
    size = areProviders ? size : { width: 0, height: 0, opacity: 0 };

    return (
      <View
        style={{ flex: 1 }}
        ref={view => {
          this.calendar = view;
        }}
      >
        {!areProviders && !isLoading ? <EmptyScreen/> : null}
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            size,
            { borderTopWidth: !showHeader ? 1 : 0 },
          ]}
          style={styles.container}
          scrollEnabled={!activeCard && !activeBlock && !isLoading}
          onScroll={this.handleScroll}
          onScrollBeginDrag={this.handelScrollToDefault}
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
              { marginTop: showHeader ? headerHeight : 0 },
            ]}
          >
            <Board
              createAlert={this.createAlert}
              startDate={startDate}
              onPressAvailability={this.handleOnPressAvailability}
              onCellPressed={this.handleCellPressed}
              columns={headerData}
              rooms={rooms}
              step={apptGridSettings.step}
              startTime={startTime}
              apptGridSettings={apptGridSettings}
              showAvailability={showAvailability}
              cellWidth={this.cellWidth}
              displayMode={displayMode}
              selectedProvider={selectedProvider}
              selectedFilter={selectedFilter}
              showRoomAssignments={filterOptions.showRoomAssignments}
              showAssistantAssignments={filterOptions.showAssistantAssignments}
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
              overlappingCardsMap={overlappingCardsMap}
            />
            {/* resize cards goes inside the grid becuase we want it to be relative positioned to it
            this makes the card to not move it original while resizeing and scrolling thorugh the grid */}
            {this.renderResizeCard()}
            {this.renderResizeBlock()}
          </ScrollViewChild>
          <ScrollViewChild
            scrollDirection="vertical"
            style={[
              styles.columnContainer,
              { top: showHeader ? headerHeight : 0 },
            ]}
          >
            <TimeColumn schedule={apptGridSettings.schedule}/>
            <CurrentTime
              apptGridSettings={apptGridSettings}
              startTime={startTime}
              isNeedShowCurrentTime={isNeedShowCurrentTime}
            />
          </ScrollViewChild>
          {showHeader
            ? <ScrollViewChild
              scrollDirection="horizontal"
              style={styles.headerContainer}
            >
              <Header
                showAvailability={showAvailability}
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
        {/* buffer goes after calendar so it can be on top of it */}
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
        {/* actives card goues after calendar and buffer so it can be of top of them */}
        {this.renderActiveCard()}
        {this.renderActiveBlock()}
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={alert && alert.onPressLeft ? alert.onPressLeft : this.hideAlert}
          onPressRight={alert ? alert.onPressRight : null}
        />
      </View>
    );
  }
}
