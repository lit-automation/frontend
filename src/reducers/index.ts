// tslint:disable:no-import-side-effect
import './app';
import './errors';
import './user';
import './signin';
// tslint:enable:no-import-side-effect

if (window.DEV_MODE) {
    console.log('Setup reducers done');
}
