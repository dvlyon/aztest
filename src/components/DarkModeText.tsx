import { StyleProp, Text, TextStyle, useColorScheme } from 'react-native'
import { Colours } from '../styles/Colours'

interface IDarkModeText {
    numberOfLines?: number
    style?: StyleProp<TextStyle>
    text?: string
    title?: boolean
}

/*
    Component to render a text based on DarkMode.
    Receives a subset of Text props.
*/
const DarkModeText = ({ numberOfLines, style, text, title }: IDarkModeText) => {
    const isDarkMode = useColorScheme() === 'dark'

    const dmStyle: StyleProp<TextStyle> = title ? {
        color: isDarkMode ? Colours.white : Colours.black,
    } : {
        color: isDarkMode ? Colours.light : Colours.dark,
    }

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[
                dmStyle,
                style,
            ]}
        >
            {text}
        </Text>
    )
}

export default DarkModeText
