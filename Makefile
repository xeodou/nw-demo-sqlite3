GOPATH=$(shell pwd)
NODE_WEBKIT_VERSION=0.12.0

install_node:
	@npm i --production

dist:
	@mkdir -p dist/bin
	@mkdir -p dist/node_modules && cp -rf node_modules/babel dist/node_modules/babel
	@cp -rf node_modules/body-parser dist/node_modules
	@cp -rf node_modules/cookie-parser dist/node_modules
	@cp -rf node_modules/express dist/node_modules
	@cp -rf node_modules/express-session dist/node_modules
	@cp -rf node_modules/jade dist/node_modules
	@cp -rf node_modules/sqlite3 dist/node_modules
	@cp -rf public ./dist/
	@cp -rf lib ./dist/
	@cp config.json index.html package.json ./dist/

clean:
	@rm -rf ../build
	@rm -rf ./dist/*

build_sqlite_nw_32: install_node
	@export LDFLAGS="-L`brew --prefix`/opt/sqlcipher/lib"
	@export CPPFLAGS="-I`brew --prefix`/opt/sqlcipher/include"
	@npm install sqlite3 --build-from-source --sqlite_libname=sqlcipher --sqlite=`brew --prefix` --runtime=node-webkit --target_arch=ia32 --target=$(NODE_WEBKIT_VERSION)

build_sqlite_nw_64:
	@export LDFLAGS="-L`brew --prefix`/opt/sqlcipher/lib"
	@export CPPFLAGS="-I`brew --prefix`/opt/sqlcipher/include"
	@npm install sqlite3 --build-from-source --sqlite_libname=sqlcipher --sqlite=`brew --prefix` --runtime=node-webkit --target_arch=x64 --target=$(NODE_WEBKIT_VERSION)

snapshot_db_js:
	@nwjc lib/db.js ./dist/bin/nw_sqlite.bin

minify_js:
	@./node_modules/.bin/uglifyjs

dist_osx_64: clean install_node build_sqlite_nw_64 dist snapshot_db_js
	@./node_modules/.bin/nwbuild --version v$(NODE_WEBKIT_VERSION) -p osx64 ./dist

dist_win_32: clean install_node build_sqlite_nw_32 dist snapshot_db_js
	@./node_modules/.bin/nwbuild --version v$(NODE_WEBKIT_VERSION) -p win32 ./dist

all: build_go

.PHONY: all build_go dist

