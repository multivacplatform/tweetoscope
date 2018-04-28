
// var Frecs_Color = {}
var Frecs_Size = {}
var Real_Freqs = {}
var Real2Fake_Freqs = {}
var Min_Freq;
var Max_Freq;
var Min_Freq_fake;
var Max_Freq_fake;


var step_size = 0.2;
var ms = 300;
var echelle = 50;

var jsonfile = main_url+"ajax_sample/Climate_Change_Weekly.json"

var log_dict = {};
var log_avg = 0


    var MinS=1000000
    var MaxS=-1;

var MeanFreq_nodes = {}
var Scores = {}
var Sizes = {}
var Frecs_Color = [
    "#991B1E",
    "#fa4607", // red
    "#fa6e07",
    "#fa9607",
    "#fab207",
    "#f9da08",
    "#f9f008",
    // "#f1ff10",
    "#bae64f",//epsilon
    "#10ffd5",
    "#64e0f2",
    "#64c5f2",
    "#6ca1e9",
    "#5c8af2",
    "#3c76fb",
    "#005197"  //blue
];

function Tweets_Dates__Distribution_old( distr , dates_) {

    var dates_back = dates_.slice()
    var dates = dates_.slice()
    for(var d in dates)
        dates[d] = 0

    for(var node in distr) {
        var freqs = distr[node]
        for(var i in freqs) {
            dates[i] += freqs[i]
        }
    }

    var the_data = []
    var N = Object.keys(distr).length
    for(var i in dates) {
        var date = dates_back[i]
        var freq = Math.round(dates[i])
        the_data.push( [ date , freq ] )
    }
    return the_data
}


function Tweets_Dates__Distribution( distr , dates_) {

    var dates_back = dates_.slice()
    var dates = dates_.slice()

    var the_data = []
    for(var d in dates) {
        the_data.push( [ dates[d] , Frecs.timesteps_docfreq[d] ] )
    }

    return the_data
}





// Load the CSS+JS for the timerange twitter-slider
//  and it adds the divs for'play/stop button
function TwitterTimeSlider( manualflag ) {
    //twittertimeslider_div

    $( "#heatgraph" ).html("");
    $( "#playstop" ).remove();
    // if ( !isUndef(manualflag) && !twittertimeline ) twittertimeline = manualflag;
    if(!manualflag) {
        return;
    }

    console.log("now im in twittertimeline: "+twittertimeline)

    ProcessDivsFlags()

    //     [ HTML and Libraries Stuff ]
        loadCSS("ion.rangeSlider-master/css/ion.rangeSlider.css");
        // loadCSS("http://localhost/ion.rangeSlider-master/style.min.css");
        loadCSS("ion.rangeSlider-master/demo_rangeslider.css");
        loadCSS("ion.rangeSlider-master/css/skin2.css");
        loadJS("ion.rangeSlider-master/js/ion.rangeSlider.min.js");

        // for debug
        // loadJS("ion.rangeSlider-master/js/ion.rangeSlider.js");

        var div_info = "";
        div_info += '      <input id="range_09" />';
        $( "#heatgraph" ).html(div_info);
        var timeline_div = $("#heatgraph").offset()
        var newleft = timeline_div.left-50*2;
        div_info = '  <div id="playstop">';
        div_info += '      <img style="cursor: pointer;" id="theplay" height="50px" src="libs/img2/play-circled2.png"></img>';
        div_info += '  </div>';
        $( div_info ).insertAfter("#heatgraph");
    //     [ / HTML and Libraries Stuff ]

    ParseTwitterData()

    var the_data = Tweets_Dates__Distribution( Frecs.nodes , Frecs.timesteps )

    makeGraph("many", D["#tweets-table"]["title_global"][LA] ,["Date" , "#Tweets"] , the_data, false); //

    DavidStuff(manualflag)
    set_ClustersLegend( "cluster_twitter" )
    $.doTimeout(250,function (){
        var mini_w = $(".irs").width()
        var mini_h = 40
        var mini_b = (mini_h/10)
        makeMiniGraph("chart_shadow" , mini_w , mini_h , mini_b, the_data, false )
    });
    if(auto_twitter_film) {
        $("#theplay").click()
    }

}

