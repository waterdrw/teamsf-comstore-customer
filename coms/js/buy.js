function initAll ()
{
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var compon_list = new Array();

    //console.log(userData);

    var url = "http://teamsf.co.kr/~coms/shop_compon_list_show.php";
    var sId = $.getUrlVar("shopId");

    var params = {sid:sId, mid:userData.id};
    
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(compons){
        //console.log(compons);
        compon_list = compons;

        for (var i in compons) {
            var compon = compons[i];
            var temp = parseInt(i)+1;
            $('#compon'+temp).html(compon.price);
            $('#compon-'+temp+'-name').html(compon.item_name);
        }

        $('.banner-coupon:nth-child(1)').tap();

    });

    $('.banner-coupon').on('tap',function(e){
        
        var index = $(this).attr('value');
        var compon = compon_list[index];

        for (var i in compon_list) {
            var temp = parseInt(i)+1;
            $('.banner-coupon:nth-child('+temp+')').removeClass('active');
        }

        var combo = compon.combo_count;
        $('#shop-name').html(compon.shop_name);
        $('#limit-date').html(compon.limit_date);
        $('#compon-image').attr('src',compon.shop_profile_img_path);

        $('#combo-count').html(compon.combo_count);
        $('#price-discount').html(compon.discount_rate);
        $('.buy-discount-price').html(commaNum(parseInt(compon.price*10000)-parseInt(compon.discount_price*10000)));
        $('.buy-price').html(commaNum(parseInt(compon.price*10000)));

        $('#compon-num').val(parseInt(index)+1);
        
        $(this).addClass('active');
        //console.log(compon_list[i]);
    });
    $('#btn-phone').on('tap', function(){
        var itemId = $('#compon-num').val();
        window.location = "./buy_result.html?shopId="+sId+"&itemId="+itemId;
    });
    $('#btn-credit').on('tap', function()
    {
    	var ajaxParam =
    	{
    		mid:userData.id,
    		sid:sId
    	};
    	
    	$.ajax (
    	{
    		url:"http://teamsf.co.kr/~coms/shop_compon_duplication_check.php",
    		data:ajaxParam,
    		type:"post",
    		dataType:"json",
    		success:function ( existJsonObj )
    		{
    			if ( existJsonObj.exist == true )
    			{
    				doAlert("이미 발급한 콤템이 있습니다!","콤템 발급 오류",function(){});
    				return;
    			}
    			else
    			{   
    		        navigator.notification.confirm ( "콤템을 발급 받으시겠습니까?", function ( btnIndex )
	            	{
	            		g_isOpen = false;
	            		if ( btnIndex == 1 )
	            		{
	            			var itemId = $('#compon-num').val();
	        		        window.location = "./buy_result.html?shopId="+sId+"&itemId="+itemId;
	            		}
	            	}, "콤템 발급" ,["확인","취소"] );
    			}
    		}
    	});
    });
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}0

function initPhonegap ()
{
	document.addEventListener("deviceready", initAll , false);	
}