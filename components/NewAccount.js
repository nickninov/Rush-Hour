import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';

// Date picker
import DatePicker from 'react-native-datepicker';

// Dropdown
import RNPickerSelect from 'react-native-picker-select';

// Amazon
import { Auth } from 'aws-amplify';

class NewAccount extends Component {

  // Hides the navigation's head
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);
    /* States that will store the user's input for email and password field, 
       a flag that will change the screens
       and the confirmation code
    */
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      isEmailSent: false,
      confirmCode: ''
    };
  }

  /*
    This method will try to fetch the given string from the AsyncStorage.
    This will method will try to auto log in the user when they initially open the application
    If the string is null or "false" nothing will be executed.
    If the string is "true" the application will log the user within the app
  */
  asyncChecks = async () => {
    const emailNewAccount = await AsyncStorage.getItem('emailNewAccount');

    // Checks if the user has closed the app and lead them to the confirm screen
    if(emailNewAccount != null && emailNewAccount != ''){
      this.setState({
        isEmailSent: true,
        email: emailNewAccount
      })
    }
  }

  // Executes before the first render
  componentWillMount() {
    this.asyncChecks();
  }

  // User Interface
  render() {

    // Check if an email has been sent or not
    if(this.state.isEmailSent == false) {

      return (
        <View style={styles.cont}>
          <StatusBar barStyle="light-content" />

          <Image source = {require('../assets/UWL/RushHourLogo.png')} style={styles.logo}/>

          <View style={styles.inputWrapper}>

            <KeyboardAvoidingView behavior="padding" enabled>

              <View style={styles.container}>
    
                <TextInput
                  style={styles.inputstyle}
                  placeholder="First Name"
                  placeholderTextColor="#5B5B5B"
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  onChangeText={firstName => this.setState({ firstName })}
                  value={this.state.firstName}
                  returnKeyType = "next"
                  onSubmitEditing = {() => this.lastNameInput.focus()}
                />

                <TextInput
                  style={styles.inputstyle}
                  placeholder="Last Name"
                  placeholderTextColor="#5B5B5B"
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  onChangeText={lastName => this.setState({ lastName })}
                  value={this.state.lastName}
                  ref = {(input) => this.lastNameInput = input}
                />

                <View style = {styles.genderDropdown}>
                  <RNPickerSelect
                    onValueChange={(gender) => this.setState({gender: gender})}
                    placeholder = {{label: 'Select gender'}}
                    style = {{
                      placeholder: {
                        color: '#5B5B5B',
                        fontSize: 22
                      },

                      inputIOS: {
                        color: 'white',
                        fontSize: 22
                      },

                      inputAndroid: {
                        color: 'white',
                        fontSize: 22
                      }
                  }}
                    items={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' },
                    ]}
                  />
                </View>

                <DatePicker
                  style = {styles.datePicker}
                  date={this.state.birthDate}
                  mode="date"
                  placeholder="Select birthday"
                  format="YYYY-MM-DD"
                  minDate="1950-01-01"
                  maxDate="2099-12-31"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon = {false}
                  customStyles ={{
                    dateInput: {
                      alignItems: 'flex-start',
                      borderRadius: 10,
                      backgroundColor: '#1e1f20',
                      borderColor: '#1e1f20',
                      ...Platform.select({
                        android: {

                        }
                      })
                    },
                    // The placeholder text
                    placeholderText: {
                      color: '#5B5B5B',
                      fontSize: 22,
                      marginLeft: '1.5%',
                      ...Platform.select({
                        android: {
                          fontSize: 22
                        }
                      })
                    },
                    // The selected date text
                    dateText: {
                      color: 'white',
                      fontSize: 23,
                      marginLeft: '1.5%'
                    }
                  }}
                  onDateChange={(date) => {this.setState({birthDate: date})}}
                />

                <TextInput
                  style={styles.inputstyle}
                  placeholder="12345678@student.uwl.ac.uk"
                  placeholderTextColor="#5B5B5B"
                  keyboardType="email-address"
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  returnKeyType = "next"
                  onSubmitEditing = {() => this.passwordInput.focus()}
                />
    
                <TextInput
                  style={styles.inputstyle}
                  placeholder="Password"
                  placeholderTextColor="#5B5B5B"
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  secureTextEntry={true}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  ref = {(input) => this.passwordInput = input}
                />
                </View>

                <TouchableOpacity onPress={() => {
                  this.signUpValidation(this.state.firstName, this.state.lastName, this.state.gender, this.state.birthDate, this.state.email, this.state.password);
                }} style={styles.buttonWrapper}>
                    <Text style={styles.logInButtonText}>
                      Sign up
                    </Text>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Home') }}>
                  <View>
                    <Text style={styles.logInText}>
                      Already registered? Sign in.
                    </Text>
                  </View>
                </TouchableOpacity>
    

            </KeyboardAvoidingView>
          </View>
        </View>
      );

    }
    else {
      return (
        <View style={styles.cont}>
          <StatusBar barStyle="light-content" />

          <Image source = {require('../assets/UWL/RushHourLogo.png')} style={styles.logo}/>

          <View style={styles.inputWrapper}>
          <KeyboardAvoidingView behavior="padding" enabled>
  
            <View style={styles.container}>
  
              <TextInput
                style={styles.inputstyle}
                placeholder="Confirmation Code"
                placeholderTextColor="#5B5B5B"
                autoCapitalize={"none"}
                autoCorrect={false}
                onChangeText={confirmCode => this.setState({ confirmCode })}
                value={this.state.confirmCode}
              />

              </View>
  
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => {
                  this.confirmation(this.state.email, this.state.confirmCode);
                }}>
                  <Text style={styles.logInButtonText}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
  
            
          </KeyboardAvoidingView>
          </View>
        </View>
      );
    }
  }

