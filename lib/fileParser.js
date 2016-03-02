/**
 * @fileoverview The graph file parser.
 * @author  Victor O. Santos Uceta
 */
'use strict';

var fs = require('fs');
var gexf = require('gexf');
var dot = require('graphlib-dot');
var csv = require('fast-csv');
var xlsx = require('xlsx');
var ProgressBar = require('progress');

/*
 * @constructor
 * @param {object} The module settings.
 */
function FileParser(args) {

    /* Setting up defaults */
    this.componentType = args.type;
    this.delimiter = args.delimiter;
    this.format = args.format;
    this.file = args.file;
    this.lnCount = 0;
    this.bar = null;
    this.colTypes = null;

    /* Checking if the file exist */
    try{
        fs.statSync(this.file);
    }catch(e){
        throw new Error("Error: provided file not found");
    }

}

/*
 */
FileParser.prototype.computeLines = function (callback) {

    /* logging message */
    console.log("Computing line count...");
    /* initializing variables */
    var self = this;
    var i, count = 0;
    /* compute number of lines in the file */
    fs.createReadStream(this.file)
        .on('data', function(chunk) {
            for (i=0; i < chunk.length; ++i)
                if (chunk[i] == 10) count++;
        })
        .on('end', function() {
            /* logging number */
            console.log("Total lines in file: "+ count);
            /* setting the properties */
            self.lnCount = count;
            callback();
        });
};

/*
 */
FileParser.prototype.activateProgress_ = function () {

    /* Instantiating progress bar */
    this.bar = new ProgressBar('  importing [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: this.lnCount
    });
};

/*
 */
FileParser.prototype.tickProgress = function (n) {

    /* increasing tick if present */
    if(this.bar){
        this.bar.tick(n);
    }
};

/*
 */
FileParser.prototype.readCSV_ = function (progressCallback, doneCallback) {

    /* this object */
    var self = this;
    /* flag to read the types */
    var typesReaded = false;
    /* Activate the progress bar */
    this.activateProgress_();

    /* Open file stream and parse csv*/
    fs.createReadStream(this.file)
        .pipe(csv({objectMode: true, headers: true, delimiter: this.delimiter}))
        .on("data", function (data) {

            /* reading second row, i.e. types */
            if(!typesReaded && self.componentType === 'v'){
                /* trimming and lower casing column types */
                for(var prop in data){
                    data[prop] =  data[prop].trim().toLowerCase();
                }
                /* Set the columns */
                self.colTypes = data;
                typesReaded = true;
                /* dont return this column */
                return;
            }

            /* Send progress */
            progressCallback(data);
        })
        .on("end", function () {
            /* done callback */
            doneCallback();
        });
};
/*
 */
FileParser.prototype.readXLSX_ = function (progressCallback, doneCallback) {

};
/*
 */
FileParser.prototype.readGEXF_ = function (progressCallback, doneCallback) {

};
/*
 */
FileParser.prototype.readDOT_ = function (progressCallback, doneCallback) {

};

/*
 * Validates the configuration.
 * @private
 * @return {boolean} Is valid or not.
 */
FileParser.prototype.parse = function (progressCallback, doneCallback) {

    /* The collecting array */
    var elements = [];

    /* checking which parsing function to call */
    switch (this.format) {
        case 'csv':
            /* Parse the csv and notify in streams */
            this.readCSV_(function (data) {
                /* If there is a progress callback, call */
                if (progressCallback) {
                    progressCallback(data);
                }
            }, function (data) {
                /* If there is a done callback */
                if (doneCallback) {
                    doneCallback();
                }
            });
            break;
        case 'xlsx':

            break;
        case 'gexf':

            break;
        case 'dot':

            break;
    }

};

/* Exporting the module function */
module.exports = FileParser;