function DavidStuff( flag ) {

    if(!flag) {
        //normal colors
        return;
    }

    console.log("")
    console.log(" = = = = = = = = = = = = = = ")
    console.log(" = = Here comes the new formula = = ")
    console.log(" = = = = = = = = = = = = = = ")

    var wos_data = Frecs.nodes_wos;


    // === [ Min y Max de las frecuencias ] === //
    var MinT=1000000
    var MaxT=-1;
    var MinT_avg=1000000
    var MaxT_avg=-1;
    for(var i in Frecs.nodes) {
        var occs = Frecs.nodes[i];

        var sum = 0
        for(var j in occs) {
            sum += occs[j]
        }

        MeanFreq_nodes[i] = sum/occs.length
        if (MeanFreq_nodes[i]<MinT_avg) MinT_avg = MeanFreq_nodes[i];
        if (MeanFreq_nodes[i]>MaxT_avg) MaxT_avg = MeanFreq_nodes[i];

        for(var j in occs) {
            if(occs[j]>0) {
                if (occs[j]<MinT) MinT = occs[j];
                if (occs[j]>MaxT) MaxT = occs[j];
            }
        }
    }

    // === [ / Min y Max de las frecuencias ] === //

    //  = = = = = = = = = = = = = = = == = = = = = //
    //  = = = = = = = = = = = = = = = == = = = = = //
    //  = = = = = = = = = = = = = = = == = = = = = //


    var MaxW = Frecs["nodes_wos__minmax"][1];
    var min_size = 1000000
    var max_size = -1
    for(var i in MeanFreq_nodes) {
        if(wos_data.hasOwnProperty(i)) {
            var T = MeanFreq_nodes[i];
            var W = wos_data[i][0];

            // var part1 = Math.log10(W+1)/Math.log10(MaxW)
            // var part2 = Math.log10(T+1)/Math.log10(MaxT_avg)
            // Math.pow(,-3)/Math.pow(,-3)
            var part1 = Math.pow(W, 1 / 2) / Math.pow(MaxW, 1 / 2)//Math.sqrt(W+1)/Math.sqrt(MaxW)
            var part2 = Math.pow(T, 1 / 2) / Math.pow(MaxT_avg, 1 / 2)//Math.sqrt(T+1)/Math.sqrt(MaxT_avg)


            Sizes[i] = Math.round(Math.max(part1, part2) * 100)//Math.sqrt( Math.pow(part1,2)+ Math.pow(part2,2))//Math.round( Math.max( part1 , part2 )*100 )

            if (Sizes[i] < min_size) min_size = Sizes[i];
            if (Sizes[i] > max_size) max_size = Sizes[i];
        }
    }

    // === [ Normalizing Frequencies ] === //



    // 01.-  Normalizing Twitter-frecuencies and save them in Frecs_nodes_cp{}
    var Frecs_nodes_cp = {}
    for(var i in Frecs.nodes) {
        Frecs_nodes_cp[i] = []
        for(var j in Frecs.nodes[i]) {
            Frecs_nodes_cp[i].push(Number((Frecs.nodes[i][j]/MaxT)))
            // Frecs.nodes[i][j] = Number((Frecs.nodes[i][j]/MaxT));
        }
    }


    // 03.-  Calculating the ratio Tw/WoS
    var Temp = {}
    for(var i in Frecs_nodes_cp) {
        if(wos_data.hasOwnProperty(i)) {
            var sum = 0
            var occs = Frecs_nodes_cp[i]
            for (var j in occs) {
                sum += occs[j]
            }
            var Tn = sum / occs.length
            var Wn = wos_data[i][1]

            Temp[i] = Tn / (Wn + 0.000001); //the ratio
            // console.log(Temp[i]+"\t"+Math.round(Wn*10000)+"\t"+Math.round(Tn*10000)+"\t\t"+i)
        }
    }

    // 04.-  Creating pre-RGBColors [+-]
    var Scores = {}
    var MinS=1000000
    var MaxS=-1;
    for(var i in Temp) {
        var temp = Temp[i]
        if(temp>1)
            Scores[i] = Math.log10(temp+0.000001)
        if(temp<1)
            Scores[i] = -Math.log10(1/(temp+0.000001))
        if(temp==0) {
            Scores[i] = 0;
        }
        var score = Math.abs(Scores[i])
        if (score<MinS) MinS = score;
        if (score>MaxS) MaxS = score;
    }



    // var sorted_ratios = ArraySortByValue(Temp, function(a,b){
    //         return b-a
    // });


    // var MIN = sorted_ratios[sorted_ratios.length-1].value
    // var MAX = sorted_ratios[0].value

    // var raw_number = (""+MIN).split(".")
    // console.log(raw_number)
    // var order_of_magnitude = 0
    // for(var i in raw_number) {
    //     for(var j in raw_number[i]) {
    //         var digit = Number(raw_number[i][j])
    //         if( digit!=0) break;
    //         else order_of_magnitude++;
    //     }
    // }
    // console.log("Order of magnitude:")
    // console.log(order_of_magnitude)


    // var Magndict = {}
    // var Magnitude_Mult = Math.pow(10, order_of_magnitude)
    // for(var i in sorted_ratios) {
    //     // console.log()
    //     var entero = Math.round( sorted_ratios[i].value*Magnitude_Mult )
    //     var first_dig = (""+entero)[0]
    //     var second_dig = ((""+entero)[1])?"."+(""+entero)[1]:".0";
    //     var rounded = Math.round( Number( first_dig+second_dig ) )
    //     var length = (""+entero).length
    //     // console.log( sorted_ratios[i].key+"\t"+Temp[sorted_ratios[i].key]+"\t"+ entero +"\t"+ length + "\t" +rounded + "\t" + (rounded+length) )
    //     var magfinal = Math.round( Number(length+"."+(""+rounded)[0])*10 )
    //     // console.log(magfinal)

    //     if( ! Magndict[magfinal] )
    //         Magndict[magfinal] = 0
    //     Magndict[magfinal] ++;
    // }


    // var TheColors = [
    //     "#0080FF", //blue
    //     "#81DAF5",
    //     "#58FAF4",
    //     "#81F7D8",
    //     "#D0FA58",
    //     "#F4FA58",//yellow
    //     "#F7D358",
    //     "#FE9A2E",
    //     "#FE2E2E" //red
    // ]

    // // var steps = TheColors.length;
    // console.log("")
    // console.log(" = = = = = = = = = = = ")
    // var step_size = Math.round( Object.keys(Magndict).length /TheColors.length )
    // var step_i = 0
    // var counter = 0
    // for(var bin in Magndict) {
    //     // console.log(bin)
    //     Magndict[bin] = (TheColors.length-1)-Math.min( step_i , TheColors.length-1)
    //     console.log(bin +"\t"+ Magndict[bin])
    //     counter++
    //     if((counter%step_size)===0)
    //         step_i++
    // }
    // console.log("")

    // var DictFinal = {}
    // for(var i in sorted_ratios) {

    //     var entero = Math.round( sorted_ratios[i].value*Magnitude_Mult )
    //     var first_dig = (""+entero)[0]
    //     var second_dig = ((""+entero)[1])?"."+(""+entero)[1]:".0";
    //     var rounded = Math.round( Number( first_dig+second_dig ) )
    //     var length = (""+entero).length
    //     var magfinal = Math.round( Number(length+"."+(""+rounded)[0])*10 )
    //     DictFinal[sorted_ratios[i].key] = Magndict[magfinal]
    //     console.log( sorted_ratios[i].key+"\t"+Temp[sorted_ratios[i].key]+"\t"+ entero +"\t"+ length + "\t" +rounded + "\t" + (rounded+length) +"\t"+Magndict[magfinal])

    // }








    var colour_min = 1000000
    var colour_max = -1

    var DavidWay = {}
    // 05.-  Assigning new colors to the nodes!
    var Min_hexa=1000000
    var Max_hexa=-1
    var Min_size = 3;
    var Max_size = 12;
    var Colors = {}
    for(var i in Scores) {

        var color_i = Math.round((7*Scores[i])/MaxS)
        // console.log( i +"\t"+ color_i )
        color_i = Math.round((7*Scores[i])/MaxS)+7
        if (color_i<colour_min) colour_min = color_i;
        if (color_i>colour_max) colour_max = color_i;
        if(! DavidWay[color_i])
            DavidWay[color_i] = 0
        DavidWay[color_i]++;
        var hex_color = Frecs_Color[color_i]


        color_i = Math.round((255*Scores[i])/MaxS)
        // var size_i = Math.round((Max_size*Sizes[i])/max_size)
        var size_i = Math.round( Min_size+(Number(Sizes[i])-min_size)*( (Max_size-Min_size)/(max_size-min_size) ) );

        // // David stuff
        // var hex_color;
        // var epsilon=5;
        // if(color_i>=-epsilon && color_i<=epsilon)
        //     hex_color = rgbToHex(0, 255 , 0) ;//[255, 255 , 255]
        // if(color_i<-epsilon)
        //     hex_color = rgbToHex( 255, 255+color_i , 255+color_i ) ;//[255, 255+color_i , 255+color_i]
        // if(color_i>epsilon)
        //     hex_color = rgbToHex( color_i, 255 , 255 ) ;//[color_i, 255 , 255]


        // // Salomonic stuff
        // var hex_color;
        // var epsilon=5;
        // if(color_i==0)
        //     hex_color = rgbToHex(255, 255 , 255)
        // if(color_i<0)
        //     hex_color = rgbToHex( 255, 255+color_i , 255+color_i ) ;
        // if(color_i>0)
        //     hex_color = rgbToHex( color_i, 255 , 255 ) ;

        partialGraph._core.graph.nodesIndex[Label2ID[i]].color = hex_color;
        partialGraph._core.graph.nodesIndex[Label2ID[i]].size = size_i

        // Colors[i] = color_i
        if (color_i<Min_hexa) Min_hexa = color_i;
        if (color_i>Max_hexa) Max_hexa = color_i;
    }


    // 06.-   Assigning special colors to anti-twitter nodes
    var v_nodes = getVisibleNodes();
    for(var i in v_nodes) {
        if( !Frecs.nodes[Nodes[v_nodes[i].id].label_en.toLowerCase()] ) {
            partialGraph._core.graph.nodesIndex[v_nodes[i].id].color = "#991B1E";
            partialGraph._core.graph.nodesIndex[v_nodes[i].id].size = 2
        }
    }

    partialGraph.draw(2,2,2);


    // Edges-color mix of the 2 nodes-color
    var v_edges = getVisibleEdges();
    for(var e in v_edges) {
        var e_id = v_edges[e].id;
        var a = v_edges[e].source.color;
        var b = v_edges[e].target.color;
        if (a && b) {
            a = hex2rga(a);
            b = hex2rga(b);
            var r = (a[0] + b[0]) >> 1;
            var g = (a[1] + b[1]) >> 1;
            var b = (a[2] + b[2]) >> 1;
            partialGraph._core.graph.edgesIndex[e_id].color = "rgba("+[r,g,b].join(",")+",0.5)";
        }
    }



    partialGraph.draw(2,2,2);



    console.log(" = = = = = = = = = = = = = = ")
    console.log(" = = = = = = = = = = = = = = ")
    console.log("")
}

