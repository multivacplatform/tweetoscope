
function makeMiniGraph(className , w , h , b , rawdata, isStacked) {
    $("#"+className).remove();
    $('<div id="'+className+'" style="width: 37%; height:6%; bottom: '+b+'%; position:absolute; left: 15%; right: 0; margin: 0 auto;" ></div>').insertBefore("#heatgraph")
    var demo = document.getElementById(className);
    var div = document.createElement('div');
    div.className = className+'_2';
    div.style.display = 'inline-block';
    div.style.margin = '4px';
    demo.appendChild(div);
    // rawdata.push( ["2015-03-01",Math.round(rawdata[0])] )
    // rawdata.pop()
    var the_data = rawdata.join("\n");

    g_mini = new Dygraph( div, the_data ,
        {
          width: w,
          height: h,
          showRoller: false,
          stackedGraph: true,
          displayAnnotations: false,
          highlightCircleSize: 1,
          strokeWidth: .7,
          strokeBorderWidth: isStacked ? null : .7,
          drawGrid:false,
          showLabelsOnHighlight:false,
          labelsKMB:false,
          labelsKMG2:false,
          labelsUTC:false,
          drawAxis:false
        }
    );
}

function makeGraph(className, the_title, labels, rawdata, isStacked) {
    console.warn('className for demo', className)
    var demo = document.getElementById(className);
    var div = document.createElement('div');
    $("#"+className).html("")
    div.className = className;
    div.style.display = 'inline-block';
    div.style.margin = '4px';
    demo.appendChild(div);
    var the_data = rawdata.join("\n");

    var ngrams_chart_W = $("#rightish").width()*0.8;
    var ngrams_chart_H = $("#rightish").height()*0.2;

    g = new Dygraph( div, the_data ,
        {
          width: ngrams_chart_W,
          height: ngrams_chart_H,
          // rollPeriod: 7,
          // errorBars: true,
          title: the_title,
          titleHeight: 20,
          labels: labels.slice(),
          stackedGraph: false,
          animatedZooms: true,

          highlightCircleSize: 2,
          strokeWidth: 1,
          strokeBorderWidth: isStacked ? null : 1,

          highlightSeriesOpts: {
            strokeWidth: 3,
            strokeBorderWidth: 1,
            highlightCircleSize: 5
          },
          showRangeSelector: false,
          showInRangeSelector: false,

          // clickCallback: function(e, x, pts) {
          //   console.log( "Click: " + pts_info(e,x,pts));
          // },

          pointClickCallback: function(e, p) {
            console.log( "Point Click: " + p.name + ": " + p.yval_stacked );
            console.log(p)
          },

          // zoomCallback: function(minX, maxX, yRanges) {
          //   console.log( "Zoom: [" + minX + ", " + maxX + ", [" + yRanges + "]]");
          // },

          // drawCallback: function(g) {
          //   console.log( "Draw: [" + g.xAxisRange() + "]");
          // }
        }
    );

    // g.setSelection(false, 's005');
    //console.log(g);
}

function updateGraph( startTime , endTime ) {

    console.log( "\ttimediff: "+(endTime - startTime)+"ms" )
    console.log( "" )
    // this is a draaaag, swaaaag
    if ( (endTime - startTime) >= 120) {
        if( g.dateWindow_ == null ) {
            var petitbuffer = []
            for(var i in g.rawData_)
                petitbuffer.push( i )
            var stringbuff = petitbuffer.join(",")
            // +(g.rawData_.length-1)
            if(CurrentValue==false || CurrentValue!=stringbuff ) {
                CurrentValue = stringbuff
                console.log("Applying this timerange:")
                console.log("["+stringbuff+"]")
                var tweet_ids = []
                for(var i in petitbuffer) {
                  tweet_ids = TweetsData[petitbuffer[i]].concat(tweet_ids)
                }
                Final_UpdateTable( tweet_ids )
            }
        } else {
            // console.log("there is a range going on: "+g.dateWindow_)
            var petitbuffer = []
            var Min = g.dateWindow_[0] , Max = g.dateWindow_[1];
            for(var i in g.rawData_) {
                if ( g.rawData_[i][0]>=Min && g.rawData_[i][0]<=Max ) {
                    petitbuffer.push( i )
                }
            }
            stringbuff = petitbuffer.join(",")
            if(CurrentValue==false || CurrentValue!=stringbuff ) {
                CurrentValue = stringbuff
                console.log("Applying this timerange:")
                console.log("["+stringbuff+"]")
                var tweet_ids = []
                for(var i in petitbuffer) {
                  tweet_ids = TweetsData[petitbuffer[i]].concat(tweet_ids)
                }
                Final_UpdateTable( tweet_ids )
            }
            // console.log( g.rawData_ )
        }
    }
}


