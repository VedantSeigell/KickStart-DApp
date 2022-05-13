const path = require ('path');
const solc = require('solc');
const fs = require('fs-extra');  //Community based module for faster functions

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);  //Deletes the build folder

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8');  //Reads the file in CampaignPath
const output = solc.compile(source,1).contracts;  //Compiles contracts and stores in output
fs.ensureDirSync(buildPath);  //Checks if directory exists, if false it creates it

for(let contract in output){    //for each compiled contract in output, it creates new json file using fs function with parameters
    fs.outputJsonSync(
        path.resolve(buildPath,contract.replace(':','')+'.json'),   
        output[contract]
    );
}