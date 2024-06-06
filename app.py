import time #import time module

import redis #import redis module
from flask import Flask #import Flask module

app = Flask(__name__) #create a Flask instance
cache = redis.Redis(host='redis', port=6379) #create a Redis instance

#function to get the hit count
def get_hit_count():
    retries = 5 #set retries to 5
    #loop to try to increment the hits
    while True:
        try:
            return cache.incr('hits')
            #if there is a connection error, wait for 0.5 seconds
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')#route to the home page

#function to return the hit count
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)