function clickInsideTweet(e, tweetSrcUrl) {
    console.log('>>>>> event target tag', e.target.tag)
    console.log("event")
    console.log(e)
    var tgt = e.target
    // if (tgt.tagName.toLowerCase() == "a")
    //     window.open(tgt.href, "Link in tweet")
    // else
    //     window.open(tweetSrcUrl, "Source Tweet")
}


function RenderTweet( tweet) {

    // var image_normal = "newinterface/twitter_avatar.png";
    var image_normal = "https://avatars.io/twitter/"+tweet["author"]["screen_name"];
    var image_bigger = "";
    if( tweet["author"]["profile_image_url"] ) {
        image_normal = tweet["author"]["profile_image_url"]
        image_bigger = tweet["author"]["profile_image_url"].replace("_normal","_bigger")
    }
    var html = ""
    html += '\t\t'+ '<blockquote onclick="clickInsideTweet(event, \''+tweet["tweet_url"]+'\')" class="Tweet h-entry tweet subject expanded" cite="'+tweet["tweet_url"]+'" data-tweet-id="'+tweet["id_s"]+'" data-scribe="section:subject">' + '\n';

    html += '\t\t\t'+ '<div class="Tweet-header u-cf">' + '\n';

    html += '\t\t\t\t'+ '<div class="Tweet-brand u-floatRight">' + '\n';

    html += '\t\t\t\t'+ '<span class="Tweet-metadata dateline">' + '\n';
    html += '\t\t\t\t\t'+ '<a target="_blank" class="u-linkBlend u-url customisable-highlight long-permalink" data-datetime="2012-12-03T18:51:11+000" data-scribe="element:full_timestamp" href="'+tweet["tweet_url"]+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '<time class="dt-updated" datetime="2012-12-03T18:51:11+0000" title="Time posted: 03 Dec 2012, 18:51:11 (UTC)">'+tweet["date"]+'</time>' + '\n';
    html += '\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t'+ '</span>' + '\n';

    html += '\t\t\t\t\t'+ '<span class="u-hiddenInWideEnv">' + '\n';
    html += '\t\t\t\t\t\t'+ '<a target="_blank" href="'+tweet["tweet_url"]+'" data-scribe="element:logo">' + '\n';
    html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--twitter " aria-label="" title="" role="presentation"></div>' + '\n';
    html += '\t\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t\t'+ '</span>' + '\n';
    html += '\t\t\t\t'+ '</div>' + '\n';

    html += '\t\t\t\t'+ '<div class="Tweet-author u-textTruncate h-card p-author" data-scribe="component:author">' + '\n';
    html += '\t\t\t\t\t'+ '<a target="_blank" class="Tweet-authorLink Identity u-linkBlend" data-scribe="element:user_link" href="'+tweet["author"]["url"]+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorAvatar Identity-avatar">' + '\n';
    html += '\t\t\t\t\t\t\t'+ '<img class="Avatar u-photo" data-scribe="element:avatar" data-src-2x="'+image_bigger+'" src="'+image_normal+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '</span>' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorName Identity-name p-name customisable-highlight" data-scribe="element:name">'+tweet["author"]["name"]+'</span>' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorScreenName Identity-screenName p-nickname" data-scribe="element:screen_name">@'+tweet["author"]["screen_name"]+'</span>' + '\n';

    html += '\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t'+ '</div>' + '\n';
    html += '\t\t\t'+ '</div>' + '\n';

    html += '\t\t\t'+ '<div class="Tweet-body e-entry-content" data-scribe="component:tweet">' + '\n';

    html += '\t\t\t\t'+ '<p class="Tweet-text e-entry-title" lang="en" dir="ltr">' + tweet["text"] + '</p>' + '\n';

    if( !isUndef(tweet["retweet_count"]) || !isUndef(tweet["favorite_count"])  ) {
        html += '\t\t\t\t'+ '<ul class="Tweet-actions" data-scribe="component:actions" role="menu" aria-label="Tweet actions">' + '\n';
        if(tweet_links) {
            html += '\t\t\t\t\t'+ '<li class="Tweet-action">' + '\n';
            html += '\t\t\t\t\t\t'+ '<a target="_blank" class="TweetAction TweetAction--reply web-intent" href="https://twitter.com/intent/tweet?in_reply_to='+tweet["id_s"]+""+'" data-scribe="element:reply">' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--reply TweetAction-icon" aria-label="Reply" title="Reply" role="img"></div>' + '\n';
            html += '\t\t\t\t\t\t'+ '</a>' + '\n';
            html += '\t\t\t\t\t'+ '</li>' + '\n';
        }

        if(!isUndef(tweet["retweet_count"])) {
            html += '\t\t\t\t\t'+ '<li class="Tweet-action">' + '\n';
            html += '\t\t\t\t\t\t'+ '<a target="_blank" class="TweetAction TweetAction--retweet web-intent" href="https://twitter.com/intent/retweet?tweet_id='+tweet["id_s"]+'" data-scribe="element:retweet">' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--retweet TweetAction-icon" aria-label="Retweet" title="Retweet" role="img"></div>' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<span class="TweetAction-stat" data-scribe="element:retweet_count" aria-hidden="true">'+tweet["retweet_count"]+'</span>' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<span class="u-hiddenVisually">'+tweet["retweet_count"]+' Retweets</span>' + '\n';
            html += '\t\t\t\t\t\t'+ '</a>' + '\n';
            html += '\t\t\t\t\t'+ '</li>' + '\n';
        }

        if(!isUndef(tweet["favorite_count"])) {
            html += '\t\t\t\t\t'+ '<li class="Tweet-action">' + '\n';
            html += '\t\t\t\t\t\t'+ '<a target="_blank" class="TweetAction TweetAction--favorite web-intent" href="https://twitter.com/intent/favorite?tweet_id='+tweet["id_s"]+'" data-scribe="element:favorite">' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--favorite TweetAction-icon" aria-label="Favorite" title="Favorite" role="img"></div>' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<span class="TweetAction-stat" data-scribe="element:favorite_count" aria-hidden="true">'+tweet["favorite_count"]+'</span>' + '\n';
            html += '\t\t\t\t\t\t\t'+ '<span class="u-hiddenVisually">'+tweet["favorite_count"]+' favorites</span>' + '\n';
            html += '\t\t\t\t\t\t'+ '</a>' + '\n';
            html += '\t\t\t\t\t'+ '</li>' + '\n';
        }

        html += '\t\t\t\t'+ '</ul>' + '\n';
    }


    html += '\t\t\t'+ '</div>' + '\n';


    html += '\t\t'+ '</blockquote>' + '\n';
    // html += '\t\t'+ '<br>' + '\n';


    return html;
}

