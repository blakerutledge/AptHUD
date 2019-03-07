//DECLARE VARS

var date, t, tt, time, ampm;
var tickerVal = 0;
var alertStatus = false;
var hourForecast = [];
var dayForecast = [];
var alertMessage = "";
var weatherInterval = 10 * 60000; //every 10 minutes
var timeInterval = 1 * 60000; //every 1 minute
var dayInterval = 24 * 60 * 60000; //every 24 hours

var colors = [ "#656869", "#616668", "#5D6466", "#596265", "#556063", "#505D62","#4E5C61", "#4C5B60", "#48595E", "#44575D", "#40555C", "#3B525A", "#375059", "#334E57", "#32505D", "#305262","#2F5568", "#2E576E", "#2C5973", "#2B5B79", "#2A5D7F", "#295F84", "#28628A", "#26648F", "#256694", "#24689A","#236AA0", "#216CA5", "#206FAB", "#1F71B1", "#1D73B6", "#1C75BC", "#1C7ABC", "#1C7FBC", "#1C84BC", "#1C89BC","#1C8EBC", "#1C93BC", "#2296B5", "#2999AE", "#2F9CA7", "#359EA0", "#3CA199", "#42A492", "#48A78B", "#4EAA84","#5BAF77", "#61B270", "#67B569", "#74BB5B", "#7ABE54", "#80C04D", "#87C346", "#8DC63F", "#91C840", "#96CA41","#9ACC43", "#9ECD44", "#A3CF45", "#A7D146", "#AAD046", "#ADCF46", "#B1CE46", "#B4CC45", "#B7CB45", "#BDC945","#C0C744", "#C6C544", "#C9C343", "#CFC143", "#D2C043", "#D6BF43", "#D9BD42", "#DFBB42", "#E4B942", "#E8B741","#EDB541", "#F2B441", "#F6B240", "#FBB040", "#F9AB3F", "#F7A63F", "#F5A23E", "#F39D3D", "#F1983D", "#EF933C","#ED8E3B", "#EB893B", "#E9843A", "#E78039", "#E57B39", "#E37638", "#E17137", "#DF6C37", "#DD6737", "#DA6236","#D85D36", "#D65835", "#D45334", "#D24E34" ];

var today = {
	day: "",
	month: "",
	date: "",
	hour: "",
	icon: "",
	temp: "",
	tempColor: "",
	feelsLike: "",
	wind: "",
	precip: "",
	humid: ""
};

function hourModule( h, i, t, tC, w, p, hu ) {
    this.hour = h;
    this.icon = i;
    this.temp = t;
    this.tempColor = tC;
    this.wind = w;
    this.precip = p;
    this.humid = hu;
};

function dayModule( d, i, h, hc, l, lc, p ) {
	this.day = d,
	this.icon = i,
	this.hi = h,
	this.hiColor = hc,
	this.lo = l,
	this.loColor = lc,
	this.precip = p
};

$( document ).ready(function() {
	//DO NOW
	weatherCheck();
	timeCheck();
	tickerVal=0;
	ticker();

	//AND DO LATER
	setInterval(function () {
		//check API calls used today here..... 
		//every 6 minutes, check weather
		tickerVal=0;
		timeCheck();
		weatherCheck();
	}, weatherInterval);
	setInterval(function () {
		//every 1 minute, check time
		timeCheck();
		ticker();
	}, timeInterval);
	setInterval(function () {
		//every 24 hours, refresh browser (pi memory bug)
		window.location.reload(true);
	}, dayInterval);
});

