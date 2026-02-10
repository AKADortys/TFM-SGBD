const configService = require("../../services/Config/config.service");
const { handleResponse } = require("../../utils/controller.util");

module.exports = {
    // Get config
    getConfig: async (req, res) => {
        try {
            const config = await configService.getConfig();
            return handleResponse(res, 200, "Configuration récupérée avec succès", config);
        } catch (error) {
            // Error is already logged/handled in service, just send error response
            return handleResponse(res, 500, error.message);
        }
    },

    // Update config
    updateConfig: async (req, res) => {
        try {
            const data = req.body;
            const config = await configService.updateConfig(data);
            return handleResponse(res, 200, "Configuration mise à jour avec succès", config);
        } catch (error) {
            return handleResponse(res, 500, error.message);
        }
    },
};
