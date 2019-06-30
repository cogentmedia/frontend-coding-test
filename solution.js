function add( ...args ) {
    return args.reduce( (acc, cur) => acc + cur, 0 );
}

function listToObject( arr ) {
    let obj = {};
    arr.forEach( (element) => {
        if ( element.value && typeof element.value === "object" && !Array.isArray(element.value) ) {
            obj[element.name] = Object.assign( {}, element.value );
        } else {
            obj[element.name] = element.value;
        }
    });
    return obj;
}

function objectToList( obj ) {
    return Object.keys(obj).map((key) => {
        let val;
        if ( obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key]) ) {
            val = Object.assign( {}, obj[key] );
        } else {
            val = obj[key];
        }
        return {
            name: key,
            value: val
        }
    });
}

function deserialize() {}

export { add, listToObject, objectToList, deserialize }