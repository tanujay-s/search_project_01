const { fetchAllDashboardData } = require('../services/dashboardService');

async function dashboard(req, res, next) {
    try {

        let dashboard_data = await fetchAllDashboardData();
        
        res.json(dashboard_data);
    } catch(err){
        next(err);
    } 
}

module.exports = { dashboard };