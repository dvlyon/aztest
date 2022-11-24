import { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, useColorScheme, Text, View, Linking } from 'react-native'
import { Colours } from '../styles/Colours'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios from 'axios'
import { RootStackParamList } from '../../App'
import { useNetInfo } from '@react-native-community/netinfo'
import Toast from 'react-native-toast-message'
import DarkModeText from '../components/DarkModeText'
import { Fonts } from '../styles/Fonts'

/*
    Screen that displays a show's information.
    Fetches the show information using the showId from the route params.
    Prefers original over medium size images.
*/
const ShowScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Show'>) => {
    const [show, setShow] = useState<Show | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    const netInfo = useNetInfo()

    // Fetching show information and validating there's connectivity
    useEffect(() => {
        const getShow = async () => {
            try {
                const { data, status } = await axios.get<Show>(`https://api.tvmaze.com/shows/${route.params.showId}`)

                if (status === 200) {
                    setShow(data)

                    navigation.setOptions({ title: `${data.name} (${data.network?.name || data.webChannel?.name})` })
                }
            } finally {
                setLoading(false)
            }
        }

        if (netInfo.isInternetReachable === true) {
            setLoading(true)

            getShow()
        } else if (netInfo.isInternetReachable !== null) {
            Toast.show({
                type: 'error',
                text1: 'Network error',
                text2: 'There seems to be an issue with your internet connection.',
                position: 'bottom',
            })
        }
    }, [netInfo.isInternetReachable]) // Retry if net becomes available

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

                {loading && (
                    <ActivityIndicator />
                )}
                {show && (
                    <>
                        <Image
                            source={{
                                uri: show.image?.original || show.image?.medium || 'https://via.placeholder.com/150/333333/EBEBEB?text=dvlyon.com'
                            }}
                            style={styles.image}
                            resizeMode='contain'
                        />
                        <View style={[
                            styles.section,
                            {
                                backgroundColor: isDarkMode ? Colours.dark : Colours.light,
                                shadowColor: isDarkMode ? Colours.white : Colours.black,
                            }
                        ]}>
                            <DarkModeText
                                style={[Fonts.title, styles.spacing]}
                                text={`${show.name} ${show.premiered && `(${new Date(show.premiered).getFullYear()})`}`}
                                title
                            />
                            <DarkModeText
                                style={[Fonts.subTitle, styles.spacing]}
                                text={show.network?.name || show.webChannel?.name}
                                title
                            />
                            <View style={[
                                styles.sectionDivider,
                                {
                                    borderBottomColor: isDarkMode ? Colours.white : Colours.black,
                                }]}
                            />
                            <DarkModeText
                                style={[Fonts.paragraph, styles.sectionDescription]}
                                text={show.summary?.replace(/(<([^>]+)>)/ig, '')}
                            />
                            <DarkModeText text={`Genres: ${show?.genres.join(', ')}`} />
                            <DarkModeText text={`Status: ${show?.status}`} />
                            {show.officialSite && (
                                <Text
                                    style={{
                                        color: isDarkMode ? 'lightblue' : 'blue',
                                    }}
                                    onPress={() => Linking.openURL(show.officialSite)}
                                >
                                    Website
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ShowScreen

const styles = StyleSheet.create({
    image: {
        height: 400,
        width: '100%',
    },
    section: {
        marginTop: -8,
        shadowOpacity: 0.75,
        elevation: 12,
        borderTopEndRadius: 32,
        borderTopStartRadius: 32,
        padding: 16,
    },
    spacing: {
        marginBottom: 6,
    },
    sectionDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 12,
    },
    sectionDescription: {
        marginBottom: 16,
    },
})
