import checkForUpdate, {Manifest as ManifestType} from "./checkForUpdate";
import { mapItem } from "./loops";

export default async function checkPluginsForUpdates(plugins: ManifestType[]): Promise<ManifestType[]> {
	// Get a list of plugins that have an "updater" field
	const updatablePlugins = plugins.filter(plugin => plugin.updater);
  
	// Check for updates for each updatable plugin
	const updateablePlugins = await mapItem(updatablePlugins, async function(plugin: ManifestType) {
	  return await checkForUpdate(plugin);
	});
  
	// Return a list of plugins that have updates available
	return updateablePlugins.filter(plugin => plugin);
  }