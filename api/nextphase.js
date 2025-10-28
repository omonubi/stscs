// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS
// description: A script to advance a dedicated phase-tracking token through
//  various phases of a combat turn. Helps players keep track of where they
//  arw in the combat turn.
// note: updates a customized version of TurnMarker1 at the end of each round

var PhaseIndex = 0;
var RoundIndex = 1; // Used to track combat rounds
const names = ['Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 2: Movement', 
    'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire', 
    'Phase/Turn is COMPLETE!'];
    
const PHASE_MAX = 10;

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
	            sendChat("Phase", `&{template:custom} {{title=**${names[0]}**}} {{color=black}}`);
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
    
    // Continue only if combat round is still underway...
    if (PhaseIndex < PHASE_MAX) {
        const myObj = getObj('graphic', myTokenId);
        if (myObj.get('name').startsWith('Phase')) {
    	    myObj.set('name', names[PhaseIndex]);
    	    sendChat("Phase", `&{template:custom} {{title=**${names[PhaseIndex]}**}} {{color=black}}`);
    	    switch (PhaseIndex) {
    	        case 2: case 5: case 8:
    	            sortTurnOrder(sorter_desc);
    	            break;
    	        case 3: case 6:
    	            removeFireTokens();
                    rechargeShields(PhaseIndex);
    	        default:
    	            sortTurnOrder(sorter_asc);
            }
            PhaseIndex ++;
        } else {
            // Note: PhaseIndex was incremented!
            switch (PhaseIndex) {
                case 2: case 3: case 5: case 6: case 8: case 9:
                    sendChat('Ship', `&{template:custom} {{title=**${myObj.get('name')}**}}`);
            }
        }
        // If the round is over, update Round label in turn tracker
        if (PhaseIndex == PHASE_MAX) {
            resetTPA();
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
    }
});

// Remove fire tokens from map
function removeFireTokens() {
	const selectedObjs = findObjs({type: 'graphic'});
	
	_.each (selectedObjs, function(obj) {
		if (obj.get('_subtype') == 'card') { obj.remove(); }
	});
}

// Recharge all shields
function rechargeShields(currentPhaseIndex) {
    var tokens = findObjs({ _type: 'graphic' });

    tokens.forEach(function(token) {
        var charId = token.get('represents');
        if (!charId) return;

        var character = getObj('character', charId);
        if (!character) return;

        var tpaResetAttr = findObjs({
            _type: 'attribute',
            characterid: charId,
            name: 'current_phase'
        })[0];

        if (!tpaResetAttr) {
            tpaResetAttr = createObj('attribute', {
                name: 'current_phase',
                current: currentPhaseIndex,
                max: '',
                characterid: charId
            });
            //log('Created current_phase for character: ' + character.get('name'));
        } else {
            tpaResetAttr.setWithWorker({ current: currentPhaseIndex });
            //log('Updated current_phase for character: ' + character.get('name'));
        }
    });
}

function resetTPA() {
    var tokens = findObjs({ _type: 'graphic' });
    var now = new Date().toLocaleString();

    tokens.forEach(function(token) {
        if (!token.get('name').startsWith('Phase')) { 
            var charId = token.get('represents');
            if (!charId) return;
    
            var character = getObj('character', charId);
            if (!character) return;
    
            var tpaResetAttr = findObjs({
                _type: 'attribute',
                characterid: charId,
                name: 'tpa_reset'
            })[0];
    
            if (!tpaResetAttr) {
                // Create attribute and use setWithWorker
                tpaResetAttr = createObj('attribute', {
                    name: 'tpa_reset',
                    current: now,
                    max: '',
                    characterid: charId
                });
                //log('Created tpa_reset for character: ' + character.get('name'));
            } else {
                // Use setWithWorker instead of set
                tpaResetAttr.setWithWorker({ current: now });
                //log('Updated tpa_reset for character: ' + character.get('name'));
            }
        }
    });
}