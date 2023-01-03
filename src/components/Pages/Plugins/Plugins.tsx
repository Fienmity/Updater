/**
 * Imports
 */
import { TouchableOpacity, View, Text } from 'enmity/components';
import { getByName, getByProps } from 'enmity/metro';
import { Constants, Dialog, React, StyleSheet } from 'enmity/metro/common';
import PluginItem from './PluginItem';
import ExitWrapper from '../../Wrappers/ExitWrapper';
import { get, getBoolean } from 'enmity/api/settings';
import { name } from '../../../manifest.json'
import updatePlugin from '../../../func/updatePlugin';
import { reload } from 'enmity/api/native';

/**
 * The main Search module, used to input text and store it. This is easy to make from scratch, but because Discord already made one I might aswell use it.
 * @param Search: The main Search Bar component
 */
const Search = getByName('StaticSearchBarContainer');
const Button = getByProps("ButtonColors", "ButtonLooks", "ButtonSizes").default;

export default () => {
    /**
     * Main states used throughout the component to allow storing options and the possible search query.
     * @param {Getter, Setter} query: The query that has been searched with the Search module.
     */
    const [isBulk, setIsBulk] = React.useState(false);
    const [query, setQuery] = React.useState([]);
    const invalidate = React.useState({})[1];

    const availableUpdates = JSON.parse(get(name, "_availableUpdates") as string)

    async function updateHandler() {
        const availableOptions: any[] = availableUpdates.filter(plugin => getBoolean(name, plugin.name, true));

        availableOptions.length > 0
            ? Dialog.show({
                title: "Update found",
                body: `An update is available for the following plugins:\n ${availableOptions.map(item => '\n' + `• **${item.name}**`)} \n\n Would you like to update all of these plugins now?`,
                confirmText: "Update All",
                cancelText: "Not now",

                onConfirm: () => {
                    availableOptions.forEach(option => {
                        updatePlugin(option.name, (updated) => {
                            if (updated) {
                                Dialog.show({
                                    title: `Updated Plugin`,
                                    body: `Successfully updated ${option.name}. \nWould you like to reload Discord or continue to the next plugin?`,
                                    confirmText: "Reload",
                                    cancelText: "Continue",

                                    /**
                                     * Use the native @arg reload function to force crash Enmity.
                                     * @returns {void}
                                     */
                                    onConfirm: (): void => reload(),
                                })
                            }
                        })
                    })
                }
            }) : Dialog.show({
                title: "No updates",
                body: `**No updates for any plugins were found**. \nThis is as a result of any of the following: \n\n• **You disabled all plugins from being checked by Updater**\n• **There are no plugins installed which have Updater implemented** \n\nHere's a cat for now :3`,
                confirmText: "Okay",
            })
        
        invalidate({})
    }


    const filter_color = (color: string, light: string, dark: string, boundary: number = 186): string => {
        let base_color = color.replace("#", "")
        const parse_color_as_int = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        const red = parse_color_as_int(base_color, [0, 2], 16),
            green = parse_color_as_int(base_color, [2, 4], 16),
            blue = parse_color_as_int(base_color, [4, 6], 16);

        return (((red + green + blue) / (255 * 3)) > boundary)
            ? dark
            : light
    }

    const styles = StyleSheet.createThemedStyleSheet({
        button: {
            width: '90%',
            height: 50,
            position: 'absolute',
            bottom: 0,
            marginBottom: 30,
            justifyContent: 'center',
            backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
            borderRadius: 10,
            marginLeft: '5%',
            marginRight: '5%',
        },
        text: {
            color: filter_color(Constants.ThemeColorMap.HEADER_PRIMARY[0], '#f2f2f2', "#121212", 0.8),
            textAlign: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            letterSpacing: 0.25,
            fontFamily: Constants.Fonts.PRIMARY_BOLD,
            fontSize: 16,
        },
    })

    /**
     * Main return element of the Component.
     * @returns {~ TSX Page}
     */
    return <>
        {/**
          * The main search container. Any text that is inputted into this, will be stored into the query state, and filtered on re-render.
          */}
        <Search
            placeholder="Search Options"
            onChangeText={(text: string) => setQuery(text)}
        />
        {/**
          * The main part of the component, showing available options to toggle.
          * This is wrapped in an @arg {TSX} ExitWrapper component to allow the user to close out the page by swiping to the right.
          */}
        <ExitWrapper component={<View style={{ marginBottom: 100 }}>
            <Button
                color={'link'}
                text={`${isBulk ? "Disable" : "Enable"} Bulk Update`}
                size='small'
                onPress={() => setIsBulk(prev => !prev)}
                style={{
                    marginTop: 16,
                    width: '95%',
                    marginLeft: "2.5%"
                }}
            />
            {availableUpdates.filter(item => item.name.toLowerCase().includes(query)).map(plugin => <PluginItem
                plugin={{
                    name: plugin.name,
                    version: plugin.version,
                    changelog: plugin.updater?.changelog,
                    color: plugin?.color
                }}
                isBulk={isBulk}
                onInstall={() => invalidate({})}
            />)}
        </View>} />
        {isBulk ? <TouchableOpacity
            style={styles.button}
            onPress={updateHandler}>
            <Text style={styles.text}>Update All</Text>
        </TouchableOpacity> : null}
    </>;
}