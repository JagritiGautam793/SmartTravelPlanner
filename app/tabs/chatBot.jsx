import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { generateResponse } from "../chat";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  async function handleSubmit() {
    setResponse("Generating response..."); // Show loading text
    const aiResponse = await generateResponse(input);
    setResponse(aiResponse);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask AI Anything</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your question..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Generate" onPress={handleSubmit} />
      <Text style={styles.response}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
});
