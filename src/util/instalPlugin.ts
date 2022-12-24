export default function installPlugin(url: string, callback?: (result) => void, update?: () => void): Promise<void> {
	return window.enmity.plugins.installPlugin(url, callback, update);
}
