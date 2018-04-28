/*
 * Customize as you want ;)
 */


function newPopup(url) {
	popupWindow = window.open(url,'popUpWindow','height=700,width=800,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no')
}

function dummy_function() {
    console.log( "\t\t\t\t this does nothing" )
}

function SuperGraphReset( flag ) {
    if(!flag)
        return;

    nds = partialGraph._core.graph.nodes.filter(function(x) {
                            return !x['hidden'];
          });
    eds = partialGraph._core.graph.edges.filter(function(x) {
                            return !x['hidden'];
          });

    for(var x in nds){
        n=nds[x];
        n.color = Nodes[n.id].color;
        n.size = Nodes[n.id].size;
    }

    for(var x in eds){
        e=eds[x];
        e.color = Edges[e.id].color;
    }

    partialGraph.refresh();
    partialGraph.draw();
    $("#chart_shadow").remove()
    set_ClustersLegend( "clust_default" )
}


// ** To Delete pls **
function callGeomap(){
    db=JSON.stringify('community.db');
    if(is_empty(selections)){
        // jsonparams='["all"]';
        jsonparams='["unique_id"]&unique_id='+egonode[getUrlParam.nodeidparam];
    } else {

        N=getNodesByAtt(catSoc).length;

        nodesA = []
        nodesB = []
        socneigh = []
        for(var i in selections) {
            if(Nodes[i].type==catSoc) nodesA.push(i);
            if(Nodes[i].type==catSem) nodesB.push(i);
        }

        if(nodesA.length==0 && nodesB.length>0) socneigh = getArrSubkeys(opos,"key");
        if(nodesA.length>0 && nodesB.length>0) socneigh = getNeighs(nodesB,bipartiteN2D);

        kSels = {}

        for(var i in nodesA) {
            kSels[nodesA[i]] = 1;
        }
        for(var i in socneigh) {
            kSels[socneigh[i]] = 1;
        }

        k=Object.keys(kSels).length;

        // cats=(categoriesIndex.length);
        // arr={};
        // if(cats==2 && swclickActual=="social") {
        //     N=Object.keys(partialGraph._core.graph.nodes.filter(function(n){return n.type==catSoc})).length;
        //     arr=nodes1;
        // }
        // if(cats==2 && swclickActual=="semantic") {
        //     N=Object.keys(partialGraph._core.graph.nodes.filter(function(n){return n.type==catSem})).length;
        //     arr=nodes2;
        // }
        // if(cats==1)
        //     N=Object.keys(Nodes).length;

        // temp=getNeighs(Object.keys(selections),arr);
        // sel_plus_neigh=Object.keys(temp);
        // k=sel_plus_neigh.length;
        // // if(N==k) jsonparams='["all"]';
        pr ("N: "+N+" -  k: "+k)
        if(N==k) jsonparams='["unique_id"]&unique_id='+getUrlParam.nodeidparam;
        else jsonparams=JSON.stringify(Object.keys(kSels));

        //jsonparams=JSON.stringify(getSelections());
        //jsonparams = jsonparams.split('&').join('__and__');
    }
    pr('in callGeomap: db='+db+'&query='+jsonparams);
    initiateMap(db,jsonparams,"geomap2/");
    // $("#ctlzoom").hide();
    // $("#CurrentView").hide();
}


// ** To Delete pls **
function clickInCountry( CC ) {
    // pr("in extras.js: you've clicked "+CC)
    var results = []

    for(var i in Nodes) {
        if( !isUndef(Nodes[i].CC) && Nodes[i].CC==CC) results.push(i)
    }

    $.doTimeout(20,function (){

        if(swclickActual=="social") {
            MultipleSelection(results , false); //false-> dont apply deselection algorithm
            return;
        }

        if(swclickActual=="semantic") {
            var oposresults = getNeighs2( results , bipartiteD2N );
            MultipleSelection(oposresults , false);
            return;
        }

    });
}

// ** To Delete pls **
function callTWJS(){
    //    db=getCurrentDBforCurrentGexf();
    //    db=JSON.stringify(db);
    //    if(is_empty(selections)){
    //        jsonparams='["all"]';
    //    } else {
    //        jsonparams=JSON.stringify(getSelections());
    //        jsonparams = jsonparams.split('&').join('__and__');
    //    }
    //    pr('in callGeomap: db='+db+'&query='+jsonparams);
    //    initiateMap(db,jsonparams,"geomap/"); //From GEOMAP submod
    $("#ctlzoom").show();
    $("#CurrentView").show();
}

