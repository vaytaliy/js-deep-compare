const ValidationResult = require("./ValidationResult.js");
const ObjectTools = require("./ObjectTools.js");
const fs = require('fs').promises;

class ObjectValidator {

    static firstObject = {};
    static secondObject = {};
    static validationOptions = {
        createErrorFields: false,
        errorFieldName: "_error_field",
        originalFieldName: "_original_field",
    };

    static Compare(firstObject, secondObject, opts) {

        if (firstObject !== Object(firstObject) || secondObject !== Object(secondObject) || opts !== Object(opts)) {
            throw new TypeError("You must provide valid javascript objects as argument");
        }

        this.firstObject = {
            name: Object.keys(firstObject)[0],
            rawValue: JSON.parse(JSON.stringify(firstObject)),
            value: firstObject,
            validationResult: new ValidationResult(),
            totalModifiedFields: 0,
            SaveResultAsync: async function ({ path, alias, format = "txt", saveValidationResult = false } = {}) {

                let fullFileName = Date.now();

                if (alias && alias !== '') { fullFileName += `-${alias}` }

                if (saveValidationResult === true) { path += `/${fullFileName}` }

                fs.mkdir(path, { recursive: true }, (err) => {
                    if (err) throw err;
                });

                try {
                    await fs.writeFile(`${path}/${fullFileName}.${format}`, JSON.stringify(this.value));

                    if (saveValidationResult === true) {
                        await fs.writeFile(`${path}/summary-${fullFileName}.${format}`
                            , JSON.stringify(this.validationResult));
                    }

                } catch (err) {
                    console.log(err);
                }
            }
        };

        this.secondObject = {
            name: Object.keys(secondObject)[0],
            value: secondObject,
            rawValue: JSON.parse(JSON.stringify(secondObject)),
            validationResult: new ValidationResult(),
            totalModifiedFields: 0 // dont need it
        };

        Object.assign(this.validationOptions, opts);
        this.RunComparisonRecursively(this.firstObject.value, this.secondObject.rawValue, "", "", this.firstObject);
        this.RunComparisonRecursively(this.secondObject.value, this.firstObject.rawValue, "", "", this.secondObject); //checks properties that exist in object 2 but not in 1

        this.firstObject.validationResult["properties_not_in_first_object"] = this.secondObject.validationResult["properties_not_in_second_object"];

        if (this.secondObject.validationResult && this.secondObject.validationResult["properties_not_in_second_object"].count) {
            this.firstObject.validationResult.errorCount += this.secondObject.validationResult["properties_not_in_second_object"].count
        };

        return this.firstObject;
    };

    static ProcessErrorDisplayForObject({ objectToProcess, error, errorTracebackString, errorDetail, pointerToModifiedObject } = {}) {

        if (this.validationOptions.createErrorFields) {
            const newModifiedFieldsCount = ObjectTools.TraverseOriginalObjectUsingString(objectToProcess, errorTracebackString, { error, errorDetail }
                , this.validationOptions.errorFieldName
                , this.validationOptions.originalFieldName) // will modify original object passed to it!

            pointerToModifiedObject.totalModifiedFields += newModifiedFieldsCount;
            return;
        }
    };

