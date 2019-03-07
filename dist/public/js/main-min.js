function hourModule(t,e,o,a,r,i,l){this.hour=t,this.icon=e,this.temp=o,this.tempColor=a,this.wind=r,this.precip=i,this.humid=l}function dayModule(t,e,o,a,r,i,l){this.day=t,this.icon=e,this.hi=o,this.hiColor=a,this.lo=r,this.loColor=i,this.precip=l}function weatherCheck(){jQuery(document).ready(function($){$.ajax({url:"https://api.wunderground.com/api/ad42a357677d6a01/hourly10day/q/NY/Williamsburg.json",dataType:"jsonp",success:function(t){today.day=t.hourly_forecast[0].FCTTIME.weekday_name,today.month=t.hourly_forecast[0].FCTTIME.month_name,today.date=t.hourly_forecast[0].FCTTIME.mday_padded,today.hour=t.hourly_forecast[0].FCTTIME.hour,today.icon="wi-wu-"+t.hourly_forecast[0].icon,today.temp=t.hourly_forecast[0].temp.english,today.tempColor=temp2color(today.temp),today.feelsLike=t.hourly_forecast[0].feelslike.english,today.wind=t.hourly_forecast[0].wspd.english,today.precip=t.hourly_forecast[0].pop,today.humid=t.hourly_forecast[0].humidity,writeCurrent(today);for(var e=0;24>e;e++){var o=t.hourly_forecast[e].FCTTIME.hour,a="wi-wu-"+t.hourly_forecast[e].icon,r=t.hourly_forecast[e].temp.english,i=temp2color(r),l=t.hourly_forecast[e].wspd.english,s=t.hourly_forecast[e].pop,n=t.hourly_forecast[e].humidity;hourForecast[e]=new hourModule(o,a,r,i,l,s,n)}writeHourly(hourForecast)}}),$.ajax({url:"https://api.wunderground.com/api/ad42a357677d6a01/forecast10day/q/NY/Williamsburg.json",dataType:"jsonp",success:function(t){for(var e=0;10>e;e++){var o=t.forecast.simpleforecast.forecastday[e].date.weekday_short[0],a="wi-wu-"+t.forecast.simpleforecast.forecastday[e].icon,r=t.forecast.simpleforecast.forecastday[e].high.fahrenheit,i=temp2color(r),l=t.forecast.simpleforecast.forecastday[e].low.fahrenheit,s=temp2color(l),n=t.forecast.simpleforecast.forecastday[e].pop;dayForecast[e]=new dayModule(o,a,r,i,l,s,n)}write10Day(dayForecast)}}),$.ajax({url:"https://api.wunderground.com/api/ad42a357677d6a01/alerts/q/NY/Williamsburg.json",dataType:"jsonp",success:function(t){var e="none";if(null!=t.alerts[0]);else{alertStatus=!1;var o="No alert ... "+e;hideAlert(o)}}})})}function writeCurrent(t){$(".top_day").html(t.day),$(".top_month").html(t.month),$(".top_date").html(t.date),jQuery(".top_date div.top_date").attr("class","top_date"),$(".top_icon").addClass(t.icon),$(".top_temp").html(t.temp),$(".top_feels").html(t.feelsLike),$(".top_wind").html(t.wind),$(".top_precip").html(t.precip),$(".top_humid").html(t.humid),$("#wrapperOut").css("background-color",t.tempColor),$(".section_top").css("color",t.tempColor)}function writeHourly(t){for(var e=0;24>e;e++)$(".hourlyModule"+e).find(".hourlyHour").html(parseHour(t[e].hour)),$(".hourlyModule"+e).find(".hourlyModuleColor").css("background-color",t[e].tempColor),$(".hourlyModule"+e).find(".mid_icon").addClass(t[e].icon),$(".hourlyModule"+e).find(".hourlyTemp").html(t[e].temp),$(".hourlyModule"+e).find(".hourlyTempWrap").css("bottom",2*t[e].temp+"px"),$(".hourlyModule"+e).find(".hourlyPrecip").html("<span>"+t[e].precip+"</span><span>%P</span>"),$(".hourlyModule"+e).find(".hourlyHumid").html("<span>"+t[e].humid+"</span><span>%H</span>"),$(".hourlyModule"+e).find(".hourlyWind").html("<span>"+t[e].wind+"</span><span>mph</span>");for(var o="0,"+temp2svg(t[0].temp),e=0;24>e;e++)o+=" "+(38+76*e)+","+temp2svg(t[e].temp);o+=" 1822,"+temp2svg(t[23].temp),o+=" 1822,200 0,200",document.getElementById("hourly-graph-svg").setAttribute("points",o)}function write10Day(t){for(var e=0;10>e;e++)$(".dailyModule"+e+" > h4").html(t[e].day),$(".dailyModule"+e).find(".bot_icon").addClass(t[e].icon),$(".dailyModule"+e).find(".dailyHi").html("<span>"+t[e].hi+"</span><span>&deg</span>"),$(".dailyModule"+e).find(".dailyLo").html("<span>"+t[e].lo+"</span><span>&deg</span>"),$(".dailyModule"+e).find(".dailyHi").css("background-color",t[e].hiColor),$(".dailyModule"+e).find(".dailyLo").css("background-color",t[e].loColor)}function writeAlert(t){$(".section_alert > span").html(t),$("section").addClass("sectionAlertOn")}function hideAlert(t){$(".section_alert > span").html(t),$("section").removeClass("sectionAlertOn")}function temp2svg(t){0>t&&(t=0),t>100&&(t=100);var e=2*(100-t);return e}function temp2color(t){0>t&&(t=0),t>99&&(t=99);var e=colors[t];return e}function parseHour(t){var e;return t>12&&(e=t-12),12>=t&&(e=t),0==t&&(e=12),e}function timeCheck(){date=new Date,t=date.getHours(),12>t&&ampmBaby("am"),t>=12&&ampmBaby("pm"),0==t&&(t=12),t>12&&(t-=12),tt=date.getMinutes(),10>tt&&(tt="0"+tt);var e=t+":"+tt;$(".top_time").html(e)}function ampmBaby(t){"am"===t?(ampm="AM",$(".pm").addClass("ampmDeactive"),$(".am").removeClass("ampmDeactive")):(ampm="PM",$(".pm").removeClass("ampmDeactive"),$(".am").addClass("ampmDeactive"))}function ticker(){$("#ticker").html(tickerVal),tickerVal++}var date,t,tt,time,ampm,tickerVal=0,alertStatus=!1,hourForecast=[],dayForecast=[],alertMessage="",weatherInterval=6e5,timeInterval=6e4,dayInterval=864e5,colors=["#656869","#616668","#5D6466","#596265","#556063","#505D62","#4E5C61","#4C5B60","#48595E","#44575D","#40555C","#3B525A","#375059","#334E57","#32505D","#305262","#2F5568","#2E576E","#2C5973","#2B5B79","#2A5D7F","#295F84","#28628A","#26648F","#256694","#24689A","#236AA0","#216CA5","#206FAB","#1F71B1","#1D73B6","#1C75BC","#1C7ABC","#1C7FBC","#1C84BC","#1C89BC","#1C8EBC","#1C93BC","#2296B5","#2999AE","#2F9CA7","#359EA0","#3CA199","#42A492","#48A78B","#4EAA84","#5BAF77","#61B270","#67B569","#74BB5B","#7ABE54","#80C04D","#87C346","#8DC63F","#91C840","#96CA41","#9ACC43","#9ECD44","#A3CF45","#A7D146","#AAD046","#ADCF46","#B1CE46","#B4CC45","#B7CB45","#BDC945","#C0C744","#C6C544","#C9C343","#CFC143","#D2C043","#D6BF43","#D9BD42","#DFBB42","#E4B942","#E8B741","#EDB541","#F2B441","#F6B240","#FBB040","#F9AB3F","#F7A63F","#F5A23E","#F39D3D","#F1983D","#EF933C","#ED8E3B","#EB893B","#E9843A","#E78039","#E57B39","#E37638","#E17137","#DF6C37","#DD6737","#DA6236","#D85D36","#D65835","#D45334","#D24E34"],today={day:"",month:"",date:"",hour:"",icon:"",temp:"",tempColor:"",feelsLike:"",wind:"",precip:"",humid:""};$(document).ready(function(){weatherCheck(),timeCheck(),tickerVal=0,ticker(),setInterval(function(){tickerVal=0,timeCheck(),weatherCheck()},weatherInterval),setInterval(function(){timeCheck(),ticker()},timeInterval),setInterval(function(){window.location.reload(!0)},dayInterval)});