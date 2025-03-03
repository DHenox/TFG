const pool = require('../config/database');

const Project = {
    get: (projectId) => {
        return pool.query(
            `
            SELECT
                p.*,
                json_agg(t.*) AS tasks,
                json_build_object(
                    'id', tm.id,
                    'name', tm.name,
                    'description', tm.description,
                    'user_id', tm.user_id
                ) AS team
            FROM
                projects p
            LEFT JOIN
                tasks t ON p.id = t.project_id
            LEFT JOIN
                teams tm ON p.team_id = tm.id
            WHERE
                p.id = $1
            GROUP BY
                p.id, tm.id
            `,
            [projectId]
        );
    },
    getTasks: (projectId) => {
        return pool.query(
            `
            SELECT *
            FROM tasks
            WHERE project_id = $1
            ORDER BY created_at ASC
            `,
            [projectId]
        );
    },
    getTaskAssignedUsers: (taskId) => {
        return pool.query(
            `
            SELECT u.*
            FROM user_task ut
            JOIN users u ON ut.user_id = u.id
            WHERE ut.task_id = $1
            `,
            [taskId]
        );
    },
    getScanningStatus: (taskId) => {
        return pool.query(
            `
            SELECT CASE WHEN s.task_id = $1 THEN 'started'
            ELSE 'not started' END AS scanning_status
            FROM tfg.scans s WHERE s.task_id = $1;
            `,
            [taskId]
        );
    },
    getChats: (projectId) => {
        return pool.query(
            `
            SELECT *
            FROM chats
            WHERE project_id = $1
            `,
            [projectId]
        );
    },
    getUsers: (projectId) => {
        return pool.query(
            `
            SELECT u.*
            FROM users u
            JOIN user_project up ON up.user_id = u.id
            WHERE up.project_id = $1
            `,
            [projectId]
        );
    },
    create: async ({ name, description, userId, teamId }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar el proyecto en la tabla projects
            const projectResult = await client.query(
                `INSERT INTO projects (name, description, created_at, user_id, team_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [name, description, new Date(), userId, teamId]
            );

            const projectId = projectResult.rows[0].id;

            // Obtener los miembros del equipo
            const teamMembersResult = await client.query(
                `SELECT user_id FROM user_team WHERE team_id = $1`,
                [teamId]
            );
            const members = teamMembersResult.rows.map((row) => row.user_id);

            const userTeamValues = members
                .map((memberId) => `('${memberId}', ${projectId})`)
                .join(',');

            // Insertar las relaciones en la tabla user_project
            await client.query(
                `INSERT INTO user_project (user_id, project_id) 
                 VALUES ${userTeamValues}`
            );

            await client.query('COMMIT');

            // Obtener el proyecto recién creado con tareas y equipo
            const projectWithDetails = await client.query(
                `
                SELECT
                    p.*,
                    json_agg(t.*) AS tasks,
                    json_build_object(
                        'id', tm.id,
                        'name', tm.name,
                        'description', tm.description,
                        'user_id', tm.user_id
                    ) AS team
                FROM
                    projects p
                LEFT JOIN
                    tasks t ON p.id = t.project_id
                LEFT JOIN
                    teams tm ON p.team_id = tm.id
                WHERE
                    p.id = $1
                GROUP BY
                    p.id, tm.id
                `,
                [projectId]
            );

            return projectWithDetails;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    update: async (projectId, { name, description, teamId }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Obtener el proyecto actual para determinar el equipo anterior
            const currentProjectResult = await client.query(
                `SELECT team_id FROM projects WHERE id = $1`,
                [projectId]
            );

            if (currentProjectResult.rowCount === 0) {
                throw new Error('Proyecto no encontrado');
            }

            const currentTeamId = currentProjectResult.rows[0].team_id;

            // Si el equipo ha cambiado, eliminar las asignaciones de usuarios para las tareas del proyecto
            if (currentTeamId !== teamId) {
                // Eliminar las asignaciones de usuarios en user_task para tareas del proyecto
                await client.query(
                    `
                    DELETE FROM user_task
                    WHERE task_id IN (
                        SELECT id FROM tasks WHERE project_id = $1
                    )
                    `,
                    [projectId]
                );
            }

            // Actualizar el proyecto en la tabla projects
            const result = await client.query(
                `
                UPDATE projects
                SET name = $1, description = $2, team_id = $3
                WHERE id = $4
                RETURNING *
                `,
                [name, description, teamId, projectId]
            );

            if (result.rowCount === 0) {
                throw new Error('Proyecto no encontrado');
            }

            // Obtener los miembros del equipo actualizado
            const teamMembersResult = await client.query(
                `SELECT user_id FROM user_team WHERE team_id = $1`,
                [teamId]
            );
            const members = teamMembersResult.rows.map((row) => row.user_id);

            // Eliminar las relaciones antiguas en user_project
            await client.query(
                `DELETE FROM user_project WHERE project_id = $1`,
                [projectId]
            );

            // Insertar las nuevas relaciones en user_project
            if (members.length > 0) {
                const userProjectValues = members
                    .map((memberId) => `('${memberId}', ${projectId})`)
                    .join(',');

                await client.query(
                    `INSERT INTO user_project (user_id, project_id) VALUES ${userProjectValues}`
                );
            }

            await client.query('COMMIT');

            // Obtener el proyecto actualizado con tareas y equipo
            return client.query(
                `
                SELECT
                    p.*,
                    json_agg(t.*) AS tasks,
                    json_build_object(
                        'id', tm.id,
                        'name', tm.name,
                        'description', tm.description,
                        'user_id', tm.user_id
                    ) AS team
                FROM
                    projects p
                LEFT JOIN
                    tasks t ON p.id = t.project_id
                LEFT JOIN
                    teams tm ON p.team_id = tm.id
                WHERE
                    p.id = $1
                GROUP BY
                    p.id, tm.id
                `,
                [projectId]
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    delete: async (projectId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Eliminar el proyecto en sí
            const result = await client.query(
                `DELETE FROM projects WHERE id = $1 RETURNING *`,
                [projectId]
            );

            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};

module.exports = Project;