function SimplifyTimeSlider( value ) {
    $("#range_09").data("ionRangeSlider").update({
        hide_min_max: value,
        hide_from_to: value,
        grid: !value
    });
}
// uses: Frecs.nodes|wos_data|timesteps , ColoringGraph_final(), TweetsMovie()
//      Building Frecs.nodes_proportionals
function ParseTwitterData( ) {

    console.warn("ParseTwitterData")

    var wos_data = Frecs.nodes_wos;

    var timesteps = Frecs.timesteps.slice()
    // for(var i in timesteps) {
    //     timesteps[i] = humanize.date( 'M d' , new Date(timesteps[i]))
    // }

    //      = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  //
    //      = = = = = = = [ Defining slider events ]      = = = = = = = //
    $("#range_09").ionRangeSlider({
        from: timesteps.length-1,
        values: timesteps,
        from_min: 1,
        grid_num: sliderNTicks,  // <== total number of ticks on the legend grid
        grid_snap: false,
        keyboard: true,
        grid: true,
        // onStart: function (data) {
        //     // console.log("onStart");
        // },
        // onChange: function (data) {
        //     // console.log("onChange");
        // },
        onFinish: function (data) {
            // console.log("onFinish");
            var sels_buffer = Object.keys(selections)
            // console.log("sels_buffer:")
            // console.log(sels_buffer)
            if(sels_buffer.length>0) {
                cancelSelection(false)
            }
            // console.log("\tprevious value: "+min_buff)
            // console.log("\tcurrent value: "+data.from)
            var t_a = min_buff;
            var t_b = data.from;
            ColoringGraph_final( 0 , 0   , t_a , t_b , step_size , ms , false , sels_buffer)
            min_buff = data.from

            $.doTimeout(500,function () {
                SimplifyTimeSlider( false )
                MainTwitterApp( ["global warming"] )
            });
        }
        // onUpdate: function (data) {
        //     // console.log("onUpdate");
        // }
    });

    SimplifyTimeSlider( true )

    $("#theplay").click(function(){
        SimplifyTimeSlider( false )
        $("#overlay").show();
        TweetsMovie();
    });

    console.log(Frecs)

    if(Object.keys(Frecs.nodes_proportionals).length>1)
        return true;

    var Ratios = {}
    Min_Freq=1000000
    Max_Freq=-1;
    for(var i in Frecs.nodes) {
        var occs = Frecs.nodes[i];
        Ratios[i] = []
        for(var j in occs) {
            Ratios[i].push(0)
                if (occs[j]<Min_Freq) Min_Freq = occs[j];
                if (occs[j]>Max_Freq) Max_Freq = occs[j];
        }
    }

    for(var i in Frecs.nodes) {
        var occs = Frecs.nodes[i];
        for(var j in occs) {
            if(wos_data.hasOwnProperty(i)) {
                var Tn = occs[j]/Max_Freq
                var Wn = wos_data[i][1]
                var ratio = Tn/(Wn+0.000001)
                Ratios[i][j] = ratio
            } else {

            }
        }
    }
    //      = = = = = = = [ / Min y Max de las frecuencias ]    = = = = = //
    //      = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  //

    console.log("Min_Freq:")
    console.log( Min_Freq )
    console.log("Max_Freq:")
    console.log( Max_Freq )

    // 04.-  Creating pre-RGBColors [+-]
    for(var i in Ratios) {
        for(var j in Ratios[i]) {
            var temp = Ratios[i][j]
            if(temp>1.1)
                Ratios[i][j] = Math.log10(temp+0.000001)
            if(temp<0.9)

                Ratios[i][j] = -Math.log10(1/(temp+0.000001))
            if(temp>=0.9 && temp<=1.1) {
                Ratios[i][j] = 0;
            }
            var score = Math.abs(Ratios[i][j])
            if (score<MinS) MinS = score;
            if (score>MaxS) MaxS = score;
        }
    }

    //      = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  //
    //      = = = = = = = [ Normalizacion de las frecuencias ]      = = = = = //
    Min_Freq_fake=1000000
    Max_Freq_fake=-1;
    for(var i in Frecs.nodes) {
        var occs = Frecs.nodes[i];
        var norm_occs = []
        for(var j in occs) {

            // var norm_occ = 0.0;
            // norm_occ = Math.round(occs[j]/Max_Freq*100/echelle)

            // // if( log_avg >= occs[j] ) {
            // //     norm_occ = Math.round(occs[j]/Max_Freq*100/echelle) ;
            // // } else {
            // //     norm_occ = Math.round(100.0/echelle);
            // // }


            // norm_occs.push( norm_occ )

            // Frecs_Color[norm_occ] = true;
            // Frecs_Size[norm_occ] = true;


            // if (norm_occ<Min_Freq_fake) Min_Freq_fake = norm_occ;
            // if (norm_occ>Max_Freq_fake) Max_Freq_fake = norm_occ;

            var color_i = Math.round((7*Ratios[i][j])/MaxS)+7
            norm_occs.push( color_i )

        }
        // console.log( i + "\t->\t" +norm_occs)

        Frecs.nodes_proportionals[i] = norm_occs;
        // console.log(i)
        // console.log(Frecs.nodes[i] + " AND " + wos_data[i])
        // console.log(norm_occs)
        // console.log("")
    }
    //
    //      = = = = = = = [ / Normalizacion de las frecuencias ]      = = = = = //
    //      = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  //

}



