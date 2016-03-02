/**
 * @fileoverview The gremlin client module.
 * @author  Victor O. Santos Uceta
 */
'use strict';

/* Get the gremlin module */
var Gremlin = require('gremlin');
var S = require('string');
var isGroovyReserved = require('./groovyReserved.json');

/*
 * @constructor
 * @param {object} The module settings.
 */
function GremlinClient(args) {

    /* Create client connection */
    this.client = Gremlin.createClient(args.port, args.host, {session: false});
    /* The prefix of the groovy console */
    this.prefix = args.prefix || "g";
    /* We need the file parser here */
    this.parser = args.parser;

    /* data types function enumerator */
    this.typeParser = {
        numeric: function(v){return S(v).toFloat()},
        date: function(v){return new Date(Date.parse(v))},
        boolean: function(v){return S(v).toBoolean()},
        string: function(v){return v}
    }
}

/*
 * Validates the configuration.
 * @private
 * @return {boolean} Is valid or not.
 */
GremlinClient.prototype.insert = function (data, type, successCallback, errorCallback) {

    var template;
    var query;

    /* build query */
    switch(type){

        /* for the edges
        *
        * g.V().has('city','Bodmin').next().addEdge('canReach',g.V().has('city','Gignod').next())
        *
        * */

        case "e":
            template = this.buildEdgeTemplate_(data);
            break;
        case "v":
            template = this.buildVertexTemplate_(data);
            query = this.prefix + ".addV(" + template +")";
            break;
    }

    //console.log(query);
    //console.log(data);
    //process.exit();

    /* Execute query insert */
    this.client.execute(query, data, function(err, results) {
        if (!err) {
            successCallback(results);
         }else{
            errorCallback(err, data);
        }
    });
};

/*
 * Construct an object to be concatenated into the gremlin-groovy query.
 * @private
 * @return {string} A new template for this object properties.
 */
GremlinClient.prototype.buildVertexTemplate_ = function (data) {

    /* this object */
    var self = this;
    /* Initialize template */
    var template = "";

    /* Build the template for this object */
    Object.keys(data).forEach(function(prop){
        /* Lower case property */
        var loProp =  S(prop).stripPunctuation().underscore().s.toLowerCase();

        /* Check if the property is groovy reserved */
        if(isGroovyReserved[loProp]){
            /* start with a underscore */
            loProp = '_'+loProp;
        }
        /* If the column is not empty */
        if(!S(data[prop]).isEmpty()) {
            /* moving to new property */
            data[loProp] = self.parseVertex_(prop, data[prop]);
        }else{
            /* deleting old one anyways and return the iteration */
            delete data[prop];
            return;
        }
        /* adding to the template */
        template+="'"+ loProp+"', "+ loProp + ", ";
    });

    /* Return template */
    return template.substr(0,template.length-2);
};

/*
 * Construct an object to be concatenated into the gremlin-groovy query.
 * @private
 * @return {string} A new template for this object properties.
 */
GremlinClient.prototype.buildEdgeTemplate_ = function (data) {

};

GremlinClient.prototype.parseVertex_ = function(prop ,value){

    /* Extracting the column type */
    var type = this.parser.colTypes[prop];

    /* if this type is supported */
    if(this.typeParser.hasOwnProperty(type)){

        return this.typeParser[type](value);

    }else{
        console.log("WARNING: Column \""+ prop+ "\" does not have a supported type: \""+ type
            + "\", supported types are: " + Object.keys(this.typeParser).join(","));
        return value;
    }
};

GremlinClient.prototype.parseEdge_ = function(prop, data){


};

/* Exporting the module function */
module.exports = GremlinClient;