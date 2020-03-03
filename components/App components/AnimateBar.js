import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
} from 'react-native';

import randomcolor from 'randomcolor';

// Get the screens dimensions to position logo in the middle
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class AnimatedBar extends Component {
  constructor(props) {
    super(props);

    this._width = new Animated.Value(0);
  }

  componentDidMount() {
    this.animateTo(this.props.delay, this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    this.animateTo(nextProps.delay, nextProps.value);
  }

  animateTo = (delay, value) => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this._width, {
        toValue: value,
      }),
    ]).start();
  };

  render() {
    const barStyles = {
      backgroundColor: this.props.barColor,
      height: this.props.height,
      width: 23,
      justifyContent: 'flex-end',
      alignItems: 'center',
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      
      // Gets the screen's width and multiplies it by 0.028 for margin left and margin right
      marginLeft: width * 0.028,
      marginRight: width * 0.028,
    };

    const textStyle = {
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginLeft: 1,
      marginRight: 1,
      alignSelf: 'center',
      transform: [{ rotate: '180deg' }],
      color: '#5B5B5B',
      fontSize: 20,
      textAlign: 'center',
    };

    return (
      <View>
        <Text style={textStyle}>{this.props.day}</Text>
        <Animated.View style={barStyles} />
      </View>
    );
  }
}
export default AnimatedBar;
