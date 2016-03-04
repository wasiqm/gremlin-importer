
<p align="center">
 <img height="300" src="https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/images/csv-file-format-extension.png">
</p>

# **CSV Import guide**  #

Updated: March 3, 2016

### **Description** ###

This guide will give you a short tutorial of how to import your **CSV** data via a **Gremlin Server** using the `gremlin-importer` node.js package. Note that TinkerPop is usually used with a backend database such as Neo4J, TitanDB, or OrientDB.

In this guide, we will use the following:

 - [TitanDB 1.0](http://s3.thinkaurelius.com/docs/titan/1.0.0/index.html), which comes with [TinkerPop3](http://tinkerpop.apache.org/docs/3.0.0-incubating/)
 - The download-and-run configuration of TitanDB, i.e. **Cassandra** with **Elasticsearch**.
 - Two CSV files with fake data about Marvel© characters. One for [edges](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/edges.csv) and other for the [vertices](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/vertices.csv).

### **CSV format information and limitations** ###

There are several things to have in mind before building your CSV files. **Pay careful attention to the following details otherwise your import will fail.** 

####Three Important Points ####

 1. You will need at least **Two(2) CSV** files: one for **vertices**, and other for **edges**.
 2. You need to properly follow the format for both. **Vertex** files and **edge** files have a**different format**.
 3.  The **import** **order** is all vertices first, then all edges.

####The Data Types ####

The `gremlin-importer` currently **supports** **5** data types:

 1. **numeric**: This is any integer or floating point. For example `55`, `33.55`, or `-15.32`
 2. **date**: A JavasCript parseable date. For example: `10/11/1952` or `1995-12-17T03:24:00`
 3. **boolean**: A boolean value. For example: `true` or `false`
 4. **string**: A sequence of characters. For example: `"a"`,  `"hero"`, `"The day after tomorrow"`
 5. **label**:  A **string**, but will be used as a **label** component in the TinkerPop Graph.

####The **Vertex** CSV format ####

The vertex CSV file follows the next format:

 - First row **must** include field **headers**. These must **not** contain special characters. If space is found, it will be **underscored** and **lowercased** to follow naming conventions. For example:
 
 	```javascript
	category, id, name, born_place, salary, siblings, rank, first_battle
	```
	 
 - The second row **must** include the **data type** of the column. For example:
 
 	```javascript
 category, id, name, born_place, salary, siblings, rank, first_battle
 label, numeric, string, string, numeric, numeric, numeric, date
	```
	
	Here we say that `category` is a `label`,  `id` is `numeric`, `name` is a `string`, and so on.
 - Finally following rows must contain the actual vertex data. For example:
	 
 	```javascript
	category, id, name, born_place, salary, siblings, rank, first_battle
	label, numeric, string, string, numeric, numeric, numeric, date
	hero, 1,3-D Man, Dmitriyevka,8.46,1,7,12/17/1995
	villain, 2,A-Bomb (HAS), Roma,7.6,5,5,4/3/02004
	```

Some **Tips** before wrapping up the vertex CSV format:

 - Always quote everything in the CSV(I know, I did not in my examples) but you should. Example:
 
 	```javascript
	"villain" ,"2" ,"A-Bomb (HAS)", "Roma" ,"7.6" ,"5" ,"5" ,"4/3/02004"
	```
 - Remember that no special characters are allowed in the column headers and data types. The `gremlin-importer` will `stripPunctuation(), trim(), underscore(), and toLowerCase()` those.
 
 - Each row must have the **same width**, this is, if you include a CSV with **5** headers, it must have **5** data types, and each row must have **5** values. If value is empty, like for example:
	```javascript
	"" ,"2" ,"A-Bomb (HAS)", "Roma" ,"7.6" ,"5" ,"5" ,"4/3/02004"
	```
  Note that this line is missing the **label** value, in such case, this vertex will be imported without a label. The same will happen with another field, the vertex will simply not have the missing field.

	**Warning**:  Be sure to not miss a value like a unique identifier, because you will need those to insert the edges.

 -  Remember to add a breakline(enter) at the end of your CSV.

####The **Edge** CSV format ####

The edge CSV file is very similar to the vertex CSV file but row-wise, it must follow the next format:

 - The edges CSV file is row-wise instead of column wise. This means that this file **must not include headers**.
 - Each edge is represented as a combination of **3 rows**. **Source** row, **target** row, and **edge** row. For example: 
 
	```javascript
	id, numeric, 1428
	id, numeric, 1
	out,worked,hours, numeric, 1,date, date, 8/1/1984
	```

	In the above example, we have the first row as the source, the second row as the target, and the thirds row as the edge. This will be equivalent to the following illustration:
	
	<p align="center">
 <img  src="https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/images/guide_images/singleEdge.png">
</p>
	We have two vertices, one with **id** = 1428 and the other with **id** = 1, both numeric, and one edge conecting both with the first value as the ***direction*** from the **source to target** (out), a ***label*** with value "worked" , a numeric field named ***hours*** with value 1, and a date field named ***date*** with value "8/1/1984".  In other words, vertex 1428 worked with vertex 1 for one(1) hour on August 1, 1984. 
	
	Note that if the direction of the edge where **in**, vertex 1 would be pointing vertex 1428.

 - As you noticed in the previous point, each vertex row must follow a format:
	 
	```javascript
	id, numeric, 1428
	```
	Each value is a **triplet** (**[field name, data type, value]**) , which consist of the field name(in this case '**id**'), second value is the date type(in this case is a **'numeric'**), and finally the value(in this case '**1428**'). This tells the `gremlin-importer` to **attach** the edge to the vertex with the **numeric** **id** = **1428**. You can infer that this field **MUST** be **UNIQUE**.

 - The edge line must follow a **STRICT** format and **ORDER** as follows:
 	```javascript
	out,worked,hours, numeric, 1,date, date, 8/1/1984
	```
	 - First value is the direction of the edge from **source**(first line) to **target**(second line), this value must be either: **in** or **out**.
	 - The second value is the edge **label**. This is value is also required by `gremlin-importer` since it enforces a good representation of the graph semantics. In this case, it represents the 'worked' event between two vertices.
	 - The following fields are triplets as previously discussed. You can add as many as you want but must follow the **[field name, data type, value]** format. In this example, we have two fields, each one with its name, data type, and value.

Some **Tips** before wrapping up the edge CSV format:

 - Be sure to have each edge with all **3** required lines: source, target, vertex. Otherwise, the import will fail. A common validation is to make sure the number of lines in your CSV is divisible by 3.
 - Remember to add a breakline(enter) at the end of your CSV.

### **Let the import begin!** ###

Ok, enough of boring formats and rules and all that stuff, let put a graph into that Gremlin Server!

<p align="center">
 <img  src="http://www.officialpsds.com/images/thumbs/Gizmo-psd31186.png">
</p>

I'm assuming you have **node.js** and **npm** installed. I will use TitanDB in this tutorial but you can use any other TinkerPop3 enabled database.

Install `gremlin-importer`

    $ npm install -g gremlin-importer

Download  [edges.csv](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/edges.csv) and [vertices.csv](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/vertices.csv) to a local directory.


### 1. Create vertex indexes ###

Before importing the vertices, we need to create an index for the **id** field in our database. This is necessary because we need the index to be present at the moment of inserting the **edges**. If you skip this step, the edge import will take forever since the server will look sequentially for every source and target in order to create the edge. By having the index for the **id** field, the search becomes way faster and efficient.

First, open your **gremlin console** and load your database configuration. The following is the configuration for a Cassandra setting using TitanDB:
```javascript
graph = TitanFactory.open('conf/gremlin-server/titan-cassandra-server.properties')
g = graph.traversal()
```

Next, we rollback any existing open transactions before creating our index:

```javascript
if(graph.getOpenTransactions()) graph.tx().rollback()
```
next, we create the index:

```javascript
mgmt = graph.openManagement()
idProp = mgmt.makePropertyKey("id").dataType(Integer.class).make()
mgmt.buildIndex("id_index", Vertex.class).addKey(idProp).unique().buildCompositeIndex()
mgmt.commit()
```

Then wait for index to become available:
```javascript
mgmt.awaitGraphIndexStatus(graph, 'id_index').status(SchemaStatus.ENABLED).timeout(10, java.time.temporal.ChronoUnit.MINUTES).call()
```
When the previous command is **done** you are suppose to see something like this:
```javascript
==>GraphIndexStatusReport[success=true, indexName='id_index', targetStatus=ENABLED, notConverged={}, converged={id=ENABLED}, elapsed=PT0.042S]
```

(**Optional**) If you already have data, you will need to reindex:

```javascript
mgmt = graph.openManagement()
mgmt.updateIndex(mgmt.getGraphIndex("id_index"), SchemaAction.REINDEX).get()
mgmt.commit()
```

### 2. Import vertices ###

It is time to import our vertices!(finally man...). Ok so since you have followed this guide step by step, you should have [vertices.csv](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/vertices.csv) in your directory already. Let's import **1485 vertices** to our Gremlin Server.
```bash
$ gremlin-importer -h localhost -p 8182 -f csv -t v path/to/vertices.csv
```
Here you are indicating that the gremlin server is running in the localhost, port 8182, the format of the file is CSV, the type of components to be imported are vertices, and the file is vertices.csv. Change these parameters to your needs.

You should see something like this:

```bash
Computing line count...
Total lines in file: 1487

  importing [========================================] 100% 0.0s

Import Summary
-----------------------
Total time: a few seconds
Inserted elements: 1485
Warnings: 0
Errors: 0
```

Now go back to the **gremlin console**, and check how many vertices are in the database:

```javascript
gremlin> g.V().count()
==>1485
```
If you see an ugly warning it is ok, it means that not all fields in the vertices are indexed and you should never do something like `g.V().count()` because is really heavy.

We are **done** importing our vertices!

### 3. Import edges ###

Importing edge is not that different from importing the vertices, you just need to specify the [edges.csv](https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/example_data/edges.csv)  file and change the `-t` flag to **e** instead of **v**. This will import **2972 edges** to our Gremlin Server.
```bash
$ gremlin-importer -h localhost -p 8182 -f csv -t e path/to/edges.csv
```
Again, just change these parameters to your needs.

After a couple of seconds, you will see something like the following:

```bash
Computing line count...
Total lines in file: 8916

  importing [========================================] 100% 0.0s


Import Summary
-----------------------
Total time: a few seconds
Inserted elements: 2972
Warnings: 0
Errors: 0
```
Now go back to the **gremlin console**, and check how many edges are in the database:

```bash
gremlin> g.E().count()
==>2972
```
You will probably see that ugly warning again. So remember, doing `g.E().count()` is not a good practice.

**We are done importing data!** Let's check our graph and see what we just imported.

### 4. Test your graph data ###

Let's go back to the **gremlin console**. Let's do some investigative work about our favorite billionaire **Tony Stark**...

```bash
gremlin> g.V().has('id',574).valueMap()
```
We see that Tony has 4 brothers... and his salary is 9.81... millions perhaps...?
```bash
==>[siblings:[4], born_place:[Şānūr], name:[Iron Man], rank:[8], id:[574], salary:[9.81], first_battle:[1983-11-12T05:00:00.000Z]]
```
Now, let's find out who come to Iron Man looking for trouble(**battled**) and when:
```bash
gremlin> g.V().has('id',574).inE('battled').as('fight').outV().values('name').as('agressors').select('fight').values('date').as('fight_date').select('agressors','fight_date')
```
These are the troublesome guys:
```bash
==>[agressors:Morlun, fight_date:2004-04-04T05:00:00.000Z]
==>[agressors:Josiah X, fight_date:2015-07-09T04:00:00.000Z]
==>[agressors:Thena, fight_date:2007-07-28T04:00:00.000Z]
```
We see that he battled 3 other people, Morlun on 2004, Josiah X on 2015, and Thena on 2007. The gremlins inside the server did a walk while collecting data. These walks looks like the following:

<p align="center">
 <img  src="https://raw.githubusercontent.com/mastayoda/gremlin-importer/master/images/guide_images/gremlinWalk.png">
</p>

### 5. Celebrate ###

This is the end of the guide! At this point you either **love or hate** gremlin. The good thing is that you now know how to import CSV data into a Gremlin server. Now go and have some **graph fun**!

<p align="center">
 <img  src="https://media.giphy.com/media/14cQ5Y4jrQF0nm/giphy.gif">
</p>

### **Common problems and ideas** ###

####Problem
TitanDB doesn't let me create the indexes... The edges import fails, what I'm doing wrong?

####Solution
The good news is that you probably are not doing anything wrong. Since TinkerPop is independent of the database backend, such as **TitanDB**, and **Neo4J**, you will find many problems while trying to create indexes, and make your data persist. This is commonly due to the mismatch of different storage backends versions and indexing components. My advice will be to erase all data and start the import process again. Many times creating  the index before you have data works better than reindexing existing data.


----------

####Problem
I got a lot of errors while doing the import for the [vertices|edges], what is wrong?

####Solution
Double check the CSV format in this guide. Also, prevent weird characters in the data, and quote everything in the CSV. Commonly the output in the error, while the import is in the process, will tell what is wrong.

----------

####Problem
I have **XXGB** of data to import. This is taking forever... Is not there a faster way to import all my **Gigs**?

####Solution
A powerful detail about CSV import is that you can easily partition the importing data and running the import in parallel. **Parallel import** is out of the scope of this guide, but here is a possible pipeline.

 - Convert your data into many smaller vertex CSV, and many edge CSV files. For example, 20 X 1GB vertex CSV files, and 40 X 1GB edge CSV files. Of course following the format.
 - Distribute all the vertex and edge CSV files among different machines.
 - Get ready your gremlin server, or gremlin server cluster because is going to smoke.
 - Run the vertex import process on all machines with the 20 vertex CSV files.
 - After the vertex import is over, do the same import process with all the edge CSV files.
 
This procedure should work the same as we just did in the guide, but in parallel.