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
import CurrencyConverter from "../components/CurrencyConvertor";

export default function ChatBot() {
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [currentConversionData, setCurrentConversionData] = useState(null);
  const scrollViewRef = useRef(null);
  const [isConverterLoading, setIsConverterLoading] = useState(false);

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
      // Check for tool calls and responses in the message
      if (message && message.tool_calls && message.tool_calls.length > 0) {
        // Find any currency conversion tool calls
        const currencyToolCall = message.tool_calls.find(
          (call) => call.function?.name === "convertCurrency"
        );

        if (currencyToolCall && currencyToolCall.function?.result) {
          try {
            // Parse the tool result
            const result = JSON.parse(currencyToolCall.function.result);

            if (result.type === "currency_conversion") {
              // Set loading state to false and show data
              setIsConverterLoading(false);
              // Show currency converter with the result data
              setShowCurrencyConverter(true);
              setCurrentConversionData(result);
            }
          } catch (e) {
            setIsConverterLoading(false);
            console.error("Failed to parse tool result:", e);
          }
        }
      }

      // Check if the content directly contains currency conversion data
      // This handles when AI returns the result directly
      if (
        typeof message.content === "object" &&
        message.content?.type === "currency_conversion"
      ) {
        setIsConverterLoading(false);
        setShowCurrencyConverter(true);
        setCurrentConversionData(message.content);
      }
    },
    onResponse: async (response) => {
      // For non-streaming responses, check for direct tool results
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          const data = await response.json();

          // If we received a direct currency conversion result
          if (data.type === "currency_conversion") {
            setIsConverterLoading(false);
            setShowCurrencyConverter(true);
            setCurrentConversionData(data);

            // Return formatted data for the chat UI
            return {
              id: Date.now().toString(),
              role: "assistant",
              content: `I've converted ${data.amount} ${data.fromCurrency} to ${
                data.convertedAmount
              } ${data.toCurrency}. The exchange rate is 1 ${
                data.fromCurrency
              } = ${data.exchangeRate.toFixed(4)} ${data.toCurrency}.`,
              tool_calls: [
                {
                  function: {
                    name: "convertCurrency",
                    arguments: JSON.stringify({
                      amount: data.amount,
                      fromCurrency: data.fromCurrency,
                      toCurrency: data.toCurrency,
                    }),
                    result: JSON.stringify(data),
                  },
                },
              ],
            };
          }
        } catch (e) {
          setIsConverterLoading(false);
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
    // Simple check for generic currency terms rather than detailed NLP
    const hasCurrencyTerms =
      /currenc|exchang|conver|dollar|euro|pound|yen|rate/i.test(input);

    // Let the AI handle all currency-related detection
    return false;
  };

  // Modified submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Set converter loading state if the message seems currency-related
    if (/currenc|exchang|conver|dollar|euro|pound|yen|rate/i.test(input)) {
      setIsConverterLoading(true);
    }

    // Always use the normal submit handler
    handleSubmit(e);
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

          {/* Show Currency Converter Skeleton when loading */}
          {isConverterLoading && (
            <View style={styles.converterContainer}>
              <CurrencyConverter />
            </View>
          )}

          {/* Show Currency Converter with data if available */}
          {showCurrencyConverter && !isConverterLoading && (
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
