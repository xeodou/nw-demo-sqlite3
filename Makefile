GOPATH=$(shell pwd)
NODE_WEBKIT_VERSION=0.12.0

install_node:
	@npm i --production

clean:
	@rm -rf ../build

build_sqlite_nw_32: install_node
	@export LDFLAGS="-L`brew --prefix`/opt/sqlcipher/lib"
	@export CPPFLAGS="-I`brew --prefix`/opt/sqlcipher/include"
	@npm install sqlite3 --build-from-source --sqlite_libname=sqlcipher --sqlite=`brew --prefix` --runtime=node-webkit --target_arch=ia32 --target=$(NODE_WEBKIT_VERSION)

build_sqlite_nw_64:
	@export LDFLAGS="-L`brew --prefix`/opt/sqlcipher/lib"
	@export CPPFLAGS="-I`brew --prefix`/opt/sqlcipher/include"
	@npm install sqlite3 --build-from-source --sqlite_libname=sqlcipher --sqlite=`brew --prefix` --runtime=node-webkit --target_arch=x64 --target=$(NODE_WEBKIT_VERSION)

snapshot_db_js:
	@nwjc lib/db.js ./bin/nw_sqlite.bin

minify_js:
	@./node_modules/.bin/uglifyjs

dist_osx_64: install_node build_sqlite_nw_64
	@./node_modules/.bin/nwbuild --version v$(NODE_WEBKIT_VERSION) -p osx64 ./

dist_win_32: install_node build_sqlite_nw_32
	@./node_modules/.bin/nwbuild --version v$(NODE_WEBKIT_VERSION) -p win32 ./

all: build_go

.PHONY: all build_go

