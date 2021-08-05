class ObjectTools {

    static TraverseOriginalObjectUsingString(obj, traversalString, valueToInsert, nameOfErrorField, nameOfOriginalField) {

        let latestTraversedVal = obj;
        let newTraversedVal = obj;
        let latestArray = [];
        let splitObj = traversalString.split(/\[|\./);
        let foundArrayIndex = 0;
        let latestArrayIdx = 0;
        let latestObj = {};
        let totalModifiedFields = 0;
        let i = 0
        let latestObjIdx = 0;
        for (i; i < splitObj.length; i++) {

            if (splitObj[i].includes(']', splitObj[i].length - 1)) { //in this case this is an array element

                foundArrayIndex = parseInt(splitObj[i].substr(0, splitObj[i].length));
                latestArray = latestTraversedVal
                latestArrayIdx = i;
                newTraversedVal = latestTraversedVal[foundArrayIndex]
                latestTraversedVal = newTraversedVal

            } else { //in this case the property is object or value type

                newTraversedVal = latestTraversedVal[splitObj[i]];

                if (typeof newTraversedVal !== 'object') { //if last value is valuetype, then we stop

                    latestTraversedVal[splitObj[i]] = {
                        [nameOfOriginalField]: newTraversedVal,
                        [nameOfErrorField]: valueToInsert
                    };
                    totalModifiedFields += 1
                    return totalModifiedFields;
                } else {
                    if (Object.keys(newTraversedVal).length >= 1 && !Array.isArray(newTraversedVal)) {
                        latestObjIdx = i;
                        latestObj = newTraversedVal
                    }
                }
                latestTraversedVal = newTraversedVal; // this is in case thats an object
            }
        }

        if (Array.isArray(latestTraversedVal)) {
            totalModifiedFields += 1
        }

        
        return totalModifiedFields;
    };
}

module.exports = ObjectTools;