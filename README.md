## Telnet TCP chat room

#### Install and run:

Download the files.

* In your terminal, navigate to the file path / location of the downloaded files. 
* Type `nodemon chatroom.js` to start the server. 
* Then type `telnet _your.ip_ (space) port` something like this: IP[`111.111.1.1`] _ PORT[`8000`].

**On successful install and launch you should see:**

```
 * ~~~~ WELCOME !!! ~~~~
  * 
  * Commands are: 
  * @all (sends to all).
  * @nick + _yournick_ changes nickname.
  * @list will list all users with user names that are connected.
  * @count will show the number of users connected.
  * 
  * 
```

There is also a special admin command.
Enter `@admin-tools` in the chat window and you will get some information.
