import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/DonationPage.module.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function CurrentStock() {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterPincode, setFilterPincode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch('/api/donations');
        const data = await res.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDonations(sortedData);
        setFilteredDonations(sortedData);
      } catch (err) {
        console.error('Error fetching donations:', err);
      }
    };
    fetchDonations();
  }, []);

  useEffect(() => {
    const filtered = donations.filter((donation) => {
      const nameMatch = donation.item
        ?.toLowerCase()
        .includes(filterName.toLowerCase());
      const pincodeMatch = donation.pincode
        ?.toString()
        .includes(filterPincode);
      return nameMatch && pincodeMatch;
    });
    setFilteredDonations(filtered);
    setCurrentPage(1); // reset to page 1 on filter
  }, [filterName, filterPincode, donations]);

  const handleClearFilters = () => {
    setFilterName('');
    setFilterPincode('');
  };

  const handleDownloadCSV = () => {
    const headers = ['Item', 'Quantity', 'Donor', 'Phone', 'Address', 'Pincode', 'Message', 'Date'];
    const rows = filteredDonations.map((d) => [
      d.item,
      d.quantity,
      d.name,
      d.phone,
      d.address,
      d.pincode,
      d.message || '',
      new Date(d.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'donations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Donation Report', 14, 15);

    const tableColumn = ['Item', 'Quantity', 'Donor', 'Phone', 'Address', 'Pincode', 'Message', 'Date'];
    const tableRows = filteredDonations.map((d) => [
      d.item,
      d.quantity,
      d.name,
      d.phone,
      d.address,
      d.pincode,
      d.message || '',
      new Date(d.createdAt).toLocaleString()
    ]);

    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] }
    });

    doc.save('donations.pdf');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <Navbar />
      </header>

      <main className={styles.main}>
        <h2 className={styles.heading}>Current Stock</h2>

        {/* Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Item Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Search by Pincode"
            value={filterPincode}
            onChange={(e) => setFilterPincode(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
          <button
            onClick={handleClearFilters}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Clear Filters
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 text-white px-3 py-2 rounded-md w-full"
            >
              Download CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-purple-600 text-white px-3 py-2 rounded-md w-full"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Display Donations */}
        {currentDonations.length === 0 ? (
          <p className="text-center text-gray-600">No donations found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentDonations.map((donation) => (
              <div
                key={donation._id}
                className="border rounded-lg p-4 shadow-md bg-white"
              >
                <h2 className="text-xl font-semibold text-blue-600">
                  {donation.item}
                </h2>
                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Donor:</strong> {donation.name}</p>
                <p><strong>Phone:</strong> {donation.phone}</p>
                <p><strong>Address:</strong> {donation.address}</p>
                <p><strong>Pincode:</strong> {donation.pincode}</p>
                {donation.message && (
                  <p><strong>Message:</strong> {donation.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Donated on: {new Date(donation.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
