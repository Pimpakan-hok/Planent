import React from 'react-native';

// log in and register
import Login from './planentAuthentication/Login';
import Register from './planentAuthentication/Register';

// Forget password
import ResetPassword from './planentAuthentication/ForgetPasswordEmail';

// Main App Stack
import ScreenStacker from './ScreenStacker';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Stack = createStackNavigator({
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            headerShown: false
        }
    },
    RegisterScreen: {
        screen: Register,
        navigationOptions: {
            headerShown: false
        }
    },
    ForgetPassScreen: {
        screen: ResetPassword,
        navigationOptions: {
            headerShown: false
        }
    },
    HomeScreen: {
        screen: ScreenStacker,
        navigationOptions: {
            headerShown: false
        }
    }

});

export default createAppContainer (Stack);