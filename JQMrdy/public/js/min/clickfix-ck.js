$(document).ready(function(){$(function(){FastClick.attach(document.body)}),$("#userpanel").on("click",function(o){var t=$(this).offset().left,c=$(this).offset().top;o.pageX-t<.8*$(this).width()&&o.stopPropagation()}),$("#userpanel a").hover(function(o){var t=$(this).offset().left;o.pageX-t<$("#userTime").offset().left?$(this).css("background-color","#c7b299"):$(this).css("background-color","#e4ccaf")},function(){$(this).css("background-color","#c7b299")}),$("#homePanel").css("background-color","#E8DBCF")});