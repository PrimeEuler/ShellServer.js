ShellServer.js
==============

Open multiple (dragable, resizable) terminal emulation sessions that send all keystrokes from the web browser to the shell server. The shell server has two default functions, ssh and telnet. 


Requirements:

* [node.js](http://nodejs.org/) -- v0.8.7 or newer
* [ssh2](https://github.com/mscdex/ssh2)
* [express.io](https://github.com/techpines/express.io)
* [bone.io](https://github.com/techpines/bone.io)
* [term.js](https://github.com/chjj/term.js)

Install:
```bash
npm install express.io
npm install ssh2
npm install bone.io
term.js is already included in the /js directory
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

```
