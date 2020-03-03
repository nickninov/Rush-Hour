import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';

// Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Amazon
import Amplify from 'aws-amplify';
import config from "./config";
import { withAuthenticator } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';

class ForgotPassword extends Component {
  // Hides the navigation's head
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    /* States that will store the user's input for email and password field, 
       a flag that will change the screens
       and the confirmation code
    */
    this.state = {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      isEmailSent: false,
      confirmCode: ''
    };
  }

// User Interface
  render() {

    if(this.state.isEmailSent == false) {
      return (
        <View style={styles.cont}>
          <StatusBar barStyle="light-content" />

          <Image source = {require('../assets/UWL/RushHourLogo.png')} style={styles.logo}/>


          <View style={styles.inputWrapper}>
            
          <KeyboardAvoidingView behavior="padding" enabled>
            
              <TextInput
                style={styles.inputstyle}
                placeholder="Username"
                placeholderTextColor="#5B5B5B"
                keyboardType="email-address"
                autoCapitalize={"none"}
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />

  
              <TouchableOpacity onPress={() => { this.sendEmail(this.state.email);}} style={styles.buttonWrapper}>
                  <Text style={styles.logInButtonText}>
                    Continue
                  </Text>
              </TouchableOpacity>
          
          </KeyboardAvoidingView>
          </View>
  
        </View>
      );
    }
    else {

      return (
        <View style={styles.cont}>
          <Image source = {require('../assets/UWL/RushHourLogo.png')} style={styles.logo}/>

          <View style={styles.inputWrapper}>

            <KeyboardAvoidingView behavior="padding" enabled>
              
              <TextInput
                style={styles.inputstyle}
                placeholder="Confirmation code"
                placeholderTextColor="#5B5B5B"
                autoCapitalize={"none"}
                autoCorrect={false}
                onChangeText={confirmCode => this.setState({ confirmCode })}
                value={this.state.confirmCode}
                returnKeyType = "next"
                onSubmitEditing = {() => this.newPassword.focus()}
              />

              <TextInput
                style={styles.inputstyle}
                placeholder="New Password"
                placeholderTextColor="#5B5B5B"
                autoCapitalize={"none"}
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={newPassword => this.setState({ newPassword })}
                value={this.state.newPassword}
                returnKeyType = "next"
                onSubmitEditing = {() => this.confirmNewPassword.focus()}
                ref = {(input) => this.newPassword = input}
              />
    
              <TextInput
                style={styles.inputstyle}
                placeholder="Confirm Password"
                placeholderTextColor="#5B5B5B"
                autoCapitalize={"none"}
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={confirmNewPassword => this.setState({ confirmNewPassword })}
                value={this.state.confirmNewPassword}
                ref = {(input) => this.confirmNewPassword = input}
              />
    

                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={() => {
                    this.confirmDetails(this.state.email, this.state.confirmCode, this.state.newPassword, this.state.confirmNewPassword)
                  }}>
                    <View style={styles.logInButtonTextWrapper}>
                      <Text style={styles.logInButtonText}>
                        Reset
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
            
            </KeyboardAvoidingView>
          </View>
  
        </View>
      );
    }
  }

  // new password: 2p@cShakur

  // A function that will send the user an email with a code for the next step
  async sendEmail(email) {

    // Check if email field is empty
    if(email != ''){
      Auth.forgotPassword(email)
      .then(() => {
        // Change Screen
        this.setState({
          isEmailSent: true
        })
      }).catch(err => alert(err.message));
    }
    else {
      alert("Field is empty!");
    }

  }

  // A function that will confirm the new password 
  confirmDetails(email, code, newPassword, confirmNewPassword) {

    // Collect the confirmation code and new password
    if(newPassword == confirmNewPassword) {

      // Collect confirmation code and new password, then
      Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(data =>  
        this.goToHome()
      )
      .catch(err => alert(err.message));
    }
  }

  async goToHome() {
    // Navigate to home screen
    alert("Password has been successfully changed!");
    this.props.navigation.navigate('Home')
  }
  
}

// Stylesheet for the log in interface
const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: '#131415',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonWrapper: {
    backgroundColor: '#F1C30F',
    marginLeft: '35%',
    marginRight: '35%',
    marginTop: '8%',
    marginBottom: '8%',
    overflow: 'hidden',
    borderRadius: 15,
    padding: '2.5%',
  },

  logo: {
    width: '15%',
    height: '8%',
    marginBottom: '5%',
    alignSelf: 'center',
    padding: '3%',
    ...Platform.select({
      android: {
        width: '13%',
        height: '8%',
        padding: '8%'
      }
    })
  },

  inputstyle: {
    backgroundColor: '#1E1F20',
    fontSize: 22,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    color: 'white'
  },

  inputWrapper: {
    marginTop: '2%',
    width: '100%',
    paddingLeft: '3%',
    paddingRight: '3%'
  },

  logInButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        fontSize: 20,
      }
    })
  },

  logInText: {
    textAlign: 'center',
    color: '#5B5B5B',
    marginTop: '2.5%',
    marginBottom: '2.5%',
    fontSize: 25,
    textAlign: 'left'
  }
});
export default ForgotPassword;