// ** To Delete pls **
function selectionToMap(){
    db=getCurrentDBforCurrentGexf();
    db=JSON.stringify(db);
    param='geomap/?db='+db+'';
    if(is_empty(selections)){
        newPopup('geomap/?db='+db+'&query=["all"]');
    } else {
        pr("selection to geomap:");
        jsonparams=JSON.stringify(getSelections());
        jsonparams = jsonparams.split('&').join('__and__');
        pr('geomap/?db='+db+'&query='+jsonparams);
        newPopup('geomap/?db='+db+'&query='+jsonparams);
    }
}

// ** To Delete pls **
//DataFolderMode
function getCurrentDBforCurrentGexf(){
    folderID=dataFolderTree["gexf_idfolder"][decodeURIComponent(getUrlParam.file)];
    dbsRaw = dataFolderTree["folders"][folderID];
    dbsPaths=[];
    for(var i in dbsRaw){
        dbs = dbsRaw[i]["dbs"];
        for(var j in dbs){
            dbsPaths.push(i+"/"+dbs[j]);
        }
        break;
    }
    return dbsPaths;
}

// ** To Delete pls **
//DataFolderMode
function getGlobalDBs(){
    graphdb=dataFolderTree["folders"];
    for(var i in graphdb){
        for(var j in graphdb[i]){
            if(j=="data") {
                maindbs=graphdb[i][j]["dbs"];
                for(var k in maindbs){
                    return jsonparams+"/"+maindbs[k];
                }
            }
        }
    }
}

// ** To Delete pls **
//DataFolderMode
function getTopPapers_old(type){
    if(getAdditionalInfo){
        jsonparams=JSON.stringify(getSelections());
        //jsonparams = jsonparams.replaceAll("&","__and__");
        jsonparams = jsonparams.split('&').join('__and__');
        dbsPaths=getCurrentDBforCurrentGexf();
        //dbsPaths.push(getGlobalDBs());
        dbsPaths=JSON.stringify(dbsPaths);
        thisgexf=JSON.stringify(decodeURIComponent(getUrlParam.file));
        image='<img style="display:block; margin: 0px auto;" src="'+'API_pasteur/img/ajax-loader.gif"></img>';
        $("#topPapers").show();
        $("#topPapers").html(image);
        $.ajax({
            type: 'GET',
            url: 'API_pasteur/info_div.php',
            data: "type="+type+"&bi="+bi+"&query="+jsonparams+"&dbs="+dbsPaths+"&gexf="+thisgexf,
            //contentType: "application/json",
            //dataType: 'json',
            success : function(data){
                pr('API_pasteur/info_div.php?'+"type="+type+"&bi="+bi+"&query="+jsonparams+"&gexf="+thisgexf+"&index="+field[thisgexf]);
                $("#topPapers").html(data);
                $("#topPapers").show();
            },
            error: function(){
                pr('Page Not found: getTopPapers()');
            }
        });
    }
}



function lalala() {

    var numbersList = []
    for(var i=0;i<30;i=i+3) {
        numbersList.push(i)
    }
    console.log( numbersList )
    // numbersList.sort(function(){ return Math.random()-0.5; });
    for(var i in Nodes) {
        // numbersList.sort(function(){ return Math.random()-0.5; });
        console.log( '"'+Nodes[i].label+'" : ['+numbersList.sort(function(){ return Math.random()-0.5; }).slice(0,10)+']'+',' )
    }
}


//This is for removing features from TinawebJS
function ProcessDivsFlags() {
    for(var i in DivsFlags) {
        if(DivsFlags[i]===false)
            $("#"+i).remove()
    }
}


