const FinancialRecord = require("../models/RecordModel");

module.exports.getAllRecords = async (req, res) => {
  const { userId } = req.params;

  const filter = { owner: userId };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  const allRecords = await FinancialRecord.find(filter)
    .sort({ createdAt: -1 })
    .limit(30);

  res
    .status(200)
    .json({ success: true, count: allRecords.length, data: allRecords });
};

module.exports.createRecord = async (req, res) => {
  const { amount, type, category, description } = req.body;

  const newRecord = new FinancialRecord({
    amount,
    type,
    category,
    description,
    owner: req.user.id,
  });

  const savedRecord = await newRecord.save();

  if (!savedRecord) {
    return res.status(500).json({ err: "Failed to create User" });
  }

  res
    .status(200)
    .json({ message: "Record Created Sucessfully", record: savedRecord });
};

module.exports.updateRecord = async (req, res) => {
  const id = req.params.id;
  const record = await FinancialRecord.findById(id);

  if (!record) {
    return res.status(404).json({ err: "Record Not found" });
  }

  const { amount, type, category, description } = req.body;

  if (amount !== undefined) record.amount = amount;
  if (description !== undefined) record.description = description;

  if (type || category) {
    record.type = type || record.type;
    record.category = category || record.category;
  }

  const updatedRecord = await record.save();
  res
    .status(200)
    .json({ message: "Record updated sucessfully", record: updatedRecord });
};

module.exports.deleteRecord = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await FinancialRecord.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ error: "Cannot find Record" });
  }

  res
    .status(200)
    .json({ message: "Record Deleted sucessfully", user: deletedUser });
};
