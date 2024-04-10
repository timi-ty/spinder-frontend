/* The global state of this app is managaed by redux. The custom hooks here interface with react-redux hooks.
 * These hooks are built with a homogenous paradigm. They are primarily for loading app data/resources.
 * These hooks will only try to load up a resource from it's source if the resource is not fresh or loading.
 * Every resource has a status value which determines whether or not the resource will be reloaded when hooked up.
 * This means that these hooks can be used anywhere in the app without reloading performance concerns.
 * A resource is only loaded if it is not available or currently loading.
 */

 /* Each loader can return an unloader.
 * An unloader is a function that disposes the loaded resources.
 * Most of the time, we want to keep our loaded resources for use in various components in our app.
 * Thus, dispose loaded resources with caution.
 * NOTE: DO NOT USE A LOADER IN AN EFFECT. STRICTLY USE THE USE RESOURCE HOOKS.
 * Loaders may be used in user action callbacks.
 */