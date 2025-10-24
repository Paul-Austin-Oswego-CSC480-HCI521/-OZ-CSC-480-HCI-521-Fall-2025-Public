# Requirements for Sprint 5:
#### The header requirements apply to the entire system and will be worked on across multiple sprints. Incomplete requirements from previous sprints should be prioritized over new requirements. The requirements are listed in order, with the top requirement having the highest priority.

### Account Creation (AC) Process Requirements:

#### AC.1: The system must provide a single account creation process for students and instructors.
* **Acceptance Criteria:**
* After successful account creation, users should be automatically logged in and redirected to their homepage.
* New users will not be members of any classes when their accounts are created.

#### AC.2: The account creation process should have fields for Display Name and Role (Student/Instructor).
* **Acceptance Criteria:**
* The system must add a new user record to the database when a new account is successfully created.  
* All unsubmitted data is discarded when a user exits the AC process.
* The system allows users to set a display name different from the name associated with their Google account.

#### AC.3: All users in the system should have a unique email address.
* **Acceptance Criteria:**
* If an email is already in use, account creation should be blocked, and the user is informed that an account already exists with that email.

### Login Page (LP) Requirements:

#### LP.1: The system must provide a single login page to authenticate users.
* **Acceptance Criteria:**
* Students and instructors are redirected to their homepage after a successful login.  
* Only authenticated users can access data associated with their account.

#### LP.2: The system will use Google’s OAuth service for all authentication functions. 
