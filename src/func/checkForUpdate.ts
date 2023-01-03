import Manifest from "../interface/Manifest";

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
