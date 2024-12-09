import React, { useEffect, useState } from "react";
import { Card, Row } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "./TransactionsSearch";
import Header from "./header";
import AddIncomeModal from "./modals/AddIncome";
import AddExpenseModal from "./modals/AddExpense";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Loader from "./loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import EditTransactionModal from "./modals/EditTransaction"; // Import the EditTransactionModal

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in");
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};
    const incomeData = {};
  
    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;
  
      if (transaction.type === "income") {
        // Process income data
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance += transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
  
        if (incomeData[tag]) {
          incomeData[tag] += transaction.amount;
        } else {
          incomeData[tag] = transaction.amount;
        }
      } else {
        // Process expenses data
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -= transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }
  
        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });
  
    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));
  
    const incomeDataArray = Object.keys(incomeData).map((key) => ({
      category: key,
      value: incomeData[key],
    }));
  
    return { balanceData, spendingDataArray, incomeDataArray };
  };
  

  const { balanceData, spendingDataArray, incomeDataArray } = processChartData();


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    if (transactionToEdit) {
      // Updating an existing transaction
      const updatedTransaction = {
        ...transactionToEdit, // Keep the current transaction's data
        ...values, // Overwrite with new form data
        type: transactionToEdit.type || type, // Use the existing type or fallback to the passed type
        date: moment(values.date).format("YYYY-MM-DD"), // Ensure the date is correctly formatted
      };
  
      // Ensure you're passing the transaction ID and updated data
      if (transactionToEdit.id) {
        updateTransaction(transactionToEdit.id, updatedTransaction); // Call the update function
      } else {
        console.error("Transaction ID is missing");
      }
  
      setTransactionToEdit(null); // Reset the transaction being edited
      setIsEditModalVisible(false); // Close the edit modal
    } else {
      // Adding a new transaction
      const newTransaction = {
        type: type, // Specify the type (income or expense)
        date: moment(values.date).format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        tag: values.tag,
        name: values.name,
      };
  
      addTransaction(newTransaction); // Call the add function
      if (type === "income") {
        setIsIncomeModalVisible(false); // Close income modal
      } else if (type === "expense") {
        setIsExpenseModalVisible(false); // Close expense modal
      }
    }
  
    calculateBalance(); // Recalculate balance after adding or updating
  };
  

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    } else {
      toast.error("User not authenticated!");
    }
    setLoading(false);
  }

  const onDeleteTransaction = async (transactionId) => {
    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, transactionId);
      await deleteDoc(transactionRef);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== transactionId)
      );
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Couldn't delete the transaction");
    }
  };

  const onEditTransaction = (id) => {
    const transactionToEdit = transactions.find((transaction) => transaction.id === id);
    console.log("Transaction to edit: ", transactionToEdit);  // Debugging step
  
    if (transactionToEdit) {
      setTransactionToEdit(transactionToEdit);  // Set the transaction to edit
      setIsEditModalVisible(true);  // Open the modal to edit
    } else {
      console.error("Transaction not found");
    }
  };
  
  
  const updateTransaction = async (transactionId, updatedTransaction) => {
    if (!transactionId || typeof transactionId !== 'string') {
      console.error("Invalid transaction ID:", transactionId);
      toast.error("Invalid transaction ID");
      return;
    }
  
    if (!user || !user.uid) {
      console.error("User not authenticated");
      toast.error("User not authenticated");
      return;
    }
  
    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, transactionId);
      await updateDoc(transactionRef, updatedTransaction);
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, ...updatedTransaction }
            : transaction
        )
      );
      toast.success("Transaction updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
      toast.error("Couldn't update transaction");
    }
  };
  

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
    radius: 0.9, // Set a radius to make sure it's full
    innerRadius: 0, // Full circle, no hole

  };
  
  const incomeConfig = {
    data: incomeDataArray,
    angleField: "value",
    colorField: "category",
    pieStyle: { lineWidth: 0, stroke: "#fff" }, // Ensure no lines around the pie
    radius: 0.8, // Set radius for full pie
  };

  function reset() {
    console.log("resetting");
  }

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="dashboard-container">
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Cards
            currentBalance={currentBalance}
            income={income}
            expenses={expenses}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            cardStyle={cardStyle}
            reset={reset}
          />

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          <EditTransactionModal
            isVisible={isEditModalVisible}
            handleCancel={() => setIsEditModalVisible(false)}
            transactionToEdit={transactionToEdit}
            onSave={updateTransaction}
          />

          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                    <h2>Total Spending</h2>
                    {spendingDataArray.length === 0 ? (
                        <p>Seems like you haven't spent anything till now...</p>
                    ) : (
                        <Pie {...{ ...spendingConfig, data: spendingDataArray }} style={{ width: "100%", height: "100%" }} />
                    )}
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                    <h2>Total Income</h2>
                    {incomeDataArray.length === 0 ? (
                        <p>No income data available...</p>
                    ) : (
                        <Pie {...{ ...incomeConfig, data: incomeDataArray }} />
                    )}
                </Card>

              </Row>
            </>
          )}

          <TransactionSearch
            transactions={transactions}
            exportToCsv={exportToCsv}
            fetchTransactions={fetchTransactions}
            addTransaction={addTransaction}
            onDeleteTransaction={onDeleteTransaction}
            onEditTransaction={onEditTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
