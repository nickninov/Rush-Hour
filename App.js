import React, {Component} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  AsyncStorage,
  Image,
  StatusBar,
  Platform
} from 'react-native';

// Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Amazon
import Amplify from 'aws-amplify';
import config from "./components/config";
import { withAuthenticator } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
  
    API: {
      endpoints: [
        {
          name: "areas",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
      ]
    }
  });

// Import different screens
import NewAccount from './components/NewAccount';
import ForgotPassword from './components/ForgotPassword';
import RushHour from './components/RushHour';

class App extends React.Component {

  // Hides the navigation's head
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props){
    super(props);
    // States that will store the user's input for email and password field
    this.state = {
      email: '',
      password: '',
    }
  };

  // Check to which screen to go to
  async componentWillMount() {

    // Check if the user has started creating a new account and verifying it
    const emailNewAccount = await AsyncStorage.getItem('emailNewAccount');

    // Check if the user has logged
    const isLogged = await AsyncStorage.getItem('isLogged');

    // Check if the user has already started making an account
    if(emailNewAccount != null && emailNewAccount != ''){
      this.props.navigation.navigate('NewAccount');
    }

    // Check if the user has an account to be successfully logged in
    if(isLogged == "true"){
      // Remove emailNewAccount and emailForgotPassword from AsyncStorage
      await AsyncStorage.removeItem('emailNewAccount');

      // Go to the Application screen
      this.props.navigation.navigate('Application');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Image source = {require('./assets/UWL/RushHourLogo.png')} style={styles.logo}/>

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

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => { this.logInUser(this.state.email, this.state.password);}}>
                <Text style={styles.logInButtonText}>
                  Login
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ForgotPassword') }}>
              <Text style={styles.logInText}>
                Forgot your password? Please reset it.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewAccount')}}>
              <Text style={styles.logInText}>
                New to us, create an account
              </Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };

  // Username: 21361642@student.uwl.ac.uk
  // Password: m0nk@Sm0nk@S
  // 2P@cShakur

  // Log in user to the application
  logInUser(email, password) {
    if(email != '' && password != ''){
      Auth.signIn({
        username: email,
        password: password
      }).then(() => {
        this.toApplication();
      })
      .catch(err => alert(err.message));
    }
  }

  // A method that stores that the user has successfully signed in and then leads them to the app
  async toApplication() {
    // Async the user
    try {
      await AsyncStorage.setItem('isLogged', "true");

      // Clear email and password fields
      this.setState({
        email: '',
        password: ''
      })
       // Go to the application
      this.props.navigation.navigate('Application');
    }
    catch (error) {
      console.log(error)
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131415',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center'
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

  inputstyle: {
    backgroundColor: '#1E1F20',
    color: 'white',
    fontSize: 22,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 15,
  },

  logInButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
    ...Platform.select({
      android: {
        fontSize: 20,
      }
    })
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

  logInText: {
    textAlign: 'center',
    color: '#5B5B5B',
    marginTop: '2.5%',
    marginBottom: '2.5%',
    fontWeight: "900",
    fontSize: 15
  },

  inputWrapper: {
    width: '100%',
    paddingLeft: '3%',
    paddingRight: '3%',  
  }
});

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: App,
    },
    NewAccount: {
      screen: NewAccount,
    },
    ForgotPassword: {
      screen: ForgotPassword,
    },
    Application: {
      screen: RushHour,
    }
  },
  {
    initialRouteKey: 'Home',
  }
);
export default createAppContainer(AppNavigator);