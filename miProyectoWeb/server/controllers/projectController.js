const Project = require('../models/projectModel');
const axios = require('axios');

// Obtener un proyecto específico
exports.getProject = async (req, res) => {
    try {
        const result = await Project.get(req.params.projectId);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas de un proyecto
exports.getProjectTasks = async (req, res) => {
    try {
        const result = await Project.getTasks(req.params.projectId);
        let tasks = result.rows;

        // Formatear las fechas para eliminar la hora
        tasks = tasks.map((task) => ({
            ...task,
            start_date: task.start_date.toISOString().split('T')[0],
            end_date: task.end_date.toISOString().split('T')[0],
        }));

        // Obtener los usuarios asignados a cada tarea
        for (let task of tasks) {
            const assignedUsersResult = await Project.getTaskAssignedUsers(
                task.id
            );
            task.assignedUsers = assignedUsersResult.rows;
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener chats de un proyecto
exports.getProjectChats = async (req, res) => {
    try {
        const result = await Project.getChats(req.params.projectId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuarios de un proyecto
exports.getProjectUsers = async (req, res) => {
    try {
        const result = await Project.getUsers(req.params.projectId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pasar la salida de nmap + script de Vulners a un objeto JSON
const parseNmapOutput = (output) => {
    const services = [];
    const lines = output.trim().split('\n');

    let currentService = null;

    lines.forEach((line) => {
        // Detectar líneas de servicios
        const serviceMatch = line.match(
            /(\d+)\/(tcp|udp)\s+(\w+)\s+(\S+)\s+(.*)/
        );
        if (serviceMatch) {
            if (currentService) {
                services.push(currentService);
            }
            currentService = {
                port: serviceMatch[1],
                protocol: serviceMatch[2],
                status: serviceMatch[3],
                service: serviceMatch[4],
                version: serviceMatch[5],
                vulnerabilities: [],
            };
            return;
        }

        // Detectar líneas de vulnerabilidades
        const vulnMatch = line.match(/\s*CVE-(\d{4}-\d+)\s+(\d+\.\d+)\s+(\S+)/);
        if (vulnMatch && currentService) {
            currentService.vulnerabilities.push({
                id: `CVE-${vulnMatch[1]}`,
                severity: vulnMatch[2],
                link: vulnMatch[3],
            });
        }
    });

    if (currentService) {
        services.push(currentService);
    }

    return services;
};
// Obtener descripción de una vulnerabilidad
const getVulnerabilityDescription = async (vulnId) => {
    try {
        const response = await axios.get(
            `https://vulners.com/api/v3/search/id/?id=${vulnId}`
        );
        return (
            response.data.data.documents[`${vulnId}`].description ||
            'Descripción no disponible'
        );
    } catch (error) {
        console.error(
            `Error fetching description for ${vulnId}: ${error.message}`
        );
        return 'Descripción no disponible';
    }
};

// Crear scan de un proyecto
exports.createProjectScan = async (req, res) => {
    const { projectId } = req.params;
    const { target } = req.body;
    if (!target) {
        return res.status(400).json({ error: 'Falta el objetivo del escaneo' });
    }
    const { exec } = require('child_process');

    exec(
        `nmap -sV --script vulners -p 22 ${target} | grep -e "CVE-" -e "/tcp" -e "/udp"`,
        async (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ error: 'Error al ejecutar el escaneo' });
            }

            const parsedResult = parseNmapOutput(stdout);

            // Añadir descripciones para cada vulnerabilidad a través de la API de Vulners
            for (let service of parsedResult) {
                for (let vuln of service.vulnerabilities) {
                    vuln.description = await getVulnerabilityDescription(
                        vuln.id
                    );
                }
            }

            res.json(parsedResult);
        }
    );
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
    try {
        const { name, description, userId, teamId } = req.body;
        const result = await Project.create({
            name,
            description,
            userId,
            teamId,
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un proyecto existente
exports.updateProject = async (req, res) => {
    try {
        const { name, description, teamId } = req.body;
        const result = await Project.update(req.params.projectId, {
            name,
            description,
            teamId,
        });
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
    try {
        const result = await Project.delete(req.params.projectId);
        if (result.rowCount > 0) {
            res.json({ message: 'Proyecto eliminado' });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
