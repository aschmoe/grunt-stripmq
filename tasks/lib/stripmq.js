'use strict';

var fs = require('fs'),
  _ = require('underscore'),
  Parser = require('css-parse'),
  Stringify = require('css-stringify/lib/compress');

Stringify.prototype.compile = function(node){
  if(this.viewport.stripBase) {
    node.stylesheet.rules = _.reject(
      _.where(
        node.stylesheet.rules, {type: "media"}
      ), 
      function(rule) { 
        return rule.media && (rule.media === "print" ||  rule.media === "only screen"); 
      }
    );
  }
  return node.stylesheet
  .rules.map(this.visit, this)
  .join('');
};


// overwrite media compiler method
Stringify.prototype.media = function(node) {
  if(!this.matchMedia(node.media)) {
    return '';
  }
  return node.rules.map(this.visit, this).join('');
};

Stringify.prototype.processQuery = function(keyval, matches) {
  
  var self = this,
    // property parts
    property = keyval[0].trim().match(/(min|max)-(.+)$/),

    prop_value, setting_value_min, setting_value_max, 

    abortDimension = false;

  // no min/max property found
  if(!property) {
    return;
  }


  // find setting values by properties
  if(keyval[0].match(/width/i)) {
    setting_value_min = self.viewport.minWidth;
    setting_value_max = self.viewport.maxWidth;
    abortDimension = self.viewport.abortMaxWidth;
  }

  else if(keyval[0].match(/height/i)) {
    setting_value_min = self.viewport.minHeight;
    setting_value_max = self.viewport.maxHeight;
    abortDimension = self.viewport.abortMaxHeight;
  }

  else if(keyval[0].match(/device-pixel-ratio/i)) {
    setting_value_min = self.viewport["min-device-pixel-ratio"];
    setting_value_max = self.viewport["max-device-pixel-ratio"];

    // opera device pixel ratio is different, uses 3/2 for 1.5, kind of weird
    if(keyval[1].match(/[0-9]+\s*\/\s*[0-9]+/)) {
      var values = keyval[1].split("/");
      prop_value = parseInt(values[0],10) / parseInt(values[1],10);
    }
  }

  // parse the value of the property
  prop_value = parseFloat(prop_value || keyval[1]);

  switch(property[1]) {
    case 'min':
      matches.push((setting_value_min <= prop_value) && (setting_value_max >= prop_value));
      break;

    case 'max':
      if(abortDimension) {
        matches.push((setting_value_max <= prop_value) && (setting_value_min <= prop_value));
      }
      else {
        matches.push((setting_value_max >= prop_value) && (setting_value_min <= prop_value));
      }
      break;
  }

  if(keyval.length > 2) {
    self.processQuery(keyval.slice(1), matches);
  }
    
};


/**
 * parse media queries
 * @param str
 * @returns {boolean}
 */
Stringify.prototype.matchMedia = function(str) {
  var self = this,
    queries = str.toLowerCase().match(/\((.+)\)/gi),
    matches = [];

  if(queries != null) { 
    queries.forEach(function(query) {
      // min/max is should be the first property, then the name of the property (like width)
      var keyval = query.replace(/\(|\)/g, "").split(":")
      self.processQuery(keyval, matches);
    });
  }
  return matches.indexOf(false) === -1;
};


/**
 * virtual viewport
 * @type {{device-pixel-ratio: number, width: number, height: number}}
 */
Stringify.prototype.viewport = {
  "stripBase": false,
  "min-device-pixel-ratio": 1,
  "max-device-pixel-ratio": 2,
  "minWidth": 0,
  "maxWidth": 1024,
  "minHeight": 0,
  "maxHeight": 768,
  "abortMaxWidth": true,
  "abortMaxHeight": true
};


/**
 * strip media queries
 * @param   {string} input
 * @returns {string} output
 */
function StripMQ(input, options) {
  //parseOptions = options.stripBase ? {}
  var tree = new Parser(input);
  var compiler = new Stringify({});

  if(options) {
    _.extend(compiler.viewport, options);
  }

  return compiler.compile(tree);
}

module.exports = StripMQ;
