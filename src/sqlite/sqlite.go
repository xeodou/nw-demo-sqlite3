/*
* @Author: xeodou
* @Date:   2015-03-04 13:06:55
* @Last Modified by:   xeodou
* @Last Modified time: 2015-03-06 17:19:28
 */

package main

import (
	"database/sql"
	"fmt"
	"github.com/codegangsta/cli"
	_ "github.com/welovesecrets/go-sqlcipher"
	"log"
	"os"
)

const (
	TABLE_NAME = "users"
	PASS_WORD  = "aa37ce9555c6c3136791"
)

func main() {
	app := cli.NewApp()
	app.Name = "nw-sql"
	app.Usage = "This is a demo"
	app.Version = "0.0.1"
	app.Author = "xeodou"
	app.Email = "xeodou@gmail.com"
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:   "database, db",
			Value:  "database",
			Usage:  "Database you want read and write",
			EnvVar: "NW_SQLITE_DATABASE",
		},
	}
	app.Commands = []cli.Command{
		{
			Name:      "create",
			ShortName: "c",
			Usage:     "Create a new user",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "name, n",
					Usage: "User's name",
				},
				cli.StringFlag{
					Name:  "password, p",
					Usage: "User's password",
				},
			},
			Action: func(c *cli.Context) {
				db, name, pass := c.GlobalString("database"), c.String("name"), c.String("password")
				if db == "" {
					log.Fatal("Miss database")
					if name == "" {
						log.Fatal("Miss name")
						if pass == "" {
							log.Fatal("Miss password")
							return
						}
						return
					}
					return
				}
				table(db)
				CreateUser(db, name, pass)
			},
		},
		{
			Name:      "find",
			ShortName: "f",
			Usage:     "Find a user",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "name, n",
					Usage: "User's name",
				},
			},
			Action: func(c *cli.Context) {
				db, name := c.GlobalString("database"), c.String("name")
				if db == "" {
					log.Fatal("Miss database")
					if name == "" {
						log.Fatal("Miss name")
						return
					}
					return
				}
				table(db)
				FindUser(db, name)
			},
		},
	}

	app.Run(os.Args)
}

func table(database string) {
	db, err := sql.Open("sqlite3", database)
	if err != nil {
		log.Fatal(err)
	}
	p := "PRAGMA key = '" + PASS_WORD + "';"
	_, err = db.Exec(p)
	if err != nil {
		log.Fatal(err)
		return
	}
	c := "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (id INTEGER PRIMARY KEY, name char, password chart, UNIQUE(name));"
	_, err = db.Exec(c)
	if err != nil {
		log.Fatal(err)
		return
	}
}

func CreateUser(database string, name string, pass string) {
	db, err := sql.Open("sqlite3", database)
	defer db.Close()

	p := "PRAGMA key = '" + PASS_WORD + "';"
	_, err = db.Exec(p)
	if err != nil {
		log.Fatal(err)
		return
	}
	c := "INSERT INTO " + TABLE_NAME + "(name, password) values('" + name + "', '" + pass + "');"
	_, err = db.Exec(c)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print("{}")
}

func FindUser(database string, name string) {
	db, err := sql.Open("sqlite3", database)
	defer db.Close()

	p := "PRAGMA key = '" + PASS_WORD + "';"
	_, err = db.Exec(p)
	if err != nil {
		log.Fatal(err)
		return
	}
	c := "select name, password from " + TABLE_NAME + " where name='" + name + "';"
	rows, err := db.Query(c)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var name string
		var password string
		rows.Scan(&name, &password)
		fmt.Print("{\"name\":\"" + name + "\", \"password\": \"" + password + "\"}")
	}
	rows.Close()
}

// func read(name *string) {

// }
