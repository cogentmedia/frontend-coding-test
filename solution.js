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

// 'normalise' schema.
function getAliases( obj ) {
    let names = {};

    Object.keys(obj).forEach((key) => {
        // TRUST: Naming convention includes the number of the row and an underscore (_) e.g. row0_name
        let parts = key.split( /\d+_/g );

        if ( parts.length > 1 ) {
            // Let's not overwrite (unnecessary).
            if ( !names.hasOwnProperty("row") ) {
                names.row = parts[0];
            }

            // TRUST: Naming convention order is: name -> value [-> hits]
            if ( !names.hasOwnProperty("key") ) {
                names.key = parts[1];
            // NB: If the part is a match for a key - it can NOT (here) be a value.
            } else if ( !(names.key === parts[1] || names.hasOwnProperty("val")) ) {
                names.val = parts[1];
            } else if ( !(names.key === parts[1] || names.val === parts[1] || names.hasOwnProperty("hits")) ) {
                names.hits = parts[1];
            }
        } else {
            // TRUST that the only non-split key is total.
            names.total = key;
        }

        // TRUST: 'hits' is the ONLY nested object.
        if ( obj[key] && typeof obj[key] === "object" ) {
            // Find the 'hit' and 'time' prop.
            let hits = objectToList( obj[key] ),
                parts = hits[0].name.split( /\d+_/g );

            names.hit = parts[0];
            names.time = parts[1];
        }
    });

    return names;
}

function deserialize( inObj ) {

    // TRUST: DATA SCHEME.
    // Obtain a mapping of what we've been given.
    let aliases = getAliases( inObj ),
        count = inObj[aliases.total];

    // console.log( aliases );

    let outObj = { [aliases.row]: [], [aliases.total]: count };

    // TRUST: Reported number of records.
    for ( let i = 0; i < count; i++ ) {
        // Define input object property labels.
        let keyLabel = `${aliases.row}${i}_${aliases.key}`,
            valLabel = `${aliases.row}${i}_${aliases.val}`,
            hitsLabel = `${aliases.row}${i}_${aliases.hits}`;

        let hash = {
            [aliases.key]: inObj[keyLabel],
            [aliases.val]: inObj[valLabel]
        };

        if ( inObj[hitsLabel] ) {
            let hitArr = Object.values( inObj[hitsLabel] );
            hitArr = hitArr.map((hit) => {
                return  {
                    [aliases.time]: tsToMonth( hit )
                };
            });
            hash[aliases.hits] = {
                [aliases.hit]: hitArr
            };
        }

        outObj[aliases.row].push( hash );
    }

    return outObj;
}

export { add, listToObject, objectToList, deserialize }