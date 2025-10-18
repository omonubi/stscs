// Move forward 1 hex
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move 1') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var top = token.get("top");
                var left = token.get("left");
                var rotation = token.get("rotation");
                top = top - Math.cos(rotation * Math.PI / 180) * 70;
                left = left + Math.sin(rotation * Math.PI / 180) * 70;
                token.set({top: top, left: left});
			};
		});
	};
});

// Move forward 2 hexes
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move 2') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var top = token.get("top");
                var left = token.get("left");
                var rotation = token.get("rotation");
                top = top - Math.cos(rotation * Math.PI / 180) * 140;
                left = left + Math.sin(rotation * Math.PI / 180) * 140;
                token.set({top: top, left: left});
			};
		});
	};
});

// Rotate 1 hex facing to port
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move rp') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
        		var rotation = token.get("rotation");
        		rotation = rotation - 60;
        		token.set({rotation: rotation});
			};
		});
	};
});

// Rotate 1 hex facing to starboard
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move rs') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var rotation = token.get("rotation");
        		rotation = rotation + 60;
        		token.set({rotation: rotation});
			};
		});
	};
});

// Sideslip to port
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move ssp') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var top = token.get("top");
                var left = token.get("left");
                var rotation = token.get("rotation");
                top = top - Math.cos((rotation - 60) * Math.PI / 180) * 70; 
                top = top - Math.cos(rotation * Math.PI / 180) * 70;
                left = left + Math.sin((rotation - 60) * Math.PI / 180) * 70;
                left = left + Math.sin(rotation * Math.PI / 180) * 70;
                token.set({top: top, left: left});
			};
		});
	};
});

// Sideslip to starboard
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.selected && msg.content.indexOf('!move sss') == 0){
		var selectedObjs = msg.selected;
		_.each(selectedObjs, function(obj) {
			if(obj._type == 'graphic'){
				var token = getObj('graphic', obj._id);
                var top = token.get("top");
                var left = token.get("left");
                var rotation = token.get("rotation");
                top = top - Math.cos((rotation + 60) * Math.PI / 180) * 70; 
                top = top - Math.cos(rotation * Math.PI / 180) * 70;
                left = left + Math.sin((rotation + 60) * Math.PI / 180) * 70;
                left = left + Math.sin(rotation * Math.PI / 180) * 70;
                token.set({top: top, left: left});
			};
		});
	};
});