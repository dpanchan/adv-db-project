var violations = db.violations;
db.restaurants_and_violations.remove({})
violations.aggregate(
  { 
    "$lookup": {
      from: "restaurants",
      localField: "restaurant",
      foreignField: 'name',
      as: "obj"
    }
  },
  {
    "$project" : {
      reason: 1,
      restaurant: 1,
      zipcode: "$obj.address.zipcode",
      borough: "$obj.borough",
      cuisine: "$obj.cuisine"
    }
  },
  {
    "$out" : "restaurants_and_violations"
  }
);

var restaurants_and_violations = db.restaurants_and_violations;
db.tmp123.remove({})
restaurants_and_violations.mapReduce(
  function() { 
    emit(this.cuisine[0], this.reason); 
  },
  function(key, values) {
    var cache = {}
    var answer = "";
    var maxvalue = 0;
    for (var index in values) {
      if (cache[values[index]] == undefined)
        cache[values[index]] = 0;
      cache[values[index]] += 1;
    }
    for (var key in cache) {
      if (cache[key] > maxvalue) {
        maxvalue = cache[key];
        answer = key;
      }
    }
    return answer
  },
  { "out" : "tmp123" }
  );


restaurants_and_violations.mapReduce(
  function() { 
    var reasonObj = this.reason;
    emit(this.borough, reasonObj.reason); 
  },
  function(key, values) {
    print(values)
    return values.length;
  },
  { "out" : "tmp123" }
  );

restaurants_and_violations.aggregate(
  {
    "$group" : {
      "_id" : { 
        borough: "$borough",
        reason : "$reason.reason"
      }, 
      "count" : {
        $sum : 1    
      }
    }
  },
  {
    "$sort" : {
      count: -1
    }
  }, 
  {"$limit" : 10 },
  {
    "$group" : {
      "_id": {
        borough: "$_id.borough",
      },
      "tmp": {
        $push : {
          'reasons' : "$_id.reason",
          "counts": "$count"
        }
      }
    }
  }
);
  