//     [   Twitter + HeatGraph   ]

// Calculator of k-colortransitions between 2 colors
function blendColors(source, target, balance) {
    var bal = Math.min(Math.max(balance,0),1);
    var nbal = 1-bal;
    var r1,g1,b1,r2,g2,b2;
    r1 = source["r"];
    g1 = source["g"];
    b1 = source["b"];
    r2 = target["r"];
    g2 = target["g"];
    b2 = target["b"];

    return {
            r : Math.floor(r1*nbal + r2*bal),
            g : Math.floor(g1*nbal + g2*bal),
            b : Math.floor(b1*nbal + b2*bal)
           };
}


// dev method
function select_null_nodes () {
    cancelSelection(false)
    var v_nodes = getVisibleNodes();
    for(var i in v_nodes) {
        if( !Frecs.nodes[Nodes[v_nodes[i].id].label_en.toLowerCase()] ) {
            selections[v_nodes[i].id] = true
        }
    }
    var SelInst = new SelectionEngine();
    var targeted = Object.keys(selections).map(Number);
    SelInst.MultipleSelection2({nodes:targeted});
}

// uses: Frecs.timesteps , Frecs.nodes_proportionals, partialGraph,   ColoringGraph_final()
function TweetsMovie() {
    var timer_res = 0;
    var globalcount = 0;
    var N = Frecs.timesteps.length;


    // Establishing the first coloring corresponding to t = 0 (0->1)
    console.log( "Establishing the first coloring corresponding to t = 0 (0->1)" )
    console.log(Frecs)
    for(var i in Frecs.nodes_proportionals) {
        var occs = Frecs.nodes_proportionals[i];
        partialGraph._core.graph.nodesIndex[ Label2ID[i] ].color = Frecs_Color[occs[0]];
        // partialGraph._core.graph.nodesIndex[find(i)[0].id].size = Frecs_Size[occs[0]];
    }

    // Finding null-nodes
    var v_nodes = getVisibleNodes();
    for(var i in v_nodes) {
        if( !Frecs.nodes[Nodes[v_nodes[i].id].label_en.toLowerCase()] ) {
            partialGraph._core.graph.nodesIndex[v_nodes[i].id].color = "#991B1E";
            partialGraph._core.graph.nodesIndex[v_nodes[i].id].size = 2
        }
    }

    partialGraph.draw(2,2,2);

    console.log( "draaaaw()" )
    partialGraph.draw();


    var v_edges = getVisibleEdges();
    for(var e in v_edges) {
        var e_id = v_edges[e].id;
        var a = v_edges[e].source.color;
        var b = v_edges[e].target.color;
        if (a && b) {
            a = hex2rga(a);
            b = hex2rga(b);
            var r = (a[0] + b[0]) >> 1;
            var g = (a[1] + b[1]) >> 1;
            var b = (a[2] + b[2]) >> 1;
            partialGraph._core.graph.edgesIndex[e_id].color = "rgba("+[r,g,b].join(",")+",0.5)";
        }
    }
    partialGraph.draw();


    // ColoringGraph2();

    // globalcount += ColoringGraph_final( globalcount , 0   , 0 , 1 , 0.2)
    // globalcount += ColoringGraph_final( globalcount , 1   , 1 , 2 , 0.2)
    // console.log("globalcount: "+globalcount)
    // console.log("N: "+N)
    // ColoringGraph_final( timer_res , 0 , 1 , 0.1)


    var results = []
    for(var t=0; t<(N-1) ; t++) {
        var t_a = t, t_b=(t+1);
        globalcount += ColoringGraph_final( globalcount , 0   , t_a , t_b , step_size , ms , true , [])
    }
}

