import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
  Platform
} from 'react-native';

var AnimatedBar = require('./AnimateBar.js').default;

// Rush Hour Component - displays image of location and current status
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class RushHourComponent extends Component {

  render() {
    return (
      <View style={styles.componentRushHour}>
        <View
          style={styles.imageWrapper}>
          <Image source={this.props.source} style={styles.pic} />
        </View>

        <View style={{ paddingTop: 15,  paddingLeft: 15, textAlign: 'left', width: '100%',}}>
          <Text style={styles.areaText}>
            {this.props.area}
            <Text style={{ color: this.props.dotColor, fontSize: 20}}>{'\u0020\u0020\u2B24'}</Text>
          </Text>
          
        </View>

        <View
          style={styles.barWrapper}>
          <AnimatedBar day = {this.props.day7} height = {this.props.height7} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day6} height = {this.props.height6} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day5} height = {this.props.height5} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day4} height = {this.props.height4} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day3} height = {this.props.height3} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day2} height = {this.props.height2} barColor = {this.props.barColor}/>
          <AnimatedBar day = {this.props.day1} height = {this.props.height1} barColor = {this.props.barColor}/>
        </View>
      </View>
    );
  }
}



// Styling for application
const styles = StyleSheet.create({
  // RushHour component styling
  componentRushHour: {
    alignItems: 'center',
    backgroundColor: '#1E1F20',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    marginBottom: 10,
    ...Platform.select({
      android: {
        marginBottom: 15,
      }
    })
  },
  imageWrapper: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden',
  },

  barWrapper: {
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
    marginTop: 30,
    marginBottom: 18,
    flexDirection: 'row-reverse',
  },

  areaText: {
    fontSize: 30,
    color: '#A5A5A5',
    fontFamily: 'Verdana',
    fontWeight: 'bold',
  },

  // Pictures
  pic: {
    width: width - 30,
    height: 190,
    borderTopLeftRadius: width / 9,
    borderTopRightRadius: width / 9,

    ...Platform.select({
      android: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: 150,
      }
    })
  },
});


export default RushHourComponent;
