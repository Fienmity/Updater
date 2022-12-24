/**
 * Imports
 */
import { View } from 'enmity/components';
import { getByName } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { getPlugins } from 'enmity/managers/plugins';
import PluginItem from './PluginItem';
import ExitWrapper from '../../Wrappers/ExitWrapper';
import checkForUpdate, { Manifest as ManifestType } from '../../../util/checkForUpdate';
import { filter_item } from '../../../util/loops';

/**
 * The main Search module, used to input text and store it. This is easy to make from scratch, but because Discord already made one I might aswell use it.
 * @param Search: The main Search Bar component
 */
const Search = getByName('StaticSearchBarContainer');
 
export default () => {
    /**
     * Main states used throughout the component to allow storing options and the possible search query.
     * @param {Getter, Setter} options: The list of available options, populated by the @arg React.useEffect
     * @param {Getter, Setter} query: The query that has been searched with the Search module.
     */
    const [options, setOptions] = React.useState<string[]>([])
    const [query, setQuery] = React.useState([])
 
    React.useEffect(async function() {
        setOptions(await filter_item(getPlugins().filter((plugin: ManifestType) => plugin.updater), async function(plugin) {
            return await checkForUpdate(plugin);
        }));
    }, [])

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
        <ExitWrapper component={<View
            style={{
                marginBottom: 100
        }}>
             {options.map(option => {
                return <PluginItem plugin={option} />;
             })}
        </View>} />
    </>;
}