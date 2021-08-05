const ObjectValidator = require("./utils/ObjectValidator.js");
const { people } = require("./sample_data/TestData.js");
/*
    ObjectValidator.Compare:
        returns an Promise<object> which was used for comparison 
        (original, or modified if createErrorFields flag is set to true)
        this object also has validationResult property which gives summary on errors

    SaveResultAsync:
        chained method on ObjectValidator which takes its
        value (original/modified with errorfields object)
        and validationResult (summary of errors)
        
        if saveValidationResult is used, then
        a folder is created where comparison object and validation files are
        placed separately

*/


// usage example
const result = ObjectValidator.Compare(
    people[0], //first object
    people[1], //object to compare to
    {
        createErrorFields: true,  //very buggy, in the future will create fields exclusively for valuetypes which exist
        originalFieldName: "original_val",
        errorFieldName: "validation_error",
    })
    .SaveResultAsync( 
        {
            path: "./results/save_test",
            alias: "nulls_check", //folder and file name after automatically created timestamp
            format: "json",
            saveValidationResult: true //saves with errors added over fields, very buggy
        }                              
    )