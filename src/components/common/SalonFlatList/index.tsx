import * as React from 'react';
import {
  View,
  Text,
  RefreshControl,
  FlatList,
  FlatListProps,
} from 'react-native';

import LoadingOverlay from '@/components/LoadingOverlay';
import createStyleSheet from './styles';
import Colors from '@/constants/Colors';

export interface SalonFlatListProps extends FlatListProps<any> {
  isLoading?: boolean;
  renderItem: any;
  isItemSelected?: (item: any) => boolean;
  showArrowIcon?: boolean;
}

export interface SalonFlatListState {

}

interface DividerProps {
  fullWidth?: boolean;
  style: any;
}

const Divider = (props: DividerProps) => {
  const style = props.fullWidth ? props.style : [props.style, { marginLeft: 15 }];
  return <View style={style} />;
};

class SalonFlatList extends React.Component<SalonFlatListProps, SalonFlatListState> {
  styles = createStyleSheet(44); // list item height


  render() {
    const {
      renderItem,
      isLoading,
    } = this.props;
    return (
      <View style={this.styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <FlatList
          {...this.props}
          style={this.styles.list}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider style={this.styles.divider} />}
          ListFooterComponent={() => <Divider fullWidth={true} style={this.styles.divider} />}
        />
      </View>
    );
  }
}
export default SalonFlatList;