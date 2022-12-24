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

	const res = await fetch(plugin.updater.manifest);

	if (res.ok) {
		const manifest: Manifest = await res.json();

		// Check if there's a different version
		if (plugin.version !== manifest.version) {
			return manifest
		}
	}
	// Otherwise we return null		
	return null
}
