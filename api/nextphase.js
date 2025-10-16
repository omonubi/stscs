// name: nextphase.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS

var PhaseIndex = 0;

on('change:campaign:turnorder', function() {
    const names = ['Phase 1: Movement', 'Phase 1: Targeting', 'Phase 1: Fire', 'Phase 2: Movement', 'Phase 2: Targeting', 'Phase 2: Fire', 'Phase 3: Movement', 'Phase 3: Targeting', 'Phase 3: Fire'];
    
    const allTokens = getTurnArray();
    const myToken = allTokens[0];
    const myTokenId = myToken['id'];
  
    const myObj = getObj('graphic', myTokenId);
    if(myObj.get('name').startsWith('Phase')) {
	    myObj.set('name', names[PhaseIndex]);
	    sortTurnOrder(sorter_asc);
	    if (PhaseIndex == 2 || PhaseIndex == 5 || PhaseIndex == 8) {
	        sortTurnOrder(sorter_desc);
	    }
	    PhaseIndex ++;
	    if(PhaseIndex == 9) PhaseIndex = 0;
    }
});