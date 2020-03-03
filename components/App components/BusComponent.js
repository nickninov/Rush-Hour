import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Platform
} from 'react-native';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class BusComponent extends Component {

  render() {
    return (
      <View style={styles.componentBus}>
        <View style={styles.imageWrapper}>
          <Image source={this.props.source} style={styles.pic} />
        </View>

        <View style={{ paddingTop: 15, width: '100%'}}>
          <Text style={styles.areaText}>
            {this.props.start} -> {this.props.end} 
          </Text>
        </View>

        <View>
            <Text style = {styles.currentLocationText}>
                {this.props.closestStop}
            </Text>
        </View>

        <View>
            <Text style = {styles.minutesText}>
                {this.props.minutes} {this.props.minText}
            </Text>
        </View>

      </View>
    );
  }
}



// Styling for application
const styles = StyleSheet.create({
  // Bus component styling
  componentBus: {
    alignItems: 'center',
    backgroundColor: '#1E1F20',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    ...Platform.select({
      android: {
        marginBottom: 15,
      }
    })
  },

  areaText: {
    fontSize: 30,
    color: '#A5A5A5',
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  currentLocationText: {
    fontSize: 20,
    color: '#A5A5A5',
    fontFamily: 'Verdana',
    marginTop: '4%'
  },

  minutesText: {
    fontSize: 35,
    color: '#F1C30F',
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    marginTop: '4%',
    marginBottom: '4%'
  },

  imageWrapper: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
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


export default BusComponent;
