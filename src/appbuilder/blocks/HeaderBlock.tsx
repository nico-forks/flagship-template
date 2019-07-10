import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
// import translate, { translationKeys } from '../../lib/translations';

// import PSButton from '../../components/PSButton';
import GlobalStyle from '../../styles/Global';

const kSpaceBetween = 'space-between';
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: kSpaceBetween,
    alignItems: 'center'
  }
});

export interface Image {
  source: ImageURISource;
  size?: any;
}
export interface PSWelcomeProps {
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  isLoggedIn?: boolean;
  logo?: any;
  userName?: string;
  textStyle?: StyleProp<TextStyle>;
  showWelcomeMessage?: boolean;
  welcomeMessageAccount?: string;
  welcomeMessageGuest?: string;
  onSignInPress: () => void;
  onSignOutPress: () => void;
}

export default class HeaderBlock extends Component<PSWelcomeProps> {
  render(): JSX.Element {
    const {
      containerStyle,
      imageContainerStyle,
      imageStyle,
      isLoggedIn,
      logo,
      showWelcomeMessage,
      userName,
      welcomeMessageAccount,
      welcomeMessageGuest,
      textStyle
    } = this.props;

    const accountUsername = userName || '';

    let accountMessage = welcomeMessageAccount || 'Hi {{accountName}}';
    accountMessage = accountMessage.replace('{{accountName}}', accountUsername);
    const guestMessage = welcomeMessageGuest || 'Welcome!';

    const message =
      isLoggedIn && userName
        ? ` ${accountMessage}!`
        : `${guestMessage}`;
    return (
      <View style={[styles.container, containerStyle]}>
        {logo && (
          <View style={[styles.imageContainer, imageContainerStyle]}>
            <Image
              source={{ uri: logo.source }}
              style={[{ flex: 1 }, { ...logo.size }, imageStyle]}
              resizeMode={'contain'}/>
          </View>
        )}
        {showWelcomeMessage && (
          <Text style={[GlobalStyle.h2, textStyle]}>{message}</Text>
        )}


      </View>
    );
  }
}