function RenderTweets_MultiLineChart( div_name , title, labels , data_data , flag ) {

    makeGraph(div_name, title , labels, data_data, flag);

    // Fill the Buffer!:
    var petitbuffer = []
    for(var i in g.rawData_)
        petitbuffer.push( i )
    CurrentValue = petitbuffer.join(",")


    // IT WORKED :D
    $(".dygraph-rangesel-fgcanvas")
        .mousedown(function() {
        startTime = new Date().getTime();
    });

    $('#'+div_name)
        .mousedown(function() {
            startTime = new Date().getTime();
            console.log("status: DRAGGED");
        })
        .mouseup(function() {
            endTime = new Date().getTime();
            console.log("status: dropped");
            updateGraph ( startTime , endTime );
        });
}

function RenderTweets_Table ( data_raw , Formatted_Tweets , data_dates_tweets ) {
    console.log('the formatted tweets', Formatted_Tweets)

    for(var ID in Formatted_Tweets)
        Formatted_Tweets[ID] = RenderTweet( Formatted_Tweets[ID])

    var div_table=""
    $("#tweets-table").html("")
    $("#tweets-table").empty();

        div_table += '<div class="EmbeddedTweet twitter-tweet" data-iframe-title="Twitter Tweet" id="twitter-widget-0" lang="en" data-twitter-event-id="0" >' + '\n';
        div_table += '\t'+ '<div class="EmbeddedTweet-tweet">' + '\n';

        div_table += '<table id="my-ajax-table" class="table table-bordered">'+"\n"
        div_table += "\t"+'<thead>'+"\n"
        // div_table += "\t"+"\t"+'<th width="150px;" data-dynatable-column="date">Date</th>'+"\n"
        div_table += "\t"+"\t"+'<th width="100px;"  data-dynatable-column="tweet">Tweets</th>'+"\n"
        div_table += "\t"+"\t"+'</th>'+"\n"
        div_table += "\t"+'</thead>'+"\n"
        div_table += "\t"+'<tbody>'+"\n"
        div_table += "\t"+'</tbody>'+"\n"
        div_table += '</table>'+"\n"

        div_table += '\t'+'</div>' + '\n';
        div_table += '</div>' + '\n';

    $("#tweets-table").html(div_table)


    TweetsData = data_dates_tweets;

    // [ Formatting ajax-data for Dynatable ]
    var Data = {
        "records": []
    }
    var count=0;
    for(var tweetID in data_raw) {
      var ID = Number(tweetID)
      var orig_id = ID
      var arr_id = count
      RecDict[orig_id] = arr_id;
      var tweet = data_raw[tweetID]
      var tweet_txt = (!isUndef(Formatted_Tweets[ID]))?Formatted_Tweets[ID]:Formatted_Tweets[tweetID];
      var info = {
        "date": tweet.created_at,
        "tweet": tweet_txt,
        "del" : false,
      }
      Data["records"].push(info)
      count++;
      if(count==max_tweets)
        break
    }
    // [ / Formatting ajax-data for Dynatable ]

    AjaxRecords = Data["records"]; // backup-ing in global variable!

    MyTable = []
    MyTable = $('#my-ajax-table').dynatable({
              dataset: {
                records: Data["records"]
              },
              features: {
                paginate: false,
                recordCount: false,
                pushState: false,
                search: false,
                perPageSelect: false,
                // sort: false //i need to fix the sorting function... the current one just sucks
              },
              // writers: {
              //   _rowWriter: ulWriter
              //   // _cellWriter: customCellWriter
              // }
            });


    MyTable.data('dynatable').sorts.clear();
    MyTable.data('dynatable').sorts.add('date', 0) // 1=ASCENDING,
    MyTable.data('dynatable').process();
    MyTable.data('dynatable').paginationPerPage.set(5);
    MyTable.data('dynatable').paginationPage.set(1);
    MyTable.data('dynatable').process();


    $(".dynatable-head").hide()
    if ( $(".imadiv").length>0 )
        return false;

    // $('<br><br><div class="imadiv"></div>').insertAfter(".dynatable-per-page")
   if($(".dynatable-record-count").length>0) {
   $('<div class="imadiv"></div><br>').insertBefore("#my-ajax-table")
    $(".dynatable-record-count").insertAfter(".imadiv")
    $("<br>").insertBefore(".dynatable-record-count")
    $(".dynatable-pagination-links").insertAfter(".imadiv")
   }
}



