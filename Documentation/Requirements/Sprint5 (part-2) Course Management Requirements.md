# Course Management Requirements
#### The requirements are listed in order, with the top requirement having the highest priority. Stretch goals are given at the end of the document for reference.


#### CM.1: The Course Management Page shall provide instructors the ability to `view`, `create`,` edit`, and `delete courses`.
* **General Acceptance Criteria:**
* The course management page and all functions on it must be available only to instructors.


* **Acceptance Criteria for Viewing:**
* The CM interface will allow instructors to view all classes they created and to see a roster of all users in each class.
* The roster must show each user’s display name.
* Each course entry displays the Class Name, join code, and End Date.


* **Acceptance Criteria for Creation:**
* Requires the following fields: Class Name and End Date.


* **Acceptance Criteria for Editing:**
* Instructors must be able to remove a student from a class.
* Allow editing for the Class Name and End Date fields.


* **Acceptance Criteria for Deletion:**
* Permanently deletes all cards associated with that course from the database and the course itself.


#### CM.2: The course creation process will `generate a join code` for each course. The join codes will allow users to request enrollment in a given class.
* **Acceptance Criteria:**
* The code should expire after the class's end date, and will not work past that date.
* Each class must only have one active join code at a time.
* The system only requires users to provide a join code when they first enroll in a class; once they are enrolled, the join code is no longer needed.


#### CM.3: The system must allow users to `request enrollment in a course` by using a valid join code.
* **Acceptance Criteria:**
* The system must provide access to a pop-up for instructors and students to enter a join code.
* The system must validate the join code and ensure it has not expired or is invalid.
* If an expired or invalid code is entered, the system outputs an error.  
* The join code is shared externally between instructors and students.


#### CM.4: The course management page must require instructors to manually `approve a user’s enrollment request` before that user is added to the course.
* **Acceptance Criteria:**
* All pending enrollment requests must be displayed, and either approved or denied within the instructor’s course management page.
* A user's enrollment request must be approved for that course to appear in the course selection dropdown menu on the card creation page.
* Only approved users can appear in the recipients dropdown menu on the card creation page for that class.


#### CM.5: The system must `automatically archive courses` once the class end date is reached.
* **Acceptance Criteria:**
* When the end date passes, the class is considered to be “Archived” by the system.
* Archived courses must not appear in the course selection dropdown menu on the card creation page.
* Students and professors can only view old cards; new cards cannot be sent in archived classes.
* Users cannot be added or removed from an archived class.
* Archived classes cannot be edited or un-archived; they can only be deleted.
* Users cannot manually archive a class.

#### Stretch Goals:
* Clients prefer that multiple instructors per class be a stretch goal.
* Join codes can be regenerated to invalidate the old ones. 
