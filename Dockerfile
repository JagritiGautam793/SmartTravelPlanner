# Use Node.js LTS version as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install global dependencies
RUN npm install -g expo-cli @expo/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV EXPO_PUBLIC_GOOGLE_MAP_KEY=""
ENV EXPO_PUBLIC_GEMINI_API_KEY=""
ENV EXPO_PUBLIC_WEATHER_API_KEY=""
ENV OPENAI_API_KEY=""
ENV EXPO_PUBLIC_API_BASE_URL=""

# Create .env file and set default values
RUN echo "EXPO_PUBLIC_GOOGLE_MAP_KEY=\${EXPO_PUBLIC_GOOGLE_MAP_KEY}\n\
EXPO_PUBLIC_GEMINI_API_KEY=\${EXPO_PUBLIC_GEMINI_API_KEY}\n\
EXPO_PUBLIC_WEATHER_API_KEY=\${EXPO_PUBLIC_WEATHER_API_KEY}\n\
OPENAI_API_KEY=\${OPENAI_API_KEY}\n\
EXPO_PUBLIC_API_BASE_URL=\${EXPO_PUBLIC_API_BASE_URL}" > .env

# Expose necessary ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the application
CMD ["npx", "expo", "start", "--tunnel"]