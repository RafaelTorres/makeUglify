var UglifyJS = require('uglify-js');
var fs       = require('fs');
var wrench   = require('wrench');
var colorize = require('colorize');
var cconsole = colorize.console;
var path     = require('path');
var program  = require('commander');
var FilesInFolder = [];
var folderpath = "";

program
.version('0.0.2')
.option('-p, --path <pa>','Enter Folder name')
.parse(process.argv);

if(program.path){
  listFiles(program.path);
};

function listFiles(folder){
  folderpath = folder;
  var r = folderExists(folder);
  var amoundFiles = 0;
  if(r){

    var fl = wrench.readdirSyncRecursive(folder);
    fl.forEach(function(item){
        var pathFolder = path.resolve(path.join(__dirname, folder, item));
        if(fs.statSync(pathFolder).isFile()){
            if(path.extname(pathFolder) === ".js"){
               //cconsole.log('- #green["' + pathFolder+ '"]'); 
               FilesInFolder.push(pathFolder);
               amoundFiles = amoundFiles + 1;
            }; 
        };   
    });
    cconsole.log('Files Found in #green[' + folder + ']: #bold['+ amoundFiles + ']'+" Array with  files  of  folder "+"#yellow["+ FilesInFolder.length+"]"); 
    compressingFiles();
            
  }
  else{
    cconsole.log('#red[Folder #bold["' + folder + '"] does not exist]'); 
  };
};


function folderExists(path){
    try{
       var r = fs.statSync(path).isDirectory(); 
       return r;
    }
    catch(er){
       return false;
    };
};

function compressingFiles(){
    var files = FilesInFolder.shift();
    minimizer(files,function(){
        if(FilesInFolder.length > 1){
           compressingFiles();
        }
        else{
          cconsole.log("#green[Process  sucefully]");
        };
    });
};


function minimizer(file,cb){  

    try{
        var result   = UglifyJS.minify(file);
        //cconsole.log("#green["+file+"]");
        //cconsole.log(result.code); 
        rewrite(file,result.code);
        cb();
    }
    catch(err){     
         //cconsole.log("#red["+file+"]");
          cb();
    }; 
};

function rewrite(nameFile, arg){
  fs.writeFile(nameFile,arg,function(err){
      if(err){
        cconsole.log("#red[Error Writing File: " + nameFile + "]");
        //throw err;
      }
      else{
        cconsole.log("#green[File Written: " + nameFile +"]");
      };
  });
}; 








/// http://www.javascript.showbizreal.com/#shifT



