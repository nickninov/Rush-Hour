import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  RefreshControl
} from 'react-native';

// Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Import tracking
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// Get the screens dimensions to position logo in the middle
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

// Busy component
var RushHourComponent = require('./App components/RushHourComponent').default;

// Bus component
var BusComponent = require('./App components/BusComponent').default;

// Loading component
var LoadingComponent = require('./App components/LoadingComponent').default;

// Import API from AWS
import { API } from "aws-amplify";

class RushHour extends Component {

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
      toEalingMinutes: 'N/A',
      toEalingStop: '',
      toParagonMinutes: 'N/A',
      toParagonStop: '',
      minVar: ''
    };
  }

  // Returns the names of the areas and their images from AWS
  getAreaNames() {
    return API.get("areas", "/areas");
  }

  // Returns the count for each specified area in getAreaNames()
  getBusyness(area) {
    return API.get("areas", "/areas/" + area);
  }

  // Returns the BUS api with the services
  getBusData(stop) {
    return API.get("areas", "/buses/"+stop);
  }

  // Set the user's closest bus stops 
  async setClosestBusStop(array){

    // Get the status from the permission query
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    // Check if status has been granted
    if (status == 'granted') {

      // Get the current location of the user
      var location = await Location.getCurrentPositionAsync({});

      // Store the user's longitude and latitude
      var long = location.coords.longitude;
      var lat = location.coords.latitude;

      // Store the difference from all bus stops 
      var difference = [];

      // Iterate through each object within the array with bus stops: Stop - Curent Location
      for(var i = 0; i < array.length; i++){

        // Get the lattitude difference
        var latDifference = Math.abs(array[i].lat - lat);

        // Get the longitude
        var longDifference = Math.abs(array[i].lng - long);

        // lat diff + long diff
        var diffSum = latDifference + longDifference;

        difference.push({
          id: array[i].id,
          difference: diffSum,
          busStop: array[i].name
        });
      }

      difference.sort(function(stop1, stop2) {
        return stop1.difference - stop2.difference
      })

      return difference[0];
    }
  };

  // A method that puts all the API data in a state
  async getData() {

    // Fetch the images and area name data
    var allAreas = await this.getAreaNames();
    
    var tempAPIStorage = [];

    // Access each individual area and image
    for await(var areaData of allAreas) {

      // Create empty temporary data holder for each area
      var tempObj = {};

      // Store the name of the area and the area's image inside the temporary object
      tempObj.areaName = areaData.area;
      tempObj.areaImg = areaData.image;

      // Fetch details for each area
      var areaDetails = await this.getBusyness(areaData.area);
      
      // Temporary array that holds the busyness for today and the past 7 days
      var dayAndCountHolder = [];

      // Access each Day of the week and the level of busyness
      for (var element of areaDetails) {
        dayAndCountHolder.push({
          day: element.day,
          count: element.count
        });
      }

      // Add busyness for every day
      tempObj.days = dayAndCountHolder;

      tempAPIStorage.push(tempObj);
    }

    return tempAPIStorage;
  }


  // A method that returns the name of the closest stop
  async getNextStop(id){

    // Variable that holds the entire API data
    var busData = await this.getBusData(id);

    // Get the service data from the bus API
    var stopData = busData.services

    // Variables that will hold the bus API hour and minutes
    var busTimeHour = "N/A";
    var busTimeMinutes = "N/A"

    // Get the estimated time of arrival of a bus
    for(var data of stopData){

      // Check if the required section is not null 
      if(data.eta != null && (data.eta.status == "future" || data.eta.status == "next_stop")){

        // Store the arrival hour and minutes from the API in the declared variables
        busTimeHour = data.eta.etaArrive.hrs;
        busTimeMinutes = data.eta.etaArrive.mins;

        // Exit the loop
        break;
      }
    }

    // Check if the time has values
    if(busTimeHour != 'N/A' && busTimeMinutes != 'N/A'){

      // Make the API hour and minutes in Date format
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var day = new Date().getDate();
      var sec = new Date().getSeconds();
      var msec = new Date().getMilliseconds();

      // Make an API date with the bus arrival hour and minutes
      var apiDate = new Date(year, month, day, busTimeHour, busTimeMinutes, sec, msec);

      // Get the current time
      var currentDate = new Date();
      
      // Get the miliseconds from the difference of the arrival time and current time
      var miliseconds = apiDate.getTime() - currentDate.getTime();

      // Convert the miliseconds to minutes
      var minutes= Math.floor((miliseconds / 1000 / 60) << 0);

      // Check if the bus is late or on time
      if (minutes <= 0 || minutes == 0){
        console.log("Negative minutes or 0 munutes: "+minutes);

        return 0;
      }

      else {
        console.log("Arrival time: "+minutes);
        
        return minutes;
      }
      
    }
    else {
      return 'N/A'

    }
  }

  // Fetches all the data after the initial render and updates render again
  async componentDidMount() {

    // Get bus stop locations - Ealing - Paragon
    const ealing = [
      { name: 'Ealing Broadway', id: 51, lat: 51.5150111296241, lng: -0.302959529045665 }, 
      { name: 'High Street', id: 52, lat: 51.5122368939852, lng: -0.304721740368449 }, 
      { name: 'University of West London (SMR)', id: 54, lat: 51.5069550301441, lng: -0.305086520794475 }, 
      { name: 'South Ealing Station', id: 58, lat: 51.5011766642787, lng: -0.306658295277202 }, 
      { name: 'Little Ealing Lane', id: 56, lat: 51.4981845151585, lng: -0.306261328342998 }, 
      { name: 'Paragon House', id: 50, lat: 51.489056, lng: -0.314715 }
    ];

    // Get bus stop locations - Paragon - Ealing
    const paragon = [
      { name: 'Paragon House', id: 50, lat: 51.489056, lng: -0.314715 },
      { name: 'Little Ealing Lane', id: 57, lat: 51.4981795058156, lng: -0.306500044945323 }, 
      { name: 'South Ealing Station', id: 59, lat: 51.5008193532281, lng: -0.306671706322276 }, 
      { name: 'University of West London (SMR)', id: 55, lat: 51.5056678586504, lng: -0.305287686470592 }, 
      { name: 'Bond Street', id: 53, lat: 51.5118396069413, lng: -0.305842903736675 }, 
      { name: 'Ealing Broadway', id: 51, lat: 51.5150111296241, lng: -0.302959529045665 }
    ];

    // Get the object that is closest to the user's location Ealing - Paragon
    var closestEaling = await this.setClosestBusStop(ealing);

    // Get the object that is closest to the user's location Paragon - Ealing
    var closestParagon = await this.setClosestBusStop(paragon);

    // Get closest 
    var ealingStopMinutes = await this.getNextStop(closestEaling.id);
    var paragonStopMinutes = await this.getNextStop(closestParagon.id);
    
    // Check if api is functioning 
    if(ealingStopMinutes != "N/A" && paragonStopMinutes != "N/A"){
      this.setState({
        minVar: 'min'
      })
    }


    // Set busy data, minutes and stop for closest stops
    this.setState({
      data: await this.getData(),
      toEalingMinutes: ealingStopMinutes,
      toEalingStop: closestEaling.busStop,
      toParagonMinutes: paragonStopMinutes,
      toParagonStop: closestParagon.busStop
    });

  }

  // User Interface
  render() {

    // A variable that will store the entire data
    const visualData = this.state.data;
    
    // If the data is fetched successfully the components will be displayed in render
    if(visualData != null){
      
      // An array that will hold each component
      var components = [];

      // An object that will store the values of the three colors depending on the busyness levels
      var colors = {
        low: "#AEF10F",
        medium: "#F1C30F",
        high: "#F1520F"
      }

      // Loops all the areas and puts the information in the components array
      for (var component of visualData) {

        // Set a local variable that will store the color
        var color = null;

        // Checks what color should the dot be for every zone depending on their busyness
        if(component.days[0].count <= 0.33) {
          color = colors.low;
        }
        else if (component.days[0].count > 0.33 && component.days[0].count <= 0.66){
          color = colors.medium;
        }

        // Add a single RushHourComponent to the components array so they can be shown in render
        components.push(
          <RushHourComponent
            area = {component.areaName} dotColor={color}
            status={this.state.status} source={{uri: component.areaImg}}
            day7 = {component.days[1].day} height7 = {component.days[1].count * 100}
            day6 = {component.days[2].day} height6 = {component.days[2].count * 100}
            day5 = {component.days[3].day} height5 = {component.days[3].count * 100}
            day4 = {component.days[4].day} height4 = {component.days[4].count * 100}
            day3 = {component.days[5].day} height3 = {component.days[5].count * 100}
            day2 = {component.days[6].day} height2 = {component.days[6].count * 100}
            day1 = {component.days[7].day} height1 = {component.days[7].count * 100}
            barColor = "#F1C30F"
          />
        )
      }
      return (
        <View style={styles.cont}>
          <StatusBar barStyle="light-content" />
            <SafeAreaView />
                
            
              <View style ={{marginTop: 5, paddingBottom: '2%'}}>

                <TouchableOpacity onPress = {() => {console.log("Logo clicked")}} style = {{width: '100%'}}>
                  
                  <Image source = {require('../assets/UWL/RushHourLogo.png')} style={styles.logo}/>
                  
                </TouchableOpacity>

              </View>
            

              <ScrollView style = {styles.bigScroll}>
              
                <BusComponent 
                  source = {require('../assets/UWL/shuttle.jpeg')}
                  start = "Ealing"
                  end = "Paragon"
                  closestStop = {this.state.toParagonStop}
                  minutes = {this.state.toParagonMinutes}
                  minText = {this.state.minVar}
                />

                <BusComponent 
                  source = {require('../assets/UWL/shuttle.jpeg')}
                  start = "Paragon"
                  end = "Ealing"
                  closestStop = {this.state.toEalingStop}
                  minutes = {this.state.toEalingMinutes}
                  minText = {this.state.minVar}
                />

              
              <View style = {{paddingTop: '3%'}}>
                {
                  components
                }
              </View>

              <TouchableOpacity onPress={() =>  { this.logOut();} } style={styles.buttonWrapper}>
                <Text style={styles.logOutButtonText}>
                  Log out
                </Text>
              </TouchableOpacity>

            </ScrollView>                

        </View>
      );
    }
    // Display the loading component while loading
    else {
      return (
          <LoadingComponent/>
      )
    }      
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
    alignSelf: 'center',
    padding: '7%',
    ...Platform.select({
      android: {
        marginTop: '7%',
        marginBottom: '1%'
      }
    })
  },

  buttonWrapper: {
    backgroundColor: '#F1C30F',
    marginLeft: '35%',
    marginRight: '35%',
    marginTop: '4%',
    marginBottom: '4%',
    borderRadius: 15,
    padding: '2.5%',
  },

  logOutButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    height: 25,
    ...Platform.select({
      android: {
        fontSize: 20,
      }
    })
  },

  bigScroll: {
    ...Platform.select({
      android: {
        height: height
      }
    }),
    marginBottom: '5%',
    width: '100%',
  }

});

export default RushHour;