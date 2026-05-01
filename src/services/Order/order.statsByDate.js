const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

module.exports = getStatsByDate = async (startDate, endDate) => {
  try {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const stats = await Order.aggregate([
      { $match: match },

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
          revenueByDate: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$totalPrice" },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
      {
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
          revenueByDate: 1,
        },
      },
    ]);
    return stats[0];
  } catch (error) {
    handleServiceError("Order", "getStatsByDate", error);
  }
};
