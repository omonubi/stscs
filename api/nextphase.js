// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS
// description: A script to advance a dedicated phase-tracking token through
//  various phases of a combat turn. Helps players keep track of where they
//  arw in the combat turn.
// note: updates a customized version of TurnMarker1 at the end of each round

var PhaseIndex = 0;
var RoundIndex = 1; // Used to track combat rounds
const names = ['Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 1: Recharge', 'Phase 2: Movement', 'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 2: Recharge', 'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire', 'Phase 3: Recharge', 'Phase/Turn is COMPLETE!'];

// Reset name of token and phase counter
on('chat:message', function(msg) {
    // New combat 
    if (msg.type == 'api' && msg.content.indexOf('!nextphase reset') == 0){
        PhaseIndex = 0;
        RoundIndex = 1;
    // New combat round
    } else if (msg.type == 'api' && msg.content.indexOf('!nextphase') == 0){
		const selectedObjs = findObjs({type: 'graphic'});
		
		_.each (selectedObjs, function(obj) {
			if (obj.get('_subtype') == 'token' && obj.get('name').startsWith('Phase')) {
			    obj.set('name', names[0]);
	            sendChat("Phase Tracker", names[0]);
			    PhaseIndex = 1;
			    RoundIndex ++;
			}
		});
	};
});

// Advance to the next combat phase
on('change:campaign:turnorder', function() {
    const allTokens = getTurnArray();
    const myToken = allTokens[0];
    const myTokenId = myToken['id'];
  
    const myObj = getObj('graphic', myTokenId);
    if (myObj.get('name').startsWith('Phase')) {
	    myObj.set('name', names[PhaseIndex]);
	    sendChat("Phase Tracker", names[PhaseIndex]);
	    switch (PhaseIndex) {
	        case 2: case 3: case 6: case 7: case 10: case 11:
	            sortTurnOrder(sorter_desc);
	            break;
	        case 4: case 8: case 12:
	            removeFireTokens();
	        default:
	            sortTurnOrder(sorter_asc);
        }
        PhaseIndex ++;
    }
    // If the round is over, update Round label in turn tracker
    if (PhaseIndex == 13) {
        PhaseIndex = 0;
        const resortedTokens = getTurnArray();
        for (let i = 0; i < resortedTokens.length; i++) {
            const aToken = resortedTokens[i];
            const aTokenId = aToken['id'];
            const myObj = getObj('graphic', aTokenId);
            if (myObj.get('name').startsWith('Round')) {
                myObj.set('name', 'Round ' + RoundIndex);
            }	            
        }
    }
});

// Remove fire tokens from map
function removeFireTokens() {
	const selectedObjs = findObjs({type: 'graphic'});
	
	_.each (selectedObjs, function(obj) {
		if (obj.get('_subtype') == 'card') { obj.remove(); }
	});
}