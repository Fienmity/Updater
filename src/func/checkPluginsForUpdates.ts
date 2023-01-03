import Manifest from "../interface/Manifest";
import { mapItem } from "../util/loops";
import getUpdatablePlugins from "./getUpdatablePlugins";
import checkForUpdate from "./checkForUpdate";
import UpdaterManifest from "../manifest.json";
import { set } from "enmity/api/settings";

export default async function checkPluginsForUpdates(): Promise<Manifest[]> {
	// Get plugins that support Updater
	const updatablePlugins = getUpdatablePlugins()

	// Check for updates for each updatable plugin
	const checkedPlugins = await mapItem(updatablePlugins, async function (plugin: Manifest) {
		return await checkForUpdate(plugin);
	}) as Manifest[];

	// Filter out plugins with no updates available
	const updatesAvailablePlugins = checkedPlugins.filter((updateAvailablePlugin) => updateAvailablePlugin)

	// Update availableUpdates with the new array of available updates
	set(UpdaterManifest.name, "_availableUpdates", JSON.stringify(updatesAvailablePlugins))

	return updatesAvailablePlugins
}
