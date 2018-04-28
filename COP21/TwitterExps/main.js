

$.ajax({
    type: 'GET',
    url: 'example.json',
    contentType: "application/json",
    async:true,
    //dataType: 'json',
    success : function(data){ 
      new Chartkick.LineChart("chart-4" , data );
      console.log( data )
    },
    error: function(){ 
        pr('Page Not found: ajax in main()');
    }
});