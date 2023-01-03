import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Logger, React, Toasts } from 'enmity/metro/common';
import checkPluginsForUpdates from './func/checkPluginsForUpdates';
import getUpdatablePlugins from './func/getUpdatablePlugins';
import prettyList from './util/prettyList';
import Manifest from './manifest.json';
import Settings from './components/Settings/Settings';
import { getIDByName } from "enmity/api/assets"

const UpdaterLogger = new Logger('Updater');

const DownloadIcon = getIDByName("ic_download_24px");

const Updater: Plugin = {
   ...Manifest,

   onStart() {
      console.log(DownloadIcon)
      const lateStart = async function() {
         // Log what plugins the user has that are supported
         const supportedPlugins = getUpdatablePlugins()
         const supportedPluginsPrettyString = prettyList(supportedPlugins.map((plugin) => plugin.name))
         UpdaterLogger.log("Supported plugins:", supportedPluginsPrettyString)

         // Log what updates are available
         UpdaterLogger.log("Checking for updates..")
         const updates = await checkPluginsForUpdates()
         // Log if no updates found and return
         if(updates.length === 0) return UpdaterLogger.log("No updates found")

         // Log available updates
         const updatesPrettyString = prettyList(updates.map((updateAvailablePlugin) => `${updateAvailablePlugin.name} (${updateAvailablePlugin.version})`))
         UpdaterLogger.log("Available updates:", updatesPrettyString)

         // Also toast about the available updates
         Toasts.open({ content: "Updates found for: " + updatesPrettyString, source: DownloadIcon })
      }

      setTimeout(lateStart, 1000)
   },

   onStop() {

   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />
   },
};

registerPlugin(Updater);
