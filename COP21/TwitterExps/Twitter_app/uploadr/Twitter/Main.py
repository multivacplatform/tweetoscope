
import tweepy
import datetime
import pprint
import json


class TwitterClass:

	def __init__(self , user ):
		self.Users = [
			{ 
				"consumer_key" : "CZsvGNaGsyiXeL1erQXczkQnC",
				"consumer_secret" : "I0Yi1BhT7G2nSYKOiUBO7ZVHT77t8zMuTPI6nFphK3xd2aMIEt",
				"access_token" : "65937227-PNoRKZQbUphsgB6mD0fVUYdehNWn509FRmZ09kevB",
				"access_token_secret" : "sYRcmjuLdlblJGJZp1ihGj6kj7W8G2RBx3bdHn48CDHxW",
			},
			{
				"consumer_key" : "kY7vbFP0cxCrN2KgR1DSEQ",
				"consumer_secret" : "pxElptfYcgnQOu2rOMbMonrTvIRy2VtB9t230zDHY",
				"access_token" : "635648101-SBaaDYx3EwKA3udPDhhPF74rDOz8EmwVt9Y2eeRA",
				"access_token_secret" : "dUVrpMnumFBrUgVKyH17l7rJu3GffEOBU6dJfHaRI",
			}
		]
		self.Tweets = {}

	def getRateLimitStatus_internal(self , user , item):
		auth = tweepy.OAuthHandler( self.Users[user]["consumer_key"], self.Users[user]["consumer_secret"] )  
		auth.set_access_token( self.Users[user]["access_token"], self.Users[user]["access_token_secret"] ) 
		api = tweepy.API(auth)
		results = api.rate_limit_status()
		if item=="all":
			results.pop("rate_limit_context")
			return [ api , results["resources"] ]
		else:
			return [ api , results["resources"][item] ]


	def getRateLimitStatus_global(self , user , item):
		auth = tweepy.OAuthHandler( self.Users[user]["consumer_key"], self.Users[user]["consumer_secret"] )  
		auth.set_access_token( self.Users[user]["access_token"], self.Users[user]["access_token_secret"] ) 
		api = tweepy.API(auth)
		results = api.rate_limit_status()
		if item=="all":
			results.pop("rate_limit_context")
			return results["resources"]
		else:
			return results["resources"][item]


	def getAPI(self):
		final_u = -1
		remaining_raw = []
		for i in range(len(self.Users)):
			remaining_raw = self.getRateLimitStatus_internal( i , "search")
			remaining = int(remaining_raw[1]["/search/tweets"]["remaining"])
			if remaining>10:
				final_u = i
				break
		return {
			"user": final_u,
			"api": remaining_raw[0],
			"remaining":int(remaining_raw[1]["/search/tweets"]["remaining"])
		}

	def Query(self , Query):
		Results = []
		OrientedQuery = Query
		if len(Query.split(" "))==1:
			OrientedQuery = OrientedQuery+" climate"
		API_instance = self.getAPI()
		for tweet in tweepy.Cursor( API_instance["api"].search, q=OrientedQuery, rpp=100, result_type="popular", include_entities=True, lang="en").items():
			if Query not in self.Tweets:
				self.Tweets[Query] = {}
			self.Tweets[Query][tweet.id] = {
				"query":Query,
				"id":tweet.id,
				"created_at":tweet.created_at.isoformat()+"Z",
				"author": {
					"profile_image_url": tweet.author.profile_image_url,
					"id" : tweet.author.id,
					"lang" : tweet.author.lang,
					"screen_name" : tweet.author.screen_name,
					"name" : tweet.author.name,
					"time_zone" : tweet.author.time_zone,
					"favourites_count" : tweet.author.favourites_count,
					"friends_count" : tweet.author.friends_count,
					"statuses_count" : tweet.author.statuses_count,
					"followers_count" : tweet.author.followers_count,
					"profile_image_url" : tweet.author.profile_image_url,
					"listed_count" : tweet.author.listed_count
				},
				"text" : tweet.text.encode('utf-8'),
				"retweet_count":tweet.retweet_count,
				"favorite_count":tweet.favorite_count
			}

			print "u",API_instance["user"],":",API_instance["remaining"],"  ||  ",tweet.id,"--->",self.Tweets[Query][tweet.id]["query"]

			the_date = tweet.created_at
			# the_date = the_date.strftime('%Y-%m-%dT%H:%M:%S') 
			the_date = the_date.strftime('%Y-%m-%d') 
			# print the_date
			info = [
				the_date , tweet.retweet_count
			]
			Results.append(info)

		if len(Results) ==0:
			Results = self.Query_Normal(Query)
		
		FinalArray = {
			"name": Query,
			"data": Results
		}

		return FinalArray


	def Query_Normal(self , Query):
		Results = []
		OrientedQuery = Query
		API_instance = self.getAPI()
		for tweet in tweepy.Cursor( API_instance["api"].search, q=OrientedQuery, rpp=100, result_type="popular", include_entities=True, lang="en").items():
			if Query not in self.Tweets:
				self.Tweets[Query] = {}
			self.Tweets[Query][tweet.id] = {
				"query":Query,
				"id":tweet.id,
				"created_at":tweet.created_at.isoformat()+"Z",
				"author": {
					"profile_image_url": tweet.author.profile_image_url,
					"id" : tweet.author.id,
					"lang" : tweet.author.lang,
					"screen_name" : tweet.author.screen_name,
					"name" : tweet.author.name,
					"time_zone" : tweet.author.time_zone,
					"favourites_count" : tweet.author.favourites_count,
					"friends_count" : tweet.author.friends_count,
					"statuses_count" : tweet.author.statuses_count,
					"followers_count" : tweet.author.followers_count,
					"profile_image_url" : tweet.author.profile_image_url,
					"listed_count" : tweet.author.listed_count
				},
				"text" : tweet.text.encode('utf-8'),
				"retweet_count":tweet.retweet_count,
				"favorite_count":tweet.favorite_count
			}
			the_date = tweet.created_at
			# the_date = the_date.strftime('%Y-%m-%dT%H:%M:%S') 
			the_date = the_date.strftime('%Y-%m-%d') 
			# print the_date
			info = [
				the_date , tweet.retweet_count
			]
			Results.append(info)

		return Results