/**
 * Imports
 */
import { getIDByName } from "enmity/api/assets";
import { reload } from "enmity/api/native";
import { getBoolean, set } from "enmity/api/settings"
import { View, TouchableOpacity, Text, Image, FormRow, FormSwitch } from "enmity/components"
import { Constants, Dialog, React, StyleSheet } from "enmity/metro/common"
import { name } from '../../../manifest.json';
import installPlugin from "../../../util/instalPlugin";;

 
/**
 * This is a component which is part of the Plugins page.
 * @param {string} plugin: A single plugin manifest.
 */
export default ({ plugin, isBulk, onInstall }: { 
    plugin: {
        name: string;
        version: string;
        changelog?: string;
        download: string;
        color?: string
    },
    isBulk?: boolean;
    onInstall: any;
}) => {
    /**
     * Create a new state for whether the Option is currently active, by default, this is false.
     * @param {Getter, Setter}: Allows you to set and re-render the component to determine whether the option is active or inactive.
     */
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, plugin.name, true))

    const styles = StyleSheet.createThemedStyleSheet({
        container: {
          backgroundColor: Constants.ThemeColorMap.BACKGROUND_SECONDARY,
          borderRadius: 10,
          borderLeftColor: plugin.color ?? '#ff8cc2',
          borderLeftWidth: 3,
          borderRightColor: plugin.color ?? '#ff8cc2',
          borderRightWidth: 3,
          marginTop: 15,
          marginLeft: 10,
          marginRight: 10
        },
        name: {
          color: Constants.ThemeColorMap.HEADER_PRIMARY,
          fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
          fontSize: 22,
        },
        content: {
          color: Constants.ThemeColorMap.HEADER_SECONDARY,
          fontSize: 16,
          fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
          marginRight: 2.5
        },
        install: {
          justifyContent: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center'
        },
        description: {
          color: Constants.ThemeColorMap.HEADER_SECONDARY,
          fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        },
        info: {
          marginLeft: -6,
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%'
        },
        download: {
          width: 25,
          height: 25,
          tintColor: Constants.ThemeColorMap.HEADER_PRIMARY
        }
    });

    const onPressDownload = () => Dialog.show({
        title: "Update found",
        body: `Are you sure you want to update **${plugin.name}** to version ${plugin.version}?`,
        confirmText: "Update",
        cancelText: "Not now",
        
        onConfirm: () => installPlugin(plugin.download, ({ data }) => {
            data=="installed_plugin" || data=="overridden_plugin" 
                ?   (() => {
                    onInstall(plugin)
                    Dialog.show({
                        title: `Updated Plugin`,
                        body: `Successfully updated ${plugin.name}. \nWould you like to reload Discord now?`,
                        confirmText: "Reload",
                        cancelText: "Not now",
                        onConfirm: (): void => reload(),
                    })
                })()
                :   console.log(`[Updater] ${plugin.name} failed to update.`)
        })
    })

    const onPressToggle = () => {
        /**
         * Sets the current value of the option to the opposite of what it is currently, effectively toggling it
         * @arg {string} name: The name of the file's settings to edit. In this case, it's Updater.
         * @arg {string} option: The option's setting to change.
         * @arg {boolean}: The value to set @arg option to.
         */
        set(name, plugin.name, !getBoolean(name, plugin.name, true))

        /**
         * Set the current state to whatever the new value of the setting is, effectively re-rendering the component to show the new icon.
         * @func getBoolean: Gets a boolean value from a file's setting.
         */
        setIsActive(getBoolean(name, plugin.name, true))
    }

    return <>
        <View style={styles.container}>
            <FormRow 
                label={() => <View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{plugin.name}</Text>
                        <Text style={[styles.content, {
                            marginLeft: 2.5
                        }]}>{plugin.version}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.content}>{plugin.changelog ?? "Add files via upload"}</Text>
                    </View>
                </View>}
                trailing={() => <View style={styles.install}>
                    <TouchableOpacity
                        style={styles.delete}
                        onPress={onPressDownload}
                        >
                        <Image style={styles.download} source={{ uri: "https://i.imgur.com/lqDX8pR.png" }} />
                    </TouchableOpacity>
                </View>}
                leading={() => <View>
                    {isBulk ? <FormSwitch
                        value={isActive}
                        onValueChange={onPressToggle}
                    /> : null}
                </View>}
            />
        </View>
    </>
}