    static RunComparisonRecursively(currentPropertyObj1, currentPropertyObj2, lastCheckedProp, propertyName, pointerToModifiedObject) {

        if (typeof currentPropertyObj1 != "object") { // that means the end

            if (currentPropertyObj1 !== currentPropertyObj2) {

                const errorType = "mismatches";
                const errorMessage = ValidationResult.ErrorDetailMessageBuilder({ errorType, errorData: { objOneValue: currentPropertyObj1, objTwoValue: currentPropertyObj2 } });

                pointerToModifiedObject.validationResult.addError(errorType,
                    {
                        placeOfOrigin: propertyName,
                        originalValue: currentPropertyObj1,
                        comparedToValue: currentPropertyObj2,
                        errorMessage
                    }
                );

                this.ProcessErrorDisplayForObject(
                    {
                        objectToProcess: pointerToModifiedObject.value,
                        error: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get(errorType),
                        errorTracebackString: propertyName,
                        errorDetail: errorMessage,
                        pointerToModifiedObject
                    }
                );
            }

            return;
        }

        else if (Array.isArray(currentPropertyObj1)) { // that means we have array and may continue, wont stringify as it may contain more nested information, check order errors too!

            const lengthObjOne = currentPropertyObj1.length;
            const lengthObjTwo = currentPropertyObj2.length;

            if (lengthObjOne < lengthObjTwo) {

                const lengthDifference = lengthObjTwo - lengthObjOne;
                const errorType = "array_size_mismatches";
                const errorMessage = ValidationResult.ErrorDetailMessageBuilder({ errorType, errorData: { lengthDifference, lengthObjOne } });

                pointerToModifiedObject.validationResult.addError(errorType,
                    {
                        placeOfOrigin: propertyName,
                        lengthObjOne,
                        lengthObjTwo,
                        lengthDifference,
                        errorMessage
                    }
                );
                this.ProcessErrorDisplayForObject(
                    {
                        objectToProcess: pointerToModifiedObject.value,
                        error: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get(errorType),
                        errorTracebackString: propertyName,
                        errorDetail: errorMessage,
                        pointerToModifiedObject
                    }
                );
            }

            for (let i = 0; i < currentPropertyObj1.length; i++) {

                let newPropertyName = `${propertyName}[${i}]`;

                if (!currentPropertyObj2 || currentPropertyObj2[i] == null) {

                    const errorType = "nulls";
                    const errorMessage = ValidationResult.ErrorDetailMessageBuilder({ errorType, errorData: { nullIndex: i } });

                    pointerToModifiedObject.validationResult.addError(errorType,
                        {
                            placeOfOrigin: newPropertyName,
                            nullIndex: i
                        }
                    );
                    this.ProcessErrorDisplayForObject(
                        {
                            objectToProcess: pointerToModifiedObject.value,
                            error: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get(errorType),
                            errorTracebackString: newPropertyName,
                            errorDetail: errorMessage,
                            pointerToModifiedObject
                        }
                    );

                    continue;
                }

                this.RunComparisonRecursively(currentPropertyObj1[i], currentPropertyObj2[i], `${lastCheckedProp}[${i}]`, newPropertyName, pointerToModifiedObject);
            }
        }

        else if (currentPropertyObj1 && Object.keys(currentPropertyObj1).length >= 1) { //that means we have an object that has a property
            for (const [key, value] of Object.entries(currentPropertyObj1)) {

                let secondObj = this.LookupPropInObj(key, currentPropertyObj2);

                if (key === this.validationOptions.errorFieldName) {
                    
                    continue;   //ignore validation field name
                }

                if (secondObj == null) {

                    const errorType = "properties_not_in_second_object";
                    const errorMessage = ValidationResult.ErrorDetailMessageBuilder({ errorType, errorData: { nonExistingProperty: lastCheckedProp } });

                    pointerToModifiedObject.validationResult.addError(errorType,
                        {
                            placeOfOrigin: propertyName,
                            nonExistingProperty: key
                        }
                    );
                    this.ProcessErrorDisplayForObject(
                        {
                            objectToProcess: pointerToModifiedObject.value,
                            error: ValidationResult.ERROR_TYPE_DESCRIPTIONS.get(errorType),
                            errorTracebackString: propertyName + "." + key,
                            errorDetail: errorMessage,
                            pointerToModifiedObject
                        }
                    );

                    continue;
                }

                let newPropertyName = propertyName === "" ? key : propertyName + "." + key;
                this.RunComparisonRecursively(value, secondObj, key, newPropertyName, pointerToModifiedObject);
            }
        }
    };

    static LookupPropInObj(key, obj) {
        if (obj && obj.hasOwnProperty(key)) {
            return obj[key];
        }
        return null;
    };
}

module.exports = ObjectValidator;