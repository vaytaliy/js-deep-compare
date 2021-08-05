const assert = require('assert');
const ObjectValidator = require("../utils/ObjectValidator.js");
const util = require('util')

describe("Flat objects", () => {
    
    it('Same valuetypes different values', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false
        }
    
        let gob = {
            name: "Gob",
            phoneNumber: "39-04-232",
            age: 31,
            height: 6.1,
            engaged: false
        }
        
        let {value, validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 3, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 3);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);     
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Same valuetypes same values', () => {
        
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false
        }
    
        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false
        }
        
        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Different valuetypes same values', () => {
        
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: "32",
            height: 6.4,
            engaged: false
        }
    
        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: "false"
        }
        
        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 2, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 2);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);

    });

    it('First object has null', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: null,
            height: 6.4,
            engaged: false
        }
    
        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 23,
            height: 6.4,
            engaged: false
        }
        
        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 1);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Second object has null', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 33,
            height: 6.4,
            engaged: false
        }
    
        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 33,
            height: 6.4,
            engaged: null
        }
        
        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 1, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 1);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('First object missing multiple properties', () => {
        let bob = {name: "Gob"};
        let gob = {
            name: "Gob",
            phoneNumber: "5332-22-11",
            age: 23,
            height: 6.1,
            engaged: true
        }

        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 4);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('First object is empty', () => {
        let bob = {}

        let gob = {
            name: "Gob",
            phoneNumber: "29-04-232",
            age: 12,
            height: 5.4,
            engaged: true
        }

        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 5);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Second object is empty', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false
        }

        let gob = {}

        let {validationResult, totalModifiedFields} = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 5, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 5);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });
});