// Execution:    ChangeGraphAppearanceByAtt( true )
// It scans the existing node-attributes and t keeps only those which are Numeric.
//  then, add the button in the html with the sigmaUtils.clustersBy(x) listener.
function ChangeGraphAppearanceByAtt( manualflag ) {

    if ( !isUndef(manualflag) && !colorByAtt ) colorByAtt = manualflag;
    if(!colorByAtt) return;

    // Seeing all the possible attributes!
    var AttsDict = {}
    var Atts_2_Exclude = {}
    var v_nodes = getVisibleNodes();
    for (var i in v_nodes) {
        if(!v_nodes[i].hidden) {

            var id = v_nodes[i].id;

            for(var a in Nodes[id].attributes) {
                var someatt = Nodes[id].attributes[a]

                // Identifying the attribute datatype: exclude strings and objects
                if ( ( typeof(someatt)=="string" && isNaN(Number(someatt)) ) || typeof(someatt)=="object" ) {
                    if (!Atts_2_Exclude[a]) Atts_2_Exclude[a]=0;
                    Atts_2_Exclude[a]++;
                }
            }

            var possible_atts = [];
            if (!isUndef(Nodes[id].attributes))
                possible_atts = Object.keys(Nodes[id].attributes)

            if(!isUndef(v_nodes[i].degree))
                possible_atts.push("degree")
            possible_atts.push("clust_louvain")

            for(var a in possible_atts){
                if ( !AttsDict[ possible_atts[a] ] )
                    AttsDict[ possible_atts[a] ] = 0
                AttsDict[ possible_atts[a] ] ++;
            }

        }
    }

    for(var i in Atts_2_Exclude)
        delete AttsDict[i];

    var AttsDict_sorted = ArraySortByValue(AttsDict, function(a,b){
        return b-a
    });

    // console.log( "I AM IN ChangeGraphAppearanceByAtt( true )" )
    // console.log( AttsDict_sorted )


    var div_info = "";

    if( $( ".colorgraph_div" ).length>0 )
        div_info += '<ul id="colorGraph" class="nav navbar-nav navbar-right">'

    div_info += ' <li class="dropdown">'
    div_info += '<a href="#" class="dropdown-toggle" data-toggle="dropdown">'
    div_info += '        <img title="Set Colors" src="libs/img2/colors.png" width="20px"><b class="caret"></strong></img>'
    div_info += '</a>'
    div_info += '  <ul class="dropdown-menu">'

    for (var i in AttsDict_sorted) {
        var att_s = AttsDict_sorted[i].key;
        var att_c = AttsDict_sorted[i].value;
        var the_method = "clustersBy"
        if(att_s.indexOf("clust")>-1) the_method = "colorsBy"
        div_info += '<li><a href="#" onclick=\''+the_method+'("'+att_s+'")\'>By '+att_s+'('+att_c+')'+'</a></li>'
        // pr('<li><a href="#" onclick=\''+the_method+'("'+att_s+'")\'>By '+att_s+'('+att_c+')'+'</a></li>')
    }
    div_info += '  </ul>'
    div_info += ' </li>'

    console.log('$( ".colorgraph_div" ).length')
    console.log($( ".colorgraph_div" ).length)
    if( $( ".colorgraph_div" ).length>0 )   {
        div_info += '</ul>'
        $( div_info ).insertAfter(".colorgraph_div");
        $( ".colorgraph_div" ).remove();
    } else {
        $("#colorGraph").html(div_info)
    }
}



//     [  / Twitter + HeatGraph   ]

function RunLouvain() {

  var node_realdata = []
  var nodesV = getVisibleNodes()
  for(var n in nodesV)
    node_realdata.push( nodesV[n].id )

  var edge_realdata = []
  var edgesV = getVisibleEdges()
  for(var e in edgesV) {
    var st = edgesV[e].id.split(";")
    var info = {
        "source":st[0],
        "target":st[1],
        "weight":edgesV[e].weight
    }
    edge_realdata.push(info)
  }
    var community = jLouvain().nodes(node_realdata).edges(edge_realdata);
    var results = community();
    for(var i in results)
        Nodes[i].attributes["clust_louvain"]=results[i]

}


function RunCPM ( ) {

    var mntnt  = partialGraph.states.slice(-1)[0].type.map(Number).join("|")
    var nodesV = getVisibleNodes()
    var Graph = {}
    for(var n in nodesV) {
        var ID = nodesV[n].id
        // console.log(ID + " : " + " and now=" +mntnt)
        // console.log( Relations[mntnt][ID] )
        // console.log("")
        Graph[ID] = Relations[mntnt][ID]
    }

    var jCPM = new CPM( Graph )
    var results = jCPM.k_clique_communities(3)

    var resultats = {}
    console.log("Groups: "+results.length)
    for(var r in results) {
        var groupID = Number(r)
        var group = results[groupID]
        // console.log(group)
        for(var n in group) {
            var nodeID = group[n]
            if(!resultats[nodeID])
                resultats[nodeID] = []
            resultats[nodeID].push( groupID )
        }
    }

    for(var r in resultats) {
        console.log(r)
        console.log(resultats[r])
        console.log("")
    }
}

