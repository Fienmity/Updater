import type { Plugin } from "enmity/managers/plugins";

interface UpdaterManifest {
	plugin: string
	manifest: string
	changelog?: string
	source?: string
}

export default interface Manifest extends Omit<Plugin, "onStart" | "onStop" | "onEnable" | "onDisable" | "getSettingsPanel" | "commands" | "patches"> {
	updater?: UpdaterManifest
}
