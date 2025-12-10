const User = require("../../models/User");

module.exports = async (startDate, endDate) => {
  const matchNewUsers = {};
  if (startDate || endDate) {
    matchNewUsers.createdAt = {};
    if (startDate) matchNewUsers.createdAt.$gte = new Date(startDate);
    if (endDate) matchNewUsers.createdAt.$lte = new Date(endDate);
  }

  const stats = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },

    {
      $addFields: {
        ordersCount: { $size: "$orders" },
        totalSpent: { $sum: "$orders.totalPrice" },
      },
    },

    {
      $match: {
        ordersCount: { $gt: 0 },
      },
    },

    {
      $facet: {
        usersByOrderCount: [
          { $sort: { ordersCount: -1 } },
          { $project: { name: 1, lastName: 1, ordersCount: 1 } },
        ],

        usersByMoneySpent: [
          { $sort: { totalSpent: -1 } },
          { $project: { name: 1, lastName: 1, totalSpent: 1 } },
        ],

        newUsers: [{ $match: matchNewUsers }, { $count: "count" }],

        activeUserRate: [
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
              activeUsers: {
                $sum: {
                  $cond: [{ $gt: ["$ordersCount", 0] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalUsers: 1,
              activeUsers: 1,
              activeRate: {
                $cond: [
                  { $eq: ["$totalUsers", 0] },
                  0,
                  { $divide: ["$activeUsers", "$totalUsers"] },
                ],
              },
            },
          },
        ],
      },
    },

    {
      $project: {
        usersByOrderCount: 1,
        usersByMoneySpent: 1,
        newUsers: { $ifNull: [{ $arrayElemAt: ["$newUsers.count", 0] }, 0] },
        activeUserRate: {
          $ifNull: [{ $arrayElemAt: ["$activeUserRate", 0] }, {}],
        },
      },
    },
  ]);

  return stats[0];
};
