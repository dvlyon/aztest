import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native'
import { Colours } from '../styles/Colours'
import { Fonts } from '../styles/Fonts'
import DarkModeText from './DarkModeText'

interface ISearchShowCard {
    show: Show
    onPress: (id: number) => void
}

/*
    Component to render a show card on the search screen.
    Prefers medium over original size images.
    Receives a type show and a onPress action that navigates to the show info screen.
*/
const SearchShowCard = ({ show, onPress }: ISearchShowCard) => {
    const isDarkMode = useColorScheme() === 'dark'

    return (
        <Pressable onPress={() => onPress(show.id)}>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDarkMode ? Colours.dark : Colours.light,
                    shadowColor: isDarkMode ? Colours.white : Colours.black,
                }
            ]}>
                <View style={styles.cardImageContainer}>
                    <Image
                        source={{
                            uri: show.image?.medium || show.image?.original || 'https://via.placeholder.com/150/333333/EBEBEB?text=dvlyon.com'
                        }}
                        style={styles.cardImage}
                        resizeMode='cover'
                    />
                </View>
                <View style={styles.cardContent}>
                    <DarkModeText
                        numberOfLines={1}
                        style={Fonts.title}
                        text={show.name}
                        title
                    />
                    <DarkModeText
                        numberOfLines={1}
                        style={Fonts.subTitle}
                        text={show.network?.name || show.webChannel?.name}
                        title
                    />
                    <View style={[
                        styles.cardDivider,
                        {
                            borderBottomColor: isDarkMode ? Colours.white : Colours.black,
                        }]} />
                    <DarkModeText
                        numberOfLines={3}
                        style={[Fonts.paragraph, styles.cardDescription]}
                        text={show.summary?.replace(/(<([^>]+)>)/ig, '')}
                    />
                </View>
            </View>
        </Pressable>
    )
}

export default SearchShowCard

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        shadowOpacity: 0.75,
        elevation: 12,
        borderRadius: 5,
        height: 180,
        flexDirection: 'row'
    },
    cardImage: {
        height: '100%',
        width: '100%',
    },
    cardImageContainer: {
        flex: 1,
    },
    cardContent: {
        padding: 16,
        flex: 2,
    },
    cardDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 6,
    },
    cardDescription: {
        marginTop: 8,
    },
})
