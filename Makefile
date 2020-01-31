TARGET_VERSION ?= 0.0.1

# This should be run after every merge to master
build:
	npm install
	npm run build

release:
	sed -i -e 's#\(.*cdn.jsdelivr.net/gh/nre-learning/nre-styles@\)latest\(/dist/styles.css.*\)#\1$(TARGET_VERSION)\2#' helpers/stylesheet.js
	npm version --no-git-tag-version $(TARGET_VERSION)
	npm install
	npm run build
