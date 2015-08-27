PATH := $(PWD)/node_modules/.bin:$(PATH)

all: lint dist test


# ESnext compilation
# ======================

dist:
	rm -rf $@
	babel lib -d $@

develop:
	babel-node $@


# Code quality
# ============

lint:
	eslint ./lib ./test

test: dist
	tape test/*.test.js | faucet

cover: dist
	rm -rf coverage
	babel-istanbul cover --report none --print detail tape test/*.test.js

cover-browse: dist
	rm -rf coverage
	babel-istanbul cover --report html tape test/*.test.js
	opn coverage/index.html

travis: lint cover
	babel-istanbul report lcovonly
	(cat coverage/lcov.info | coveralls) || exit 0
	rm -rf coverage


# Publish package to npm
# @see npm/npm#3059
# =======================

publish: all
	npm publish

# Release, publish
# ================

# "patch", "minor", "major", "prepatch",
# "preminor", "premajor", "prerelease"
VERS ?= "patch"
TAG  ?= "latest"

release: all
	npm version $(VERS) -m "Release %s"
	npm publish --tag $(TAG)
	git push --follow-tags


# Tools
# =====

rebuild:
	rm -rf node_modules
	npm install


.PHONY: dist develop test
.SILENT: dist develop cover travis