function SomeEffect( ClusterCode ) {
    console.log( ClusterCode )

    var raw = ClusterCode.split("||")
    var Type=raw[0], Cluster=raw[1], clstID=Number(raw[2]);

    var present = partialGraph.states.slice(-1)[0]; // Last
    var type_t0 = present.type;
    var str_type_t0 = type_t0.map(Number).join("|")
    console.log( "\t"+str_type_t0)


    greyEverything();

    var nodes_2_colour = {};
    var edges_2_colour = {};

    var nodesV = getVisibleNodes()
    for(var i in nodesV) {
        var n = nodesV[i]
        n.forceLabel = false;
        var node = Nodes[n.id]
        if ( node.type==Type && !isUndef(node.attributes[Cluster]) && node.attributes[Cluster]==clstID ) {
            // pr( n.id + " | " + Cluster + " : " + node.attributes[Cluster] )
            nodes_2_colour[n.id] = n.degree;
        }
    }


    for(var s in nodes_2_colour) {
        if(Relations[str_type_t0] && Relations[str_type_t0][s] ) {
            neigh = Relations[str_type_t0][s]
            if(neigh) {
                for(var j in neigh) {
                    t = neigh[j]
                    if( !isUndef(nodes_2_colour[t]) ) {
                        edges_2_colour[s+";"+t]=true;
                        edges_2_colour[t+";"+s]=true;
                    }
                }
            }
        }
    }


    for(var i in nodes_2_colour) {
        n = partialGraph._core.graph.nodesIndex[i]
        if(n) {
            n.color = n.attr['true_color'];
            n.attr['grey'] = 0;
        }
    }


    for(var i in edges_2_colour) {
        an_edge = partialGraph._core.graph.edgesIndex[i]
        if(!isUndef(an_edge) && !an_edge.hidden){
            // pr(an_edge)
            an_edge.color = an_edge.attr['true_color'];
            an_edge.attr['grey'] = 0;
        }
    }





    var nodes_2_label = ArraySortByValue(nodes_2_colour, function(a,b){
        return b-a
    });

    for(var n in nodes_2_label) {
        if(n==4)
            break
        var ID = nodes_2_label[n].key
        partialGraph._core.graph.nodesIndex[ID].forceLabel = true;
    }



    overNodes=true;
    partialGraph.draw()


}


function set_ClustersLegend ( daclass ) {
    //partialGraph.states.slice(-1)[0].LouvainFait = true

    $("#legend_for_clusters").removeClass( "my-legend" )
    $("#legend_for_clusters").html("")

    var ClustNB_CurrentColor = {}
    var nodesV = getVisibleNodes()
    for(var i in nodesV) {
        n = nodesV[i]
        color = n.color
        type = Nodes[n.id].type
        clstNB = Nodes[n.id].attributes[daclass]
        ClustNB_CurrentColor[type+"||"+daclass+"||"+clstNB] = color
    }

    LegendDiv = ""

    if( daclass=="cluster_twitter" ) {
        LegendDiv += '    <div class="legend-title">'+D["#legend_for_clusters"]["tw"]["header"][LA]+'</div>'//Attention Relative
        LegendDiv += '    <div class="legend-scale">'
        LegendDiv += '      <ul class="legend-labels">'
        var Copy_Frecs_Color = Array.prototype.slice.call(Frecs_Color).reverse();
        for(var i in Copy_Frecs_Color) {

            var IDx = "."
            if(i==0) {
                IDx = D["#legend_for_clusters"]["tw"]["max"][LA] //"Twitter"
            }
            if(i==(Math.round(Copy_Frecs_Color.length/2)-1)  ) {
                IDx = D["#legend_for_clusters"]["tw"]["mean"][LA] //"Equilibre"
            }
            if(i==(Copy_Frecs_Color.length-1)) {
                IDx = D["#legend_for_clusters"]["tw"]["min"][LA] //"Science"
            }

            var Color = Copy_Frecs_Color[i]
            var ColorDiv = '<span style="background:'+Color+';"></span>'
            // console.log( '<li>'+ColorDiv+ IDx+"</li>")
            LegendDiv += '<li>'+ColorDiv+ IDx+"</li>"+"\n"
        }
    } else {
        if (daclass=="clust_louvain")
            daclass = "louvain"
        LegendDiv += '    <div class="legend-title">'+D["#legend_for_clusters"]["wos"]["header"][LA]+'</div>'
        LegendDiv += '    <div class="legend-scale">'
        LegendDiv += '      <ul class="legend-labels">'
        OrderedClustDicts = Object.keys(ClustNB_CurrentColor).sort()
        if( daclass.indexOf("clust")>-1 ) {
            for(var i in OrderedClustDicts) {
                var IDx = OrderedClustDicts[i]
                var raw = IDx.split("||")
                var Type = raw[0]
                var ClustType = raw[1]
                var ClustID = raw[2]
                var Color = ClustNB_CurrentColor[IDx]
                // pr ( Color+" : "+ Clusters[Type][ClustType][ClustID] )
                var ColorDiv = '<span style="background:'+Color+';"></span>'
                LegendDiv += '<li onclick=\'SomeEffect("'+IDx+'")\'>'+ColorDiv+ Clusters[Type][ClustType][ClustID]+"</li>"+"\n"
            }
        } else {
            for(var i in OrderedClustDicts) {
                var IDx = OrderedClustDicts[i]
                var Color = ClustNB_CurrentColor[IDx]
                // pr ( Color+" : "+ Clusters[Type][ClustType][ClustID] )
                var ColorDiv = '<span style="background:'+Color+';"></span>'
                LegendDiv += '<li onclick=\'SomeEffect("'+IDx+'")\'>'+ColorDiv+ IDx+"</li>"+"\n"
            }

        }
    }
    LegendDiv += '      </ul>'
    LegendDiv += '    </div>'


    $("#legend_for_clusters").addClass( "my-legend" );
    $("#legend_for_clusters").html( LegendDiv )
    $("#overlay").hide();

}


