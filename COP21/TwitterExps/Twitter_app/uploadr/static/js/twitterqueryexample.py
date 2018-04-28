import json
import pprint
import dateutil.parser


data = json.load(open("twitterqueryexample.json","r"))
pprint.pprint(data)


Ngrams = {}
Days_x_Tweets = {}
for i in data:
	tweet = data[i]
	dateiso = dateutil.parser.parse( tweet["created_at"] )
	jour = dateiso.strftime('%Y-%m-%d')

	if jour not in Days_x_Tweets:
		Days_x_Tweets[jour] = {
			"tweets":[]
		}
	Days_x_Tweets[jour]["tweets"].append( tweet["id"] )
	Ngrams[tweet["query"]] = True

Ngrams = Ngrams.keys()

DatesIndex = sorted(Days_x_Tweets.keys())
print
print
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
for jour in DatesIndex:
	info = []
	info.append(jour)
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
	"labels":Ngrams
}

pprint.pprint( FinalArray )