const process = require('process')
    path = require('path'),
    fs = require('fs'),
    processGenerator = require('child_process');

const Settings = {
    Library: path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], 'local-node-modules'),
    LibraryModulePath: "",
    ProjectModulePath: path.join(process.cwd(), 'node_modules')
};

Settings.LibraryModulePath = path.join(Settings.Library, 'node_modules');

module.exports = {
    decorate(require){

        require.global = GlobalRequire;
        require.local = LocalRequire;
        require.modules = ReadModules;

        return this;
    },
    settings: Settings,
    createLocalRegex: () => /require *\. *local *\(([\w\d ,\n"']*\))/gi
};

function ReadModules(){

    const modulePath = Settings.LibraryModulePath;
    return fs.readdirSync(modulePath).filter(fileName => fs.lstatSync(path.join(modulePath, fileName)).isDirectory());
}
function LocalRequire(){

    if(arguments.length === 0) return;

    var argList = Array.prototype.slice.apply(arguments);

    const importPathList = argList.map(arg => path.join(Settings.Library, 'node_modules', arg));

    if(fs.existsSync(Settings.Library) === false)
        fs.mkdirSync(Settings.Library);

    if(fs.existsSync(Settings.ProjectModulePath) === false)
        fs.mkdirSync(Settings.ProjectModulePath);

    const json = (path.join(Settings.Library, 'package.json')),
        exists = fs.existsSync(json);

    if(exists === false)
        processGenerator.execSync(`npm init --yes`, {cwd: Settings.Library});

    const installationList =
        importPathList.
        reduce(function(state, value, index){

            const importExists = fs.existsSync(value);

            if(importExists)
                return state;
            else
                return [...state, argList[index]];

        }, []);

    const installations = installationList
        .map(arg => {
            console.log(`..installing [${arg}]`);
            processGenerator.execSync(`npm install ${arg} --save-dev`, {cwd: Settings.Library});
            console.log('Finished.');
        });

    const importResultList = importPathList.map((importPath, index) => {

        const projectReference = path.join(Settings.ProjectModulePath, argList[index]);
        if(!fs.existsSync(projectReference))
        processGenerator.execSync(`ln -s ${importPath}`, {cwd: Settings.ProjectModulePath});
        
        return require(argList[index]);
    });

    return importResultList.length === 1? importResultList[0] : importResultList;
}

function GlobalRequire(){

    var argList = Array.prototype.slice.apply(arguments);

    const pathList = argList.map(arg => path.join('/usr/local/lib/node_modules', arg)),
        resultList = pathList.map(path => require(path));

    return resultList.length === 1? resultList[0] : resultList;
}

//handle arguments
const processArguments = process.argv.splice(2);

if(processArguments.length > 0){

    const args = {
        moduleName: processArguments[0]
    };

    var package = LocalRequire(args.moduleName);
    console.log(`[Package: '${args.moduleName}']`);
    console.log();
    console.log(package);
}