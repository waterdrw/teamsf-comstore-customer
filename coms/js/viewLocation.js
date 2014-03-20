function initAll() {
	
	var address = decodeURIComponent($.getUrlVar("address"));
	var lat = $.getUrlVar("lat");
	var lng = $.getUrlVar("lng");
	var latlng = new google.maps.LatLng (lat, lng);
    
    //$('#map_canvas').gmap({'center': latlng});

    $('#shop-address').html(address);
    $('#map_canvas').height(getRealContentHeight());
    //var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var mapOptions = {
		zoom: 14,
		center: latlng
	}
	var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var marker = new google.maps.Marker({
	  position: latlng,
	  map: map
	});
	
}

function initPhoneGap () 
{
	document.addEventListener ( "deviceready", initAll , false );
}

function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();
 
    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    } 
    return content_height;
}