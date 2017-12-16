import json
from bson.json_util import loads
from random import randint 

count = 0


reasons = [
    ("Mice found", 4),
    ("Dust found", 4),
    ("Old furniture", 45),
    ("Utensils unclean", 45),
    ("Water quality bad", 45),
    ("Lots of frozen food", 45),
    ("Smoky or blackened kitchen", 45), 
    ("Staff dont clean hands", 45),
    ("failed basic sanity check", 45)]
    
total = sum([x[1] for x in reasons])

def get_reason():
  r = randint(0, total)
  for reason in reasons:
    r -= reason[1]
    if r <= 0:
      return reason[0]


count = 0
g = open("violations.json", "w")
with open("restaurants.json") as f:
  for line in f:
    r = randint(0, 10)
    if r < 4:
      obj = loads(line)
      g.write(json.dumps({"restaurant": obj["name"],"reason": get_reason()}) + "\n")
g.close()

l = 0
with open("violations.json") as f:
  for line in f:
    l += 1
    try:
      x = loads(line)
    except BaseException:
      print l