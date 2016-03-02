#!/usr/bin/env node
/**
 * @fileoverview The cli entry point.
 * @author  Victor O. Santos Uceta
 */
'use strict';

var pkg = require('../package.json');
var cli = require('commander');
var Importer = require('./index');

cli
    .version(pkg.version)
    .usage('[options] <file>')
    .option('-h, --h <host>', 'The hostname or IP address of the gremlin server, by default localhost')
    .option('-p, --port <port>', 'The hostname or IP address of the gremlin server, by default 8182', parseInt)
    .option('-f, --format <format>', 'The file format, currently supported: csv, gexf, dot', /^(csv|gexf|dot)$/i)
    .option('-t, --type <type>', '(ONLY FOR CSV) Type of components contained in the file, can be e for edges or v for vertices', /^(v|e)$/i)
    .option('-d, --delimiter <delimiter>', '(ONLY FOR CSV) The value delimiter')
    .option('--prefix <prefix>', 'The gremlin server groovy prefix for the default graphTraversalSource, E.g. g or graph, by default g')
    .on('--help', function () {
        console.log('  Example:');
        console.log('');
        console.log('    $ gremlin-import -a localhost -p 8182 -f gexf /path/to/myGraph.gexf');
        console.log('');
        console.log('    The above command connects to localhost port 8182 and imports the graph contained in myGraph.gexf');
    })
    .parse(process.argv);

/* Setting the importer arguments */
var args = {
    "file": cli.args[0],
    "host": cli.host,
    "port": cli.port,
    "format": cli.format,
    "type": cli.type,
    "delimiter": cli.delimiter
};

var importer = new Importer(args);

importer.import(function () {

    console.log("Data import completed");
    console.log("-----------------------");
    console.log("Total time: " + importer.getElapseTime());
    console.log("Inserted elements: " + importer.successCount);
    console.log("Errors: " + importer.errorCount);
    /* Exit process */
    process.exit();
})