// Format the x-api-data
function ISCPIF_API_Twitter(URLAPI , the_query , args) {
    console.log(" = = = = = = = = = = = = = =")
    console.log("ISCPIF API c'est parti!...")
    console.log(args)
    console.log(args["q"])
    console.log("from: "+args["since"])
    console.log("until: "+args["until"] )
    console.log(" = = = = = = = = = = = = = =")
    var loading_image = '<img src="newinterface/loader_horizontal.gif"></img>'
    $("#tweets-table").html('<center>'+loading_image+'</center>')
    $("#many").html("")
    $("#results_tweets").html("")
    $.ajax({
        type: 'GET',
        url: URLAPI,
        data: args,
        // dataType: 'jsonp',
        dataType: 'json',
        success : function(data){
            console.log("the_data:")
            console.log(data)
            console.log("ISCPIF API c'est FINI!...")
            if(data.total==0) {
                $("#tweets-table").html(D["#tweets-table"]["res"][LA])
                $("#many").html("")
                return;
            }
            var Formatted_Tweets = ISCPIF_API_Twitter__format ( data );
            RenderTweets_Table ( Formatted_Tweets , Formatted_Tweets , false )
            var the_total = -1
            if( args["q"][0]=="global warming" ) {
              if($("#range_09").length==0 || $("#range_09").data("ionRangeSlider").options.grid==false) {
                the_total = Frecs.timesteps_docfreq.reduce(function(a, b){return a+b;})
              } else {
                the_total = Frecs.timesteps_docfreq[$("#range_09").data("ionRangeSlider").options.from]
              }
            } else {
              the_total = data.total
            }
            console.log(data) // k = get total
            var first_elem = humanize.date( 'M d' , new Date(args["since"]))
            var last_elem = humanize.date( 'M d' , new Date(args["until"]))
            the_total = humanize.numberFormat( the_total , 0 , "." , ".")
            $("#tweets-header").html("<center> "+D["#tweets-table"]["since"][LA]+" "+first_elem + " "+D["#tweets-table"]["until"][LA]+" " + last_elem+'<div id="results_tweets"><strong>'+the_total+" tweets</strong></div></center>" )

            // $.doTimeout(30,function () {
            //   var the_data = Tweets_Dates__Distribution( Frecs.nodes , Frecs.timesteps )
            //   makeGraph("many", "Evolution du nombre total de Tweets collectés" ,["Date" , "#Tweets"] , the_data, false);
            // });

            var LineNames = []
            var x_Frequencies = []
            var ChartTitle = ""

            var current_sels = Object.keys(selections);
            // No active selection, then:
            if(current_sels.length==0) {
                LineNames = ["#Tweets"]
                x_Frequencies = Tweets_Dates__Distribution( Frecs.nodes , Frecs.timesteps )
                ChartTitle = D["#tweets-table"]["title_global"][LA]
            } else { // Else, active selection, so:
                for(var i in Frecs.timesteps) {
                    x_Frequencies.push( [Frecs.timesteps[i]] )
                }
                for(var node_id in selections) {
                    var node_label = Nodes[node_id].label_en
                    if(Frecs.nodes[node_label]) {
                        LineNames.push(Nodes[node_id].label)
                        for(var i in Frecs.nodes[node_label]) {
                            var freqj_nodei = Frecs.nodes[node_label][i]
                            x_Frequencies[i].push( freqj_nodei )
                        }
                    }
                }
                ChartTitle = D["#tweets-table"]["title_local"][LA]
            }
            LineNames.unshift("Date")
            RenderTweets_MultiLineChart ( "many" , ChartTitle ,LineNames , x_Frequencies , true )

        },
        error: function(){
            console.log('Page Not found: ajax in ISCPIF_API_Twitter()');
            // console.log()
        }
    });

}