// uses: Frecs , Frecs_Color, blendColors()
function Colorer_final( t_a , t_b , step_size ) {
    var results = {}
    var a = t_a, b=t_b;
    // pr("tiempos t="+a+"|t="+b)
    for(var factor=0; factor < 1; factor=factor+step_size) {
        // pr("\tfactor: "+factor)
        var result = []
        for(var i in Frecs.nodes_proportionals) {
            if(!isUndef(Frecs.nodes_wos[i])) {
                var occs = Frecs.nodes_proportionals[i];
                // if (occs[a]!=occs[b]) {
                    var hex_source = Frecs_Color[occs[a]]
                    var hex_target = Frecs_Color[occs[b]]
                    var rgb_source = hex2rga(hex_source)
                    var rgb_target = hex2rga(hex_target)
                    // pr("\t\t"+rgb_source+" vs "+rgb_target)
                    var source = { "r":rgb_source[0], "g":rgb_source[1], "b": rgb_source[2] }
                    var target = { "r":rgb_target[0], "g":rgb_target[1], "b": rgb_target[2] }
                    var rgb_trans = blendColors(source, target, factor);
                    var rgb = rgbToHex ( rgb_trans["r"] , rgb_trans["g"] , rgb_trans["b"] )
                    // // pr("\t\t"+i+" -> "+rgb)
                    // // partialGraph._core.graph.nodesIndex[find(i)[0].id].color = rgb;
                    // var thefactor = factor*(occs[b]-occs[a

                    var n_id = Number(Label2ID[i]);
                    if(!results[n_id])
                        results[n_id] = []

                    // var result_dict = {
                    //     "t":Number(b),
                    //     "col": rgb ,
                    //     // "factor": (occs[b]>occs[a])?factor:(factor*-1)
                    //     // // // "size": 1
                    // }
                    results[n_id].push(rgb)
                    // // console.log( result_dict )
                    // result.push ( result_dict )
                // }
            }
        }
        // results.push (result)
    }
    return results;
}

