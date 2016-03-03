
# **gremlin-importer** #

<p align="center">
 <img src="https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/images/gremlin-importer.png">
</p>

[![NPM](https://nodei.co/npm/gremlin-importer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gremlin-importer/)

[![npm version](https://badge.fury.io/js/gremlin-importer.svg)](https://badge.fury.io/js/gremlin-importer) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/LICENSE) ![platform](https://img.shields.io/badge/platform-node.js-green.svg)

----------
## STATUS: Not stable ##
Under development: ETA ~ march 15, 2016

 - Release 1.0 supporting CSV for edges and vertices
 - User defined values, including labels
 - Properties for second release

## Description ##

This is a pain free data importing tool for **Gremlin enabled** databases. All you need is to provide the **vertices** and **edges** in the correct format and the gremlin-importer will populate the graph database for you. Some **rules** and **restrictions** must be **followed** in order to have a successful import process.

See the [**wiki**](https://github.com/mastayoda/gremlin-importer/wiki) for guides of how to import different formats.

## Installation ##

    $ npm install -g gremlin-importer

## Usage ##

    $ gremlin-importer [options] <file>

###Example

Connect to **myServer.com** port **8182**, and import a **csv** file named **vertices.csv** containing **vertices** with delimiter **#**

    $ gremlin-importer -h myServer.com -p 8182 -f csv -t v vertices.csv  
    
###Options
**-h, ---help**                    
output usage information

    $ gremlin-importer -h
    $ gremlin-importer --help

**-V, ---version**                
output the version number

    $ gremlin-importer -V
    $ gremlin-importer --version

**-h, ---host < host >**            
The hostname or IP address of the gremlin server, by default **localhost**

    $ gremlin-importer -h 128.0.0.1
    $ gremlin-importer -h mygremlinserver.com
    $ gremlin-importer --host otherServer.com

**-p, ---port <port>**            
The hostname or IP address of the gremlin server, by default **8182**

    $ gremlin-importer -p 8182
    $ gremlin-importer --port 9991

**-f, ---format <format>** 
The file format, currently supported: **csv**

    $ gremlin-importer -f csv
    $ gremlin-importer --format csv

**-t, ---type <type>**            
(**ONLY FOR CSV**) Type of components contained in the file, can be **e** for edges or **v** for vertices

    $ gremlin-importer -t v
    $ gremlin-importer --type e

**-d, ---delimiter <delimiter>**  
(**ONLY FOR CSV**) The value delimiter

    $ gremlin-importer -d ,
    $ gremlin-importer --delimiter #

**---prefix <prefix>**           
 The gremlin server groovy prefix for the default **graphTraversalSource**, by default **g**

    $ gremlin-importer --prefix bigGraph



## Preamble ##

Why this tool?

 - Importing data should be easy and not a painful process.
 - Currently, **Gremlin I/O** is very sensitive, it can import data in **graphML** and **Graphson** formats by default.
 - Sometimes, we don't want to convert our data into specific format, but simple ones such as **CSV**.
 - Nested file format such as **graphML** and **Graphson** need to be loaded into memory to be imported. If the amount of vertices and edges is massive, it can be imported in a stream fashion and even in parallel using flat fils such as **CSV**.


## Current file format support ##

Current supported formats are:

 - CSV

Future supported formats will be:

 - GEXF
 - GraphML
 - Graphson
 - DOT
 - XLXS

## Current tested databases ##

 - [TitanDB](http://thinkaurelius.github.io/titan/)




## Import Guides##

 - [CSV import guide](https://github.com/mastayoda/gremlin-importer/wiki/CSV-import-guide)

----------


## Important information ##