// Username: 21361642@student.uwl.ac.uk
// Password: m0nk@Sm0nk@S

  // Tries to sign up the user with the given information
  signUpValidation(firstName, lastName, gender, birthDate, email, password) {
    // Checks if the fields are empty 
    if(firstName != '' && lastName != '' && gender != '' && birthDate != '' && email != '' && password != '') {
      Auth.signUp({
        username: email,
        password: password,
        attributes: {
          given_name: firstName,
          family_name: lastName,
          gender: gender,
          birthdate: birthDate
        }
        })
        // If the sign up was successful the verification screen will be switched
        .then(() => this.updateWindow(email))
        .catch(err => alert(err.message))
    }
  }

  // A method that informs the user to check their email and changes the current screen 
  async updateWindow(email){
    alert("A verification code has been sent to "+email);
    // Store the email
    await AsyncStorage.setItem('emailNewAccount', email);
    this.setState({
      isEmailSent: true
    });
  }

  // A method that will try to confirm the user's entered verification code
  confirmation(email, confirmationCode) {
    Auth.confirmSignUp(email, confirmationCode)
    .then(() => this.registerUser())
    .catch(err => alert(err.message))
  }

  /*
    This method will only be executed when the user has successfully created an account or logged in.
    It indicates that the user can automatically go to the application screen without entering their 
    details again next time the appllication is opened.
  */
  async registerUser(){
    // Async the user
    try {
      // Enable auto log in
      await AsyncStorage.setItem('isLogged', "true");

      // Delete new account information
      await AsyncStorage.removeItem('emailNewAccount');
    }
    catch (error) {
      console.log(error)
    }

    // Inform the user that an account was successfully created
    alert("Account has been successfully created!");

    // Navigate to screen
    this.props.navigation.navigate('Application');
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

  logo: {
    width: '15%',
    height: '8%',
    marginBottom: '8%',
    alignSelf: 'center',
    ...Platform.select({
      android: {
        width: '13%',
        height: '8%',
      }
    })
  },

  container: {
    // backgroundColor: 'pink',
    marginLeft: '10%',
    marginRight: '10%'
  },

  buttonWrapper: {
    backgroundColor: '#F1C30F',
    marginLeft: '35%',
    marginRight: '35%',
    marginTop: '4%',
    marginBottom: '2%',
    overflow: 'hidden',
    borderRadius: 15,
    padding: '2.5%',
  },

  inputstyle: {
    backgroundColor: '#1E1F20',
    fontSize: 20,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    marginTop: '1%',
    marginBottom: '1%',
    padding: '1%',
    ...Platform.select({
      android: {
        fontSize: 22,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 7,
      }
    })
  },

  genderDropdown: {
    backgroundColor: '#1E1F20',
    paddingTop: '4.5%',
    paddingBottom: '4.5%',
    paddingLeft: '1%',
    marginTop: '1.5%',
    marginBottom: '1.5%',
    borderRadius: 10,
    ...Platform.select({
      android: {
        paddingTop: 0,
        paddingBottom: 0,
      }
    })
  },

  datePicker: {
    width: '100%',
    borderRadius: 10,
    textAlign: 'center',
    marginTop: '1%',
    marginBottom: '1%'
  },

  icon: {
    color: '#F1C30F',
    textAlign: 'center'
  },

  inputWrapper: {
    marginTop: '5%',
    width: '100%',
    ...Platform.select({
      android: {
        marginTop: '2%'
      }
    })
  },

  logInButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
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
    fontWeight: "bold",
    fontSize: 15
  }
});

export default NewAccount;

// David
// Username: 21290089@student.uwl.ac.uk
// Password: Afm8907sec!