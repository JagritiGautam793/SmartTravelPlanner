import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import CurrencyConverter from "../../components/CurrencyConvertor";

export default function ChatBot() {
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [currentConversionData, setCurrentConversionData] = useState(null);
  const scrollViewRef = useRef(null);

  const {
    messages,
    error,
    handleInputChange,
    input,
    handleSubmit,
    append,
    isLoading,
  } = useChat({
    fetch: expoFetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
    onFinish: (message) => {
      // Check for tool invocation result
      if (
        message.content &&
        typeof message.content === "object" &&
        message.content.type === "currency_conversion"
      ) {
        setShowCurrencyConverter(true);
        setCurrentConversionData(message.content);

        // Add a message explaining the currency conversion
        append({
          role: "assistant",
          content: `I've converted ${message.content.amount} ${message.content.fromCurrency} to ${message.content.convertedAmount} ${message.content.toCurrency}. Here's a converter you can use for more conversions:`,
        });
      }
    },
    onResponse: async (response) => {
      // For non-streaming responses, we need to parse the JSON
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          const data = await response.json();

          if (data.type === "currency_conversion") {
            setShowCurrencyConverter(true);
            setCurrentConversionData(data);
            return {
              content: data,
              role: "assistant",
            };
          }
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
        }
      }

      // For streaming responses, continue normally
      return response;
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [messages, showCurrencyConverter]);

  // Function to handle user request for currency conversion
  const handleCurrencyRequest = () => {
    // Improved patterns to identify currency conversion requests
    const currencyPatterns = [
      /convert\s+(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "convert 100 USD to EUR"
      /exchange\s+(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "exchange 50 GBP to JPY"
      /(\d+(\.\d+)?)\s+([a-z]{3})\s+in\s+([a-z]{3})/i, // "50 USD in EUR"
      /(\d+(\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i, // "100 EUR to USD"
      /currency\s+convert/i, // Generic "currency convert" request
      /exchange\s+rate/i, // Generic "exchange rate" request
    ];

    // Check if any pattern matches
    for (const pattern of currencyPatterns) {
      const match = input.match(pattern);
      if (match) {
        // If we have a structured match with groups (amount, from, to currencies)
        if (match.length >= 5) {
          const amount = match[1];
          const fromCurrency = match[3].toUpperCase();
          const toCurrency = match[4].toUpperCase();

          // Add user message
          append({
            role: "user",
            content: input,
          });

          // Clear input
          handleInputChange({ target: { value: "" } });

          // Let the AI handle the conversion with the tool
          append({
            role: "assistant",
            content: "Converting currency...",
          });

          // Add a specific currency conversion request that will trigger the tool
          append(
            {
              role: "user",
              content: `Convert ${amount} ${fromCurrency} to ${toCurrency}`,
            },
            { skipChatCompletion: false }
          );

          return true;
        }

        // Generic currency conversion request
        return false; // Let handleSubmit process it with the AI
      }
    }

    return false;
  };

  // Modified submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // If it's a currency request, handle it client-side
    if (!handleCurrencyRequest()) {
      // Otherwise, use the normal submit handler
      handleSubmit(e);
    }
  };

  if (error) return <Text style={styles.errorText}>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((m, index) => (
            <View
              key={index}
              style={[
                styles.messageBox,
                m.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  m.role === "user"
                    ? styles.userMessageText
                    : styles.assistantMessageText,
                ]}
              >
                {m.content}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBox, styles.assistantMessage]}>
              <Text style={[styles.messageText, styles.assistantMessageText]}>
                ...
              </Text>
            </View>
          )}

          {/* Show Currency Converter if user asks for it */}
          {showCurrencyConverter && (
            <View style={styles.converterContainer}>
              <CurrencyConverter initialData={currentConversionData} />
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => {
                  setShowCurrencyConverter(false);
                  setCurrentConversionData(null);
                }}
              >
                <Text style={styles.hideButtonText}>Hide Converter</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: {
                  ...e.target,
                  value: e.nativeEvent.text,
                },
              })
            }
            onSubmitEditing={handleFormSubmit}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleFormSubmit}
            disabled={isLoading || !input.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  messageBox: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3498db",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5e5",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "white",
  },
  assistantMessageText: {
    color: "#333",
  },
  converterContainer: {
    marginVertical: 8,
    width: "100%",
  },
  inputContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  hideButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "center",
  },
  hideButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
});
