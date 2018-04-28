import os
import simplejson as json
import glob
from uuid import uuid4
import datetime
import pprint
import time
import dateutil.parser

results = []
queries = [
    "greece",
    "france"
]

from Twitter.Main import TwitterClass
twitter = TwitterClass()
for q in queries:
    try:
        twitter.Query(q)
    except:
        time.sleep(1)
        twitter.Query(q)

# json.dump(twitter.Tweets, open("twitterqueryexample_full.json",'w'))

data = twitter.Tweets
Ngrams = {}
Days_x_Tweets = {}
for i in data:
    tweet = data[i]
    dateiso = dateutil.parser.parse( tweet["created_at"] )
    # jour = dateiso.strftime('%Y-%m-%dT%H:%M:%S')
    jour = dateiso.strftime('%Y-%m-%d')

    if jour not in Days_x_Tweets:
        Days_x_Tweets[jour] = {
            "tweets":[]
        }
    Days_x_Tweets[jour]["tweets"].append( tweet["id"] )
    Ngrams[tweet["query"]] = True

Ngrams = Ngrams.keys()

DatesIndex = sorted(Days_x_Tweets.keys())
for jour in DatesIndex:
    # print jour
    Scores = {}
    t_ids = Days_x_Tweets[jour]["tweets"]
    for t in t_ids:
        tweet = data[t]
        # print "\t", tweet["query"] ,t,"RT:",tweet["retweet_count"]
        if tweet["query"] not in Scores:
            Scores[ tweet["query"] ] = 0
        Scores[ tweet["query"] ] += tweet["retweet_count"]
    Days_x_Tweets[jour]["scores"] = Scores
    # print

finaldata = []
Date_vs_Tweets = []
for jour in DatesIndex:
    info = []
    the_timestamp = jour
    # the_timestamp = jour.replace("T"," ")
    info.append( the_timestamp )
    Date_vs_Tweets.append( Days_x_Tweets[jour]["tweets"] )
    t_scores = Days_x_Tweets[jour]["scores"]
    for ng in Ngrams:
        score = -1
        if ng not in t_scores:
            score = 0
        else:
            score = t_scores[ng]
        info.append(score)
    finaldata.append(info)

FinalArray = {
    "data":finaldata,
    "labels":Ngrams,
    "dates_tweets":Date_vs_Tweets,
    "raw" : data
}


pprint.pprint( FinalArray )