//For Pasteur
// function getTopPapers(type){
//     if(getAdditionalInfo){
//         jsonparams=JSON.stringify(getSelections());
//         bi=(Object.keys(categories).length==2)?1:0;
//         var APINAME = "API_pasteur/"
//         //jsonparams = jsonparams.replaceAll("&","__and__");
//         jsonparams = jsonparams.split('&').join('__and__');
//         //dbsPaths.push(getGlobalDBs());
//         thisgexf=JSON.stringify(decodeURIComponent(getUrlParam.file));
//         image='<img style="display:block; margin: 0px auto;" src="'+APINAME+'img/ajax-loader.gif"></img>';
//         $("#tab-container-top").show();
//         $("#topPapers").show();
//         $("#topPapers").html(image);
//         $.ajax({
//             type: 'GET',
//             url: APINAME+'info_div.php',
//             data: "type="+type+"&bi="+bi+"&query="+jsonparams+"&gexf="+thisgexf+"&index="+field[getUrlParam.file],
//             //contentType: "application/json",
//             //dataType: 'json',
//             success : function(data){
//                 pr(APINAME+'info_div.php?'+"type="+type+"&bi="+bi+"&query="+jsonparams+"&gexf="+thisgexf+"&index="+field[getUrlParam.file]);
//                 $("#topPapers").html(data);

//                 getTopProposals(type , jsonparams , thisgexf);
//             },
//             error: function(){
//                 pr('Page Not found: getTopPapers');
//             }
//         });
//     }
// }

//For CNRS
function getTopPapers(type){
    // true flag to get raw labels
    var rawselections = getSelections(true)
    if(getAdditionalInfo && rawselections.length>0){
        MainTwitterApp( rawselections , null )
        jsonparams=JSON.stringify(rawselections);
        bi=(Object.keys(categories).length==2)?1:0;
        console.log("using var APINAME from settings:", APINAME)
        //jsonparams = jsonparams.replaceAll("&","__and__");
        jsonparams = jsonparams.split('&').join('__and__');
        //dbsPaths.push(getGlobalDBs());
        thisgexf=JSON.stringify(decodeURIComponent(getUrlParam.file));
        image='<img style="display:block; margin: 0px auto;" src="'+APINAME+'img/ajax-loader.gif"></img>';
        $("#tab-container-top").show();
        $("#topPapers").show();
        console.log(jsonparams)
        $("#topPapers").html(image);
        $.ajax({
            type: 'GET',
            url: APINAME+'info_div.php',
            data: "type="+type+"&bi="+bi+"&query="+jsonparams+"&gexf="+thisgexf+"&index="+field[getUrlParam.file]+"&maxpubs="+max_pubs,
            //contentType: "application/json",
            //dataType: 'json',
            success : function(data){
                pr(APINAME+'info_div.php?'+"type="+type+"&bi="+bi+"&query="+jsonparams+"&gexf="+thisgexf+"&index="+field[getUrlParam.file]);
                $("#topPapers").html(data);
                $("#selectionsBox h3").append(" <span>("+$("#perctg_selection").html()+'% <span style="font-size:65%;">'+D["#selectionsBox"]["text"][LA]+'.</span>) </span>')

            },
            error: function(){
                pr('Page Not found: getTopPapers');
            }
        });
    }
}