function weatherCheck() {
	jQuery(document).ready(function($) {
	  $.ajax({
	  	url : "https://api.wunderground.com/api/ad42a357677d6a01/hourly10day/q/NY/Williamsburg.json",
	  	dataType : "jsonp",
	  	success : function(parsed_json) {
			
			// GATHER INFO FOR TODAY MODULE
			today.day = parsed_json.hourly_forecast[0].FCTTIME.weekday_name;
			today.month = parsed_json.hourly_forecast[0].FCTTIME.month_name;
			today.date = parsed_json.hourly_forecast[0].FCTTIME.mday_padded;
			today.hour = parsed_json.hourly_forecast[0].FCTTIME.hour;
			today.icon = "wi-wu-"+parsed_json.hourly_forecast[0].icon;
			today.temp = parsed_json.hourly_forecast[0].temp.english;
			today.tempColor = temp2color(today.temp);
			today.feelsLike = parsed_json.hourly_forecast[0].feelslike.english;
			today.wind = parsed_json.hourly_forecast[0].wspd.english;
			today.precip = parsed_json.hourly_forecast[0].pop;
			today.humid = parsed_json.hourly_forecast[0].humidity;
			writeCurrent(today);

			//GATHER INFO FOR NEXT 24 HOURS
			for(var i=0; i<24; i++) {
				var h = parsed_json.hourly_forecast[i].FCTTIME.hour;
				var ic = "wi-wu-"+parsed_json.hourly_forecast[i].icon;
				var t = parsed_json.hourly_forecast[i].temp.english;
				var tColor = temp2color(t);
				var w = parsed_json.hourly_forecast[i].wspd.english;
				var p = parsed_json.hourly_forecast[i].pop;
				var hu = parsed_json.hourly_forecast[i].humidity;
				hourForecast[i] = new hourModule(h, ic, t, tColor, w, p, hu);
			};
			//WRITE INFO FOR NEXT 24 HOURS
			writeHourly(hourForecast);
     	}
	  });

	  $.ajax({
	  	url : "https://api.wunderground.com/api/ad42a357677d6a01/forecast10day/q/NY/Williamsburg.json",
	  	dataType : "jsonp",
	  	success : function(parsed_json) {
			// GATHER INFO FOR 10 DAY FORECAST
			for(var i=0; i<10; i++) {
				var d = parsed_json.forecast.simpleforecast.forecastday[i].date.weekday_short[0];
				var ic = "wi-wu-"+parsed_json.forecast.simpleforecast.forecastday[i].icon;
				var h = parsed_json.forecast.simpleforecast.forecastday[i].high.fahrenheit;
				var hc = temp2color(h);
				var l = parsed_json.forecast.simpleforecast.forecastday[i].low.fahrenheit;
				var lc = temp2color(l);
				var p = parsed_json.forecast.simpleforecast.forecastday[i].pop;
				dayForecast[i] = new dayModule(d, ic, h, hc, l, lc, p);
			};
			//WRITE INFO FOR 10 DAY FORECAST
			write10Day(dayForecast);
     	}
	  });

	  $.ajax({
	  	url : "https://api.wunderground.com/api/ad42a357677d6a01/alerts/q/NY/Williamsburg.json",
	  	dataType : "jsonp",
	  	success : function(parsed_json) {
	  		var a = "none";
	  		if ( parsed_json.alerts[0] != null){
	  			//there's an alert!
	  			// a = parsed_json.alerts[0].description;
	  			// e = parsed_json.alerts[0].expires;
	  			// alertStatus = true;
	  			// var alert = 'Notice: '+ "a" +" until "+"e"+".";
	  			// writeAlert(alert);
	  		}
	  		else {
	  			//ALL IS WELL
	  			alertStatus = false;
	  			var alert = 'No alert ... ' + a;
	  			hideAlert(alert);
	  		}	
     	} 
	  });
	});
};

function writeCurrent(data) {
	$('.top_day').html(data.day);
	$('.top_month').html(data.month);
	$('.top_date').html(data.date);
	jQuery('.top_date div.top_date').attr('class', 'top_date');
	$('.top_icon').addClass(data.icon);
	$('.top_temp').html(data.temp);
	$('.top_feels').html(data.feelsLike);
	$('.top_wind').html(data.wind);		
	$('.top_precip').html(data.precip);
	$('.top_humid').html(data.humid);
	$('#wrapperOut').css("background-color", data.tempColor)
	$('.section_top').css("color", data.tempColor);
	/*console.log(data.hour);
	if (data.hour <= 6){
		$('#wrapperOut').css("opacity", "0.3");
	}
	else if (6 < data.hour <= 18){
		$('#wrapperOut').css("opacity", "1");
	}
	else if (18 < data.hour < 21){
		$('#wrapperOut').css("opacity", "0.7");
	}
	else if (21 <= data.hour){
		$('#wrapperOut').css("opacity", "0.5");
	}*/
}

