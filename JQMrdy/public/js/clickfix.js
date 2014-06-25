  $(document).ready(function(){
		$(function() {
		    FastClick.attach(document.body);
		});


//Disable the normal clicking for the User Panel
		$('#userpanel').on('click', function (e) {
			var posX = $(this).offset().left, posY = $(this).offset().top;
			
		    		   
		    if(e.pageX - posX < 0.8*$(this).width()){		    
		    	e.stopPropagation();
		    }
		    // return false;
		});


		

		$('#userpanel a').hover(

		function (e) {
			var posX = $(this).offset().left;
		    		   
		    if(e.pageX - posX < $('#userTime').offset().left){
		    	$(this).css("background-color", "#c7b299");
		    }
		    else{
		    	$(this).css("background-color", "#e4ccaf");
		    }
		    
		},

		function () {
		    $(this).css("background-color", "#c7b299");
		});
		

		//Fix Panel Background
		$('#homePanel').css('background-color','#E8DBCF');   
  });



