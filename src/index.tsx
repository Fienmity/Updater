import { getPlugins, Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import { Logger, Toasts } from 'enmity/metro/common';
import Settings from './components/Settings/Settings';
import Manifest from './manifest.json';
import checkForUpdate from './util/checkForUpdate';

const UpdaterLogger = new Logger('Updater');

const Updater: Plugin = {
   ...Manifest,

   onStart() {
      const lateStart = () => {
         UpdaterLogger.log("Checking for updates..")
         getPlugins().forEach(plugin => {
            checkForUpdate(plugin).then(manifest => {
               if (manifest) {
                  UpdaterLogger.log(`Update found for ${plugin.name}`);
                  Toasts.open({ content: `Update found for ${plugin.name}`, source: 599 })
               } else UpdaterLogger.log(`No update found for ${plugin.name}`)
            })
         })
      }

      setTimeout(lateStart, 1000)
   },

   onStop() {

   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />
   }
};

registerPlugin(Updater);
