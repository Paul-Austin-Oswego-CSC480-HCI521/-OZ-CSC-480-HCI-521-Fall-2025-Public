@echo off
setlocal EnableDelayedExpansion
REM User Endpoints Test Script
REM Tests all User API endpoints

REM Load environment variables from .env file
for /f "tokens=1,2 delims==" %%a in ('type "..\..\back-end\.env" 2^>nul ^| findstr "APP_HTTP_PORT" ^| findstr /v "^#"') do set %%a=%%b

REM Fallback if .env file not found or APP_HTTP_PORT not set
if "%APP_HTTP_PORT%"=="" (
    echo Warning: Could not read APP_HTTP_PORT from .env file, using default port 9080
    set APP_HTTP_PORT=9080
)

set BASE_URL=http://localhost:%APP_HTTP_PORT%/kudo-app/api

echo ========================================
echo [TEST SUITE] User Endpoints Test Suite
echo ========================================
echo Testing endpoints at: %BASE_URL%
echo.

echo [START] Running tests...
echo.

echo [TEST 1] GET All Users
curl -s %BASE_URL%/users
echo.
echo Status: %ERRORLEVEL%
echo.

echo [TEST 2] Filter by Role
echo Testing role=INSTRUCTOR:
curl -s "%BASE_URL%/users?role=INSTRUCTOR"
echo.
echo Testing role=STUDENT:
curl -s "%BASE_URL%/users?role=STUDENT"
echo.
echo.

echo [TEST 3] Create New Test User
echo Creating test user with unique email:
set TIMESTAMP=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"email\":\"test.user.%TIMESTAMP%@example.com\",\"name\":\"Test User %TIMESTAMP%\",\"password\":\"password123\",\"role\":\"STUDENT\"}"
echo.
echo.

echo [TEST 4] Get User by Valid ID
echo Getting all users to extract a valid user ID:
curl -s %BASE_URL%/users > temp_users.json
for /f "delims=" %%i in ('powershell -Command "(Get-Content temp_users.json | ConvertFrom-Json)[0].userId"') do set USER_ID=%%i
del temp_users.json
echo Testing GET user by ID: %USER_ID%
curl -s %BASE_URL%/users/%USER_ID%
echo.
echo.

echo [TEST 5] Get User by Invalid UUID
echo Testing invalid UUID (should return 400):
curl -s %BASE_URL%/users/invalid-uuid -w "Status: %%{http_code}"
echo.
echo.

echo [TEST 6] Update User
echo Testing UPDATE user (name and role):
curl -s -X PUT %BASE_URL%/users/%USER_ID% -H "Content-Type: application/json" -d "{\"name\":\"Updated Batch Test User\",\"role\":\"INSTRUCTOR\"}"
echo.
echo.
echo Verifying update worked:
curl -s %BASE_URL%/users/%USER_ID%
echo.
echo.

echo [TEST 7] POST Validation Tests
echo Testing missing email (should return 400):
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"password\":\"password123\",\"role\":\"STUDENT\"}" -w "Status: %%{http_code}"
echo.
echo.

echo Testing missing name (should return 400):
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"email\":\"test.user2@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}" -w "Status: %%{http_code}"
echo.
echo.

echo Testing invalid email format (should return 400):
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"email\":\"invalid-email-format\",\"name\":\"Test User\",\"password\":\"password123\",\"role\":\"STUDENT\"}" -w "Status: %%{http_code}"
echo.
echo.

echo Testing invalid role (should return 400):
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"email\":\"test.user3@example.com\",\"name\":\"Test User\",\"password\":\"password123\",\"role\":\"INVALID_ROLE\"}" -w "Status: %%{http_code}"
echo.
echo.

echo [TEST 8] Duplicate Email
echo Testing duplicate email (should return 409):
curl -s -X POST %BASE_URL%/users -H "Content-Type: application/json" -d "{\"email\":\"test.user.%TIMESTAMP%@example.com\",\"name\":\"Duplicate User\",\"password\":\"password123\",\"role\":\"STUDENT\"}" -w "Status: %%{http_code}"
echo.
echo.

echo [TEST 9] Delete User
echo Testing DELETE user:
curl -s -X DELETE %BASE_URL%/users/%USER_ID% -w "Status: %%{http_code}"
echo.
echo.
echo Verifying user was deleted (should return 404):
curl -s %BASE_URL%/users/%USER_ID% -w "Status: %%{http_code}"
echo.
echo.

echo Testing DELETE non-existent user (should return 404):
curl -s -X DELETE %BASE_URL%/users/12345678-1234-1234-1234-123456789012 -w "Status: %%{http_code}"
echo.
echo.

echo [TEST 10] Final Verification
echo Getting all users to verify final state:
curl -s %BASE_URL%/users
echo.
echo.

