var getUrlParam = (function () {
    var get = {
        push:function (key,value){
            var cur = this[key];
            if (cur.isArray){
                this[key].push(value);
            }else {
                this[key] = [];
                this[key].push(cur);
                this[key].push(value);
            }
        }
    },
    search = document.location.search,
    decode = function (s,boo) {
        var a = decodeURIComponent(s.split("+").join(" "));
        return boo? a.replace(/\s+/g,''):a;
    };
    search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function (a,b,c) {
        if (get[decode(b,true)]){
            get.push(decode(b,true),decode(c));
        }else {
            get[decode(b,true)] = decode(c);
        }
    });
    return get;
})();

var startTime = false;
var endTime = false;
var g;

var CurrentValue = false

var TweetsData = {}
var TweetsRaw = {}

var dataq = JSON.parse(getUrlParam.motscles)
console.log(dataq)
console.log(" - - -")










function makeGraph(className, labels, rawdata, isStacked) {
    var demo = document.getElementById('demo');
    var div = document.createElement('div');
    div.className = className;
    div.style.display = 'inline-block';
    div.style.margin = '4px';
    demo.appendChild(div);

    var the_data = rawdata.join("\n");

    console.log( "the labels:" )
    console.log( labels )
    console.log( " - - - - - - - -- - ")
    console.log( "the data:")
    console.log( the_data )
    console.log("*****")
    console.log("raw data:")
    console.log( rawdata )


    g = new Dygraph( div, the_data ,
        {
          width: 480,
          height: 320,
          labels: labels.slice(),
          stackedGraph: isStacked,

          highlightCircleSize: 2,
          strokeWidth: 1,
          strokeBorderWidth: isStacked ? null : 1,

          highlightSeriesOpts: {
            strokeWidth: 3,
            strokeBorderWidth: 1,
            highlightCircleSize: 5
          },
          showRangeSelector: true,
          showInRangeSelector: true,

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


function GetTweetsFrom( IDs ) {
    console.log(IDs)

    // $.ajax({
    //     // type: 'POST',
    //     type: 'GET',
    //     // url: '/twitterquery_dygraph',
    //     url: "/static/js/twitteroutput_full.json",
    //     dataType: 'json',
    //     async:true,
    //     success : function(data){ 

    //     },
    //     error: function(){ 
    //         pr('Page Not found: ajax in main()');
    //     }
    // });
}

function RenderTweets( tweets) {
    console.log("in RenderTweets()")

    $("#div-twitter").html( "" )

    var html = ""
    html += '<div class="EmbeddedTweet twitter-tweet" data-iframe-title="Twitter Tweet" id="twitter-widget-0" lang="en" data-twitter-event-id="0">' + '\n';
    html += '\t'+ '<div class="EmbeddedTweet-tweet">' + '\n';

    for(var i in tweets) {
        var tweet = tweets[i];
        html += '\t\t'+ '<blockquote class="Tweet h-entry tweet subject expanded" cite="'+tweet["tweet_url"]+'" data-tweet-id="'+tweet["id"]+'" data-scribe="section:subject">' + '\n';

        html += '\t\t\t'+ '<div class="Tweet-header u-cf">' + '\n';
        html += '\t\t\t\t'+ '<div class="Tweet-brand u-floatRight">' + '\n';
        html += '\t\t\t\t\t'+ '<span class="u-hiddenInWideEnv">' + '\n';
        html += '\t\t\t\t\t\t'+ '<a href="'+tweet["tweet_url"]+'" data-scribe="element:logo">' + '\n';
        html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--twitter " aria-label="" title="" role="presentation"></div>' + '\n';
        html += '\t\t\t\t\t\t'+ '</a>' + '\n';
        html += '\t\t\t\t\t'+ '</span>' + '\n';
        html += '\t\t\t\t'+ '</div>' + '\n';
        html += '\t\t\t\t'+ '<div class="Tweet-author u-textTruncate h-card p-author" data-scribe="component:author">' + '\n';
        html += '\t\t\t\t\t'+ '<a class="Tweet-authorLink Identity u-linkBlend" data-scribe="element:user_link" href="'+tweet["author"]["url"]+'">' + '\n';
        html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorAvatar Identity-avatar">' + '\n';
        html += '\t\t\t\t\t\t\t'+ '<img class="Avatar u-photo" data-scribe="element:avatar" data-src-2x="http://..._bigger.jpg" src="http://..._normal.jpg">' + '\n';
        html += '\t\t\t\t\t\t'+ '</span>' + '\n';
        html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorName Identity-name p-name customisable-highlight" data-scribe="element:name">'+tweet["author"]["name"]+'</span>' + '\n';
        html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorScreenName Identity-screenName p-nickname" data-scribe="element:screen_name">@'+tweet["author"]["screen_name"]+'</span>' + '\n';
        html += '\t\t\t\t\t'+ '</a>' + '\n';
        html += '\t\t\t\t'+ '</div>' + '\n';
        html += '\t\t\t'+ '</div>' + '\n';

        html += '\t\t\t'+ '<div class="Tweet-body e-entry-content" data-scribe="component:tweet">' + '\n';
        html += '\t\t\t\t'+ '<p class="Tweet-text e-entry-title" lang="en" dir="ltr">' + tweet["text"] + '</p>' + '\n';
        html += '\t\t\t\t'+ '<div class="Tweet-metadata dateline">' + '\n';    
        html += '\t\t\t\t\t'+ '<a class="u-linkBlend u-url customisable-highlight long-permalink" data-datetime="2012-12-03T18:51:11+000" data-scribe="element:full_timestamp" href="'+tweet["tweet_url"]+'">' + '\n';
        html += '\t\t\t\t\t\t'+ '<time class="dt-updated" datetime="2012-12-03T18:51:11+0000" title="Time posted: 03 Dec 2012, 18:51:11 (UTC)">'+tweet["date"]+'</time>' + '\n';
        html += '\t\t\t\t\t'+ '</a>' + '\n';
        html += '\t\t\t\t'+ '</div>' + '\n';
        html += '\t\t\t'+ '</div>' + '\n';

        html += '\t\t'+ '</blockquote>' + '\n';
        html += '\t\t'+ '<br>' + '\n';


    }

    html += '\t'+'<div>' + '\n';
    html += '<div' + '\n';

    $("#div-twitter").html( html )


    return true;
}



function RenderTweet( tweet) {
    console.log("in RenderSingleTweet()")

    var html = ""
    html += '\t\t'+ '<blockquote class="Tweet h-entry tweet subject expanded" cite="'+tweet["tweet_url"]+'" data-tweet-id="'+tweet["id"]+'" data-scribe="section:subject">' + '\n';

    html += '\t\t\t'+ '<div class="Tweet-header u-cf">' + '\n';
    html += '\t\t\t\t'+ '<div class="Tweet-brand u-floatRight">' + '\n';
    html += '\t\t\t\t\t'+ '<span class="u-hiddenInWideEnv">' + '\n';
    html += '\t\t\t\t\t\t'+ '<a href="'+tweet["tweet_url"]+'" data-scribe="element:logo">' + '\n';
    html += '\t\t\t\t\t\t\t'+ '<div class="Icon Icon--twitter " aria-label="" title="" role="presentation"></div>' + '\n';
    html += '\t\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t\t'+ '</span>' + '\n';
    html += '\t\t\t\t'+ '</div>' + '\n';
    html += '\t\t\t\t'+ '<div class="Tweet-author u-textTruncate h-card p-author" data-scribe="component:author">' + '\n';
    html += '\t\t\t\t\t'+ '<a class="Tweet-authorLink Identity u-linkBlend" data-scribe="element:user_link" href="'+tweet["author"]["url"]+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorAvatar Identity-avatar">' + '\n';
    html += '\t\t\t\t\t\t\t'+ '<img class="Avatar u-photo" data-scribe="element:avatar" data-src-2x="'+tweet["author"]["profile_image_url"].replace("_normal","_bigger")+'" src="'+tweet["author"]["profile_image_url"]+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '</span>' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorName Identity-name p-name customisable-highlight" data-scribe="element:name">'+tweet["author"]["name"]+'</span>' + '\n';
    html += '\t\t\t\t\t\t'+ '<span class="Tweet-authorScreenName Identity-screenName p-nickname" data-scribe="element:screen_name">@'+tweet["author"]["screen_name"]+'</span>' + '\n';
    html += '\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t'+ '</div>' + '\n';
    html += '\t\t\t'+ '</div>' + '\n';

    html += '\t\t\t'+ '<div class="Tweet-body e-entry-content" data-scribe="component:tweet">' + '\n';
    html += '\t\t\t\t'+ '<p class="Tweet-text e-entry-title" lang="en" dir="ltr">' + tweet["text"] + '</p>' + '\n';
    html += '\t\t\t\t'+ '<div class="Tweet-metadata dateline">' + '\n';    
    html += '\t\t\t\t\t'+ '<a class="u-linkBlend u-url customisable-highlight long-permalink" data-datetime="2012-12-03T18:51:11+000" data-scribe="element:full_timestamp" href="'+tweet["tweet_url"]+'">' + '\n';
    html += '\t\t\t\t\t\t'+ '<time class="dt-updated" datetime="2012-12-03T18:51:11+0000" title="Time posted: 03 Dec 2012, 18:51:11 (UTC)">'+tweet["date"]+'</time>' + '\n';
    html += '\t\t\t\t\t'+ '</a>' + '\n';
    html += '\t\t\t\t'+ '</div>' + '\n';
    html += '\t\t\t'+ '</div>' + '\n';

    html += '\t\t'+ '</blockquote>' + '\n';
    html += '\t\t'+ '<br>' + '\n';


    return html;
}

$.ajax({
    type: 'POST',
    // type: 'GET',
    url: '/twitterquery_dygraph',
    // url: "/static/js/twitteroutput_full.json",
    data: { motscles : getUrlParam.motscles},
    dataType: 'json',
    async:true,
    success : function(data){ 
        console.log("the_data:")
        console.log(data)
        var labels = data.labels.slice()
        labels.unshift("Date")
        console.log("labels:")
        console.log(labels)


        makeGraph("many", labels, data.data, true);


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

        $('#demo')
            .mousedown(function() {
                startTime = new Date().getTime();  
                console.log("status: DRAGGED");
            })
            .mouseup(function() {
                endTime = new Date().getTime();
                console.log("status: dropped");
                updateGraph ( startTime , endTime );
            });



        var Tweet_HTML = {}
        for(var tweetID in data.raw) {
            var ID = Number(tweetID)
            var tweet = data.raw[tweetID]
            var info = {
                "id": ID,
                "date": tweet.created_at,
                "text": tweet.text,
                "author": {
                    "screen_name":tweet.author.screen_name,
                    "lang": tweet.author.lang,
                    "url": 'http://twitter.com/'+tweet.author.screen_name,
                    "screen_name": tweet.author.screen_name,
                    "name": tweet.author.name,
                    "profile_image_url":tweet.author.profile_image_url,
                },
                "tweet_url": 'http://twitter.com/'+tweet.author.screen_name+'/status/'+tweetID,
                "query": tweet.query
            }
            Tweet_HTML[ID] = RenderTweet(info)
        }


        console.log(Tweet_HTML)

        // var html = ""
        // html += '<div class="EmbeddedTweet twitter-tweet" data-iframe-title="Twitter Tweet" id="twitter-widget-0" lang="en" data-twitter-event-id="0">' + '\n';
        // html += '\t'+ '<div class="EmbeddedTweet-tweet">' + '\n';


        // html += '\t'+'<div>' + '\n';
        // html += '<div' + '\n';



        // DYNATABLE STUFF:
        var div_table=""
        $("#div-table").html("")
        $("#div-table").empty();

            div_table += '<div class="EmbeddedTweet twitter-tweet" data-iframe-title="Twitter Tweet" id="twitter-widget-0" lang="en" data-twitter-event-id="0">' + '\n';
            div_table += '\t'+ '<div class="EmbeddedTweet-tweet">' + '\n';

            div_table += '<table id="my-ajax-table" class="table table-bordered">'+"\n"
            div_table += "\t"+'<thead>'+"\n"
            // div_table += "\t"+"\t"+'<th width="150px;" data-dynatable-column="date">Date</th>'+"\n"
            div_table += "\t"+"\t"+'<th data-dynatable-column="tweet">Tweet</th>'+"\n"
            div_table += "\t"+"\t"+'</th>'+"\n"
            div_table += "\t"+'</thead>'+"\n"
            div_table += "\t"+'<tbody>'+"\n"
            div_table += "\t"+'</tbody>'+"\n"
            div_table += '</table>'+"\n"

            div_table += '\t'+'</div>' + '\n';
            div_table += '</div>' + '\n';
        
        $("#div-table").html(div_table)


        TweetsData = data.dates_tweets;
        var Data = {
            "records": []
        }

        // Formatting ajax-data for Dynatable
        var count=0;
        for(var tweetID in data.raw) {
          var ID = Number(tweetID)
          var orig_id = ID
          var arr_id = count
          RecDict[orig_id] = arr_id;
          var tweet = data.raw[tweetID]
          var info = {
            "date": tweet.created_at,
            "tweet": Tweet_HTML[ID],
            "del" : false,
          }
          Data["records"].push(info)
          count++;
        }


        AjaxRecords = Data["records"]; // backup-ing in global variable!

        MyTable = []
        MyTable = $('#my-ajax-table').dynatable({
                  dataset: {
                    records: Data["records"]
                  },
                  features: {
                    pushState: false,
                    // sort: false //i need to fix the sorting function... the current one just sucks
                  },
                  // writers: {
                  //   _rowWriter: ulWriter
                  //   // _cellWriter: customCellWriter
                  // }
                });


        MyTable.data('dynatable').sorts.clear();
        MyTable.data('dynatable').sorts.add('date', 1) // 1=ASCENDING,
        MyTable.data('dynatable').process();
        MyTable.data('dynatable').paginationPerPage.set(3);
        MyTable.data('dynatable').paginationPage.set(1);
        MyTable.data('dynatable').process();



        if ( $(".imadiv").length>0 ) return false;

        $('<br><br><div class="imadiv"></div>').insertAfter(".dynatable-per-page")
        $(".dynatable-record-count").insertAfter(".imadiv")
        $(".dynatable-pagination-links").insertAfter(".imadiv")











        // // DYNATABLE STUFF:
        // var div_table=""
        // $("#div-table").html("")
        // $("#div-table").empty();
        //     div_table += '<table id="my-ajax-table" class="table table-bordered">'+"\n"
        //     div_table += "\t"+'<thead>'+"\n"
        //     div_table += "\t"+"\t"+'<th width="150px;" data-dynatable-column="date">Date</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="query">Query</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th width="500px;" data-dynatable-column="text">Content</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="link">Link</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="RT">#RT</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="FV">#FV</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="user">User</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="userFoll">#Foll</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="userFavo">#Favs</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="userAmis">#Amis</th>'+"\n"
        //     div_table += "\t"+"\t"+'<th data-dynatable-column="userList">#List</th>'+"\n"
        //     // div_table += "\t"+"\t"+'<th data-dynatable-column="del" data-dynatable-no-sort="true">Trash</th>'+"\n"
        //     div_table += "\t"+"\t"+'</th>'+"\n"
        //     div_table += "\t"+'</thead>'+"\n"
        //     div_table += "\t"+'<tbody>'+"\n"
        //     div_table += "\t"+'</tbody>'+"\n"
        //     div_table += '</table>'+"\n"
        // $("#div-table").html(div_table)

        // TweetsData = data.dates_tweets;
        // var Data = {
        //     "records": []
        // }

        // // Formatting ajax-data for Dynatable
        // var count=0;
        // for(var tweetID in data.raw) {
        //   var ID = Number(tweetID)
        //   var orig_id = ID
        //   var arr_id = count
        //   RecDict[orig_id] = arr_id;
        //   var tweet = data.raw[tweetID]
        //   var info = {
        //     "id": ID,
        //     "date": tweet.created_at,
        //     "text": tweet.text,
        //     "link": '<a target=_blank href="http://twitter.com/'+tweet.author.screen_name+'/status/'+tweetID+'">ici</a>',
        //     // "date": new Date(Date.parse(tweet.created_at)),
        //     "query": tweet.query,
        //     "RT": tweet.retweet_count,
        //     "FV": tweet.favorite_count,
        //     "user": '<a target=_blank href="http://twitter.com/'+tweet.author.screen_name+'">@'+tweet.author.screen_name+'</a>',
        //     "userFoll": tweet.author.followers_count,
        //     "userList": tweet.author.listed_count,
        //     "userFavo": tweet.author.favourites_count,
        //     "userAmis": tweet.author.friends_count,
        //     "del" : false,
        //   }
        //   Data["records"].push(info)
        //   count++;
        // }
        

        // AjaxRecords = Data["records"]; // backup-ing in global variable!

        // MyTable = []
        // MyTable = $('#my-ajax-table').dynatable({
        //           dataset: {
        //             records: Data["records"]
        //           },
        //           features: {
        //             pushState: false,
        //             // sort: false //i need to fix the sorting function... the current one just sucks
        //           },
        //           // writers: {
        //           //   _rowWriter: ulWriter
        //           //   // _cellWriter: customCellWriter
        //           // }
        //         });


        // MyTable.data('dynatable').sorts.clear();
        // MyTable.data('dynatable').sorts.add('date', 1) // 1=ASCENDING,
        // MyTable.data('dynatable').process();

        // MyTable.data('dynatable').paginationPage.set(1);
        // MyTable.data('dynatable').process();



        // if ( $(".imadiv").length>0 ) return false;

        // $('<br><br><div class="imadiv"></div>').insertAfter(".dynatable-per-page")
        // $(".dynatable-record-count").insertAfter(".imadiv")
        // $(".dynatable-pagination-links").insertAfter(".imadiv")


    },
    error: function(){ 
        pr('Page Not found: ajax in main()');
    }
});