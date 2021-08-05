const assert = require('assert');
const ObjectValidator = require("../utils/ObjectValidator.js");
const util = require('util')

describe("invalid input", () => {
    it('First object is null', () => {
        let bob = null
    
        let gob = {
            name: "Gob",
            phoneNumber: "39-04-232",
            age: 31,
            height: 6.1,
            engaged: false
        }

        //actual, expected
        assert.throws(() => {ObjectValidator.Compare(bob, gob)}, TypeError)
    });

    it('Second object is null', () => {
        let bob = {
            name: "Bob",
            phoneNumber: "39-04-232",
            age: 31,
            height: 6.1,
            engaged: false
        }
    
        let gob = null

        //actual, expected
        assert.throws(() => {ObjectValidator.Compare(bob, gob)}, TypeError)
    });

    it('First object is hashmap', () => {
        let bob = new Map();
        bob.set("name", "bob");
        bob.set("age", "31");
    
        let gob = {
            name: "Gob",
            phoneNumber: "39-04-232",
            age: 31,
            height: 6.1,
            engaged: false
        }

        //actual, expected
        assert.throws(() => {ObjectValidator.Compare(bob, gob)}, TypeError)
    });

    it('First object is stringified json', () => {
        let bob = "{\"name\":\"Bob\",\"age\":22,\"height\":6.4}"
    
        let gob = {
            name: "Gob",
            phoneNumber: "39-04-232",
            age: 31,
            height: 6.1,
            engaged: false
        }

        //actual, expected
        assert.throws(() => {ObjectValidator.Compare(bob, gob)}, TypeError)
    });

});