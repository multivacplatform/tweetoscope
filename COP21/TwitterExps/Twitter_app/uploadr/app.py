from flask import Flask, request, redirect, url_for, render_template , current_app, jsonify
import os
import time
import simplejson as json
import glob
from uuid import uuid4
import datetime
import pprint
import time
import dateutil.parser
import base64

app = Flask(__name__)

app.TWJSrealmainpath = "/home/pksm3/www"
app.TWJSlocalpath = "/i7/CNRS/"
app.TWJSdata = "data/cnrsfolder"
app.serverpath = "http://localhost"

# app.TWJSrealmainpath = "/var/www"
# app.TWJSlocalpath = "/CNRSdemo/"
# app.TWJSdata = "data/cnrsfolder"
# app.serverpath = "http://tina.iscpif.fr"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dygraph_exp")
def dygraph_index():
    return render_template("dygraph_exp.html")


@app.route("/dynatable/")
def dynatable_index():
    return render_template("dynatable.html")


# @app.route("/twitterquery_chartkick" , methods=["POST"])
# def scan_chartkick():
#     results = []
#     queries = [
#         "greece",
#         "grexit"
#     ]


#     form = request.form
#     is_ajax = False
#     if form.get("__ajax", None) == "true":
#         is_ajax = True

#     queries = json.loads(form["queries"])

#     from Twitter.Main import TwitterClass
#     twitter = TwitterClass(-1)
#     results = []
#     for q in queries:
#         try:
#             result = twitter.Query(q)
#         except:
#             time.sleep(1)
#             result = twitter.Query(q)

#         if len(result["data"])>0:
#             results.append(result)

#     # # pprint.pprint( results )
#     # json.dump(twitter.Tweets, open("twitterqueryexample_full.json",'w'))

#     return json.dumps(results)

@app.route("/myAPIstatus/<int:user>/<item>")
def getAPIstatus( user , item ):
    results = ["hola" , "mundo"]

    from Twitter.Main import TwitterClass
    twitter = TwitterClass( user )
    results = twitter.getRateLimitStatus_global( user ,str(item) )

    return jsonify(results)


@app.route("/clicks")
def clicks():
    return json.dumps(["ok"])

@app.route("/app_log_clicks")
def app_log_clicks():
    results = ["iscpif"]
    command_for_sample = 'cat nohup.out | grep "GET /clicks"'
    reload_buffer = []
    import subprocess
    import urllib
    output = subprocess.check_output(command_for_sample, shell=True)
    for i in output.split("\n"):
        result = ""
        line = i.replace("\n","")
        cleaned_line = line.replace(' HTTP/1.1" 200 -' , "").replace('"GET /clicks?motscles=',"").replace('127.0.0.1 - - ',"")
        result = urllib.unquote_plus(cleaned_line)

        raw = result.split("&g=")
        if len(raw)>1:
            to_digest = raw[1].replace('"','')
            raw2 = to_digest.split("__")
            if len(raw2)>1:
                to_digest2 = raw2[0]
                raw3 = to_digest2.split("_")
                coords = raw3[0]
                coords_url = "https://www.google.fr/search?q="+coords
                result = result.replace( coords , '<a target="_blank" href="'+coords_url+'">geo('+coords+')</a>' )
                if len(raw3)>1:
                    ip = raw3[1]
                    ip_url = "http://www.ip-adress.com/whois/"+ip
                    result = result.replace( ip , '   _<a target="_blank" href="'+ip_url+'">ip('+ip+')</a>' )
    
        results.append( result )
    results.reverse()
    # return json.dumps(results)
    return "<br>".join(results)

# # http://localhost:2020/twitterquery_dygraph?motscles=[%22climate%20change%22,%22cop21%22]
# @app.route("/twitterquery_dygraph")
@app.route("/twitterquery_dygraph")
def scan_dygraph():
    results = []
    queries = [
        "greece",
        "france"
    ]
    FinalArray = {}

    queries = json.loads(request.args['motscles'])
    original_query = queries[:]

    directory = "../../tweets_buffer/"+time.strftime("%Y-%m-%d")
    if not os.path.exists(directory):
        os.makedirs(directory)
    for i in range(len(queries)):
        q = queries[i]
        queryfile = base64.urlsafe_b64encode(q)
        if os.path.isfile( directory+"/"+queryfile+".json" ):
            queries[i] = False
    # Ngram = True, then retrieve tweets from twitter!

    from Twitter.Main import TwitterClass
    twitter = TwitterClass( -1 )
    for i in range(len(queries)):
        q = queries[i]
        if q!=False:
            try:
                twitter.Query(q)
            except:
                time.sleep(1)
                twitter.Query(q)

    if len(twitter.Tweets.keys())>0:
        for q in twitter.Tweets:
            if len( twitter.Tweets[q].keys() )>0:
                json.dump(twitter.Tweets[q], open(directory+"/"+base64.urlsafe_b64encode(q)+".json",'w'))



    for q in original_query:
        queryfile = base64.urlsafe_b64encode(q)
        if q not in twitter.Tweets:
            if  os.path.isfile( directory+"/"+queryfile+".json" ):
                print "previous query already done:",q,(directory+"/"+queryfile+".json")
                with open((directory+"/"+queryfile+".json")) as data_file:
                    twitter.Tweets[q] = json.load(data_file)
        else:
            print "file doesn't exist:",q,(directory+"/"+queryfile+".json")

    data = {}
    for q in twitter.Tweets:
        for t in twitter.Tweets[q]:
            if t not in data:
                data[str(t)] = {}
            data[str(t)] = twitter.Tweets[q][t]

    json.dump(data, open("lalala.json",'w'))
    # for t in data:
    #     print t,"--->",data[t]["query"]


    Ngrams = {}
    Days_x_Tweets = {}
    for i in data:
        # print i
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
            tweet = data[str(t)]
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

    return json.dumps(FinalArray)
    # return json.dumps(results)


def ajax_response(status, msg):
    status_code = "ok" if status else "error"
    return json.dumps(dict(
        status=status_code,
        msg=msg,
    ))
