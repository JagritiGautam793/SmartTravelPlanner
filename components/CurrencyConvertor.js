import { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker"; // ✅ Import from the correct package

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});

  // Fetch real-time exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchRates();
  }, []);

  // Convert currency
  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      alert("Currency data not available.");
      return;
    }

    const conversionRate =
      exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    setConvertedAmount((amount * conversionRate).toFixed(2));
  };

  return (
    <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Currency Converter
      </Text>

      {/* Amount Input */}
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* From Currency Picker */}
      <Text>From:</Text>
      <Picker
        selectedValue={fromCurrency}
        onValueChange={(value) => setFromCurrency(value)}
        style={{ height: 50, width: "100%" }}
      >
        {Object.keys(exchangeRates).map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      {/* To Currency Picker */}
      <Text>To:</Text>
      <Picker
        selectedValue={toCurrency}
        onValueChange={(value) => setToCurrency(value)}
        style={{ height: 50, width: "100%" }}
      >
        {Object.keys(exchangeRates).map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      {/* Convert Button */}
      <Button title="Convert" onPress={convertCurrency} />

      {/* Converted Amount Display */}
      {convertedAmount !== null && (
        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
          Converted Amount: {convertedAmount} {toCurrency}
        </Text>
      )}
    </View>
  );
}
