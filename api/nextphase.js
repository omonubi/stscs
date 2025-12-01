// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS
// description: A script to advance a dedicated phase-tracking token through
//  various phases of a combat turn. Helps players keep track of where they
//  arw in the combat turn.
// note: updates a customized version of TurnMarker1 at the end of each round

var PhaseIndex = 0;
var RoundIndex = 0; // Used to track combat rounds
const names = ['Phase: New Round', 'Phase: Crew Rolls', 'Phase: Allocate TPA', 'Phase: Sensor Scans', 
    'Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 1: Repair', 
    'Phase 2: Movement', 'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 2: Repair', 
    'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire', 'Phase 3: Repair', 
    'Phase/Round is COMPLETE!'];

const PHASE_NEWROUND = 0;
const PHASE_CREW = 1
const PHASE_ALLOCATION = 2;
const PHASE_SENSORS = 3; 
const PHASE_1_MOVEMENT = 4;
const PHASE_1_TARGET = 5;
const PHASE_1_FIRE = 6;
const PHASE_1_REPAIR = 7;
const PHASE_2_MOVEMENT = 8;
const PHASE_2_TARGET = 9;
const PHASE_2_FIRE = 10;
const PHASE_2_REPAIR = 11;
const PHASE_3_MOVEMENT = 12;
const PHASE_3_TARGET = 13;
const PHASE_3_FIRE = 14;
const PHASE_3_REPAIR = 15;
const PHASE_ROUND_COMPLETE = 16;

// Reset name of token and phase counter
on('chat:message', function(msg) {
    // New combat 
    if (msg.type == 'api' && msg.content.indexOf('!nextphase reset') == 0){
        PhaseIndex = PHASE_NEWROUND;
        RoundIndex = 1;
        sendChat('Phase', `&{template:custom} {{title=**Let the Battle Begin!**}} {{color=red}}`);
    // New combat round
    } else if (msg.type == 'api' && msg.content.indexOf('!nextphase') == 0){
        if (PhaseIndex == PHASE_ROUND_COMPLETE) PhaseIndex = PHASE_NEWROUND;
        nextPhase();
	};
});

function nextPhase() {
	PhaseIndex ++;
	const selectedObjs = findObjs({type: 'graphic'});
	sortTurnOrder(sorter_asc);
	_.each (selectedObjs, function(obj) {
		if (obj.get('_subtype') == 'token' && obj.get('name').startsWith('Phase')) {
		    obj.set('name', names[PhaseIndex]);
            sendChat('Phase', `&{template:custom} {{title=**${names[PhaseIndex]}**}} {{color=black}}`);
		}
	});
}

// Advance to the next combat phase
on('change:campaign:turnorder', function() {
    const allTokens = getTurnArray();
    const myToken = allTokens[0];
    const myTokenId = myToken['id'];
    
    // Continue only if combat round is still underway...
    if (PhaseIndex != PHASE_ROUND_COMPLETE) {
        const myObj = getObj('graphic', myTokenId);
        if (myObj.get('name').startsWith('Phase')) {
            // This is a new phase
            PhaseIndex ++;
    	    myObj.set('name', names[PhaseIndex]);
    	    sendChat('Phase', `&{template:custom} {{title=**${names[PhaseIndex]}**}} {{color=black}}`);
    	    switch (PhaseIndex) {
    	        case PHASE_1_TARGET: case PHASE_2_TARGET: case PHASE_3_TARGET:
    	            sendChat('Phase', `&{template:custom} {{title=**Tactical Heading Changes?**}} {{color=blue}}`);
    	            sendChat('Phase', `&{template:custom} {{title=**Fire / No Fire Selection**}} {{color=blue}}`);
    	            sortTurnOrder(sorter_asc);
    	            break;
    	        case PHASE_1_FIRE: case PHASE_2_FIRE: case PHASE_3_FIRE:
                    removeSensorStatus();
    	            sortTurnOrder(sorter_desc);
    	            break;
    	        case PHASE_1_REPAIR: case PHASE_2_REPAIR: case PHASE_3_REPAIR:
    	            removeFireTokens();
                    rechargeShields(PhaseIndex);
                    sortTurnOrder(sorter_asc);
                    break;
                case PHASE_ROUND_COMPLETE:
                    resetTPA();
                    RoundIndex++;
                    const resortedTokens = getTurnArray();
                    for (let i = 0; i < resortedTokens.length; i++) {
                        const aToken = resortedTokens[i];
                        const aTokenId = aToken['id'];
                        const myObj = getObj('graphic', aTokenId);
                        if (myObj.get('name').startsWith('Round')) {
                            myObj.set('name', 'Round ' + RoundIndex);
                        }	            
                    }
                    break;
    	        default:
    	            sortTurnOrder(sorter_asc);
            }
        } else if (!myObj.get('name').startsWith('Round')) {
            // This is NOT a new phase so must be a vessel
            const characterId = myObj.get('represents');
            const mpAttr = findObjs({ type: 'attribute', characterid: characterId, name: 'mp' });
            const mp = mpAttr ? mpAttr[0].get('current') : 0;
            
            // If the current phase is a movement phase, display the vessel's current MP for the phase
            let noCurrentMove = 0;
            switch (PhaseIndex) {
                case PHASE_1_MOVEMENT:
                    noCurrentMove = (mp == 0 || mp == 1) ? 1 : 0;
                    sendChat('Vessel', `&{template:custom} {{title=[**${myObj.get('name')} - ${Math.floor(mp / 3) + Math.floor((mp % 3) / 2)} MP**](http://journal.roll20.net/character/${characterId})}}`);
                    break;
                case PHASE_2_MOVEMENT:
                    noCurrentMove = (mp == 0 || mp == 2) ? 1 : 0;
                    sendChat('Vessel', `&{template:custom} {{title=[**${myObj.get('name')} - ${Math.floor(mp / 3) + (mp % 3 == 1 ? 1 : 0)} MP**](http://journal.roll20.net/character/${characterId})}}`);
                    break;
                case PHASE_3_MOVEMENT:
                    noCurrentMove = (mp == 0 || mp == 1) ? 1 : 0;
                    sendChat('Vessel', `&{template:custom} {{title=[**${myObj.get('name')} - ${Math.floor(mp / 3) + Math.floor((mp % 3) / 2)} MP**](http://journal.roll20.net/character/${characterId})}}`);
                    break;
                default:
                    sendChat('Vessel', `&{template:custom} {{title=[**${myObj.get('name')}**](http://journal.roll20.net/character/${characterId})}}`);
            }

            // Set movement status marker if no movement in this phase
            if (noCurrentMove) {
                myObj.set('status_green', false);
                myObj.set('status_purple', false);
                myObj.set('status_red', true);
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

// Remove no-sensor status tokens
function removeSensorStatus() {
	const selectedObjs = findObjs({type: 'graphic'});
	
	_.each (selectedObjs, function(obj) {
		if (obj.get('_subtype') == 'token') { obj.set('status_interdiction', false); }
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
        } else {
            tpaResetAttr.setWithWorker({ current: currentPhaseIndex });
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
            } else {
                // Use setWithWorker instead of set
                tpaResetAttr.setWithWorker({ current: now });
            }
        }
    });
}