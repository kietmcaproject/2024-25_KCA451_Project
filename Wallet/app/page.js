"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Wallet() {
  const [blocks, setBlocks] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const API_URL = "http://localhost:5004"; // Change as per your Flask backend

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_chain`);
      setBlocks(response.data.chain);
    } catch (error) {
      console.error("Error fetching blocks", error);
    }
  };

  const sendTransaction = async () => {
    try {
      await axios.post(`${API_URL}/add_transaction`, {
        sender: "user_wallet", // Change to actual user
        receiver: recipient,
        amount: parseFloat(amount),
      });
      alert("Transaction added!");
      setAmount("");
      setRecipient("");
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Decentralized Wallet</h1>

      {/* Transaction Form */}
      <div className="border rounded-lg p-4 shadow-md">
        <input
          type="text"
          placeholder="Recipient Address"
          className="w-full p-2 border rounded mb-2"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={sendTransaction}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send Transaction
        </button>
      </div>

      {/* Blockchain Explorer */}
      <h2 className="text-xl font-semibold mt-6">Blockchain Explorer</h2>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div key={block.index} className="border rounded-lg p-4 shadow-md">
            <p>Block #{block.index}</p>
            <p>Hash: {block.previous_hash}</p>
            <p>Transactions: {block.transactions.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}