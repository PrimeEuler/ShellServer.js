var shell = new require('./lib/util-shell');
var express = require('express.io');
var bone = require('bone.io');
var app = express().http().io();

bone.set('io.options', {server: app.io})
app.use(bone.static());
app.use(express.cookieParser());
app.use(express.session({ secret: 'shell_9973' }));
app.use(express.static(__dirname));
app.listen(8080);

var SHELL_SERVER = bone.io('shell', {
    outbound: {
        routes: ['data'],
    },
    inbound: {
        create: function(data, context) {
        	SHELL_CREATE(this, data);
        },
        destroy: function(data, context) {
        	SHELL_DESTROY(this, data);
        },
        data: function(data, context) {
        	SHELL_DATA(this, data);        }
    }
});

function SHELL_DESTROY(self, data){
  delete self[data.shellname];
}
function SHELL_CREATE(self, data){
     self[data.shellname] = {};
     self[data.shellname].shell = new shell();
     self[data.shellname].prompt = '\r\n\> ';
      self[data.shellname].shellAgrs = {
     		                            host: '',//
     		                            //port: 21 || protocol default
     		                            username: '',
     		                            password: '',
     		                            enpassword: '',
     		                            shellname: data.shellname,
     		                            protocol: '', //telnet||ssh
     		                            autoauth: false,
                                        tryKeyboard:false,
     		                            log: false
     	                            }
     self[data.shellname].INPUT_BUFFER = '';
     self[data.shellname].CMD_HISTORY = [];
     self[data.shellname].CMD_HISTORY_INDEX = 0;
     self[data.shellname].READY = true;
     self[data.shellname].RESET = function(){
          		self[data.shellname].READY = true;
                self[data.shellname].shellAgrs.username = '';
                self[data.shellname].shellAgrs.password = '';
                self[data.shellname].prompt = '\r\n\> ';
     };
     self[data.shellname].FUNCTIONS = {};
     self[data.shellname].FUNCTIONS['telnet'] = function (endpoint) {
        self[data.shellname].shellAgrs.host = endpoint.split(':')[0];
         if(endpoint.split(':')[1]){
         self[data.shellname].shellAgrs.port = endpoint.split(':')[1];
         }
         self[data.shellname].shellAgrs.protocol = 'telnet';
     	self[data.shellname].CONNECT();
     }
     self[data.shellname].FUNCTIONS['ssh'] = function (endpoint) {
         
         self[data.shellname].shellAgrs.host = endpoint.split(':')[0];
         if(endpoint.split(':')[1]){
         self[data.shellname].shellAgrs.port = endpoint.split(':')[1];
         }
         self[data.shellname].shellAgrs.protocol = 'ssh';
     	self[data.shellname].CONNECT();
     }
     self[data.shellname].CONNECT = function () {
        var Agrs  =  self[data.shellname].shellAgrs;
        if(Agrs.username =='' && Agrs.protocol == 'ssh'){
            self[data.shellname].READY = true;
            self[data.shellname].prompt = '\r\n Username: ';
            self.data({shellname:data.shellname, data: self[data.shellname].prompt});
        }
        else if(Agrs.password =='' && Agrs.protocol == 'ssh'){
            self[data.shellname].READY = true;
             self[data.shellname].prompt = '\r\n Password: ';
            self.data({shellname:data.shellname, data: self[data.shellname].prompt});
        }else{
            self[data.shellname].READY = false;
            self[data.shellname].prompt = '\r\n ';
            self.data({shellname:data.shellname, data: '\r\n Trying ' + Agrs.protocol + ' ' + Agrs.host + ':' + (Agrs.port||'') + ' .....' });
     	    self[data.shellname].shell = null;
     	    self[data.shellname].shell = new shell();
     	    self[data.shellname].shell._connected = true;
     	    self[data.shellname].shell.connect(Agrs);
     	    self[data.shellname].shell.on('data', function (data, shellname) {
     		    var response = { shellname: shellname, data: data.toString() }
     		    self.data(response);
     		    self[shellname].READY = true;
                self[shellname].prompt = '\r\n\> ';
     	    });
     	    self[data.shellname].shell.on('error', function (error, shellname) {
     		    console.log('error', shellname);
     		    var response = { shellname: shellname, data: '\r\n' + error.toString() + self[shellname].prompt }
     		    self.data(response);
     		    self[data.shellname].RESET();
     	    });
     	    self[data.shellname].shell.on('close', function (had_error, shellname) {
     		    var response = { shellname: shellname, data: self[shellname].prompt }
     		    self.data(response);
     		    self[data.shellname].RESET();
     	    });
            self[data.shellname].shell.on('end', function (shellname) {
     		    var response = { shellname: shellname, data: self[data.shellname].prompt }
     		    self.data(response);
     		    self[data.shellname].RESET();
     	    });
            self.data({shellname:data.shellname, data: self[data.shellname].prompt});
     }
     
     }
     self.data({shellname:data.shellname, data: self[data.shellname].prompt});
}
function SHELL_DATA(self, data){
    if(self[data.shellname].shell._connected){
        self[data.shellname].shell.write(data.data);
    }
    else if (self[data.shellname].READY)
    {
         switch (data.data) {
            case '\x1b[B': //down arrow : scroll cmd history
                if(self[data.shellname].CMD_HISTORY_INDEX > 0){
                    self[data.shellname].CMD_HISTORY_INDEX--;
                }
                data.data = self[data.shellname].CMD_HISTORY[self[data.shellname].CMD_HISTORY_INDEX];
                self.data({shellname:data.shellname, data: '\x1b[2K\r\>'});//ERASE LINE AND RETURN PROMPT
                self[data.shellname].INPUT_BUFFER = data.data;
                self.data({ shellname: data.shellname, data: data.data });//PRINT CMD FROM HISTORY
                return;
                break;
         	case '\x1b[A'://up arrow : scroll cmd history
                if(self[data.shellname].CMD_HISTORY_INDEX < self[data.shellname].CMD_HISTORY.length -1){
                    self[data.shellname].CMD_HISTORY_INDEX++;
                }
                data.data = self[data.shellname].CMD_HISTORY[self[data.shellname].CMD_HISTORY_INDEX];
                self.data({ shellname: data.shellname, data: '\x1b[2K\r\>' });//ERASE LINE AND RETURN PROMPT
                self[data.shellname].INPUT_BUFFER = data.data;
                self.data({ shellname: data.shellname, data: data.data });//PRINT CMD FROM HISTORY
                return
                break;
            default:
                break;
         }

       switch (data.data.charCodeAt(0)) {
            case 13:
                data.data = self[data.shellname].INPUT_BUFFER;
                if(data.data.length > 0){
                    SHELL_INTERPRETER(self, data)
                }else{
                    self.data({shellname:data.shellname, data: self[data.shellname].prompt});
                }
                self[data.shellname].INPUT_BUFFER = '';
            case 127:
                if( self[data.shellname].INPUT_BUFFER.length > 0){
                    self.data({shellname:data.shellname, data: '\x1b[D'});// right-arrow
                    self.data({shellname:data.shellname, data: '\x1b[J'});// CSI Ps J  Erase in Display (ED).
                    self[data.shellname].INPUT_BUFFER =  self[data.shellname].INPUT_BUFFER.substring(0,  self[data.shellname].INPUT_BUFFER.length - 1);
                }
                break;
            default:
                self[data.shellname].INPUT_BUFFER  += data.data;
                if(self[data.shellname].prompt.indexOf('Password') == -1){
                self.data({shellname:data.shellname, data: data.data});
                }
                break;
            }
    }
    else if (!self[data.shellname].READY){
        switch (data.data.charCodeAt(0)) {
            case 3:
                   self[data.shellname].shell.end();
            default:
                break;
            }
    }
}
function SHELL_INTERPRETER(self, data){
    var agrs = data.data.split(' ');
    if(self[data.shellname].prompt.indexOf('Username') > -1){
        self[data.shellname].shellAgrs.username = data.data;
        self[data.shellname].CONNECT();
        return;
    }
    if(self[data.shellname].prompt.indexOf('Password') > -1){
        self[data.shellname].shellAgrs.password = data.data;
        self[data.shellname].CONNECT();
        return;
    }
	//STORE CMD IN HISTORY
    if(self[data.shellname].CMD_HISTORY.indexOf(data.data) == -1){
            self[data.shellname].CMD_HISTORY.push(data.data);
            self[data.shellname].CMD_HISTORY_INDEX =  self[data.shellname].CMD_HISTORY.length -1;
        }
	//EXECUTE CMD 
    if(self[data.shellname].FUNCTIONS[agrs[0]]){
        self[data.shellname].FUNCTIONS[agrs[0]](agrs[1]);

    } else {
    //CMD ERROR
        var response = '"'+ agrs[0] + '" is not recognized as an internal or external command,\r\n operable program or batch file.\r\n'
        self.data({shellname:data.shellname, data: '\r\n ' + response + self[data.shellname].prompt});
    }
}

app.get('/', function (req, res) {

    req.session.loginDate = new Date().toString();
    res.sendfile(__dirname + '/Shell_Client.htm');

})
