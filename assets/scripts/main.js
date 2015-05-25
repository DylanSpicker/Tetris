$(document).ready(function(){
	function drawBoard(){
		var board = $("#tetris-game");
        
		board.html("");
		
	    for (var r = 0; r < tetrisGrid.length; r++) {
	        var row = tetrisGrid[r];
	        
	        board.append("<tr class='row-" + r + "'></tr>");
	        
	        var boardRow = $(".row-"+r);                    
	        
	        for( var c = 0; c < row.length; c++  ){
	            var spotValue = row[c];
	            
	            boardRow.append("<td class='"+ r +"_"+ c +"'></td>");
	            $("."+r+"_"+c).css("background-color", function(){
	               if(spotValue){
					   if(c == 0 || c == 14 || r == 26){
	                   		return "#333";
					   }else{
						   return "black";
					   }
	               } else {
	                   return "#FFF" ;
	               }
	            });
	        }
	        
	    }
	}
	
 	function drawShape(shape, shapeTopLeft, shapePattern) {
		$(".black").removeClass("black");
        for(curShapeR = 0; curShapeR <  5; curShapeR++){
            var row = shape[shapePattern][curShapeR];
            
            for(curShapeC = 0; curShapeC <  5; curShapeC++){
                var spotValue = row[curShapeC];
                
                var gridRow = curShapeR + shapeTopLeft[1];
                var gridCol = curShapeC + shapeTopLeft[0];
                
				if(gridRow >= 0 && gridCol >= 0 && spotValue){			
					if(tetrisGrid[gridRow][gridCol]){
						$(".active-new").removeClass("active-new");
						return false;
					}
				}
                if (spotValue && curShapeR >= 0){
                    $("."+gridRow+"_"+gridCol).addClass("active-new");
                }
            }
        }
		
		return true;
    }
	
	function dropShape(){
		newSpot = [shapeTopLeft[0], shapeTopLeft[1] + 1];
		shapePatternNew = shapePattern;
		down = true;
		
		if(drawShape(shape, newSpot, shapePatternNew)){
			
			$(".active").removeClass("active");
			$(".active-new").addClass("active").removeClass("active-new");
			shapeTopLeft = newSpot;
			shapePattern = shapePatternNew;
			
			
			shapePatternNew = 0;
			newSpot = [0,0];
		}else{
			
			if(down){
				
				if(placeShape()){
					down = false;			
				}else{
					return false;
				}
				
			}else{
				shapePatternNew = shapePattern;
				newSpot = [0,0];
			}
		}
		
		if(score < 50){
			var interval = 500;
		}else if(score < 100){
			var interval = 350;
		}else if(score < 150){
			var interval = 300;
		}else if(score < 250){
			var interval = 200;
		}else if(score < 400){
			var interval = 100;
		}else{
			var interval = 50;
		}
		
		intervalDown = setTimeout(dropShape, interval);
	}
	
	function placeShape(){
		var rowsToCheck = [];
		
		$(".active").each(function(){
			$(this).removeClass("active");
			thisClass = $(this).attr('class');
			
			point = thisClass.split("_");
			
			tetrisGrid[point[0]][point[1]] = 1;
			$(this).addClass("occupied");
			
			if($.inArray(point[0], rowsToCheck) < 0){
				rowsToCheck.push(point[0]);
			}
			
		});
		
		var removeRows = [];
		
		for(var i = 0; i < rowsToCheck.length; i++){
			var count = 0;
			
			for(var j = 0; j < 15; j++){
				if(! tetrisGrid[rowsToCheck[i]][j]){
					break;
				}else{
					count += 1;
				}
			}
			
			if(count === 15){
				removeRows.push(parseInt(rowsToCheck[i], 10));
				score += 10;
			}
		}
		
		
		if(removeRows.length > 0){
			var shift = 0;
			
			for(var i = 25; i >= 0; i--){
				if(! shift &&  $.inArray(i, removeRows) < 0){
					console.log(i + " is not in " + removeRows);
					continue;
				}else if($.inArray(i, removeRows) >= 0){
					console.log(i + " is in " + removeRows);
					shift += 1;
				}			
				
				if(tetrisGrid[i - shift]){
					tetrisGrid[i] = tetrisGrid[i - shift];
					if($.inArray(i - shift, removeRows) >= 0){
						i = i+1;
					}
				}else{
					tetrisGrid[i] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
				}
				
			}
			
			drawBoard();
		}
		
		shape           = shapes[nextShape];
		nextShape = Math.floor(Math.random() * 9);
		
		shapeTopLeft    = [4,-2];
		newSpot			= [4,-2];
		shapePattern	= 0;
		shapePatternNew = 0;
		
		if(drawShape(shape, newSpot, shapePatternNew)){
			
			$(".active").removeClass("active");
			$(".active-new").addClass("active").removeClass("active-new");
			shapeTopLeft = newSpot;
			shapePattern = shapePatternNew;			
			shapePatternNew = 0;
			newSpot = [0,0];
		}else{
			alert("Game Over!");
			$("#tetris-game").html("<h1>Game Over!</h1><p>Your scored: <strong>"+score+"</strong></p><p><a href='index.html'>Play Again?</a>");
			return false;
		}
		$(".score").html(score);
		$("#nextshape").html("");
	
		for(j = 0; j < 5; j++){
			
			var nextShapeRow = shapes[nextShape][0][j];
			
			$("#nextshape").append("<tr class='row-"+j+"'></tr>");
			
			for(n = 0; n < 5; n++){
				
				if(nextShapeRow[n]){
					$("#nextshape .row-"+j).append("<td class='occupied'></td>");
				}else{
					$("#nextshape .row-"+j).append("<td></td>");
				}
				
			}
		}
		return true;
		
	}
	
	var score = 0;
	var nextShape = Math.floor(Math.random() * 9);
	var down = false;
	
	$(".score").html(score);
	
		
	var shape           = shapes[nextShape];
	nextShape = Math.floor(Math.random() * 9);
	
	var shapeTopLeft    = [4,-2];
	var newSpot			= [4,-2];
	var shapePattern	= 0;
	var shapePatternNew = 0;
	var intervalDown;
	
	drawBoard();
	
	$("#nextshape").html("");
	
	for(j = 0; j < 5; j++){
		
		var nextShapeRow = shapes[nextShape][0][j];
		
		$("#nextshape").append("<tr class='row-"+j+"'></tr>");
		
		for(n = 0; n < 5; n++){
			
			if(nextShapeRow[n]){
				$("#nextshape .row-"+j).append("<td class='occupied'></td>");
			}else{
				$("#nextshape .row-"+j).append("<td></td>");
			}
			
		}
	}
	
    if(drawShape(shape, shapeTopLeft, shapePattern)){
		$(".active-new").addClass("active").removeClass("active-new");
	}
	
	intervalDown = setTimeout(dropShape, 500);
	
	$(document).keydown(function(e) {
				
	    switch(e.which) {
	        case 39: // right
				newSpot = [shapeTopLeft[0] + 1, shapeTopLeft[1]];
				shapePatternNew = shapePattern;
				down = false;
	        break;
	
	        case 0, 32: // space
				if(shapePattern + 1 < shape.length){
					shapePatternNew = shapePattern + 1;
				}else{
					shapePatternNew = 0;
				}
				newSpot = shapeTopLeft;
				down = false;
	        break;
			
	        case 37: // left
				newSpot = [shapeTopLeft[0] - 1, shapeTopLeft[1]];
				shapePatternNew = shapePattern;
				down = false;
	        break;
	
	        case 40: // down
				newSpot = [shapeTopLeft[0], shapeTopLeft[1] + 1];
				shapePatternNew = shapePattern;
				down = true;
	        break;
	
	        default: return;
	    }
		
		
		
		if(drawShape(shape, newSpot, shapePatternNew)){
			
			$(".active").removeClass("active");
			$(".active-new").addClass("active").removeClass("active-new");
			shapeTopLeft = newSpot;
			shapePattern = shapePatternNew;
			
			
			shapePatternNew = 0;
			newSpot = [0,0];
		}else{
			
			if(down){
				
				if(placeShape()){
					down = false;
				}else{
					clearTimeout(intervalDown);
				}
				down = false ;
				
			}else{
				
				shapePatternNew = shapePattern;
				newSpot = [0,0];
				
			}
			
		}
		
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});
});
