#!/usr/bin/env node

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
.version('0.0.20')
.option('-p, --path <pa>','Enter Folder name')
.parse(process.argv);

if(program.path){
  listFiles(program.path);
};

//
function listFiles(folder){
  folderpath = folder;
  var r = folderExists(folder);
  var amoundFiles = 0;
  if(r){

    var fl = wrench.readdirSyncRecursive(folder);
    for(var i=0; i<fl.length; i++){
            if(path.extname(fl[i]) === ".js"){
              var pathFolder = path.resolve(path.join(__dirname, folder,fl[i]));
               //console.log(fl[i]);
               FilesInFolder.push(pathFolder);
                amoundFiles = amoundFiles + 1;
            }   
    }
   /* fl.forEach(function(item){
        var pathFolder = path.resolve(path.join(__dirname, folder));
        var  finalpath = pathFolder+"/"+item;
        if(fs.statSync(item).isFile()){
            if(path.extname(item) === ".js"){
               cconsole.log('- #green["' + finalpath+ '"]'); 
              // FilesInFolder.push(finalpath);

               amoundFiles = amoundFiles + 1;
            }; 
        };   
    });*/
   cconsole.log('Files Found in #green[' + folder + ']: #bold['+ amoundFiles + ']'+" Array with  files  of  folder "+"#yellow["+ FilesInFolder.length+"]"); 
   compressingFiles(folder);
            
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



function compressingFiles(folder){
 var files = FilesInFolder.shift();
   for(var i=0; i<FilesInFolder.length; i++){
cconsole.log('#green['+FilesInFolder[i]+']');
minimizer2(FilesInFolder[i]);
}
   /* minimizer(files,function(){
        if(FilesInFolder.length > 0){
           compressingFiles();
        }
        else{
          cconsole.log("#green[Process  sucefully]");
        };
    });*/
};
function minimizer2(file){  
      
    try{
        var result   = UglifyJS.minify(file);
     cconsole.log("#green["+file+"]");
        cconsole.log('#blue['+result.code+']'); 
        rewrite(file,result.code);
        //cb();
    }
    catch(err){     
         //cconsole.log("#red["+file+"]");
         // cb();
    }; 
};

function minimizer(file,cb){  
      
    try{
        var result   = UglifyJS.minify(file);
        cconsole.log("#green["+file+"]");
        //cconsole.log('#blue['+result.code+']'); 
        //rewrite(file,result.code);
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



