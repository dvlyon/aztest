import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    useColorScheme,
    View,
    ActivityIndicator,
} from 'react-native'
import { Colours } from '../styles/Colours'
import SearchShowCard from '../components/SearchShowCard'
import useDebounce from '../hooks/useDebounce'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { useNetInfo } from '@react-native-community/netinfo'
import Toast from 'react-native-toast-message'

/*
    Screen that displays show cards on user search input.
    Fetches shows information using the searchTerm provided by the user.
    Renders a SearchShowCard for each show in the response.
*/
const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
    const [searchTerm, setsearchTerm] = useState('')
    const [shows, setShows] = useState<Show[]>([])
    const [loading, setLoading] = useState(false)

    const netInfo = useNetInfo()

    // Debounces the searchTerm to prevent unnecessary api calls
    const debouncedSearch = useDebounce(searchTerm, 500)

    // Debounced fetching shows information and validating there's connectivity
    useEffect(() => {
        const searchShows = async (query: string) => {
            try {
                const { data, status } = await axios.get<ShowSearchResult[]>(`https://api.tvmaze.com/search/shows?q=${query}`)

                if (status === 200) {
                    setShows(data.map(d => d.show))
                } else {
                    setShows([])
                }
            } finally {
                setLoading(false)
            }
        }

        if (netInfo.isInternetReachable === true) {
            if (debouncedSearch) {
                setLoading(true)

                searchShows(debouncedSearch)
            } else {
                setShows([])
                setLoading(false)
            }
        } else if (netInfo.isInternetReachable !== null) {
            Toast.show({
                type: 'error',
                text1: 'Network error',
                text2: 'There seems to be an issue with your internet connection.',
                position: 'bottom',
            })
        }
    }, [debouncedSearch, netInfo.isInternetReachable]) // Retry if net becomes available and on debounced searchTerm change

    // Navigation to a show screen upon pressing a show card
    const onShowCardPress = (id: number) => {
        navigation.navigate('Show', { showId: id })
    }

    const isDarkMode = useColorScheme() === 'dark'

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colours.black : Colours.white,
        flex: 1,
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}
            >
                <View style={styles.searchContainer}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={isDarkMode ? require('../assets/search-dm.png') : require('../assets/search.png')}
                            style={styles.searchIcon}
                        />
                    </View>
                    <TextInput
                        placeholder='Search shows...'
                        value={searchTerm}
                        onChangeText={setsearchTerm}
                        style={[
                            styles.searchInput,
                            {
                                color: isDarkMode ? Colours.white : Colours.black,
                            },
                        ]}
                    />
                </View>
                {loading && (
                    <ActivityIndicator />
                )}
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colours.black : Colours.white,
                        flex: 1,
                        padding: 16,
                    }}
                >
                    {shows.map(s => (
                        <SearchShowCard
                            key={s.id}
                            show={s}
                            onPress={onShowCardPress}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        flexDirection: 'row',
        height: 48,
    },
    iconContainer: {
        width: 48,
        padding: 6,
    },
    searchIcon: {
        width: '100%',
        height: '100%',
    },
    searchInput: {
        margin: 6,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        flex: 1,
    },
})
