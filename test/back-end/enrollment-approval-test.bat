@echo off
setlocal EnableDelayedExpansion
REM Enrollment Approval Endpoints Test Suite
REM Tests the PENDING/APPROVED/DENIED enrollment workflow

REM Load environment variables from .env file
for /f "tokens=1,2 delims==" %%a in ('type "..\..\back-end\.env" 2^>nul ^| findstr "BACKEND_HTTP_PORT" ^| findstr /v "^#"') do set %%a=%%b

REM Fallback if .env file not found
if "%BACKEND_HTTP_PORT%"=="" (
    echo Warning: Could not read BACKEND_HTTP_PORT from .env file, using default port 9080
    set BACKEND_HTTP_PORT=9080
)

set BASE_URL=http://localhost:%BACKEND_HTTP_PORT%/kudo-app/api

REM Test data from V5__Test_Data.sql
set CLASS_CSC480=c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1
set CLASS_CSC365=c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2
set CLASS_CSC321=c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3
set JOIN_CODE_480=123456
set JOIN_CODE_365=654321
set JOIN_CODE_321=789012
set INSTRUCTOR_SMITH=11111111-1111-1111-1111-111111111111
set INSTRUCTOR_JOHNSON=22222222-2222-2222-2222-222222222222
set STUDENT_ALICE=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
set STUDENT_BOB=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
set STUDENT_CHARLIE=cccccccc-cccc-cccc-cccc-cccccccccccc
set STUDENT_DIANA=dddddddd-dddd-dddd-dddd-dddddddddddd
set STUDENT_EVAN=eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
set STUDENT_FIONA=ffffffff-ffff-ffff-ffff-ffffffffffff
set STUDENT_GEORGE=99999999-9999-9999-9999-999999999999

echo ========================================
echo Enrollment Approval Test Suite
echo ========================================
echo Testing endpoints at: %BASE_URL%
echo.

echo [SETUP] Generating test JWT token...
echo Requesting token for Dr. Smith (Instructor)...
for /f "delims=" %%i in ('curl -s -X POST "%BASE_URL%/auth/test-token?user_id=%INSTRUCTOR_SMITH%"') do set JWT_TOKEN=%%i

if "%JWT_TOKEN%"=="" (
    echo.
    echo ========================================
    echo ERROR: Failed to generate JWT token!
    echo ========================================
    echo.
    echo Make sure the backend is running:
    echo   docker-compose up
    echo.
    echo And the test-token endpoint is available at:
    echo   %BASE_URL%/auth/test-token
    echo.
    pause
    exit /b 1
)

echo Token generated successfully
echo Token: %JWT_TOKEN:~0,50%...
echo.

echo [START] Running tests...
echo.

REM ========================================
REM Section 1: Join Code & Class Creation
REM ========================================
echo ========================================
echo [SECTION 1] Join Code and Class Tests
echo ========================================
echo.

echo [TEST 1.1] Verify class has join code
echo Testing CSC 480 class has join code 123456:
curl -s %BASE_URL%/class/%CLASS_CSC480% -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

echo [TEST 1.2] Create new class with auto-generated join code
echo Creating class with name "Test Class" and instructor %INSTRUCTOR_SMITH%:
curl -s -X POST "%BASE_URL%/class?class_name=Test%%20Class&created_by=%INSTRUCTOR_SMITH%&end_date=2025-12-31%%2023:59:59" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

REM ========================================
REM Section 2: Student Enrollment Requests
REM ========================================
echo ========================================
echo [SECTION 2] Enrollment Request Tests
echo ========================================
echo.

echo [TEST 2.1] Valid enrollment request with join code
echo Student George requests enrollment in CSC 480 with join code %JOIN_CODE_480%:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_GEORGE%&join_code=%JOIN_CODE_480%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 201 Created with status PENDING
echo.
echo.

echo [TEST 2.2] Enrollment request with invalid join code
echo Student Alice tries to join with invalid join code 999999:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_ALICE%&join_code=999999" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 404 Not Found
echo.
echo.

echo [TEST 2.3] Duplicate enrollment request (already PENDING)
echo Student Charlie already has PENDING request for CSC 365, trying again:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_CHARLIE%&join_code=%JOIN_CODE_365%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 409 Conflict
echo.
echo.

echo [TEST 2.4] Enrollment request when already APPROVED
echo Student Alice already APPROVED in CSC 480, trying to request again:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_ALICE%&join_code=%JOIN_CODE_480%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 409 Conflict
echo.
echo.

echo [TEST 2.5] Re-request enrollment after DENIED
echo Student Evan has DENIED status in CSC 321, trying to request again:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_EVAN%&join_code=%JOIN_CODE_321%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 409 Conflict
echo.
echo.

echo [TEST 2.6] Enrollment request missing user_id
echo Request without user_id parameter:
curl -s -X POST "%BASE_URL%/class/enrollment/request?join_code=%JOIN_CODE_480%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

echo [TEST 2.7] Enrollment request missing join_code
echo Request without join_code parameter:
curl -s -X POST "%BASE_URL%/class/enrollment/request?user_id=%STUDENT_GEORGE%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

REM ========================================
REM Section 3: Pending Requests Query
REM ========================================
echo ========================================
echo [SECTION 3] Pending Requests Query Tests
echo ========================================
echo.

echo [TEST 3.1] Get pending requests for instructor
echo Dr. Smith's pending requests (should include Charlie, Evan, Fiona):
curl -s "%BASE_URL%/class/pending-requests?instructor_id=%INSTRUCTOR_SMITH%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

echo [TEST 3.2] Get pending requests for Dr. Johnson
echo Dr. Johnson's pending requests (should include Charlie, Evan for CSC 365):
curl -s "%BASE_URL%/class/pending-requests?instructor_id=%INSTRUCTOR_JOHNSON%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo.
echo.

