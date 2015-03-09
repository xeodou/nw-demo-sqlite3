nw-demo-sqlite3

This demo is use golang and nodejs. 

Use golang write a sqlite proxy as a cli.And use nodejs childe_process to call the cli.

For security reason, we don't use nodejs call sqlite datbase even we can. we want protect the databse. So user can't access the databse derectly. They can't see the secret key for the database.

We can write some private functions by golang, like check if the user is admin or someother roles.



It's use [sqlcipher](https://github.com/sqlcipher/sqlcipher)

The main problem is hard to do a cross compile on OSX.

The sqlcipher golang library is writen by cgo.
