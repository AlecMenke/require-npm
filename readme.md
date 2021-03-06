*Windows support coming soon!*

## Purpose
***
**Require NPM** is a lightweight library invented to download, cache, and reuse NPM modules.

It's intended for **Require NPM** to be used in both development and prototyping stages in order to eliminate redundant downloads of *npm modules*, with large codebases, while also improving developer productivity.

**Require NPM** allows you to reference npm modules and their dependencies throughout many projects without creating multiple redudant instances or ever requiring manual downloads.

 ### Installation
 ```cli 
 npm install require-npm --save-dev
 ```
OR
  ```cli 
 npm install -g require-npm
 ```

## Usage
***
### Downloading and Configuring NPM Libraries
```js
//requireNPM equals {decorate}
//decorate instantiates {local, global, modules} within require
const requireNPM = require('require-npm').decorate(require);

//check system cache, "npm install express", if hasn't been downloaded before with Require NPM.
//no need to run "npm install express"!!
const express = require.local('express'),
    app = express();

//"hello world" express    
app.get('/', (req,res) res => res.send('hello world'));
app.listen(8080, () => console.log('server started on 8080..');
```
### Using CLI (Comand Line Interface)
From your projects directory run:
```cli
require express
```
#
Then require **express** normally.
```js
const express = require('express');
```
### Simple Express App
```js
const requireNPM = require('require-npm');
//binds methods ['global', 'local'] 
requireNPM.decorate(require);

//downloads express codebase locally using npm, if they don't already exist, and then links to codebase within 'node_modules'.
//no need to run "npm install express"!!
const express = require.local('express'),
    app = express();
    
app.get('/', (req,res) => res.send(buildView()));
app.listen(8080, () => console.log('server is running on port 8080.'));

function buildView(){
    return require.modules().map(moduleName = `<li>${moduleName}</li>`);
}
```

### Getting More Advanced With Our Express App
```js
const requireNPM = require('require-npm');
//binds methods ['global', 'local']
requireNPM.decorate(require);

//downloads express codebase locally using npm, if they don't already exist, and then links to codebase within 'node_modules'.
//no need to run "npm install express"!!
const express = require.local('express'),
    app = express(),
    port = 8080;

app.get('/', (req, res) =>
    res.send(new RnModelView('<b>Require NPM</b> Local Modules:').compiled)
);

function RnModelView(title){

    const listView = require.
            modules().
            map(moduleName => `<li style="text-decoration: underline; font-family: cursive; color: #22313F;">${moduleName}</li>`).
            join('');

    this.compiled =
        `<h1 style="font-family: sans-serif; font-weight: normal; padding: 8px 12px; border-radius: 2px; background: #336E7B; color: white;">
            ${title}
        </h1> 
        <ul>${listView}</ul>`;
}

app.listen(port, () => console.log(`The local modules you've downloaded are now visible on port ${port}.`));
```
## Documentation
****
#
#### Require NPM (Main Module)
```
const requireNPM = require('require-npm');
```
#
The main module of **requireNPM's main module** is used to decorate the **require** function and retrieve information on directories and settings.

It consists of the following properties:
```js
{ decorate: [Function: decorate],
  settings: 
   { Library: '/Users/<USER>/local-node-modules',
     LibraryModulePath: '/Users/<USER>/local-node-modules/node_modules',
     ProjectModulePath: '/Users/<USER>/projects/my cool app/node_modules' } 
}
```
#### requireNPM.decorate(obj)
```
requireNPM.decorate(require);
```
#
The **decorate** function is used to transfer the 'local', 'global', and 'modules' functions to an object. It is recommended that you use this **decorator** to transfer these functions to **Node.js's require** function.

It can also be used as follows.
```js
const blank = {};
requireNPM.decorate(blank);

blank.local('express');
blank.global('gulp');
blank.modules().forEach(moduleName => console.log(moduleName));
```
#### require.local(...modules)
```
const express = require.local('express');
```
#
**require.local** downloads and caches any npm module requested. This allows you to reuse that npm module and it's dependencies, throughout all your projects, without redownloading any files. 