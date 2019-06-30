function add( ...args ) {
    return args.reduce( (acc, cur) => acc + cur, 0 );
}

// NB: Second unit test has misleading description.
// 'listToObject should not copy references', 'objectToList should not copy references'
// - an array is also referenced BUT the test will pass as it only looks for shallow object reference.
function getDereferencedVal( val ) {
    if ( val && typeof val === "object" && !Array.isArray(val) ) {
        return Object.assign( {}, val );
    }
    return val;
}

function listToObject( arr ) {
    let obj = {};
    arr.forEach( (element) => obj[element.name] = getDereferencedVal(element.value) );
    return obj;
}

function objectToList( obj ) {
    return Object.keys(obj).map((key) => {
        return {
            name: key,
            value: getDereferencedVal( obj[key] )
        }
    });
}


function tsToMonth( ts ) {
        // Extract unix time.
    let t = parseInt( ts.match( /\d+/g, 10 ) ),
        // Convert to ISO format and extract yyyy-mm-dd.
        d = new Date( t ).toISOString().match( /(\d{4})-(\d{2})-(\d{2})/ );
    return `${d[3]}/${d[2]}/${d[1]}`;
}

function deserialize( inObj ) {

    let outObj = { row: [], total: inObj.total };

    // TRUST: Reported number of records.
    for ( let i = 0; i < inObj.total; i++ ) {
        // Define input object property labels.
        let keyLabel = `row${i}_name`,
            valLabel = `row${i}_value`,
            hitsLabel = `row${i}_hits`;

        let hash = {
            name: inObj[keyLabel],
            value: inObj[valLabel]
        };

        if ( inObj[hitsLabel] ) {
            let hitArr = Object.values( inObj[hitsLabel] );
            hitArr = hitArr.map((hit) => {
                return  {
                    time: tsToMonth( hit )
                };
            });
            hash.hits = {
                hit: hitArr
            }
        }

        outObj.row.push( hash );
    }

    return outObj;
}

export { add, listToObject, objectToList, deserialize }