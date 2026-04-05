const express = require("express");
const router = express.Router();
const FinancialRecord = require("../models/RecordModel") ; 
const requireAuth = require("../middleware/requireAuth") ;
const authorizeRoles = require("../middleware/authorizeRoles") ;

router.get("/dashboard/summary",requireAuth, authorizeRoles("Admin", "Analyst"), async(req,res)=> {

    try {
        const userId = new mongoose.Types.ObjectId(req.user.id) ;

        const result = await FinancialRecord.aggregate([
            {$match : {owner : userId}} ,

            {
                $group : {
                    _id : {type : "$type", category : "$category"},
                    categoryTotal : {$sum : "$amount"}
                }
            }
        ]);

        let totalIncome = 0 ;
        let totalExpense = 0 ;
        const categoryTotal = { income : {}, expense : {}} ;

        result.forEach(item => {
            const {type, category} = item._id ;
            const amount = item.categoryTotal ;

            if(type === "income") {
                totalIncome += amount ;
                categoryTotal.income[category] = amount ;
            }
            else if(type === "expense") {
                totalExpense += amount ;
                categoryTotal.expense[category] = amount ;
            }
        })

        const netBalance = totalIncome - totalExpense;

        const recentActivity = await FinancialRecord.find({ owner: req.user._id })
            .sort({ createdAt: -1 }) 
            .limit(5);              

  
        res.status(200).json({
            summary: {
                totalIncome,
                totalExpense,
                netBalance,
                categoryTotal
            },
            recentActivity
        });
    }catch(err) {
        console.error("Dashboard API Error:", err);
        res.status(500).json({ error: "Failed to generate dashboard summary" })
    }
});

module.exports = router ;