var test_obj = {}

// What to do after receiving the ISCPIF_API_Twitter.data
function ISCPIF_API_Twitter__format( the_data_ ) {

    var Formatted_Tweets = {}
    var temp_dateXtweet = []
    for(var i in the_data_.hits.hits) {
        temp_dateXtweet.push( [Number(i) , ""+the_data_.hits.hits[i]._source["ca"]] )
    }

    var sorted_dateXtweet = temp_dateXtweet.sort(function(a,b) {
      return a[1] > b[1];
    });

    var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    for(var i in sorted_dateXtweet) {
        if( !isUndef(sorted_dateXtweet[i]) ) {
            var raw_tweet = the_data_.hits.hits[sorted_dateXtweet[i][0]]

	    // debug
            console.log('the raw tweet@ISCPIF_API_Twitter__format()', raw_tweet)
            test_obj = raw_tweet


            var screen_name = raw_tweet._source.usr.snm
            var tweetID = ""+raw_tweet._source["id"]
            var user_realname = raw_tweet._source.usr.unm

            var raw_date = new Date(raw_tweet._source.ca)
            var formatted_date = raw_date.toLocaleDateString('en-us', {'year':'numeric', 'month':'short','day':'numeric'})
            // var formatted_time // TODO


            var text = ""
            if(tweet_links)
                text = raw_tweet._source.tx.split("\n").join(" ").replace(replacePattern,'<a href="$1" target="_blank">$1</a>')
            else
                text = raw_tweet._source.tx.split("\n").join(" ").replace(replacePattern,"")

            var info = {
                "id": ""+tweetID,
                "id_s": ""+tweetID,
                "date": formatted_date,
                "text": text,
                "author": {
                    // "profile_image_url":"http://www.asdf_normal.jpg",//tweet.author.profile_image_url,
                    "screen_name": screen_name,
                    "lang": "eng",
                    "url": 'http://twitter.com/'+screen_name,
                    "name": user_realname,
                },
                "tweet_url": 'http://twitter.com/'+screen_name+'/status/'+tweetID,
            }
            Formatted_Tweets[""+tweetID] = info
        }
    }
    return Formatted_Tweets;

}


