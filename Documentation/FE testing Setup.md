# FE Testing Setup
### NOTE: Class creation & joining a class is now functional via the front-end. 

#### Commands are for Windows CMD. For Mac and Linux, the command syntax may need to change slightly.

### 1. Add users to the db:
1. Follow the Oauth guide to get the authentication working first.
2. Use the front-end to create 2 student accounts and 1 instructor account. You must use a unique Google account for each user.
3. After successful account creation you will be logged in. You can see the classes each user in by opening the card-creation menu and looking at the course section dropdown.
4. New users will not be members of any classes yet, so this menu should be empty for right now.

### 2. Get a valid jwt token:
1. Login / Signup in via the front-end.
2. In the f12 menu navigate to the "Application" tab. Open the local storage menu, there should be key value pair for "jwt_token".
3. Record this value. It will be added to the header of each request.

### 3. Get User Ids:
Paste the jwt token into each command. 

    curl "http://localhost:9080/kudo-app/api/users" -H "Authorization: Bearer REPLACE_WITH_YOUR_JWT_TOKEN" "http://localhost:9080/kudo-app/api/users"

This should return every user record in the db, including the users that were just added. 
```json 

[{"email":"newemailnumber0004@gmail.com",
"google_id":"***ID***",
"name":"abcd efgh",
"role":"INSTRUCTOR",
"user_id":"b2e4c8ee-70d8-42c5-988a-34a7873766c3"},

{"email":"newemailnumber0003@gmail.com",
"google_id":"***ID***",
"name":"abce",
"role":"STUDENT",
"user_id":"6be9f239-c809-4a20-84dd-32cdb07b33f2"},

{"email":"awhite26@oswego.edu",
"google_id":"***ID***",
"name":"Alek White",
"role":"STUDENT",
"user_id":"76df275b-d08d-4437-90f5-dd558a5df54c"}]
 ```

Record the `user_id` for each of the new users you want to test with.

### 4. Make an empty class:
    curl -X POST "http://localhost:9080/kudo-app/api/class?class_name=myClass" -H "Authorization: Bearer REPLACE_WITH_YOUR_JWT_TOKEN"

The db should respond with
```{"name":"myClass"} ```

### 5. Get the class_id:
    curl "http://localhost:9080/kudo-app/api/class/classes" -H "Authorization: Bearer REPLACE_WITH_YOUR_JWT_TOKEN"

The db should respond with
```json 
{"class_id":
["c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1",
"c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2",
"c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3",
"a547e1b9-cb06-4794-aae4-9a13eb648163"]}
```
Record the random UUID as the `class_id`

### 6. Add users to the new class:
Paste the user_id's and class_id into this command.  

    curl -X PUT "http://localhost:9080/kudo-app/api/class/REPLACE_WITH_YOUR_CLASS_ID" -H "Content-Type: application/json" -H "Authorization: Bearer REPLACE_WITH_YOUR_JWT_TOKEN" -d "{\"user_id\":[\"REPLACE_WITH_USER_ID_#1\",\"REPLACE_WITH_USER_ID_#2\",\"REPLACE_WITH_USER_ID_#3\"]}"

### 7. Confirmation 
* Login with one of the users that was just added to your new class. 
* On the card-creation menu "myClass" should appear in the course selection menu.
* The other users in the class should appear in the recipients list. 