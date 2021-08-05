class ValidationResult {

    errorCount = 0;

    static ERROR_TYPE_DESCRIPTIONS = new Map([
        ["mismatches", "values of compared objects weren't strict equal"],
        ["nulls", "properties that equal to null"],
        ["properties_not_in_second_object", "compared object doesn't have anything at such array index"],
        ["array_size_mismatches", "compared object has larger array size"]

    ]);

    static ErrorDetailMessageBuilder({ errorType, errorData } = {}) {
        if (errorType === "mismatches") {
            return `The value is ${errorData.objOneValue} but the compared object is ${errorData.objTwoValue}`;
        } else if (errorType === "nulls") {
            return `compared (second) object doesn't have anything at index ${errorData.nullIndex}`;
        } else if (errorType === "properties_not_in_second_object") {
            return `compared (second) object doesn't have such property ${errorData.nonExistingProperty}`;
        } else if (errorType === "array_size_mismatches") {
            return `compared object has ${errorData.lengthDifference} more items in the array, this object has ${errorData.lengthObjOne}`;
        } else if (errorType === "properties_not_in_first_object") {
            return `compared object has ${errorData.propertyName} property, while first object doesn't`;
        }
        return "unknown error";
    };

    mismatches = {
        result: [],
        count: 0,
        description: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get("mismatches")
    };

    nulls = {
        result: [],
        count: 0,
        description: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get("nulls")
    };

    properties_not_in_second_object = {
        result: [],
        count: 0,
        description: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get("properties_not_in_second_object")
    };

    properties_not_in_first_object = {}

    array_size_mismatches = {
        result: [],
        count: 0,
        description: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get("array_size_mismatches")
    };

    addError(errorType, errorData) {
        
        this.errorCount += 1;
        this[errorType].count += 1;

        this[errorType].result.push(errorData);
    };
}

module.exports = ValidationResult;