function getTopProposals(type , jsonparams , thisgexf) {

    type = "semantic";
    if(swclickActual=="social") {
        nodesA = []
        nodesB = []
        socneigh = []
        for(var i in selections) {
            if(Nodes[i].type==catSoc) nodesA.push(i);
            if(Nodes[i].type==catSem) nodesB.push(i);
        }

        if(nodesA.length>0 && nodesB.length==0) socneigh = getArrSubkeys(opos,"key");
        if(nodesA.length>0 && nodesB.length>0) socneigh = getNeighs(nodesA,bipartiteD2N);

        kSels = {}

        for(var i in nodesB) {
            kSels[nodesB[i]] = 1;
        }
        for(var i in socneigh) {
            kSels[socneigh[i]] = 1;
        }

        concepts = getSelections()
        jsonparams=JSON.stringify(concepts);

        jsonparams = jsonparams.split('&').join('__and__');
    }


    image='<img style="display:block; margin: 0px auto;" src="'+"API_pasteur/"+'img/ajax-loader.gif"></img>';
    $("#topProposals").show();
    $("#topProposals").html(image);
    $.ajax({
        type: 'GET',
        url: "API_pasteur/"+'info_div2.php',
        data: "type="+"semantic"+"&query="+jsonparams+"&gexf="+thisgexf,
        //contentType: "application/json",
        //dataType: 'json',
        success : function(data){
            pr("API_pasteur/"+'info_div2.php?'+"type="+"semantic"+"&query="+jsonparams+"&gexf="+thisgexf);
            $("#topProposals").html(data);
        },
        error: function(){
            pr('Page Not found: getTopProposals');
        }
    });
}


//FOR UNI-PARTITE
function selectionUni(currentNode){
    pr("\tin selectionUni:"+currentNode.id);
    if(checkBox==false && cursor_size==0) {
        highlightSelectedNodes(false);
        opossites = [];
        selections = [];
        partialGraph.refresh();
    }

    if((typeof selections[currentNode.id])=="undefined"){
        selections[currentNode.id] = 1;
        currentNode.active=true;
    }
    else {
        delete selections[currentNode.id];
        currentNode.active=false;
    }
    //highlightOpossites(nodes1[currentNode.id].neighbours);
    //        currentNode.color = currentNode.attr['true_color'];
    //        currentNode.attr['grey'] = 0;
    //
    //


    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
    partialGraph.refresh();
}

//JUST ADEME
function camaraButton(){
    $("#PhotoGraph").click(function (){

        //canvas=partialGraph._core.domElements.nodes;



        var nodesCtx = partialGraph._core.domElements.nodes;
        /*
        var edgesCtx = document.getElementById("sigma_edges_1").getContext('2d');

        var edgesImg = edgesCtx.getImageData(0, 0, document.getElementById("sigma_edges_1").width, document.getElementById("sigma_edges_1").height)

        nodesCtx.putImageData(edgesImg,0,0);




        //ctx.drawImage(partialGraph._core.domElements.edges,0,0)
        //var oCanvas = ctx;
  */
        //div = document.getElementById("sigma_nodes_1").getContext('2d');
        //ctx = div.getContext("2d");
        //oCanvas.drawImage(partialGraph._core.domElements.edges,0,0);
        Canvas2Image.saveAsPNG(nodesCtx);

        /*
        Canvas2Image.saveAsJPEG(oCanvas); // will prompt the user to save the image as JPEG.
        // Only supported by Firefox.

        Canvas2Image.saveAsBMP(oCanvas);  // will prompt the user to save the image as BMP.


        // returns an <img> element containing the converted PNG image
        var oImgPNG = Canvas2Image.saveAsPNG(oCanvas, true);

        // returns an <img> element containing the converted JPEG image (Only supported by Firefox)
        var oImgJPEG = Canvas2Image.saveAsJPEG(oCanvas, true);

        // returns an <img> element containing the converted BMP image
        var oImgBMP = Canvas2Image.saveAsBMP(oCanvas, true);


        // all the functions also takes width and height arguments.
        // These can be used to scale the resulting image:

        // saves a PNG image scaled to 100x100
        Canvas2Image.saveAsPNG(oCanvas, false, 100, 100);
        */
    });
}


//JUST ADEME
function getChatFrame() {
    content = '<div id="showChat" onclick="showhideChat();"><a href="#" id="aShowChat"> </a></div>';
    content += '<iframe src="'+ircUrl+'"'
    content += 'width="400" height="300"></iframe>';
    $("#rightcolumn").html(content);
}


//JUST ADEME
function showhideChat(){

    cg = document.getElementById("rightcolumn");
    if(cg){
        if(cg.style.right=="-400px"){
            cg.style.right="0px";
        }
        else cg.style.right="-400px";
    }
}


function getTips_generic(){
    param='';

    text =
        "<br>"+
        "Basic Interactions:"+
        "<ul>"+
        "<li>Click on a node to select/unselect and get its information. In case of multiple selection, the button unselect clears all selections.</li>"+
        "<li>The switch button switch allows to change the view type.</li>"+
        "</ul>"+
        "<br>"+
        "Graph manipulation:"+
        "<ul>"+
        "<li>Link and node sizes indicate their strength.</li>"+
        "<li>To fold/unfold the graph (keep only strong links or weak links), use the 'edges filter' sliders.</li>"+
        "<li>To select a more of less specific area of the graph, use the 'nodes filter' slider.</li>"+
        "</ul>"+
        "<br>"+
        "Micro/Macro view:"+
        "<ul>"+
        "<li>To explore the neighborhood of a selection, either double click on the selected nodes, either click on the macro/meso level button. Zoom out in meso view return to macro view.</li>"+
        "<li>Click on the 'all nodes' tab below to view the full clickable list of nodes.</li>"+
        "</ul>";

    $("#tab-container").hide();
    $("#tab-container-top").hide();
    return text;
}


