/* eslint-disable no-unused-vars */
  const getTurnArray = () => ( '' === Campaign().get('turnorder') ? [] : JSON.parse(Campaign().get('turnorder')));
  const getTurnArrayFromPrev = (prev) => ( '' === prev.turnorder ? [] : JSON.parse(prev.turnorder));
  const setTurnArray = (ta) => Campaign().set({turnorder: JSON.stringify(ta)});
  const addTokenTurn = (id, pr) => setTurnArray([...getTurnArray(), {id,pr}]);
  const addCustomTurn = (custom, pr) => setTurnArray([...getTurnArray(), {id:"-1",custom,pr}]);
  const removeTokenTurn = (tid) => setTurnArray(getTurnArray().filter( (to) => to.id !== tid));
  const removeCustomTurn = (custom) => setTurnArray(getTurnArray().filter( (to) => to.custom !== custom));
  const clearTurnOrder = () => Campaign().set({turnorder:'[]'});

  const packTo = (to) => [{id:'HEADER',pr:Number.MAX_SAFE_INTEGER},...to].reduce((m,t)=>{
      if('-1'===t.id){
        m[m.length-1].packed=[...(m[m.length-1].packed || []), t];
        return m;
      }
      return [...m,t];
    },[]);

  const unpackTo = (pTo) => pTo.reduce((m,t)=>{
      let packed = t.packed||[];
      delete t.packed;
      if('HEADER' === t.id){
        return [...packed,...m];
      }
      return [...m,t,...packed];
    },[]);

  const sorter_asc = (a, b) => ('-1' === a.id || '-1' === b.id) ? 0 : a.pr - b.pr;
  const sorter_desc = (a, b) => ('-1' === a.id || '-1' === b.id) ? 0 : b.pr - a.pr;
  const sortTurnOrder = (sortBy = sorter_desc) => Campaign().set({turnorder: JSON.stringify(unpackTo(packTo(getTurnArray()).sort(sortBy)))});
  /* eslint-enable no-unused-vars */    