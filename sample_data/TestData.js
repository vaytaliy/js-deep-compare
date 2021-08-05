const bob = {
    name: "bob bobson",
    phone: null,
    info: {
        friends:
            [
                {
                    name: "peter",
                    phone: "85-32-21",
                    extraInformation: {
                        isBestFriend: true
                    }
                },

                {
                    name: "dog",
                    phone: "82-32-21"
                },
                {
                    name: "andrew",
                    phone: "81-32-21"
                },
                {
                    name: "vitaliy",
                    phone: "86-32-21"
                },
                {
                    name: "ed",
                    phone: "87-32-21"
                }
            ],
        pets: [
            "dog",
            "catd"
        ],

        favoriteMeals: [
            "lunchd", [
                "blablaa", "arrvalue"
            ]
        ]
    }
}

const gob = {
    name: "gob glob",
    phone: "33-55-11",
    info: {
        friends:
            [
                {
                    name: "peter",
                    phone: "85-32-21"
                },
            ],
        pets: [
            "dog",
            "cat"
        ],

        favoriteMeals: [
            "lunch", [
                "blabla", "arrvalueds"
            ]
        ],

        strangeArray: []
    }
}

const people = [bob, gob];

module.exports = { people }