// tslint:disable:no-import-side-effect
import './app';
import './errors';
import './authorization'
// Authorization

// tslint:enable:no-import-side-effect

if (window.DEV_MODE) {
    console.log('Setup sagas done');
}