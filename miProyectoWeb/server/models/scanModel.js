const pool = require('../config/database');

const Scan = {
    // Obtener un escaneo específico
    get: async (taskId) => {
        try {
            const scanResult = await pool.query(
                'SELECT * FROM scans WHERE task_id = $1',
                [taskId]
            );
            const scan = scanResult.rows[0];

            const servicesResult = await pool.query(
                'SELECT * FROM services WHERE scan_id = $1',
                [scan.id]
            );
            scan.services = servicesResult.rows;

            for (let service of scan.services) {
                const vulnerabilitiesResult = await pool.query(
                    'SELECT * FROM vulnerabilities WHERE service_id = $1',
                    [service.id]
                );
                service.vulnerabilities = vulnerabilitiesResult.rows;
            }

            return scan;
        } catch (error) {
            throw new Error(`Error fetching scan: ${error.message}`);
        }
    },

    // Crear un nuevo escaneo
    create: async ({ command, targetIp, operativeSystem, taskId }) => {
        try {
            const result = await pool.query(
                'INSERT INTO scans (command, target_ip, operative_system, created_at, task_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [command, targetIp, operativeSystem, new Date(), taskId]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating scan: ${error.message}`);
        }
    },

    // Crear un nuevo servicio
    createService: async ({
        name,
        port,
        portStatus,
        protocol,
        version,
        scanId,
    }) => {
        try {
            const result = await pool.query(
                'INSERT INTO services (name, port, port_status, protocol, version, scan_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, port, portStatus, protocol, version, scanId]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating service: ${error.message}`);
        }
    },

    // Crear una nueva vulnerabilidad
    createVulnerability: async ({
        cveId,
        description,
        baseScore,
        baseSeverity,
        attackVector,
        attackComplexity,
        privilegesRequired,
        userInteraction,
        scope,
        confidentialityImpact,
        integrityImpact,
        availabilityImpact,
        serviceId,
    }) => {
        try {
            const result = await pool.query(
                'INSERT INTO vulnerabilities (cve_id, description, base_score, base_severity, attack_vector, attack_complexity, privileges_required, user_interaction, scope, confidentiality_impact, integrity_impact, availability_impact, service_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
                [
                    cveId,
                    description,
                    baseScore,
                    baseSeverity,
                    attackVector,
                    attackComplexity,
                    privilegesRequired,
                    userInteraction,
                    scope,
                    confidentialityImpact,
                    integrityImpact,
                    availabilityImpact,
                    serviceId,
                ]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating vulnerability: ${error.message}`);
        }
    },

    // Eliminar un escaneo
    delete: async (scanId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'DELETE FROM scans WHERE id = $1',
                [scanId]
            );

            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error deleting scan: ${error.message}`);
        } finally {
            client.release();
        }
    },
};

module.exports = Scan;