function writeHourly(data) {
	for(var i=0; i<24; i++) {
		$('.hourlyModule'+i).find('.hourlyHour').html(parseHour(data[i].hour));
		$('.hourlyModule'+i).find('.hourlyModuleColor').css("background-color", data[i].tempColor);
		$('.hourlyModule'+i).find('.mid_icon').addClass(data[i].icon);
		$('.hourlyModule'+i).find('.hourlyTemp').html(data[i].temp);
		$('.hourlyModule'+i).find(".hourlyTempWrap").css("bottom", data[i].temp*2+"px");
		$('.hourlyModule'+i).find('.hourlyPrecip').html("<span>"+data[i].precip+"</span><span>%P</span>");
		$('.hourlyModule'+i).find('.hourlyHumid').html("<span>"+data[i].humid+"</span><span>%H</span>");
		$('.hourlyModule'+i).find('.hourlyWind').html("<span>"+data[i].wind+"</span><span>mph</span>");
	}
	
	//BUILD SVG
	var poly = "0,"+temp2svg(data[0].temp);
	for(var i=0; i<24; i++) {
		poly += " "+(38+i*76)+","+temp2svg(data[i].temp);
	}
	poly += " 1822,"+temp2svg(data[23].temp);
	poly += " 1822,200 0,200";
	document.getElementById('hourly-graph-svg').setAttribute('points' , poly);
	
}

function write10Day(data) {
	for(var i=0; i < 10; i++) {
		$('.dailyModule'+i+' > h4').html(data[i].day);
		$('.dailyModule'+i).find('.bot_icon').addClass(data[i].icon);
		$('.dailyModule'+i).find('.dailyHi').html("<span>"+data[i].hi+"</span><span>&deg</span>");
		$('.dailyModule'+i).find('.dailyLo').html("<span>"+data[i].lo+"</span><span>&deg</span>");
		$('.dailyModule'+i).find('.dailyHi').css("background-color", data[i].hiColor);
		$('.dailyModule'+i).find('.dailyLo').css("background-color", data[i].loColor);
	}
	
}

function writeAlert(data) {
	$('.section_alert > span').html(data);
	$('section').addClass('sectionAlertOn');
}

function hideAlert(data) {
	$('.section_alert > span').html(data);
	$('section').removeClass('sectionAlertOn');
}



//HELPERS

function temp2svg(x) {
	if ( x < 0 ) { 
		x = 0;
	};
	if ( x > 100 ) { 
		x = 100;
	};
	var t = ( 100 - x ) * 2;
	return t;
}

function temp2color(x) {
	if ( x < 0 ) { 
		x = 0;
	};
	if ( x > 99 ) { 
		x = 99;
	};
	//x =  Math.round( x / 5 );
	var t = colors[x];
	return t;
}

function parseHour(data) {
	var t;
	if (data > 12) {
		t = data - 12;
	}
	if (data<=12) {
		t = data;
	}
	if (data==0) {
		t = 12;
	}
	return t;
}


function timeCheck() {
	//time
	date = new Date();
	t = date.getHours();
	if (t<12){
		ampmBaby("am");
	}
	if ( t>=12 ){
		ampmBaby("pm");
	}

	if (t==0) {
		t = 12;
	}
	if ( t > 12 ) {
		t = t -12;
	}
	tt = date.getMinutes();
	if (tt<10){
		tt = "0"+tt;
	}
	var time = t + ":" + tt;

	//WRITE TIME
	$('.top_time').html(time);

}

function ampmBaby(x) {
	//STYLE AM PM DIVS
	if (x === "am") {
		//AM
		ampm = "AM";
		$(".pm").addClass("ampmDeactive");
		$(".am").removeClass("ampmDeactive");
	}
	else {
		//PM
		ampm = "PM";
		$(".pm").removeClass("ampmDeactive");
		$(".am").addClass("ampmDeactive");
	}
}

function ticker(){
	//WRITE UPDATED RECENTLY
	$("#ticker").html(tickerVal)
	tickerVal++;
}