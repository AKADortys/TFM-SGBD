const configService = require("../../services/Config/config.service");
const { handleResponse } = require("../../utils/controller.util");
const { updateConfigSchema } = require("../../dto/config.dto");

module.exports = {
  // Get config
  getConfig: async (req, res) => {
    try {
      const config = await configService.getConfig();
      return handleResponse(
        res,
        200,
        "Configuration récupérée avec succès",
        config,
      );
    } catch (error) {
      return handleResponse(res, 500, error.message);
    }
  },

  // Update config
  updateConfig: async (req, res) => {
    try {
      const { error, value } = updateConfigSchema.validate(req.body);

      if (error) {
        return handleResponse(res, 400, "Validation error", error.details);
      }

      const config = await configService.updateConfig(value);
      return handleResponse(
        res,
        200,
        "Configuration mise à jour avec succès",
        config,
      );
    } catch (error) {
      return handleResponse(res, 500, error.message);
    }
  },
};
