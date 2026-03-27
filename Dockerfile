# Use Node 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package files first (to leverage caching)
COPY package.json package-lock.json* ./

# Install dependencies cleanly
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Expose Vite default dev port
EXPOSE 6620

# Run Vite dev server
CMD ["npm", "run", "dev"]
