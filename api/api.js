// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS

var PhaseIndex = 0;

on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.content.indexOf('!nextphase') == 0){
	    const names = ['Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 2: Movement', 'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire'];
	    
        const arg = msg.content.substring(11,12);
		if(arg == '1') PhaseIndex = 0; // reset counter
		
		// Advance phase tracker
		const selectedObjs = findObjs({type: 'graphic'});
		_.each(selectedObjs, function(obj) {
    		// Update index
			if(obj.get('_subtype') == 'token' && obj.get('name').startsWith('Phase')) {
			    obj.set('name', names[PhaseIndex]);
			    PhaseIndex ++;
			    if(PhaseIndex == 9) PhaseIndex = 0;
			}
		});
		
	};
});