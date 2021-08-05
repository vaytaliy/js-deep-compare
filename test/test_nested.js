const assert = require('assert');
const ObjectValidator = require("../utils/ObjectValidator.js");
const util = require('util')

describe("Nested objects", () => {

    it('Same objects with equal arrays', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Same objects with arrays: different valuetype item order', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["sapiens", "war and peace"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 2, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 2);
        assert.strictEqual(validationResult.nulls.count, 0);
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0);
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0);
        assert.strictEqual(validationResult.array_size_mismatches.count, 0);
    });

    it('Same arrays but first object has extra null item', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens", null]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 1, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 1, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has larger length)");
    });

    it('First object has more valuetype items in arrays', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens", "extra_item", "more_items"]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 2, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 2, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has larger length)");
    });

    it('Second object has more valuetype items in arrays', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens", "extra_item", "more_items"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 1, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 1, "array size mismatch (when 2nd obj has array with larger length)");
    });

    it('First object has 1 object item but second has valuetype', () => {

        /*
                expected result:
        
                second object even when it's value type at a given array index - doesn't have such properties
        */

        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", { name: "sapiens", publishedAt: "2016" }]
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens"],
            engaged: false
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 2, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 2, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has array with larger length)");
    });

    it('Subobjects have same structure but values arent equal', () => {

        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: ["peter", "alice"],
                occupation: "plumber",
                gender: "male"
            }
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            favoriteBooks: ["war and peace", "sapiens"],
            engaged: false,
            extraInfo: {
                friends: ["peter", "alice"],
                occupation: "footballer",
                gender: "male"
            }
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 1, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 1, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has array with larger length)");
    });

    it('Deeply nested objects - different values same types', () => {

        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter", {
                        name: "alice",
                        age: "25",
                        favoriteBooks: [
                            {
                                name: "sapiens",
                                releaseDate: 2016,
                                extraInfo: {
                                    author: "dont remember",
                                    ratingStars: 5,
                                    publisher: "also dont remember"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter", {
                        name: "alice",
                        age: "25",
                        favoriteBooks: [
                            {
                                name: "war and peace",
                                releaseDate: 1111,
                                extraInfo: {
                                    author: "old man who once lived",
                                    ratingStars: 4,
                                    publisher: "old publisher"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 5, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 5, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 0, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 0, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has array with larger length)");
    });

    it('Deeply nested objects - another name of property at object 1 (dont create error fields)', () => {

        //hatedBooks instead of favoriteBooks

        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter",
                    {
                        name: "alice",
                        age: "25",
                        hatedBooks: [
                            {
                                name: "sapiens",
                                releaseDate: 2016,
                                extraInfo: {
                                    author: "dont remember",
                                    ratingStars: 5,
                                    publisher: "also dont remember"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter",
                    {
                        name: "alice",
                        age: "25",
                        favoriteBooks: [
                            {
                                name: "war and peace",
                                releaseDate: 1111,
                                extraInfo: {
                                    author: "old man who once lived",
                                    ratingStars: 4,
                                    publisher: "old publisher"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: false
        })

        //console.log(util.inspect(totalModifiedFields, false, null, true /* enable colors */))
        //console.log(util.inspect(validationResult, false, null, true /* enable colors */))

        //actual, expected
        assert.strictEqual(totalModifiedFields, 0, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 1, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 1, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has array with larger length)");
    });

    it('Deeply nested objects - another name of property at object 1 (create error fields)', () => {

        //hatedBooks instead of favoriteBooks

        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter",
                    {
                        name: "alice",
                        age: "25",
                        hatedBooks: [
                            {
                                name: "sapiens",
                                releaseDate: 2016,
                                extraInfo: {
                                    author: "dont remember",
                                    ratingStars: 5,
                                    publisher: "also dont remember"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let gob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 32,
            height: 6.4,
            engaged: false,
            favoriteBooks: ["war and peace", "sapiens"],
            extraInfo: {
                friends: [
                    "peter",
                    {
                        name: "alice",
                        age: "25",
                        favoriteBooks: [
                            {
                                name: "war and peace",
                                releaseDate: 1111,
                                extraInfo: {
                                    author: "old man who once lived",
                                    ratingStars: 4,
                                    publisher: "old publisher"
                                }
                            },
                            {
                                name: "war and peace",
                                releaseDate: "long time ago"
                            }
                        ]
                    }],
                occupation: "plumber",
                gender: "male"
            }
        }

        let { value, validationResult, totalModifiedFields } = ObjectValidator.Compare(bob, gob, {
            createErrorFields: true
        })

        //actual, expected
        assert.strictEqual(totalModifiedFields, 1, "Mismatch in expected amount of fields to modify");
        assert.strictEqual(validationResult.mismatches.count, 0, "value mismatches");
        assert.strictEqual(validationResult.nulls.count, 0, "non existing property in array");
        assert.strictEqual(validationResult.properties_not_in_first_object.count, 1, "first object doesnt have N properties");
        assert.strictEqual(validationResult.properties_not_in_second_object.count, 1, "second object doesnt have N properties");
        assert.strictEqual(validationResult.array_size_mismatches.count, 0, "array size mismatch (when 2nd obj has array with larger length)");
    });

});