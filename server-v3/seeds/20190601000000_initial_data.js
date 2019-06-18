exports.seed = knex => {
    return knex('users_roles').del()
    .then(function(){knex('users').del()})
    .then(function(){knex('organizations').del()})
    .then(function () {
      return knex("organizations").insert([
        {
          id: 1,
          uid: "82fdebdd-63ab-4de2-a208-f834ffe8e37c",
          name: "Default"
        }
      ])
    }).then(function () {
      return knex("users").insert([
        {
          id: 1,
          uid: "814e88ac-f2da-4ede-b79e-b4df94be7f45",
          organization: 1,
          email: "N/A",
          password: "N/A",
          name: "Uier Test Runner"
        }
      ])
  
    }).then(function () {
      return knex("users_roles").insert([
        {
          id: 1,
          user: 1,
          role: "run_read"
        },
        {
          id: 2,
          user: 1,
          role: "run_update"
        },
        {
          id: 3,
          user: 1,
          role: "run_execute"
        }
      ])
    })

};