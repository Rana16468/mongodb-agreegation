{
/* 
          # Aggregation Framework (MongoDB)

## ****6-0 Introduction of powerful aggregation framework****

The Aggregation way to passing the  large number of document .Aggregation passing the one stage to Another stage

# ****6-1 $match , $project aggregation stage****

1. https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-project
2. https://www.mongodb.com/docs/manual/aggregation/
3. Aggregation vs Formal Mongo DB Code 

Aggregation code :

db.test.aggregate([
//stage -1
{$match: {gender:'Male',age:{$lt:30}}},
//stage 2
{$project: {name:1,gender:1,age:1}},
{$sort: {age:1}}
]);

Formal Mongo DB Code :

db.test.find({gender:'Male',age:{$lt: 30}}).sort({ age:-1 }).project({name:1,age:1,gender:1});

# **6-2 $addFields , $out , $merge aggregation stage**

1. $addFields field can not be update original  document , $addFields only create temporary  array of object data or any types of data 

db.test.aggregate([
{$match: {gender:'Male'}},
{$addFields: {course:'level 2',eduTech:'Programming Hero',monerMoto:'RegusterStudent'}}

```
]).project({course:1,eduTech:1,monerMoto:1});

```

1. Create new Collage at a time existing  array of object to Another Object —→ only using like $out operator

{$addFields: {course:'level 2',eduTech:'Programming Hero',monerMoto:'RegusterStudent'}},
//stage 3
{$project: {course:1,eduTech:1,monerMoto:1}},
//stage 4
{$out: "course_student"}]);

3.  output Checking process : db.getCollection('course_student').find({})

1. $out operator  original  document not  modified but create a new collection out operator .

db.test.aggregate([
//stage 1
{$match: {gender:'Male'}},
//stage 2
{$addFields: {course:'level 2',eduTech:'Programming Hero',monerMoto:'RegusterStudent'}},
//stage 3
// {$project: {course:1,eduTech:1,monerMoto:1}},
//stage 4
{$out: "course_student"}]);

Find Method is : output Checking process : db.getCollection('course_student').find({})

5. $marge operator  —→ original  document modification process.

db.test.aggregate([
//stage 1
{$match: {gender:'Male'}},
//stage 2
{$addFields: {course:'level 2',eduTech:'Programming Hero',monerMoto:'RegusterStudent'}},
//stage 3
// {$project: {course:1,eduTech:1,monerMoto:1}},
//stage 4
{$merge:'test'}]);

merge data same collection , our original collection name is test, new new data added the test collection because using $merge  operator .

output checking process : db.test.find({},{name:1,gender:1,course:1,eduTech:1,monerMoto:1});

## **6-3 $group , $sum , $push aggregation stage**

1.https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-group

1. group depends of any types of document field like address

db.test.aggregate([
{$group: { _id: "$address.country"}}]);
3. Group depends of any types of document field like course

db.test.aggregate([
{$group: { _id: "$course"}}]);
4. db.test.aggregate([
{$group: { _id: "$age",count:{$sum: 1}}}]);

5.https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-group
6. 

db.test.aggregate([
{$group: { _id: "$address.country",countryName:{$push:'$name'}}}]);
Easily identify the group of user country name or onter fetails

1. count and country public username get 

db.test.aggregate([
{$group: { _id: "$address.country",count:{$sum: 1},countryName:{$push:'$name'}}}]);

1. All document Access at a time 

db.test.aggregate([
{$group: { _id: "$address.country",count:{$sum: 1},countryName:{$push:'$$ROOT'}}}]);
https://stackoverflow.com/questions/22359742/how-to-use-mongodb-aggregate-and-retrieve-entire-documents

db.test.aggregate([
//stage1
{$group: { _id: "$address.country",count:{$sum: 1},fulldog:{$push:'$$ROOT'}}},
//stage2
{$project: {'[fulldog.name](http://fulldog.name/)':1,'fulldog.email':1,'fulldog.gender':1,'fulldog.phone':1}}]);

# **6-4 explore more about $group & $project**

1. maximun salary and total amount calculation 

db.test.aggregate([
{$group: { _id: null,totalSalary:{$sum:'$salary'},maxSalary:{$max: "$salary"}}}])
db.test.aggregate([
{
//stage 1
$group:
{
_id: null,
totalSalary:{$sum:'$salary'},
maxSalary:{$max: "$salary"},
minSalary:{$min: "$salary"},
avgSalary:{$avg:'$salary'}
}
},
//stage 2
{
$project: {totalSalary:1,
maxmiumSalary:'$maxSalary',
minSalary:1,
AvergaeSalary:'$avgSalary',
salaryRange:{$subtract: [ "$maxSalary","$minSalary"]} }}])

# ****6-5 Explore $group with $unwind aggregation stage****

1. https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-unwind
2. unwind aggregation —→ divided the array and resolve the data  redundancy

db.test.aggregate([//stage 1
{$unwind: "$friends"},
//stage -2
{$group: { _id: "$friends",count:{$sum:1}}}])

1. $unwind create a multiple document . unwind divided  the array of object /array and create the multiple document 

db.test.aggregate([
//stage 1
{
$unwind: "$interests"
},
{
$group: { _id: "$age",ageofInterest:{$push: "$interests"}}
}])

# ****6-6 $bucket, $sort, and $limit aggregation stage****

1.https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/

1. $bucket using create boundary and also create different  types of group 

db.test.aggregate([
{
//stage 1
$bucket: {
groupBy:'$age',
boundaries:[20,40,60,80],
default:'other',
output:{
totalSameAge:{$sum:1},
name:{$push:'$$ROOT'}
}
}
},
//stathe 2
{$sort: {count:-1}},
//statge 3
{$limit: 2},
//statge 4
{
$project: {count:1,name:1,address:1}
}])

1. 

db.test.aggregate([
{
//stage 1
$bucket: {
groupBy:'$age',
boundaries:[20,40,60,80],
default:'other',
output:{
totalSameAge:{$sum:1},
name:{$push:'$$ROOT'}
}
}
}])

# ****6-7 $facet, multiple pipeline aggregation stage****

**1.https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/**

1. **multiple statge convert process , using $facet // report** 

**db.test.aggregate([
//stage 1
{ $facet: {
//pipleline one
friendCount:[
//statge 2
{ $unwind: "$friends"},
{$group: { _id: "$friends",count:{$sum: 1}}}
],
//pipleline 2
eductionCount:[
{$unwind: "$education"},
{$group: { _id: "$education",count:{$sum: 1}}},  ],
         slillsCount:[
             {$unwind: "$skills"},
             {$group: { _id: "$skills",count:{$sum:1}}}

             ]
}}

])**

# ****6-8 $lookup stage, embedding vs referencing.mp4****

1. https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-lookup
2. $lookup operator working with marge the two collection data with referencing just like  foring key 

db.orders.aggregate([
{$lookup: {
from: "test",
localField: "userId",
foreignField: "_id",
as: "user"
}}
])

# ****6-9 What is indexing, COLLSCAN vs IXSCAN****

1. db.test.find({_id:ObjectId("6406ad63fc13ae5a40000065")}).explain('executionStats');
2. . Indexing process : db.getCollection('massive-data').createIndex({email:1}); how to create indexing here is the code db.getCollection('massive-data').createIndex({email:1});
3. 

# ****6-10 Explore compound index and text index****

1.db.getCollection('massive-data').dropIndex({email:1});

1. text indexing search in google 

# Practices  Module —- Mongo DB Problem solving

1. link : https://docs.google.com/document/d/1f1R7zzbYHYm00RST5p6-fsamHgJjJzq_pYbkVBGc8mU/edit
2. problem solution no  1

**db.getCollection('massive-data').aggregate([**


{$match:{"isActive":true}},
//statge 2
{$group: { _id: "$gender",count:{$sum:1},userDocument:{$push: '$$ROOT'}}},
// statge 3
{$project: {'[userDocument.name](http://userdocument.name/)':1,'userDocument.gemder':1,'userDocument.isActive':1,count:1}}])**

1. problem solution no  2

**db.getCollection('massive-data').aggregate(
[
//statge 1
{$match: {
"isActive":true,
"favoriteFruit":'banana'
}},
//statge 2
{
$project: {name:1,email:1,address:1}
}])**

1. problem solution no 3

**db.getCollection('massive-data').aggregate([
//statge 1
{
$group: { _id: "$favoriteFruit",  avgAge:{$avg: "$age"}}},
     //statge: 2
     {
         $sort: {avgAge:-1}
     }
])**

# problem solution no 4

db.getCollection('massive-data').aggregate([

```
//statge 1
{$unwind: "$friends"},
//statge 2
{$match: {'friends.name':{
  $regex: /^W/
}}},
//statge 3
{$group: { _id: null,friendNames:{$addToSet: "$friends.name"}}},
//statge 4
{$project: {friendNames:1}}

])

```

# problem solution no  4  extends the solution

db.getCollection('massive-data').aggregate([

```
//statge 1
{$unwind: "$friends"},
//statge 2
{$match: {'friends.name':{
  $regex: /^W/
}}},
//statge 3
{$group: { _id: null,friendNames:{$addToSet: "$friends.name"}}},
//statge 4
{$out: "myfri"}

])

```

# problem solution no  5

db.getCollection('massive-data').aggregate([

```
{ $facet: {
    //pipline
    piplineOne:[
        //statage 1
      {$match: {"age":{$lt:30}}},
      //statge 2
      {$bucket: {
            groupBy: "$age",
            boundaries: [ 20,25,26,30],
            default: "Other",
            output: {
              "count": { $sum: 1 },
              "users" : { $push: "$$ROOT" }
            }
          }},
          //statge 3
          {$project: {'users.name':1,count:1}}

        ],
        pipelinetwo:[
            //pipline 2 statge 1
            {$match: {'age':{$gt:30}}},
            //pipline 2 statge 2
            {$bucket: {
                  groupBy: "$age",
                  boundaries: [ 20, 25,26,30],
                  default: "Other",
                  output: {
                    "count": { $sum: 1 },
                    "more_then_30" : { $push: "$$ROOT" }
                  }
                }},
                //statage 3
                {$project: {'more_then_30':1,count:1}}

            ]
}}

])

```

# problem solution no  6

// db.getCollection('massive-data').updateMany({},{$set:{'balance':1050}},{upsert:true})
db.getCollection('massive-data').aggregate(
{
//statge 1
$group: { _id: "$company",totalCompany:{$sum:1},totalBalance:{$sum:'$balance'}},
},
//statge 2
{
$sort: {totalBalance:-1}
},
//statge 3
{
$limit: 2
}
)


*/

}