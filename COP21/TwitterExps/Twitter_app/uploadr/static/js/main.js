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


var dataq = JSON.parse(getUrlParam.queries)
console.log(dataq)
console.log(" - - -")

$.ajax({
    type: 'POST',
    // url: '/static/js/example.json',
    url: '/twitterquery',
    data: { queries : getUrlParam.queries},
    dataType: 'json',
    async:true,
    success : function(data){ 

      var gcdata = [] 

      if(typeof(data)==="object")
        gcdata = data;
      else
        gcdata = JSON.parse(data)

      console.log( gcdata )

      new Chartkick.LineChart("chart-4" , gcdata );
    },
    error: function(){ 
        pr('Page Not found: ajax in main()');
    }
});