const FuelLog = require('../models/FuelLog');
const Salary = require('../models/Salary');
const FeeRecord = require('../models/FeeRecord');
const Maintenance = require('../models/Maintenance');
const TripHistory = require('../models/TripHistory');
const VehicleInspection = require('../models/VehicleInspection');

// @desc    Get Analytics & Operational Summaries
// @route   GET /api/analytics/summary
// @access  Private (Admin only)
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    // 1. Fuel Consumption & Cost
    const fuelData = await FuelLog.aggregate([
      {
        $group: {
          _id: null,
          totalLiters: { $sum: '$fuelAdded' },
          totalCost: { $sum: '$fuelCost' },
          avgMileage: { $avg: '$mileage' }
        }
      }
    ]);

    // 2. Salary Summary
    const salaryData = await Salary.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          totalAmount: { $sum: '$netSalary' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Fee Collection Summary
    const feeData = await FeeRecord.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$balance' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Maintenance Summary
    const maintenanceCounts = await Maintenance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 5. Trip Stats
    const totalTrips = await TripHistory.countDocuments();
    const completedTrips = await TripHistory.countDocuments({ tripStatus: 'Completed' });

    // 6. Inspection Pass Rate
    const totalInspections = await VehicleInspection.countDocuments();
    const passedInspections = await VehicleInspection.countDocuments({ overallStatus: 'Pass' });
    const passRate = totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 100;

    return res.status(200).json({
      success: true,
      analytics: {
        fuel: {
          totalLiters: fuelData[0] ? fuelData[0].totalLiters : 0,
          totalCost: fuelData[0] ? fuelData[0].totalCost : 0,
          avgMileage: fuelData[0] ? Number(fuelData[0].avgMileage.toFixed(2)) : 4.8
        },
        salary: salaryData,
        fees: feeData,
        maintenance: maintenanceCounts,
        trips: {
          totalTrips,
          completedTrips
        },
        inspections: {
          totalInspections,
          passedInspections,
          passRate: `${passRate}%`
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
