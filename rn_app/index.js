/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// push通知のバックグラウンド処理のためにHeadlessCheckの追加。もしかしたらなくても平気かも。
// https://rnfirebase.io/messaging/usage#background-application-state
// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return <App />;
// }

AppRegistry.registerComponent(appName, () => App);
