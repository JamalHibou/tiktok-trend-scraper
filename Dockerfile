FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# Create app directory
WORKDIR /app

# Copy app files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
