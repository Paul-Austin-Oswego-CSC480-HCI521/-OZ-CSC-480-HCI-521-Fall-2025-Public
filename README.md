# CSC480/HCI521 KudoSpace

### Project Description 

The KudoSpace system facilitates the sharing of digital kudos cards by automating the process and providing an efficient and accessible interface. It will allow students to send short messages sharing feedback, recognizing their peers’ work, and motivating their classmates. This service is intended for use in an upper-level college course and will also help the course instructor(s) gauge student performance and participation.

### Setup Instructions

#### 1. Prerequisites & Notes:
- Docker and Docker Compose
- Docker Desktop makes this much easier to manage
- For specifics on endpoints look at `Documentation/Backend/REST-API-Endpoints.md`
- Reach out to me (Duncan) if you need help with the docker setup end of things
- Check if Docker is installed with, 
```bash
docker --version
docker-compose --version
```

#### 2. Environment Configuration:
1. Locate the three template env files. Look for a `.env.example` file in each of these directories `**project root**`, `/front-end`, and `/back-end`
2. For each `.env.example` file, duplicate it and rename the copy to `.env`. Place the new file in the same directory as the template.  
##### Important Notes: 
- Each template is unique. You must use the appropriate template for each directory.  
- You must manually create **ALL three** unique `.env` files using the `.env.example` templates.
- If these template files change you must manually edit your local `.env` files to include the new environment variables.
- **Never** push your local `.env` files to a public repo. 

#### 3. OAuth Setup:
1. Get your Google Client ID from: https://console.cloud.google.com/apis/credentials
2. Click Create Credentials. Set your Authorized Javascript Origin to http://localhost:3000/
3. Click save. Copy the Client ID
4. In the root `.env` file edit line 17. Replace "google-client-id.apps.googleusercontent.com" with your client ID.
``` 
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```
5. In the `front-end/.env` file edit line 7. Replace "YOUR_CLIENT_ID.apps.googleusercontent.com" with your client ID.
```
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

##### Important Note:
- Do **NOT** edit any of the `.env.example` files. Only edit the local `.env` files you created in step two.

#### 4. Database Information:
- All data in the db is stored in your local Docker volume named `oz-csc-480-hci-521-fall-2025-public_postgres_data`
- If the database schema changes, you may need to remove your local Docker volume to avoid conflicts with outdated data. 
- Data survives container restarts and rebuilds.
- Schema migrations only run on first startup (empty database)
- Follow the `FE Testing setup` guide for more information on how to set up a working database.   


#### 5. Starting:  
In the project root,
```bash
docker-compose up --build
```
The application is now accessible via http://localhost:3000/  





