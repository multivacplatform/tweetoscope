$(function(){


    $('.slider').click(function () { 
        $('#nav').slideToggle(300, function() {
            xxx = 1;
        });

        var img = $(this).find('img');
        if ($(img).attr('id') == 'bot') {
            $(img).attr('src', 'images/arrow_top.png');
            $(img).attr('id', 'top');
        } else {
            $(img).attr('src', 'images/arrow_bottom.png');
            $(img).attr('id', 'bot');
            console.log( "\tshowing the shit" )
            console.log($("#nav").html().trim())
        }
    });


    
});