function getTips(){
    var text = ""
    param='';
    var isChecked = $('#myonoffswitch1').is(':checked')

    // if true: twitter explanation

    if (isChecked) {
        //
        text = D["#tips"]["tw"][LA];
        } else { // if false: WoS explanation
            //
            text = D["#tips"]["wos"][LA];
        }

        $("#tab-container").hide();
        $("#tab-container-top").hide();
        return text;
    }


function save_suggestions() {
    var query = $("#proposed_terms").val()
    query = $.trim( query.toLowerCase() )
    console.log("saving suggestions:")
    console.log( query )
    var info = {
        "source": window.location.href,
        "data" : query,
        "date" : (new Date()).toISOString(),
        "geo" : gg,
        "new": (ExtraWords[query])?3:2
    }
    console.log( info )
    console.log(" - - -  - -")
    $("#sendcrowds").html("...")
    $.ajax({
        type: "POST",
        url: "TwitterPlugin/s.php",
        // cache:false,
        // contentType: "application/json",
        data: info,
        dataType: "json",
        success : function(data, textStatus, jqXHR) {
            console.log( "SUCCESS" )
            console.log( data )
            setTimeout(function(){
                $("#sendcrowds").html(D["#sendcrowds"]["thanks"][LA])
                setTimeout(function(){
                    clean_crowdsourcingform()
                }, 3000);
            }, 1000);
        },

        error: function(exception) {
            console.log(exception)
            console.log("exception!:"+exception.status)
        }

    })
}


// building the autocomplete (from a csv)
$("#openthemodal").click(function(){
    $("#crowdsourcing_modal").modal("show")
    if( Object.keys(ExtraWords).length >0 )
        return true;
    $.ajax({
        type: "GET",
        url: "newinterface/extra-keywords.csv",
        dataType: "text",
        success: function(data) {
            var Dicto = CSVToArray(data , "\t")
            for(var w in Dicto) {
                var normalize_word = Dicto[w][0].toLowerCase()
                if( !Label2ID[normalize_word] )
                    ExtraWords[normalize_word] = true
            }
            delete Dicto;
            $( "#proposed_terms" ).autocomplete({
                source: Object.keys(ExtraWords)
            });
            geolocator.locateByIP(onGeoSuccess, false, 2, false);
            // $.getScript( "https://www.google.com/recaptcha/api.js", function( data, textStatus, jqxhr ) {
            //   console.log( data ); // Data returned
            //   console.log( textStatus ); // Success
            //   console.log( jqxhr.status ); // 200
            //   console.log( "Load was performed." );
            // });

        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("Status: " + xhr.status + "     Error: " + thrownError);
        }
    });
})

// button for calling the search-function
$("#search_proposed_terms").click(function() {
    if($("#proposed_terms").val()=="")
        return false;

    var query = $("#proposed_terms").val()
    query = $.trim( query.toLowerCase() )
    var msg = ""
    $("#wos_chart").html("")
    if( Label2ID[query] ) {
        // query : in the Map
        //    -> GO to ISC-API
            //
            msg += D["#wos_chart"]["Map"][LA]
            search_proposed_terms ( [query] , 0 , msg )

    } else {
        if( ExtraWords[query] ) {
            // query : in the Miam
            //    -> GO to ISC-API
            //
            msg = D["#wos_chart"]["Miam"][LA]
            // msg += '<div class="g-recaptcha" data-sitekey="6Lf25BETAAAAAEbliTgBUoCz8bXFB_-fEMwAlemM"></div>'
            // msg += '<center><button class="btn btn-success"><strong>Oui</strong></button></center>'
            search_proposed_terms ( [query] , 0 , msg )
        } else {
            // query : new
            //    -> DO NOT GO to ISC-API
            //
            msg = D["#wos_chart"]["Null"][LA]
            // msg += '<div class="g-recaptcha" data-sitekey="6Lf25BETAAAAAEbliTgBUoCz8bXFB_-fEMwAlemM"></div>'
            // msg += '<center><button class="btn btn-success"><strong>Oui</strong></button></center>'
            setTimeout(function(){
                $("#wos_chart").html(msg)
            }, 300);

        }
    }



    // var raw_query = $("#proposed_terms").val().split(",");
    // for(var i in raw_query) {
    //     raw_query[i] = $.trim(raw_query[i])
    // }
    // console.log(raw_query)
    // search_proposed_terms ( raw_query )
});

