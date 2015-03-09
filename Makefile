GOPATH=$(shell pwd)

install_node:
	@npm i --production

clean:
	@rm -rf ../build

install_go:
	@GOPATH=$(shell pwd) go get ./...

build_go_osx: install_go
	@GOPATH=$(shell pwd) go build -o ./bin/nw-sql  sqlite

build_go_win: install_go
	@GOPATH=$(shell pwd) GOOS=windows GOARCH=386 go build -o ./bin/nw-sql.exe  sqlite

dist_osx_64: install_node build_go_osx
	@./node_modules/.bin/nwbuild -p osx64 ./

dist_win_32: install_node build_go_win
	@./node_modules/.bin/nwbuild -p win32 ./

all: build_go

.PHONY: all build_go

