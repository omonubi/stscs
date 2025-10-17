// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS
// description: A script to advance a dedicated phase-tracking token through
//  various phases of a combat turn. Helps players keep track of where they
//  aew in the combat turn.

var PhaseIndex = 0;
const names = ['Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 2: Movement', 'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire', 'Phase/Turn is COMPLETE!'];

// Reset name of token and phase counter
on('chat:message', function(msg) {
    if(msg.type == 'api' && msg.content.indexOf('!nextphase') == 0){
		const selectedObjs = findObjs({type: 'graphic'});
		_.each(selectedObjs, function(obj) {
			if(obj.get('_subtype') == 'token' && obj.get('name').startsWith('Phase')) {
			    obj.set('name', names[0]);
	            sendChat("Phase Tracker", names[0]);
			    PhaseIndex = 1;
			}
		});
	};
});

// Advance phase
on('change:campaign:turnorder', function() {
    const allTokens = getTurnArray();
    const myToken = allTokens[0];
    const myTokenId = myToken['id'];
  
    const myObj = getObj('graphic', myTokenId);
    if(myObj.get('name').startsWith('Phase')) {
	    myObj.set('name', names[PhaseIndex]);
	    sendChat("Phase Tracker", names[PhaseIndex]);
	    sortTurnOrder(sorter_asc);
	    PhaseIndex ++;

	    if (PhaseIndex == 3 || PhaseIndex == 6 || PhaseIndex == 9) {
    	    //sendChat("Phase Tracker", "A new phase has begun!");
        }
	    if(PhaseIndex == 10) PhaseIndex = 0;
    }
});