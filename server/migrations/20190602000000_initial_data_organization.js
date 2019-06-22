exports.up = knex => {
    return knex("organizations").insert([{
        id: 1,
        uid: "82fdebdd-63ab-4de2-a208-f834ffe8e37c",
        name: "Default"
    }]).then(function() {
        return knex("users").insert([{
            id: 1,
            uid: "814e88ac-f2da-4ede-b79e-b4df94be7f45",
            organization: 1,
            email: "admin@uier.com",
            password: "password",
            name: "Administrator"
        }])
    }).then(function() {
        return knex("users_roles").insert([
            { id: 1, user: 1, role: "user_read" },
            { id: 2, user: 1, role: "user_add" },
            { id: 3, user: 1, role: "user_delete" },
            { id: 4, user: 1, role: "test_read" },
            { id: 5, user: 1, role: "test_add" },
            { id: 6, user: 1, role: "test_update" },
            { id: 7, user: 1, role: "test_delete" },
            { id: 8, user: 1, role: "collection_read" },
            { id: 9, user: 1, role: "collection_add" },
            { id: 10, user: 1, role: "collection_update" },
            { id: 11, user: 1, role: "collection_delete" },
            { id: 12, user: 1, role: "run_read" },
            { id: 13, user: 1, role: "run_update" },
            { id: 14, user: 1, role: "test_run" },
            { id: 15, user: 1, role: "collection_run" },
            { id: 16, user: 1, role: "run_delete" }
        ])
    })
};

exports.down = knex => {
    // None
};