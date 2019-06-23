module.exports = [{
        name: "Tests",
        roles: [{
                code: "test_read",
                name: "Read",
                description: "Ability to see all tests an their details."
            },
            {
                code: "test_add",
                name: "Add",
                description: "Ability to add new tests.",
                parent: "test_read"
            },
            {
                code: "test_update",
                name: "Update",
                description: "Ability to update all details of a test.",
                parent: "test_read"
            },
            {
                code: "test_run",
                name: "Run",
                description: "Ability to run a test.",
                parent: "test_read"
            },
            {
                code: "test_delete",
                name: "Delete",
                description: "Ability to delete any test.",
                parent: "test_read"
            }
        ]
    },
    {
        name: "Collections",
        roles: [{
                code: "collection_read",
                name: "Read",
                description: "Ability to see all collections an their details."
            },
            {
                code: "collection_add",
                name: "Add",
                description: "Ability to add new collections."
            },
            {
                code: "collection_update",
                name: "Update",
                description: "Ability to update all details of a collection."
            },
            {
                code: "collection_run",
                name: "Run",
                description: "Ability to run all tests in a collection."
            },
            {
                code: "collection_delete",
                name: "Delete",
                description: "Ability to delete any collection."
            }
        ]
    },
    {
        name: "Runs",
        roles: [{
                code: "run_read",
                name: "Read",
                description: "Ability to see all runs an their details."
            },
            {
                code: "run_cancel",
                name: "Cancel",
                description: "Ability to cancel any scheduled run."
            },
            {
                code: "run_delete",
                name: "Delete",
                description: "Ability to delete any run."
            }
        ]
    },
    {
        name: "Users",
        roles: [{
                code: "user_read",
                name: "Read",
                description: "Ability to see all users an their details."
            },
            {
                code: "user_add",
                name: "Add",
                description: "Ability to add new users."
            },
            {
                code: "user_update",
                name: "Update",
                description: "Ability to update all details of a user."
            },
            {
                code: "user_delete",
                name: "Delete",
                description: "Ability to delete any user."
            }
        ]
    }
]