function log_(the__query) {
    var fichier=""
    if(window.location.href.indexOf("desktop")>-1)
        fichier=",desktop"
    var ggg = '&g="'+gg+"__"+window.location.host+fichier+'"';
    // the__query.unshift( ""+fff )
    var lg_url = main_url+"TwitterPlugin/bridgeClientServer_.php?motscles="+JSON.stringify(the__query)+ggg
    $.get( lg_url, function( data ) {
      console.log(data)
    });
}



function MainTwitterApp(the_query ) {

    if( gg=="gg" || (the_query[0]=="global warming" || the_query[1]=="global warming")) {
        console.log("")
    } else {
        log_( the_query.slice() )
    }

    var twitterAPI_url = "https://api.iscpif.fr/1/climate/search/tweets/articles.json"
    var current_elem = Frecs.timesteps.length-1;
    for(var i in Frecs.timesteps) {
        if(Frecs.timesteps[i]==$(".irs-single").html()) {
            current_elem=i
            break
        }
    }
    var first_elem = ($('#myonoffswitch1').is(':checked') && $("#range_09").data("ionRangeSlider").options.grid )? Frecs.timesteps[current_elem-1] : Frecs.timesteps[0];
    var last_elem = Frecs.timesteps[current_elem];

    var args = {
        "q": the_query,
        "since": first_elem+"T00:00:00.000Z",
        "until": last_elem+"T00:00:00.000Z",
        "count": max_tweets
    }
    // query old way
    // ISCPIF_API_Twitter( twitterAPI_url , the_query , args  )

    // query via php intermediate url
    localAPIProxy_url = APINAME + "relay_api_calls.php"
    args['func']='tweets_proxy'
    ISCPIF_API_Twitter( localAPIProxy_url , the_query , args  )
}




// Ajax for the json's
//   DOES:
//    Calc_Freqs__action( data1 , data2 )
//    MainTwitterApp( ["global warming"]  )
function Calc_Freqs() {
    var data1;
    var data2;
    var mazi = main_url+"ajax_sample/Climate_Change_Weekly.json"
    var wos_json = main_url+"ajax_sample/Climate_Change_WoS.json"
    $.when(
        $.ajax({
            type: "GET",
            url: mazi,
            // cache:false,
            // contentType: "application/json",
            dataType: "json",
            success : function(data, textStatus, jqXHR) {
                data1 = data
            },

            error: function(exception) {
                console.log("exception!:"+exception.status)
                console.log(exception)
            }

        }),

        $.ajax({
            type: "GET",
            url: wos_json,
            // cache:false,
            // contentType: "application/json",
            dataType: "json",
            success : function(data, textStatus, jqXHR) {
                data2 = data
            },

            error: function(exception) {
                console.log("exception!:"+exception.status)
            }
        })
    ).then(function() {

        Calc_Freqs__action( data1 , data2 )
        MainTwitterApp( ["global warming"] )
        $("#myonoffswitch1").css( "opacity" , 1 )
        $("#myonoffswitch1").prop( "disabled" , false )

    });
}

