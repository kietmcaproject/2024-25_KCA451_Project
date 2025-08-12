// src/pages/reports/VendorPerformanceChart.js

import React from 'react';
import { useVendorPerformance } from '../../contexts/VendorContext';
import { Chart } from 'react-chartjs-2';

const VendorPerformanceChart = () => {
  const vendorPerformance = useVendorPerformance();

  const data = {
    labels: vendorPerformance.map((vendor) => vendor.name),
    datasets: [
      {
        label: 'Performance Metric',
        data: vendorPerformance.map((vendor) => vendor.performanceMetric),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h3>Vendor Performance</h3>
      <Chart type="bar" data={data} />
    </div>
  );
};

export default VendorPerformanceChart;
