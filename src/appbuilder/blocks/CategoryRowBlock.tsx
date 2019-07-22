import React, { Component } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import PSRow from '../../components/PSRow';
import { chooseDataSource } from '../../lib/datasource';
import { border, fontSize, palette } from '../../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Loading } from '@brandingbrand/fscomponents';

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 20
  },
  arrow: {
    transform: [{ rotate: '180deg' }],
    width: 15,
    height: 15
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  title: {
    fontSize: fontSize.base,
    color: palette.onBackground
  }
});

export interface CategoryRowProps {
  dataSource?: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showArrow?: boolean;
  categoryId?: string;
  onItemPress: (item: CommerceTypes.Category) => void;
  categories?: CommerceTypes.Category[];
}

export interface CategoryRowState {
  categories: CommerceTypes.Category[];
}

function formatCategories(rootCategory: CommerceTypes.Category): any {
  return (rootCategory.categories || []).map(subCategory => ({
    id: subCategory.id,
    handle: subCategory.id,
    title: subCategory.title,
    items: (subCategory.categories || []).map(subSubCategory => ({
      id: subSubCategory.id,
      title: subSubCategory.title,
      image: subSubCategory.image
    }))
  }));
}

export default class CategoryRowBlock extends Component<CategoryRowProps, CategoryRowState> {
  // handleItemPress = (category: CommerceTypes.Category) => () => {
  //   props.onItemPress(category);
  // };

  // renderImage = (): JSX.Element => {
  //   return (
  //     <NavArrow color={palette.primary} />
  //   );
  // };
  constructor(props: CategoryRowProps) {
    super(props);

    this.state = {
      categories: props.categories || []
    };
  }

  componentWillMount(): void {
    const { categories, dataSource } = this.props;
    const dsType = dataSource && dataSource.type;
    const apiConfig = dataSource && dataSource.apiConfig;
    let categoryId = this.props.categoryId || '';
    if (dsType === 'episerver' && !categoryId) {
      categoryId = 'episerver-top';
    }
    if (dataSource) {
      chooseDataSource(dsType, apiConfig)
        .fetchCategory(categoryId)
        .then((data: any) => {
          this.setState({ categories: formatCategories(data).slice(0, 10) });
        })
        .catch((err: any) => {
          console.error(
            'error when fetching Top Categories',
            err
          );
        });
    } else if (categories) {
      this.setState({ categories });
    }


  }
  handleItemPress = (category: any) => () => {
    return;
    // props.onItemPress(category);
  }
  renderContent = (): React.ReactNode => {
    const {
      dataSource,
      rowStyle,
      showArrow,
      textStyle
    } = this.props;

    if (dataSource && !this.state.categories) {
      return <Loading style={styles.loading} />;
    }

    return this.state.categories.map((category, i) => (
      <PSRow
        key={i}
        title={category.title}
        style={rowStyle}
        textStyle={textStyle}
        onPress={this.handleItemPress(category)}
        showImage={showArrow}
      />
    ));
  }
  render(): JSX.Element {
    const {
      containerStyle
    } = this.props;
    return (
      <View style={[containerStyle]}>
        {this.renderContent()}
      </View>
    );
  }
}
