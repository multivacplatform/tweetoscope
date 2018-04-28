var LA = (typeof(getUrlParam.lang)==="undefined")? "FR" : getUrlParam.lang;

var D = {
	"#legend_for_clusters" : {
		"tw": {
			"header" : {
				"FR": "Attention Relative",
				"EN": "Relative Attention"
			},
			"max": {
				"FR": "Twitter",
				"EN": "Twitter"
			},
			"mean": {
				"FR": "Equilibre",
				"EN": "Balanced"
			},
			"min": {
				"FR": "Science",
				"EN": "Science"
			}
		},
		"wos": {
			"header" : {
				"FR": "Sujets de recherche",
				"EN": "Research areas"
			},
		},
	},
	"#selectionsBox": {
		"text": {
			"FR": "des publications",
			"EN": "publications"
		},
	},
	"#tips": {
		"tw": {
			"FR": '<br><br><div class="header">MODE D\'EMPLOI</div><br>La vue <strong><i>Comparaison publications scientifiques - attention web</i></strong> ci-contre permet de comparer, sur un même sujet, l\'attention accordée par les scientifiques avec l\'attention accordée par le Web (media et opinion publique principalement).<br><br>La plateforme Twitter est utilisée pour mesurer quotidiennement depuis mai 2015  l\'intérêt du web à travers l\'analyse de plusieurs millions de Tweets par mois et des pages web associées (article de presse, billet de blog, etc.).<br><br>Dans cette vue, la taille d\'un terme est fonction de la proportion de documents qui lui est associé toutes communautés confondues : scientifiques, media et opinion publique. La couleur indique quant à elle les communautés qui s\'intéressent majoritairement à ce terme : bleu pour le web (media et l\'opinion publique), orange/rouge pour la communauté scientifiques, vert lorsqu\'une égale attention est accordée par l\'ensemble de ces communautés.<br><br><strong>Cliquez sur l\'icône \"play\" en bas de l\'écran, pour découvrir une animation montrant l\'évolution de cette attention depuis mai 2015. Vous verrez ainsi que, selon l\'actualité, ce ne sont pas toujours les mêmes thèmes qui dominent les débats.</strong><br><br><strong>Cliquez sur un terme pour découvrir les enjeux associés.</strong><br>',
			"EN": '<br><br><div class="header">HOW TO USE</div><br><p lang="en-US">When the media or us&nbsp;talk about climate change, we mean <em>temperatures</em>, <em>storms</em>, <em>droughts</em>, <em>cyclones</em>, <em>polar bears</em> ; &nbsp;while the researchers talk about <em>observations</em>, <em>circulation models</em>, <em>temperature anomalies</em> …</p><p lang="en-US">But do the concerns of scientists sometime converge with those of the general public and media? This is what you can see thanks to climate Tweetoscope which offers interactive exploration of topics related to climate change and its consequences. Analyzing news in the web since May 2015 with Twitter as a proxy, the Tweetoscope aims to provide an evolving collective representation of questions and debates on this major societal issue.<br></p><div style="border-radius:0px"> <u></u> <div> <p lang="en-US"><p><br><strong>View “Twitter and Media”</strong>. This view compares, on the same subject, the attention paid by scientists and that granted by the web (mainly media and public opinion). The interest of the web is measured daily since May 2015 through the Twitter platform.</p> <br><p>The analysis of several million Tweets per month and the study of the related web pages (news articles, blog posts, etc.) makes it possible to measure if some topics are over-represented or under-represented relative to the attention granted by scientists.</p><br><p>In this view, the size of a term is based on the proportion of documents associated with it (from all communities): scientists, media and public opinion. The color indicates the communities that are predominantly mentioning a term: blue for the web (media and public), orange / red for the scientific community, green when equal attention is given by all these communities.</p> </div>'
		},
		"wos": {
			"FR": '<br><br><div class="header">MODE D\'EMPLOI</div><br>Lorsque dans les médias, ou entre nous, on parle du changement climatique, on entend \"températures, tempêtes, sécheresse, cyclones, ours blancs\"... Les chercheurs, eux, parlent d\'observations, de modèles, d\'anomalies de températures... <br><br>Mais, quelquefois ou souvent, les préoccupations des scientifiques ne rejoignent-elles pas celles du grand public et des médias ? C\'est ce que vous pouvez observer grâce au Tweetoscope climatique.<br><br>La <strong><i>Vue thématique</i></strong> ci-contre permet d\'explorer la littérature scientifique (plus de 200 000 analysés articles sur 30 ans). Les termes spécifiques aux recherches sur les changements climatiques sont représentés avec une taille proportionnelle au nombre de publications les mentionnant. Des liens les relient lorsqu\'ils sont mis fréquemment en relation par les chercheurs, ce qui permet de les disposer en fonction de leurs proximités thématiques.<br><br>Une couleur est attribuée à chaque grand thème de recherche: <i>\"gaz à effet de serre\"</i>, <i>\"ressources en eau et irrigation\"</i>, <i>\"augmentation des températures\"</i> ... <br><br>La vue <strong><i>Comparaison publications scientifiques - attention web</i></strong> propose un autre point de vue établi à partir de l\'analyse des messages sur Twitter.<br><br><strong>Cliquez sur un terme pour découvrir les enjeux associés ou changez de vue pour découvrir l\'évolution des débats du Web à propos du changement climatique.</strong><br><br><strong>Enfin, quelle que soit la vue, n’hésitez pas à zoomer !</strong><br>',
			"EN": '<br><br><div class="header">HOW TO USE</div><br><p lang="en-US">When the media or us&nbsp;talk about climate change, we mean <em>temperatures</em>, <em>storms</em>, <em>droughts</em>, <em>cyclones</em>, <em>polar bears</em> ; &nbsp;while the researchers talk about <em>observations</em>, <em>circulation models</em>, <em>temperature anomalies</em> …</p><p lang="en-US">But do the concerns of scientists sometime converge with those of the general public and media? This is what you can see thanks to climate Tweetoscope which offers interactive exploration of topics related to climate change and its consequences. Analyzing news in the web since May 2015 with Twitter as a proxy, the Tweetoscope aims to provide an evolving collective representation of questions and debates on this major societal issue.<br></p><div style="border-radius:0px"> <u></u> <div> <p lang="en-US"><br><strong>View "</strong><strong><strong>Science</strong>".</strong> This view allows you to explore the scientific literature (over 400,000 articles analyzed over 30 years).</p> <p lang="en-US">Specific terms to research on climate change have been identified and are represented with a size proportional to the number of publications mentioning them.</p> <p lang="en-US">Links between terms are drawn when they are frequently placed in relationship by researchers.This information is used to dispose them according to their thematic proximity.</p> <p lang="en-US">A color is assigned to each major research theme like “greenhouse gases”, “water resources and irrigation”, “rising temperatures” …</p> </div> <u></u></div><div> ',
		}
	},
	"#sendcrowds": {
		"thanks": {
			"FR":'<strong style="color:green;">Merci beaucoup :)</strong>',
			"EN":'<strong style="color:green;">Thanks for your feedback! :) </strong>',
		}
	},
	"#wos_chart": {
		"Map": {
			"FR":'<br><strong style="color:green;">Ce term est déjà dans la carte</strong>&nbsp;&nbsp;',
			"EN":'<br><strong style="color:green;">Already in the map</strong>&nbsp;&nbsp;',
		},
		"Miam": {
			"FR":'<div id="sendcrowds"><strong>Proposer ce terme pour la prochaine mise à jour ?</strong>&nbsp;&nbsp;<button class="btn btn-success" onclick="save_suggestions()"><strong>Oui</strong></button></div>',
			"EN":'<div id="sendcrowds"><strong>Propose this term in the next update ?</strong>&nbsp;&nbsp;<button class="btn btn-success" onclick="save_suggestions()"><strong>Yes</strong></button></div>',
		},
		"Null": {
			"FR": '<div id="sendcrowds"><strong style="color:red;">Ce terme n\'a pas encore été identifié.</strong><br><br><strong>Souhaitez-vous le proposer pour la prochaine mise à jour ?</strong>&nbsp;&nbsp;<button class="btn btn-success" onclick="save_suggestions()"><strong>Oui</strong></button></div>',
			"EN": '<div id="sendcrowds"><strong style="color:red;">Term not indexed yet.</strong><br><br><strong>Do you wish to suggest it for the next update ?</strong>&nbsp;&nbsp;<button class="btn btn-success" onclick="save_suggestions()"><strong>Yes</strong></button></div>',
		},
		"header": {
			"FR": "Frequence dans Web of Science",
			"EN": "Frequency in Web of Science",
		}
	},
	"#tweets-table": {
		"res": {
			"FR": "<center><strong>Pas de résultats.</strong></center><br>",
			"EN": "<center><strong>No results.</strong></center><br>",
		},
		"since":{
			"FR": "du",
			"EN": "from",
		},
		"until":{
			"FR": "au",
			"EN": "to",
		},
		"title_global": {
			"FR": "Evolution du nombre total de Tweets collectés",
			"EN": "Evolution of total number of collected Tweets",
		},
		"title_local": {
			"FR": "Evolution du nombre de Tweets collectés",
			"EN": "Evolution of number of collected Tweets",
		}
	},
	"#app_title": {
		"FR": 'T<span class="sub">WEETOSCOPE</span> C<span class="sub">LIMATIQUE</span>',
		"EN": 'C<span class="sub">LIMATE</span> T<span class="sub">WEETOSCOPE</span>'
	},
	"#reset_view": {
		"FR": "Recharger vue actuelle",
		"EN": 'Reset current view'
	},
	"#switch_wos": {
		"FR": "Vue thématique",
		"EN": "Science"
	},
	"#switch_tw": {
		"FR": "Attention web",
		"EN": "Twitter & Media"
	},
	"#searchinput": {
		"FR": "Recherche un terme",
		"EN": "Search a term"
	},
	"#taboppos": {
		"FR": '<a href="#tabs1">Voisinage contraire</a>',
		"EN": '<a href="#tabs1">Opposite-Neighbors</a>'
	},
	"#tabneigh": {
		"FR": '<a href="#tabs1">Principaux termes associés</a>',
		"EN": '<a href="#tabs1">Related terms</a>'
	},
	"#openthemodal": {
		"FR": "Suggérez de nouveaux termes !",
		"EN": "Suggest new terms !"
	},
	"#extra_info": {
		"FR": "Participez au Tweetoscope accédez à une exploration avancée, découvrez des commentaires de scientifiques",
		"EN": "Participate, explore and discover at"
	},
	"#crowdsource_legend": {
		"FR": '<h3>Contribuez au Tweetoscope</h3>Si des thématiques vous semblent absentes de cette carte, vous pouvez les proposer pour la prochaine mise à jour.',
		"EN": '<br><h2>Contribute to the Tweetoscope</h2>If some climate change topics appear to be missing here, you can make suggestions for the next Tweetoscope update.',
	},
	"#crowd_header": {
		"FR": "Contribuez au Tweetoscope Climatique",
		"EN": "Contribute to Climate Tweetoscope"
	},
	"#crowd_body": {
		"FR": "Des sujets importants vous semblent absents du Tweetoscope Climatique ? <br>Nous vous proposons de les suggérer pour sa prochaine mise à jour. Les termes proposés seront examinés par notre équipe et les plus pertinents seront ajoutés. <br><br><strong>Rechercher un terme</strong>, observez son évolution et ajoutez-le si cela vous semble opportun. Vous pouvez aussi proposer des termes qui n'ont pas encore été identifiés.",
		"EN": "If some climate change topics appear to be missing here, you can make suggestions for the next Tweetoscope update."
	},
	"#close_crowdsourcing_modal": {
		"FR": "Fermer",
		"EN": "Close"
	},
	"#howtouse": {
		"FR": "Mode d'emploi",
		"EN": "Tutorial"
	},
	"#about": {
		"FR": "A propos",
		"EN": "About"
	},
	"#topPapers": {
		"FR": '<h4> Exemples de publications (parmi TOTAL pertinentes):</h4> <br> <ul>',
		"EN": '<h4> Top publications sample (from TOTAL related):</h4> <br> <ul>',
	},

}


$("#app_title").html( D["#app_title"][LA] )
$("#reset_view").attr({  "title": D["#reset_view"][LA] })
$("#switch_wos").html( D["#switch_wos"][LA] )
$("#switch_tw").html( D["#switch_tw"][LA] )
$("#searchinput").attr({  "placeholder": D["#searchinput"][LA] })
$("#taboppos").html( D["#taboppos"][LA] )
$("#tabneigh").html( D["#tabneigh"][LA] )
$("#openthemodal").html( D["#openthemodal"][LA] )
$("#extra_info").html( D["#extra_info"][LA] )
$("#crowd_header").html( D["#crowd_header"][LA] )
$("#crowd_body").html( D["#crowd_body"][LA] )
$("#close_crowdsourcing_modal").html( D["#close_crowdsourcing_modal"][LA] )
$("#howtouse").html( D["#howtouse"][LA] )
$("#about").html( D["#about"][LA] )
$("#crowdsource_legend").html( D["#crowdsource_legend"][LA] )
