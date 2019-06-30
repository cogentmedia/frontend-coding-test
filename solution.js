function add( ...args ) {
    return args.reduce( (acc, cur) => acc + cur, 0 );
}

function listToObject() {}

function objectToList() {}

function deserialize() {}

export { add, listToObject, objectToList, deserialize }