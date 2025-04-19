import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Popular currency codes
const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "SGD", name: "Singapore Dollar" },
];

export default function CurrencyConverter({ initialData = null }) {
  // Initial values can come from AI tool response
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "1");
  const [fromCurrency, setFromCurrency] = useState(
    initialData?.fromCurrency || "USD"
  );
  const [toCurrency, setToCurrency] = useState(
    initialData?.toCurrency || "EUR"
  );
  const [result, setResult] = useState(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch exchange rates and convert
  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();

      if (!data.rates[toCurrency]) {
        throw new Error(`Currency ${toCurrency} not found`);
      }

      const rate = data.rates[toCurrency];
      const convertedAmount = parseFloat(amount) * rate;

      setResult({
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        exchangeRate: rate,
        convertedAmount: parseFloat(convertedAmount.toFixed(2)),
        date: data.date,
      });
    } catch (err) {
      setError(err.message || "Error converting currency");
    } finally {
      setLoading(false);
    }
  };

  // Auto-convert when component mounts if we have data
  useEffect(() => {
    if (!initialData && amount && !isNaN(parseFloat(amount))) {
      convertCurrency();
    }
  }, []);

  // Swap currencies function
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // Auto-convert after swap
    setTimeout(convertCurrency, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>

      {/* Currency Selection */}
      <View style={styles.currencyRow}>
        <View style={styles.currencySelector}>
          <Text style={styles.label}>From</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromCurrency}
              onValueChange={(value) => setFromCurrency(value)}
              style={styles.picker}
            >
              {CURRENCIES.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.code} - ${currency.name}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <Text style={styles.swapButtonText}>⇄</Text>
        </TouchableOpacity>

        <View style={styles.currencySelector}>
          <Text style={styles.label}>To</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toCurrency}
              onValueChange={(value) => setToCurrency(value)}
              style={styles.picker}
            >
              {CURRENCIES.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.code} - ${currency.name}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Convert Button */}
      <TouchableOpacity
        style={styles.convertButton}
        onPress={convertCurrency}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.convertButtonText}>Convert</Text>
        )}
      </TouchableOpacity>

      {/* Result Display */}
      {error ? (
        <View style={styles.resultContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {result.amount} {result.fromCurrency} =
          </Text>
          <Text style={styles.convertedAmount}>
            {result.convertedAmount} {result.toCurrency}
          </Text>
          <Text style={styles.rateText}>
            1 {result.fromCurrency} = {result.exchangeRate?.toFixed(4)}{" "}
            {result.toCurrency}
          </Text>
          {result.date && (
            <Text style={styles.dateText}>Last updated: {result.date}</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#2c3e50",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#7f8c8d",
  },
  amountInput: {
    backgroundColor: "#f5f7fa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  currencySelector: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  swapButton: {
    backgroundColor: "#3498db",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  swapButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  convertButton: {
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  convertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "#f5f7fa",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  convertedAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 8,
  },
  rateText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#95a5a6",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
  },
});
