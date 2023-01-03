import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Logger, React } from 'enmity/metro/common';
import checkPluginsForUpdates from './func/checkPluginsForUpdates';
import getUpdatablePlugins from './func/getUpdatablePlugins';
import prettyList from './util/prettyList';
import Manifest from './manifest.json';

const UpdaterLogger = new Logger('Updater');

const Updater: Plugin = {
   ...Manifest,

   onStart() {
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
      }

      setTimeout(lateStart, 1000)
   },

   onStop() {

   }
};

registerPlugin(Updater);
