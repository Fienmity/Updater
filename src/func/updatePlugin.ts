import { get, set } from "enmity/api/settings";
import Manifest from "../interface/Manifest";
import UpdaterManifest from "../manifest.json";

const installPlugin = window.enmity.plugins.installPlugin

export default function updatePlugin(name: string, callback: any) {
	const updates = JSON.parse(get(UpdaterManifest.name, "_availableUpdates") as string) as Manifest[]

	const update = updates.find(update => update.name == name)

	installPlugin(update!.updater!.plugin, ({ data }) => {
		const updated = ["installed_plugin", "overridden_plugin"].includes(data)

		if (updated) {
			const newUpdates = updates.filter(update => update.name !== name)
	
			set(UpdaterManifest.name, "_availableUpdates", JSON.stringify(newUpdates))
		}

		callback(updated)
	})
}
