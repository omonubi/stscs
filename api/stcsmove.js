// name: stcsmove.js
// author: omonubi (omonubi@hotmail.com)
// game: FASA Star Trek: STCS
// description: Script to automate movement of ship tokens via macros

if (!state.movementHistory) state.movementHistory = {};    

// Hold station
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move hs') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                
                // Add status marker
                token.set('status_green', false);
                token.set('status_purple', false);
                token.set('status_red', true);
            }
        });
    }
});

// Move forward 1 hex
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move f1') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top - Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left + Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_green', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Move forward 2 hexes
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move f2') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top - Math.cos(prev.rotation * Math.PI / 180) * 140;
                var left = prev.left + Math.sin(prev.rotation * Math.PI / 180) * 140;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_green', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Rotate 1 hex facing to port
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move rp') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                token.set({ rotation: prev.rotation - 60 });
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Rotate 1 hex facing to starboard
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move rs') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                token.set({ rotation: prev.rotation + 60 });
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Sideslip to forward/port
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move sspf') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top - Math.cos((prev.rotation - 60) * Math.PI / 180) * 70 - Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left + Math.sin((prev.rotation - 60) * Math.PI / 180) * 70 + Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_green', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Sideslip to forward/starboard
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move sssf') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top - Math.cos((prev.rotation + 60) * Math.PI / 180) * 70 - Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left + Math.sin((prev.rotation + 60) * Math.PI / 180) * 70 + Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_green', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Move backward 1 hex
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move r1') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top + Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left - Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_purple', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Move backward 2 hexes
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move r2') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top + Math.cos(prev.rotation * Math.PI / 180) * 140;
                var left = prev.left - Math.sin(prev.rotation * Math.PI / 180) * 140;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_purple', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Sideslip to aft/port
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move sspr') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top + Math.cos((prev.rotation + 60) * Math.PI / 180) * 70 + Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left - Math.sin((prev.rotation + 60) * Math.PI / 180) * 70 - Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_purple', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// Sideslip to aft/starboard
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move sssr') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var token = getObj('graphic', obj._id);
                var prev = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                var top = prev.top + Math.cos((prev.rotation - 60) * Math.PI / 180) * 70 + Math.cos(prev.rotation * Math.PI / 180) * 70;
                var left = prev.left - Math.sin((prev.rotation - 60) * Math.PI / 180) * 70 - Math.sin(prev.rotation * Math.PI / 180) * 70;
                token.set({ top: top, left: left });
                
                // Add status marker
                token.set('status_purple', true);
                token.set('status_red', false);
    
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(prev);
            }
        });
    }
});

// undo
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move undo') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic') {
                var stack = state.movementHistory[obj._id];
                if (stack && stack.length) {
                    var last = stack.pop();
                    var token = getObj('graphic', obj._id);
                    var curr = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                    
                    if (!token._redo) token._redo = [];
                    token._redo.push(curr);

                    token.set(last);  // Changed from last.prev
                }
            }
        });
    }
});   

// redo
on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!move redo') {
        _.each(msg.selected, function(obj) {
            if (obj._type === 'graphic' && getObj('graphic', obj._id)._redo?.length) {
                var token = getObj('graphic', obj._id);
                var next = token._redo.pop();
                var curr = { top: token.get('top'), left: token.get('left'), rotation: token.get('rotation') };
                
                if (!state.movementHistory[obj._id]) state.movementHistory[obj._id] = [];
                state.movementHistory[obj._id].push(curr);  // Changed from { prev: curr, next: null }

                token.set(next);
            }
        });
    }
});   