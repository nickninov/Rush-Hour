import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Platform,
} from 'react-native';

// Get the screens dimensions to position logo in the middle
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

// Busy component
var RushHourComponent = require('./RushHourComponent').default;

// Bus component
var BusComponent = require('./BusComponent').default;

class LoadingComponent extends Component {
  // Hides the navigation's head
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      color: 'white',
      refreshing: false,
      data: null,
    };
  }

  // User Interface
  render() {

      return (
          <SafeAreaView style = {{backgroundColor: '#131415'}}>
            <View style={styles.contentWrapper}>
              
              <View style ={{marginTop: 15, marginBottom: 15}}>
                <Image source = {require('../../assets/UWL/RushHourLogo.png')} style={styles.logo}/>
              </View>
                
              <BusComponent 
                source = {require('../../assets/UWL/demo.jpeg')}
                start = "Loading"
                end = "Loading"
              />

              <BusComponent 
                source = {require('../../assets/UWL/demo.jpeg')}
                start = "Loading"
                end = "Loading"
              />
                  
              
            </View>
          </SafeAreaView>
      );
  }

  async logOut() {
    await AsyncStorage.removeItem('isLogged');
    this.props.navigation.navigate('Home');
  }
}

// Stylesheet for the log in interface
const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: '#131415',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center'
  },

  logo: {
    width: '10%',
    height: '5%',
    marginBottom: '5%',
    alignSelf: 'center',
    padding: '7%',
    ...Platform.select({
      android: {
        marginTop: '7%',
        marginBottom: '1%'
      }
    })
  },

  contentWrapper: {
    width: '100%',
  },

});

export default LoadingComponent;