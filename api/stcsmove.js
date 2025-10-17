
// Move forward
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var top = token.get("top");                 //Find the current top position value
                var left = token.get("left");
                var rotation = token.get("rotation");
                top = top - Math.cos(rotation * Math.PI / 180) * 200;                             //Change position
                left = left + Math.sin(rotation * Math.PI / 180) * 200;
                token.set({top: top, left: left});                      //Set new position
			};
		});
	};
});

// Turn right
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!turnr') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
        		var rotation = token.get("rotation");   //Find the current rotation value
        		rotation = rotation + 22.5;             //add 22.5 degrees 
        		token.set({rotation: rotation});        //set the rotation
			};
		});
	};
});

// Turn left
*/
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!turnl') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var rotation = token.get("rotation");   //Find the current rotation value
        		rotation = rotation - 22.5;             //add 22.5 degrees 
        		token.set({rotation: rotation});        //set the rotation
			};
		});
	};
});