// input with autocomplete
$("#proposed_terms").keypress(function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
        $("#search_proposed_terms").click();
        $(this).autocomplete('close');
    }
})

// when you press Close crowdsourcing-modal.
function clean_crowdsourcingform() {
    $("#proposed_terms").val("")
    $("#wos_chart").html("")
}


function test_api( the_query  , max_pubs) {
    var args = {
        "q": the_query,
        "since": 1989,
        "until": 2013,
        "type":2,
        "count": max_pubs
    }
    var some_url = 'https://api.iscpif.fr/1/climate/search/wos/articles.json'
    $.ajax({
        type: "GET",
        url: some_url,
        data: args,
        dataType: "json",
        success : function(data, textStatus, jqXHR) {

            var results = []
            if( data.total>0 ){

                var html_content = D["#topPapers"][LA].replace("TOTAL",data.total);
                for( var i in data.hits.hits ) {
                    // console.log("ARTICLE Nº "+i + "    score = "+data.hits.hits[i]._score)
                    var info = {}
                    for(var j in data.hits.hits[i].fields) {
                        if( j=="AU" ) {
                            var formated_authors = []
                            var etal_flag = false
                            for(var k in data.hits.hits[i].fields[j]) {
                                var authorname =  data.hits.hits[i].fields[j][k]
                                var porciones = authorname.split( ", " )
                                var temp_name = porciones[1].toUpperCase()+" "+porciones[0].charAt(0).toUpperCase()+ porciones[0].slice(1);
                                formated_authors.push( temp_name )
                                if(k==4) {
                                    etal_flag=true
                                    break
                                }
                            }
                            var AU = (etal_flag)? (formated_authors.join(", ")+" et al.") : formated_authors.join(", ");
                            info[ "AU" ] = AU;
                        } else {
                            info[ j ] = data.hits.hits[i].fields[j].join(",")
                        }
                        // results.push( info )
                    }
                    var authors = (info["AU"])?info["AU"]:"";
                    html_content += '<li> <img src="API_CNRS/img/star.gif" border="0"></img>  <button onclick="$(\'#paperinfo_modal\').modal(\'show\')">ok</button> <a> '+info["TI"]+' </a> ['+info["PY"]+']  '+authors+'  </li> <br>'
                }
                html_content += ' </ul> </div>';
                $("#topPapers").html( html_content )
            }
        },

        error: function(exception) {
            console.log("exception!:"+exception.status)
        }
    })


}


// method for calling the ISC-API and get pubs-distribution
function search_proposed_terms( the_query , mode , msg ) {
    var args = {
        "q": the_query,
        "since": 1989,
        "until": 2013,
        "type":2,
        "count": 5
    }

    $("#wos_chart").html("")
    $.ajax({
        type: "GET",
        url: 'https://api.iscpif.fr/1/climate/search/wos/histogram.json',//articles.json
        data: args,
        dataType: "json",
        success : function(data, textStatus, jqXHR) {

            if(data.total==0) {
                $("#wos_chart").html(msg)
                return false;
            }
            else {
                var docs_years = []
                for(var i in data.aggs.publicationCount.buckets) {
                    var elem = data.aggs.publicationCount.buckets[i]
                    docs_years.push( [ elem.key+"" , elem.doc_count] )
                }
                //
                RenderTweets_MultiLineChart ( "wos_chart" , D["#wos_chart"]["header"][LA] ,["Date" , "#Publications"] , docs_years , true )
                $("#wos_chart").append("<br>"+msg)
            }
        },

        error: function(exception) {
            console.log("exception!:"+exception.status)
            $("#wos_chart").prepend(msg)
        }
    })
}


//both obsolete
function closeDialog () {
    $('#windowTitleDialog').modal('hide');
}
function okClicked () {
    //document.title = document.getElementById ("xlInput").value;
    closeDialog ();
}


function getCsv(filepath) {
    var result = false;
    $.ajax({
        type: "GET",
        url: filepath,
        dataType: "text",
        async:false,
        success: function(data) {
            var Dicto = CSVToArray(data , ",")
            for(var i=1; i<Dicto.length;i++) {
                if(Dicto[i].length>1) {
                    var EN = Dicto[i][1].toLowerCase()
                    FR_EN__Dict[EN] = Dicto[i][0].toLowerCase()
                }
            }
            result = true;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("Status: " + xhr.status + "     Error: " + thrownError);
        }
    });
    return result;
};

function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
