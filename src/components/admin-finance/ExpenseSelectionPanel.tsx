import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function ExpenseSelectionPanel() {
  // Available expenses
  const [availableExpenses, setAvailableExpenses] = useState([
    { id: 1, name: "Ujian", amount: 900000 },
    { id: 2, name: "SKS", amount: 2000000 },
  ]);

  // Selected expenses
  const [selectedExpenses, setSelectedExpenses] = useState([
    { id: 3, name: "SPP", amount: 2000000 },
  ]);

  // Total invoice price
  const [totalPrice, setTotalPrice] = useState(0);

  // Search queries
  const [availableSearchQuery, setAvailableSearchQuery] = useState("");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");

  // Calculate total price whenever selected expenses change
  useEffect(() => {
    const total = selectedExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotalPrice(total);
  }, [selectedExpenses]);

  // Format the amount to Indonesian Rupiah format
  const formatAmount = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  // Filter available expenses based on search
  const filteredAvailableExpenses = availableExpenses.filter((expense) =>
    expense.name.toLowerCase().includes(availableSearchQuery.toLowerCase())
  );

  // Filter selected expenses based on search
  const filteredSelectedExpenses = selectedExpenses.filter((expense) =>
    expense.name.toLowerCase().includes(selectedSearchQuery.toLowerCase())
  );

  // Handle adding an expense to selected list
  const handleAddExpense = (expense) => {
    setAvailableExpenses((prev) =>
      prev.filter((item) => item.id !== expense.id)
    );
    setSelectedExpenses((prev) => [...prev, expense]);
  };

  // Handle removing an expense from selected list
  const handleRemoveExpense = (expense) => {
    setSelectedExpenses((prev) =>
      prev.filter((item) => item.id !== expense.id)
    );
    setAvailableExpenses((prev) => [...prev, expense]);
  };

  // Handle save action
  const handleSave = () => {
    alert("Total price:"+ totalPrice);
  };

  // Handle cancel action
  const handleCancel = () => {
    alert("ok cancell");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 mb-6">
        {/* Available Expenses */}
        <div className="w-full">
          <div>
            <h2 className="font-semibold text-center mb-4">
              Biaya yang tersedia
            </h2>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={availableSearchQuery}
                onChange={(e) => setAvailableSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-[#EEF2F6] rounded border-2 p-2 sm:px-10 text-sm h-96">
              {/* Expense List */}
              <div className=" rounded-md p-2 max-h-64 overflow-y-auto">
                {filteredAvailableExpenses.length > 0 ? (
                  filteredAvailableExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-medium">{expense.name}</span>
                      <div className="flex items-center space-x-3">
                        <span>{formatAmount(expense.amount)}</span>
                        <button
                          className="text-blue-500 text-sm hover:underline"
                          onClick={() => handleAddExpense(expense)}
                        >
                          Tambahkan
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3 text-center text-gray-500">
                    No expenses found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Expenses */}
        <div className="w-full">
          <h2 className="font-semibold text-center mb-4">Biaya yang Dipilih</h2>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              value={selectedSearchQuery}
              onChange={(e) => setSelectedSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-[#EEF2F6] rounded border-2 p-2 sm:px-10 text-sm h-96 overflow-auto">
            <div>
              {/* Selected Expense List */}
              <div className=" rounded-md p-2 max-h-64 overflow-y-auto">
                {filteredSelectedExpenses.length > 0 ? (
                  filteredSelectedExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-medium">{expense.name}</span>
                      <div className="flex items-center space-x-3">
                        <span>{formatAmount(expense.amount)}</span>
                        <button
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => handleRemoveExpense(expense)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3 text-center text-gray-500">
                    No selected expenses
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total and Action Buttons */}
      <div className="flex flex-col items-end mt-4">
        {/* Total Price Display */}
        <div className="mb-4 text-right">
          <p className="text-sm font-medium text-gray-600">
            Total Invoice Price
          </p>
          <p className="text-xl font-bold">{formatAmount(totalPrice)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full md:w-1/2">
          <button
            className="w-1/2 bg-red-400 hover:bg-red-400 text-white py-2 px-4 rounded transition-colors"
            onClick={handleCancel}
          >
            Batalkan
          </button>
          <button
            className="w-1/2 bg-primary-green hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
    
  );
}
