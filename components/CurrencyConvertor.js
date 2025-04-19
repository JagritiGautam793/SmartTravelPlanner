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
import { generateAPIUrl } from "@/utils";
import { fetch as expoFetch } from "expo/fetch";

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

  // Function to convert currency using our AI tool
  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the AI API endpoint with our tool call
      const response = await expoFetch(generateAPIUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Convert ${amount} ${fromCurrency} to ${toCurrency}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert currency");
      }

      const data = await response.json();

      // Check if the response contains a currency conversion result
      if (data.type === "currency_conversion") {
        setResult(data);
      } else {
        // Handle text-based response from AI
        const responseContent = data.choices?.[0]?.message?.content;

        // Try to extract conversion data from text response
        if (responseContent) {
          // Simple regex to find numbers in the response
          const matches = responseContent.match(/(\d+(\.\d+)?)/g);
          if (matches && matches.length >= 1) {
            const convertedAmount = parseFloat(matches[matches.length - 1]);
            setResult({
              amount: parseFloat(amount),
              fromCurrency,
              toCurrency,
              convertedAmount,
              // Estimated exchange rate
              exchangeRate: convertedAmount / parseFloat(amount),
              date: new Date().toISOString().split("T")[0],
            });
          } else {
            throw new Error("Could not extract conversion from response");
          }
        } else {
          throw new Error("Invalid response from API");
        }
      }
    } catch (err) {
      setError(err.message || "Error converting currency");
    } finally {
      setLoading(false);
    }
  };

  // Auto-convert when component mounts if we have data
  useEffect(() => {
    if (initialData) {
      // If we got data from tool invocation, use it directly
      setResult(initialData);
    } else if (amount && !isNaN(parseFloat(amount))) {
      // Otherwise run a conversion normally
      convertCurrency();
    }
  }, [initialData]);

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