// Timers scheduling
function ColoringGraph_final( globalcount , timer , t_a , t_b , step_size , ms , fullmovie , previous_sels) {
    var noeuds = Colorer_final( t_a , t_b , step_size )
    console.log( "in ColoringGraph_final()" )

    var K = -1
    for (var ID in noeuds) {
        console.log(ID)
        console.log(noeuds[ID])
        K = noeuds[ID].length;
        break
    }
    console.log( "K: "+K )

    // console.log(t_a+" -> "+t_b)
    // console.log("NOEUEUEUEUEUEUEUUDS")
    // console.log(noeuds)
    // console.log("")
    // return;

    for (var i = 0; i < K; i++) {
        // window.setTimeout( alertFunc(timer), 1000*i);
        console.log( (ms*(i+globalcount)) )
        window.setTimeout(function() {
            // console.log("\ti: "+i);
            // console.log("\tK: "+K);
            // console.log("\tms: "+ms);
            // console.log(Math.random())
            // console.log("\tglobalcount: "+ globalcount)
            // console.log("\titeration (globalcount/K): "+ globalcount/K)

            // console.log(" - - - - - - - - - - ")

            if(fullmovie)
                UpdateTimeSlider( (globalcount/K)+1 )
            // console.log(" - - - -- - -")



            for(var ID in noeuds) {
                // var id = noeuds[i][k]["n_id"];
                // var color = noeuds[ID][timer];
                partialGraph._core.graph.nodesIndex[ID].color = noeuds[ID][timer];
                // partialGraph._core.graph.nodesIndex[ID].forceLabel = (noeuds[ID][timer]<"#ff6600")?true:false;
                // partialGraph._core.graph.nodesIndex[id].size = ((partialGraph._core.graph.nodesIndex[id].size+incrm)<1)?1:partialGraph._core.graph.nodesIndex[id].size+incrm;
            }

            partialGraph.draw(2,2,2);

            var v_edges = getVisibleEdges();
            for(var e in v_edges) {
                var e_id = v_edges[e].id;
                var a = v_edges[e].source.color;
                var b = v_edges[e].target.color;
                if (a && b) {
                    a = hex2rga(a);
                    b = hex2rga(b);
                    var r = (a[0] + b[0]) >> 1;
                    var g = (a[1] + b[1]) >> 1;
                    var b = (a[2] + b[2]) >> 1;
                    partialGraph._core.graph.edgesIndex[e_id].color = "rgba("+[r,g,b].join(",")+",0.5)";
                }
            }

            partialGraph.draw(2,2,2);

            if( (globalcount/K)==(Frecs.timesteps.length-2) ) {
                $("#overlay").hide();
            }

            timer++;
        }, (ms*(i+globalcount)) , timer);
    }

    return K;
}


var min_buff = 0
function UpdateTimeSlider(value) {
    console.log("UpdateTimeSlider() the val: "+value)
    min_buff = value;
    $("#range_09").data("ionRangeSlider").update({ from: value });
}
