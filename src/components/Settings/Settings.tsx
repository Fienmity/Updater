/**
 * Imports
 */
import { name } from "../../manifest.json"
import { FormRow, FormSection } from 'enmity/components';
import { React, Navigation, Dialog, Constants, StyleSheet } from 'enmity/metro/common';
import ExitWrapper from '../Wrappers/ExitWrapper';
import { Plugins } from '../Pages/Plugins';
import Page from '../Pages/Page';
import { getPlugins } from "enmity/managers/plugins";
import checkForUpdate, { Manifest as ManifestType } from '../../util/checkForUpdate';
import installPlugin from '../../util/instalPlugin';
import { getBoolean } from "enmity/api/settings";
import { reload } from "enmity/api/native";
import { for_item, filter_item } from "../../util/loops";
import { getIDByName } from 'enmity/api/assets';

/**
 * Main Settings Page for Updater.
 * @param {any} settings: The main prop of available methods to use for settings.
 */
export default ({ settings }) => {
    const [options, setOptions] = React.useState<string[]>([])
 
    React.useEffect(async function() {
        setOptions(await filter_item(getPlugins().filter((plugin: ManifestType) => plugin.updater), async function(plugin) {
            return await checkForUpdate(plugin);
        }));
    }, [])

    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} icon: Global style for icons to give them a neutral color scheme and ensure they fit together well.
         */
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        /**
         * @param {object} item: Style for trailing text to give it the Muted color, and contrast the normal colour of the text.
         */
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        },
    });

    async function updateHandler() {
        const availableOptions: any[] = [];
        await for_item(options.filter(option => getBoolean(name, option.name, true)), async function(option) {
            const manifest = await checkForUpdate(option);
            if (manifest) {
                availableOptions.push(manifest);
            }
        })

        availableOptions.length > 0 
            ? Dialog.show({
                title: "Update found",
                body: `An update is available for the following plugins:\n ${availableOptions.map(item => '\n' + `• **${item.name}**`)} \n\n Would you like to update now?`,
                confirmText: "Update",
                cancelText: "Not now",
                
                onConfirm: () => {
                    availableOptions.forEach(option => {
                        installPlugin(option.updater.plugin, ({ data }) => {
                            data=="installed_plugin" || data=="overridden_plugin" 
                            ?   Dialog.show({
                                    title: `Updated Plugin`,
                                    body: `Successfully updated ${option.name}. \nWould you like to reload Discord now?`,
                                    confirmText: "Reload",
                                    cancelText: "Not now",

                                    /**
                                     * Use the native @arg reload function to force crash Enmity.
                                     * @returns {void}
                                     */
                                    onConfirm: (): void => reload(),
                                }) 
                            :   console.log(`[Updater] ${option.name} failed to update.`)
                        })
                    })
                },
            }) 
            : Dialog.show({
                title: "No updates",
                body: `**No updates for any plugins were found**. \nThis is as a result of any of the following: \n\n• **You disabled all plugins from being checked by Updater**\n• **There are no plugins installed which have Updater implemented** \n\nHere's a cat for now :3`,
                confirmText: "Okay",
            })
    }

    /**
     * Main component render
     * @renders {(@arg {fragmented} component)}
     */
    return <>
        {/**
         * This component was wrapped in a @arg ExitWrapper to allow you to exit the page by swiping to the right.
         * @param Component: The main component to render inside of the @arg ExitWrapper
         */}
        <ExitWrapper component={<>
            <FormSection title="Update">
                <FormRow 
                    label="Select Plugins" 
                    subLabel="Opens a page to let you choose which plugins (if any) are able to be updated by the Updater."
                    leading={<FormRow.Icon style={styles.icon} source={getIDByName("ic_public")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => Navigation.push(Page, { component: Plugins, name: `${name}: Select Plugins` })}
                />
                <FormRow 
                    label="Check For Updates" 
                    subLabel="Searches all plugins allowed in the page above and notifies you of any updates in any of the plugins."
                    leading={<FormRow.Icon style={styles.icon} source={getIDByName("ic_upload")} />}
                    trailing={FormRow.Arrow}
                    onPress={updateHandler} 
                />
            </FormSection>
        </>} />
</>
};