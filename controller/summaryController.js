const FinancialRecord = require("../models/RecordModel");

module.exports.summary = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const result = await FinancialRecord.aggregate([
    { $match: { owner: userId } },

    {
      $group: {
        _id: { type: "$type", category: "$category" },
        categoryTotal: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotal = { income: {}, expense: {} };

  result.forEach((item) => {
    const { type, category } = item._id;
    const amount = item.categoryTotal;

    if (type === "income") {
      totalIncome += amount;
      categoryTotal.income[category] = amount;
    } else if (type === "expense") {
      totalExpense += amount;
      categoryTotal.expense[category] = amount;
    }
  });

  const netBalance = totalIncome - totalExpense;

  const recentActivity = await FinancialRecord.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  const trendData = await FinancialRecord.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyTrends = trendData.map((item) => ({
    period: `${item._id.year}-${item._id.month}`,
    type: item._id.type,
    amount: item.total,
  }));
  res.status(200).json({
    summary: {
      totalIncome,
      totalExpense,
      netBalance,
      categoryTotal,
    },
    recentActivity,
    monthlyTrends,
  });
};
