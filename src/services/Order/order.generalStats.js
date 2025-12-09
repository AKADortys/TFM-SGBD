const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

module.exports = getGeneralStats = async () => {
  try {
    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          ordersByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
              },
            },
          ],
          averageBasket: [
            {
              $group: {
                _id: null,
                avg: { $avg: "$totalPrice" },
              },
            },
          ],
        },
      },
      {
        // Mise en forme facile à consommer côté client
        $project: {
          totalOrders: {
            $ifNull: [{ $arrayElemAt: ["$totalOrders.count", 0] }, 0],
          },
          ordersByStatus: 1,
          totalRevenue: {
            $ifNull: [{ $arrayElemAt: ["$totalRevenue.total", 0] }, 0],
          },
          averageBasket: {
            $ifNull: [{ $arrayElemAt: ["$averageBasket.avg", 0] }, 0],
          },
        },
      },
    ]);
    return stats[0];
  } catch (error) {
    handleServiceError("Order", "getGeneralStats", error);
  }
};
