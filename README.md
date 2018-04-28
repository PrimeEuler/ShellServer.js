ShellServer.js
==============

Open multiple (dragable, resizable) terminal emulation sessions that send all keystrokes from the web browser to the shell server. The shell server has four default functions ssh, telnet, ping and tracert. 

For the time being the [shellServer]( https://github.com/PrimeEuler/nms.js/tree/master/lib/shellServer ) 
has been combined with [nms.js]( https://github.com/PrimeEuler/nms.js ). See the [webNMS](https://github.com/PrimeEuler/nms.js/blob/master/example/webNMS.js) for an example.


Component of:
* [NMS.js](https://github.com/PrimeEuler/NMS.js)

Requirements:
* [jquery](http://jquery.com/)
* [node.js](http://nodejs.org/) -- v0.8.7 or newer
* [ssh2](https://github.com/mscdex/ssh2)
* [express.io](https://github.com/techpines/express.io)
* [bone.io](https://github.com/techpines/bone.io)
* [term.js](https://github.com/chjj/term.js)
* [net-ping](https://npmjs.org/package/net-ping/)

Install:
```bash
npm install express.io
npm install ssh2
npm install bone.io
term.js is already included in the /js directory
npm install net-ping * requires admin/root access to create raw (ICMP) packets
```


Run:
```bash
node Shell_Server.js
```


Connect:
```bash
http://localhost:8080
```


Use:
```bash
Click terminal icon ( >_ ). 
Type "telnet nethack.alt.org" in the terminal window.

Click terminal icon ( >_ ). 
Type "ssh nethack.alt.org" in the terminal window. 
( Username : nethack, Passowrd: password )

Click terminal icon ( >_ ). 
Type "ping 74.125.225.65" in the terminal window. 
Type "tracert 74.125.225.65" in the terminal window. 

```

Cloud9: *ssh is the only working protocol in the demo on cloud9  
* [workspace](https://c9.io/pr1m3n0d3/shellserver_js)
* [demo](https://shellserver_js-c9-pr1m3n0d3.c9.io)
