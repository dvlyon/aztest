import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useColorScheme } from 'react-native'
import { Colours } from './src/styles/Colours'
import Toast from 'react-native-toast-message'
import HomeScreen from './src/screens/HomeScreen'
import ShowScreen from './src/screens/ShowScreen'

export type RootStackParamList = {
    Home: undefined
    Show: { showId: number }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
    const isDarkMode = useColorScheme() === 'dark'

    const options = {
        title: 'TVmaze API Test',
        headerStyle: {
            backgroundColor: isDarkMode ? Colours.darker : Colours.lighter,

        },
        headerTintColor: isDarkMode ? Colours.lighter : Colours.darker,
    }

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Home'>
                    <Stack.Screen
                        name='Home'
                        component={HomeScreen}
                        options={options}
                    />
                    <Stack.Screen
                        name='Show'
                        component={ShowScreen}
                        options={options}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <Toast />
        </>
    )
}

export default App