function Calc_Freqs__action(weekly_data , WoS_data) {

    console.clear()
    wos_data = jQuery.extend(true, {}, WoS_data);

    var MinW=1000000
    var MaxW=-1;
    for(var i in wos_data) {
        var occ = wos_data[i];
        if(occ>0) {
            if (occ<MinW) MinW = occ;
            if (occ>MaxW) MaxW = occ;
        }
        wos_data[i] = [occ]
    }


    // 02.-  Normalizing WoS-frecuencies and re-write them in wos_data{}
    for(var i in wos_data) {
        var norm_occ = Number((wos_data[i]/MaxW));
        wos_data[i].push( norm_occ )
    }


    var data = weekly_data;
    var Da_Dates = []
    for(var i in data.aggregations.weekly.buckets){
      if( data.aggregations.weekly.buckets[i].keywords.buckets.length>0 ) {
        Da_Dates.push( data.aggregations.weekly.buckets[i] )
      }
    }
    console.log(Da_Dates)

    var nb_dates = Da_Dates.length;
    var nodes_freq = {}
    var nodes_freq_log = {}
    var timesteps = []
    var timesteps_count = []

    for(var d in Da_Dates) {
        var timestep_i = Da_Dates[d].key_as_string.split("T")[0]
        timesteps.push( timestep_i )
        timesteps_count.push( Da_Dates[d].doc_count )
        var keywords = Da_Dates[d].keywords.buckets;
        for(var k in keywords) {
            var keyw = keywords[k].key.toLowerCase()
            if( Label2ID[keyw] ) {
                nodes_freq[keyw] = [];
                nodes_freq_log[keyw] = [];
            }
        }
    }
    timesteps.shift();
    var date = new Date( timesteps[timesteps.length-1] );
    console.log("DATE:")
    console.log(timesteps)
    console.log(date)
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 7);
    var iplusone_date = new Date(newdate).toISOString().substring(0, 10);
    timesteps.push( iplusone_date )
    console.log( "timesteps:" )
    console.log( timesteps )

    for(var n in nodes_freq) {
        for(var i=0 ; i<nb_dates ; i++) {
            nodes_freq[n].push(0)
            nodes_freq_log[n].push(0)
        }
    }


    for(var i in Da_Dates) {
        // // Da_Dates[i].doc_count
        // Da_Dates[i].key_as_string
        var keywords = Da_Dates[i].keywords.buckets;
        for(var k in keywords) {
            var keyw = keywords[k].key.toLowerCase()
            if( Label2ID[ keyw ] ) {
                // console.log( "\t" +  keywords[k].doc_count + "\t-> "+ keywords[k].key)
                nodes_freq[ keyw ][i] = keywords[k].doc_count;
                nodes_freq_log[ keyw ][i] = Number( Math.log10(keywords[k].doc_count).toFixed(4) );
                log_dict[nodes_freq_log[ keyw ][i]] = true;
            }
        }
        // console.log(" - - - - - - - -- - - - -")
    }

    // for(var i in nodes_freq)
    //     console.log(nodes_freq[i])

    for(var i in log_dict)
        log_avg += Number(i);

    log_avg = log_avg / Object.keys(log_dict).length

    Frecs = {
        "nodes": nodes_freq,
        "nodes_logfreqs": nodes_freq_log,
        "nodes_proportionals": {},
        "nodes_wos": wos_data,
        "nodes_wos__minmax" : [ MinW , MaxW ],
        "timesteps": timesteps,
        "timesteps_docfreq": timesteps_count
    }
    console.log(Frecs)
}


Calc_Freqs()
