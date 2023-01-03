import { getPlugins } from "enmity/managers/plugins";
import Manifest from "../interface/Manifest";

export default function	getUpdatablePlugins(): Manifest[] {
	return (getPlugins() as Manifest[]).filter(plugin => plugin.updater)
}
