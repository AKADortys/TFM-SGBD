FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# On s'assure que NODE_ENV est en production
ENV NODE_ENV=production

EXPOSE 3000
# Commande pour lancer l'API
CMD ["npm", "run", "start"]