echo [TEST 3.3] Pending requests without instructor_id
echo Query without instructor_id parameter:
curl -s "%BASE_URL%/class/pending-requests" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

REM ========================================
REM Section 4: Enrollment Approval/Denial
REM ========================================
echo ========================================
echo [SECTION 4] Enrollment Approval Tests
echo ========================================
echo.

echo [TEST 4.1] Approve pending enrollment (authorized instructor)
echo Dr. Smith approves Fiona's enrollment in CSC 480:
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_FIONA%/%CLASS_CSC480%?action=approve&instructor_id=%INSTRUCTOR_SMITH%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 200 OK with APPROVED status
echo.
echo.

echo [TEST 4.2] Deny pending enrollment (authorized instructor)
echo Dr. Johnson denies Charlie's enrollment in CSC 365:
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_CHARLIE%/%CLASS_CSC365%?action=deny&instructor_id=%INSTRUCTOR_JOHNSON%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 200 OK with DENIED status
echo.
echo.

echo [TEST 4.3] Approve enrollment with wrong instructor_id
echo Dr. Johnson tries to approve enrollment in Dr. Smith's class (CSC 480):
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_EVAN%/%CLASS_CSC480%?action=approve&instructor_id=%INSTRUCTOR_JOHNSON%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 403 Forbidden
echo.
echo.

echo [TEST 4.4] Approve non-existent pending request
echo Try to approve enrollment that doesn't exist:
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_ALICE%/%CLASS_CSC365%?action=approve&instructor_id=%INSTRUCTOR_JOHNSON%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 404 Not Found (Alice is already APPROVED, not PENDING)
echo.
echo.

echo [TEST 4.5] Approve without instructor_id
echo Try to approve without instructor_id parameter:
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_EVAN%/%CLASS_CSC365%?action=approve" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

echo [TEST 4.6] Invalid action parameter
echo Try to use invalid action (not approve/deny):
curl -s -X PATCH "%BASE_URL%/class/enrollment/%STUDENT_EVAN%/%CLASS_CSC365%?action=pending&instructor_id=%INSTRUCTOR_JOHNSON%" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

REM ========================================
REM Section 5: Class Roster Filter Tests
REM ========================================
echo ========================================
echo [SECTION 5] Class Roster Filter Tests
echo ========================================
echo.

echo [TEST 5.1] Get APPROVED students (default behavior)
echo Get all APPROVED students in CSC 480:
curl -s "%BASE_URL%/class/%CLASS_CSC480%/users" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include Alice, Bob, Charlie, Evan, George, Hannah (all APPROVED)
echo.
echo.

echo [TEST 5.2] Get APPROVED students (explicit filter)
echo Get APPROVED students in CSC 480 with explicit filter:
curl -s "%BASE_URL%/class/%CLASS_CSC480%/users?enrollment_status=APPROVED" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Same as default
echo.
echo.

echo [TEST 5.3] Get PENDING students
echo Get PENDING students in CSC 365:
curl -s "%BASE_URL%/class/%CLASS_CSC365%/users?enrollment_status=PENDING" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include Charlie and Evan (unless denied in previous tests)
echo.
echo.

echo [TEST 5.4] Get DENIED students
echo Get DENIED students in CSC 321:
curl -s "%BASE_URL%/class/%CLASS_CSC321%/users?enrollment_status=DENIED" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include Evan
echo.
echo.

echo [TEST 5.5] Invalid enrollment_status value
echo Try to get students with invalid enrollment_status:
curl -s "%BASE_URL%/class/%CLASS_CSC480%/users?enrollment_status=INVALID" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

REM ========================================
REM Section 6: User Classes Filter Tests
REM ========================================
echo ========================================
echo [SECTION 6] User Classes Filter Tests
echo ========================================
echo.

echo [TEST 6.1] Get user's APPROVED classes (default behavior)
echo Get Alice's APPROVED classes:
curl -s "%BASE_URL%/users/%STUDENT_ALICE%/classes" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include CSC 480, CSC 365, CSC 321
echo.
echo.

echo [TEST 6.2] Get user's APPROVED classes (explicit filter)
echo Get Alice's APPROVED classes with explicit filter:
curl -s "%BASE_URL%/users/%STUDENT_ALICE%/classes?enrollment_status=APPROVED" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Same as default
echo.
echo.

echo [TEST 6.3] Get user's PENDING classes
echo Get Charlie's PENDING classes:
curl -s "%BASE_URL%/users/%STUDENT_CHARLIE%/classes?enrollment_status=PENDING" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include CSC 365 (unless denied in previous tests)
echo.
echo.

echo [TEST 6.4] Get user's DENIED classes
echo Get Evan's DENIED classes:
curl -s "%BASE_URL%/users/%STUDENT_EVAN%/classes?enrollment_status=DENIED" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: Should include CSC 321
echo.
echo.

echo [TEST 6.5] Invalid enrollment_status value
echo Try to get classes with invalid enrollment_status:
curl -s "%BASE_URL%/users/%STUDENT_ALICE%/classes?enrollment_status=WRONG" -H "Authorization: Bearer %JWT_TOKEN%" -w "\nHTTP Status: %%{http_code}\n"
echo Expected: 400 Bad Request
echo.
echo.

REM ========================================
REM Test Summary
REM ========================================
echo ========================================
echo [END] Test Suite Complete
echo ========================================
echo.
echo All enrollment approval tests completed.
echo Please review the HTTP status codes and responses above.
echo.
echo Expected successful tests: 200/201 status codes
echo Expected error tests: 400/403/404/409 status codes
echo.

endlocal
