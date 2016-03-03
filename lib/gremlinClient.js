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
        string: function(v){return v},
        label: function(v){return v}
    }

    /* Bullet list for end summary */
    this.messageHash = {};
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
    var count = 0;

    /* Build the template for this object */
    Object.keys(data).forEach(function(prop){
        /* Lower case property and parameter property*/
        var loProp =  S(prop).stripPunctuation().underscore().s.toLowerCase();
        var objectProp = '_'+count+'_';
        count++;

        //var message = 'Property "'+loProp+'" conflicts with groovy syntax, automatically changed to: "_'+loProp+'"';
        ///* Adding to message hash */
        //if(self.messageHash[message]){
        //    self.messageHash[message]++;
        //}else{
        //    self.messageHash[message]=1;
        //}

        /* If the column is not empty */
        if(!S(data[prop]).isEmpty()) {
            /* check if it is a label */
            if(self.parser.colTypes[prop] === 'label'){

                data[objectProp] = data[prop];
                /* adding label to the template */
                template+="label, "+ objectProp +", ";
            }else{
                /* moving to new property */
                data[objectProp] = self.parseVertex_(prop, data[prop]);
                /* adding to the template */
                template+="'"+ loProp+"', "+ objectProp + ", ";
            }
            /* deleting old one anyways and return the iteration */
            delete data[prop];
        }else{
            /* deleting old one anyways and return the iteration */
            delete data[prop];
            return;
        }
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

        throw new Error("Column \""+ prop+ "\" does not have a supported type: \""+ type
            + "\", supported types are: " + Object.keys(this.typeParser).join(","));
    }
};

GremlinClient.prototype.parseEdge_ = function(prop, data){


};

/* Exporting the module function */
module.exports = GremlinClient;