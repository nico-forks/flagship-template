import React, { Component } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { get } from 'lodash-es';
import { MultiCarousel } from '@brandingbrand/fscomponents';
import { palette } from '../../styles/variables';
import { fetchCMS } from '../../lib/cms';

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: palette.surface
  },
  containerLoaded: {
    backgroundColor: 'transparent'
  },
  image: {
    borderRadius: 5,
    width: '100%',
    height: 220
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 10
  },
  dotStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.secondary,
    marginHorizontal: 5
  },
  dotActiveStyle: {
    backgroundColor: palette.secondary,
    opacity: 1
  },
  item: {
    paddingHorizontal: 0
  }
});

export interface PSHeroCarouselItem {
  Image: {
    height: number;
    width: number;
    path: string;
  };
  Link: string;
  source?: string;
}

export interface PSHeroCarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  cmsGroup?: string;
  key: string;
  cmsSlot?: string;
  images: any[];
  type: string;
  hideDots?: boolean;
  dotStyle?: StyleProp<ViewStyle>;
  dotStyleActive?: StyleProp<ViewStyle>;
  cmsIdentifier?: string;
  onItemPress?: (item: PSHeroCarouselItem) => void;
}

export default class HeroBlock extends Component<PSHeroCarouselProps> {
  state: any = {
    slotData: []
  };

  componentWillMount(): void {
    if (this.props.type === 'cms') {
      fetchCMS(this.props.cmsGroup || '', this.props.cmsSlot || '', this.props.cmsIdentifier)
        .then((slotData: any) => {
          return this.setState({ slotData })
        }
      )
        .catch((e: any) => console.error('error fetching cms slot ', e));
    } else {
      this.setState({
        slotData: this.props.images
      });
    }
  }

  render(): JSX.Element {
    const { dotStyle, dotStyleActive } = this.props;


    return (
      <View
        style={[
          styles.container,
          this.state.slotData.length && styles.containerLoaded,
          this.props.containerStyle
        ]}
      >
        <MultiCarousel
          itemsPerPage={1}
          items={this.state.slotData}
          pageIndicatorStyle={styles.pageIndicator}
          dotStyle={[styles.dotStyle, dotStyle]}
          dotActiveStyle={[styles.dotActiveStyle, dotStyleActive]}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
  
  // renderPageIndicator = (currentIndex: number, itemsCount: number) => {
    
  //   return (
  //     <View />
  //   );
  // }

  renderItem = (item: PSHeroCarouselItem) => {
    let imagePath;
    if (this.props.type === 'cms') {
      imagePath = get(item, 'Retina-Image.path');
    } else {
      imagePath = item.source;
    }

    if (this.props.onItemPress) {
      return (
        <TouchableOpacity
          onPress={this.handleItemPress(item)}
          style={styles.item}
        >
          <Image
            source={{ uri: imagePath }}
            style={styles.image}
            resizeMode='cover'
            resizeMethod='resize'
          />
        </TouchableOpacity>
      );
    }
    return (
      <Image
        source={{ uri: imagePath }}
        style={styles.image}
        resizeMode='cover'
        resizeMethod='resize'
      />
    );
  }

  handleItemPress = (item: PSHeroCarouselItem) => () => {
    if (this.props.onItemPress) {
      this.props.onItemPress(item);
    }
  }
}
