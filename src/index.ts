'use strict';

import { init } from '@weavedev/store/init';
import { appMiddleware } from './middleware';
import { initReselect } from './reselect';

window.DEV_MODE = false;
init(appMiddleware);

// Setup reselect
initReselect();
window.APP_DEV = true;
// Load async reducers
// tslint:disable-next-line:no-import-side-effect
import './async-reducers';

// Load reducers
// tslint:disable-next-line:no-import-side-effect
import './reducers';

// Load sagas
// tslint:disable-next-line:no-import-side-effect
import './sagas';

/* tslint:disable */
import './components/lit-app/App';

import { config } from './config';
config();


