const Scan = require('../models/scanModel');
const axios = require('axios');
const { exec } = require('child_process');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Obtener un escaneo específico
exports.getScan = async (req, res) => {
    try {
        const result = await Scan.get(req.params.taskId);
        const scan = {
            id: result.id,
            command: result.command,
            targetIp: result.target_ip,
            os: result.operative_system,
            services: result.services.map((service) => ({
                serviceName: service.name,
                port: service.port,
                portStatus: service.port_status,
                protocol: service.protocol,
                version: service.version,
                vulnerabilities: service.vulnerabilities.map((vuln) => ({
                    cveId: vuln.cve_id,
                    description: vuln.description,
                    baseScore: vuln.base_score,
                    baseSeverity: vuln.base_severity,
                    attackVector: vuln.attack_vector,
                    attackComplexity: vuln.attack_complexity,
                    privilegesRequired: vuln.privileges_required,
                    userInteraction: vuln.user_interaction,
                    scope: vuln.scope,
                    confidentialityImpact: vuln.confidentiality_impact,
                    integrityImpact: vuln.integrity_impact,
                    availabilityImpact: vuln.availability_impact,
                })),
            })),
        };

        res.status(200).json(scan);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Pasar la salida de nmap + script de Vulners a un objeto JSON
const parseNmapOutput = (output, ipAddress) => {
    const services = [];
    const lines = output.trim().split('\n');

    let currentService = null;
    let osInfo = null; // Variable para almacenar la información del sistema operativo

    lines.forEach((line) => {
        // Detectar líneas de servicios
        const serviceMatch = line.match(
            /(\d+)\/(tcp|udp|sctp)\s+(\w+)\s+(\S+)\s+(.*)/
        );
        if (serviceMatch) {
            if (currentService) {
                services.push(currentService);
            }
            currentService = {
                port: serviceMatch[1],
                protocol: serviceMatch[2],
                portStatus: serviceMatch[3],
                serviceName: serviceMatch[4],
                version: serviceMatch[5],
                vulnerabilities: [],
            };
            return;
        }

        // Detectar líneas de vulnerabilidades (CVE)
        const vulnMatch = line.match(/\s*CVE-(\d{4}-\d+)/);
        if (vulnMatch && currentService) {
            currentService.vulnerabilities.push({
                cveId: `CVE-${vulnMatch[1]}`,
            });
        }

        // Detectar la línea que contiene la información del sistema operativo
        const osMatch = line.match(/OS: (.+?);/);
        if (osMatch) {
            osInfo = osMatch[1];
        }
    });

    if (currentService) {
        services.push(currentService);
    }

    // Retornar los servicios junto con la información del sistema operativo
    return {
        targetIp: ipAddress,
        os: osInfo || 'OS info not available',
        services,
    };
};

// Obtener descripción de una vulnerabilidad
const getVulnersApiInfo = async (vulnId) => {
    try {
        const response = await axios.get(
            `https://vulners.com/api/v3/search/id/?id=${vulnId}`
        );
        return {
            description:
                response.data.data.documents[`${vulnId}`].description ||
                'Descripción no disponible',
            baseScore:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.baseScore || 0,
            baseSeverity:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.baseSeverity || 'N/A',
            attackVector:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.attackVector || 'N/A',
            attackComplexity:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.attackComplexity || 'N/A',
            privilegesRequired:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.privilegesRequired || 'N/A',
            userInteraction:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.userInteraction || 'N/A',
            scope:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.scope || 'N/A',
            confidentialityImpact:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.confidentialityImpact || 'N/A',
            integrityImpact:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.integrityImpact || 'N/A',
            availabilityImpact:
                response.data.data.documents[`${vulnId}`]?.metrics?.cvss3
                    ?.availabilityImpact || 'N/A',
        };
    } catch (error) {
        console.error(
            `Error fetching description for ${vulnId}: ${error.message}`
        );
        return {
            description: 'Descripción no disponible',
            baseScore: 0,
            baseSeverity: 'N/A',
            attackVector: 'N/A',
            attackComplexity: 'N/A',
            privilegesRequired: 'N/A',
            userInteraction: 'N/A',
            scope: 'N/A',
            confidentialityImpact: 'N/A',
            integrityImpact: 'N/A',
            availabilityImpact: 'N/A',
        };
    }
};

// Crear un nuevo escaneo
exports.createScan = async (req, res) => {
    const { taskId } = req.params;
    const { command } = req.body;
    const { target } = req.body;
    const { emailNotification } = req.body;
    const { email } = req.body;

    exec(
        `${command} | grep -e "CVE-" -e "/tcp" -e "/udp" -e "/sctp" -e "OS:"`,
        async (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ error: 'Error al ejecutar el escaneo' });
            }

            // Parsear la salida del comando nmap
            const parsedResult = parseNmapOutput(stdout, target);

            // Crear entrada en la tabla "Scans"
            const scan = await Scan.create({
                command: command,
                targetIp: parsedResult.targetIp,
                operativeSystem: parsedResult.os,
                taskId: taskId,
            });

            parsedResult.id = scan.id;
            parsedResult.command = scan.command;

            // Añadir descripciones para cada vulnerabilidad a través de la API de Vulners y crear entradas en las tablas "Services" y "Vulnerabilities"
            for (let service of parsedResult.services) {
                const createdService = await Scan.createService({
                    name: service.serviceName,
                    port: service.port,
                    portStatus: service.portStatus,
                    protocol: service.protocol,
                    version: service.version,
                    scanId: scan.id,
                });

                for (let vuln of service.vulnerabilities) {
                    const vulnDetails = await getVulnersApiInfo(vuln.cveId);
                    await Scan.createVulnerability({
                        cveId: vuln.cveId,
                        description: vulnDetails.description,
                        baseScore: vulnDetails.baseScore,
                        baseSeverity: vulnDetails.baseSeverity,
                        attackVector: vulnDetails.attackVector,
                        attackComplexity: vulnDetails.attackComplexity,
                        privilegesRequired: vulnDetails.privilegesRequired,
                        userInteraction: vulnDetails.userInteraction,
                        scope: vulnDetails.scope,
                        confidentialityImpact:
                            vulnDetails.confidentialityImpact,
                        integrityImpact: vulnDetails.integrityImpact,
                        availabilityImpact: vulnDetails.availabilityImpact,
                        serviceId: createdService.id,
                    });
                    vuln.cveId = vuln.cveId;
                    vuln.description = vulnDetails.description;
                    vuln.baseScore = vulnDetails.baseScore;
                    vuln.baseSeverity = vulnDetails.baseSeverity;
                    vuln.attackVector = vulnDetails.attackVector;
                    vuln.attackComplexity = vulnDetails.attackComplexity;
                    vuln.privilegesRequired = vulnDetails.privilegesRequired;
                    vuln.userInteraction = vulnDetails.userInteraction;
                    vuln.scope = vulnDetails.scope;
                    vuln.confidentialityImpact =
                        vulnDetails.confidentialityImpact;
                    vuln.integrityImpact = vulnDetails.integrityImpact;
                    vuln.availabilityImpact = vulnDetails.availabilityImpact;
                }
            }

            // Enviar notificación por correo si está habilitada
            if (emailNotification && email) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Scan Completed',
                    text: `The scan for IP ${parsedResult.targetIp} has finished. You can now view the result in the web application.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Correo enviado: ' + info.response);
                    }
                });
            }

            res.status(201).json(parsedResult);
        }
    );
};

// Eliminar un escaneo
exports.deleteScan = async (req, res) => {
    try {
        await Scan.delete(req.params.scanId);
        res.json({ message: 'Escaneo eliminado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
