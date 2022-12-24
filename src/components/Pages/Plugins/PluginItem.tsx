/**
 * Imports
 */
import { getBoolean, set } from "enmity/api/settings"
import { FormRow, View, TouchableOpacity } from "enmity/components"
import { React } from "enmity/metro/common"
import { name } from '../../../manifest.json';
import { getIDByName } from 'enmity/api/assets';

 
/**
 * This is a component which is part of the Plugins page.
 * @param {string} plugin: A single plugin manifest.
 */
export default ({ plugin }) => {
    /**
     * Create a new state for whether the Option is currently active, by default, this is false.
     * @param {Getter, Setter}: Allows you to set and re-render the component to determine whether the option is active or inactive.
     */
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, plugin.name, true))

    // console.log(plugin);

    /**
     * Return a Discord-Native FormRow with the onPress allowing you to @arg toggle the value.
     * @returns {TSX Component}
     */
    return <TouchableOpacity
        onPress={() => {
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
            
        }}
    >
        {/**
         * The main animated view, which will be affected by the Animation variable.
         */}
        <View>
            <FormRow
                key={plugin.name}
                label={plugin.name}
                trailing={<FormRow.Icon source={
                    isActive
                        ?   getIDByName('ic_selection_checked_24px')
                        :   getIDByName('ic_close_circle_24px')
                    } 
                />}
            />
        </View>
    </TouchableOpacity>
}