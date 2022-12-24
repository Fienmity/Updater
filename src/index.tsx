import { getPlugins, Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Logger, Toasts } from 'enmity/metro/common';
import Manifest from './manifest.json';
import checkForUpdate, { Manifest as ManifestType } from './util/checkForUpdate';

const UpdaterLogger = new Logger('Updater');

const Updater: Plugin = {
   ...Manifest,

   onStart() {
      const lateStart = () => {
         // Get plugins that support updater
         const plugins = getPlugins().filter((plugin: ManifestType) => plugin.updater)

         // Log supported plugins
         const supportedPrettyString = plugins.map((plugin) => plugin.name).toString().replace(",", ", ")
         UpdaterLogger.log(`Plugins supporting Updater: ${supportedPrettyString}`)

         // Check for updates
         UpdaterLogger.log("Checking for updates..")
         plugins.forEach(plugin => {
            // Check plugin for update
            checkForUpdate(plugin).then(manifest => {
               // If it returns something not null, there is a update
               if (manifest) {
                  // Log and notify user that there's a update
                  UpdaterLogger.log(`Update found for ${plugin.name}`);
                  Toasts.open({ content: `Update found for ${plugin.name}`, source: 599 })
               // Log that there wasn't a update too
               } else UpdaterLogger.log(`No update found for ${plugin.name}`)
            })
         })
      }

      setTimeout(lateStart, 1000)
   },

   onStop() {

   },
};

registerPlugin(Updater);
