// src/contexts/VendorContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// Creating the VendorContext
const VendorContext = createContext();

// VendorProvider component to wrap the app with context
export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);

  // Optional: Fetch vendor data from an API or Firebase here if needed
  useEffect(() => {
    // Example: Fetching vendor data from Firebase or some API
    // Example:
    // const fetchVendors = async () => {
    //   const vendorData = await fetchVendorData(); // Replace with your actual fetch logic
    //   setVendors(vendorData);
    // };
    // fetchVendors();

    // For now, we use a mock data as an example:
    setVendors([
      { id: 1, name: 'Vendor 1', ordersCount: 120 },
      { id: 2, name: 'Vendor 2', ordersCount: 80 },
    ]);
  }, []);

  return (
    <VendorContext.Provider value={{ vendors, setVendors }}>
      {children}
    </VendorContext.Provider>
  );
};

// Custom hook to access vendor data
export const useVendorContext = () => {
  return useContext(VendorContext);
};

// Create a custom hook to easily access vendor data
export const useVendors = () => {
  const { vendors, setVendors } = useVendorContext();
  return { vendors, setVendors };
};

// Hook for vendor performance data
export const useVendorPerformance = () => {
  const { vendors } = useVendorContext();

  // Return an array of vendor performance metrics
  const vendorPerformance = vendors.map((vendor) => ({
    name: vendor.name,
    performanceMetric: vendor.ordersCount || 0, // Assuming `ordersCount` is a performance metric
  }));

  return vendorPerformance;
};
