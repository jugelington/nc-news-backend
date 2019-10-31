#!/bin/bash
mongoimport --host nc_mongo --db admin --type json --file articles.json --jsonArray --mode=insert
mongoimport --host nc_mongo --db admin --type json --file comments.json --jsonArray --mode=insert
mongoimport --host nc_mongo --db admin --type json --file topics.json --jsonArray --mode=insert
mongoimport --host nc_mongo --db admin --type json --file users.json --jsonArray --mode=insert