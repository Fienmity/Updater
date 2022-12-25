/**
 * Imports
 */
import { React } from 'enmity/metro/common';
import { Plugins } from '../Pages/Plugins';

/**
 * Main Settings Page for Updater.
 * @param {any} settings: The main prop of available methods to use for settings.
 */
export default ({ settings }) => {
    /**
     * Main component render
     * @renders {(@arg {fragmented} component)}
     */
    return <>
        <Plugins />
    </>
};