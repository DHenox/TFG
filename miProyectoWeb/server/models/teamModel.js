const pool = require('../config/database');

const Team = {
    create: ({ name, description, userId }) => {
        return pool.query(
            `
      WITH inserted AS (
        INSERT INTO teams (name, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
      )
      INSERT INTO user_team (user_id, team_id)
      VALUES ($3, (SELECT id FROM inserted))
      RETURNING *
    `,
            [name, description, userId]
        );
    },
    update: (teamId, { name, description }) => {
        return pool.query(
            `
      UPDATE teams
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `,
            [name, description, teamId]
        );
    },
    delete: (teamId) => {
        return pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [
            teamId,
        ]);
    },
};

module.exports = Team;
