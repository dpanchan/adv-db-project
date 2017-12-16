import pymongo
from bson.json_util import loads

user, pswd = "test174", "174test"
url = "mongodb://{0}:{1}@ds157320.mlab.com:57320/test_db".format(user, pswd)

# create a pymongo client
client = pymongo.MongoClient(url)
# get db handle
db = client.test_db
# the collections on db
restaurants = db.restaurants
zips = db.zips
# remove everything to avoid dups 
restaurants.remove()
zips.remove()
# load restaurants
with open("restaurants.json") as f:
  for line in f:
    restaurant = loads(line)
    restaurants.insert(restaurant)
# load zip codes
with open("zips.json") as f:
  for line in f:
    a_zip = loads(line)
    zips.insert(a_zip)