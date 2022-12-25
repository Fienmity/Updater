import checkForUpdate, {Manifest as ManifestType} from "./checkForUpdate";
import { mapItem } from "./loops";

export default async function checkPluginsForUpdates(plugins: ManifestType[]): Promise<ManifestType[]> {
	// Filter out plugins that don't support Updater
	const updatablePlugins = plugins.filter((plugin: ManifestType) => plugin.updater);
	// return any plugins with updates, and filter out those that don't
	return (await mapItem(updatablePlugins, async function(plugin: ManifestType) {
		return await checkForUpdate(plugin);
	})).filter((manifest) => manifest);
}