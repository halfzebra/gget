# GGET [![npm version](https://badge.fury.io/js/gget.svg)](http://badge.fury.io/js/gget) [![Build Status](https://travis-ci.org/halfzebra/gget.svg?branch=master)](https://travis-ci.org/halfzebra/gget)

A module for Express.js that provides a middleware for grouping multiple GET requests to API and retrieve the response simultaneously.

## Install

```bash
npm install gget
```

## API

```js
var express = require('express')
var xget = require('gget')

var app = express()
app.use('api/group', gget(3000))
```

## Usage
```
http://example.com/group?parameter1=api/path&parameter2=api/path/id
```