import type { Plugin } from "enmity/managers/plugins";

interface UpdaterManifest {
	plugin: string
	manifest: string
	changelog?: string
	source?: string
}

export interface Manifest extends Omit<Plugin, "onStart" | "onStop" | "onEnable" | "onDisable" | "getSettingsPanel" | "commands" | "patches"> {
	updater?: UpdaterManifest
}

export default async function checkForUpdate(plugin: Manifest): Promise<Manifest | null> {
	// return null if nothing found
	if (!plugin.updater) return null

	// Fetch manifest
	return fetch(plugin.updater.manifest).then(resp => {
		// If it's ok we continue
		if (resp.ok) {
			return resp.json().then((manifest: Manifest) => {
				// Check if there's a different version
				if (plugin.version !== manifest.version) {
					return manifest
				}
				// Return null if there isn't				
				return null
			})
		}
		// Otherwise we return null		
		return null
	})
}
