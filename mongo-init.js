// Initialize single database with two collections
db = db.getSiblingDB('fitness-app');
db.createCollection('activities');
db.createCollection('recommendations');

print('MongoDB database initialized: fitness-app with collections: activities, recommendations');
