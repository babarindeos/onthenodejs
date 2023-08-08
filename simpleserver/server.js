var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const { unescape } = require('querystring');

// Array of mime Types
var mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css"
    
};

http.createServer(function(req, res){
    var uri = url.parse(req.url);
    // var uri = url.parse(req.url).pathname;
    var pathname = uri.pathname;
    var host = uri.host;
    var search = uri.search;


    //console.log(uri);
    //console.log(pathname);
    //console.log(host);
    //console.log(search);

    var fileName = path.join(process.cwd(), unescape(pathname));

    //console.log(path.join(process.cwd(), uri.pathname));

    console.log('Loading ' + pathname);
    var stats;

    try{
        stats = fs.lstatSync(fileName);
        console.log(stats);
    }catch(e){
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.write('404 Not Found\n');
        res.end()
        return;
    }


    // Check if file/directory
    if (stats.isFile()){
        //console.log(path.extname(fileName).split(".").reverse()[0]);
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        //console.log(mimeType);
        res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);

    }else if (stats.isDirectory){
        res.writeHead(302, {'location' : 'index.html'});
        req.end();
        
    }else{
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.write('500 Internal Error\n');
        res.end();
    }

   
    //res.writeHead(200, {'Content-Type' : 'text/plain'});
    //res.end("Hello World\n");
}).listen('1337', '127.0.0.1');

console.log('Server is running on 127.0.0.1:1337');