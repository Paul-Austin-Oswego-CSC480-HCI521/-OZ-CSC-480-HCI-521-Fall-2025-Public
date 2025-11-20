# Requirements for Sprint 2:
#### The header requirements apply to the entire system and will be worked on across multiple sprints. The Acceptance Criteria sections outline the goals for this current two-week sprint. Future Acceptance Criteria should be considered during the development, but are intended to be completed in future sprints. The requirements are listed in order, with the top requirement having the highest priority.

#### 1. The user’s (instructors and students) home page shall display a clickable preview for each card received by that user.
   * **Acceptance Criteria:**
   * When a user has not received any cards, the system displays a message such as “No Cards Received" when checking the inbox.
   * When clicking on a preview, the page displays that entire card in a large view centered on the screen.
   * **Future Acceptance Criteria:**
   * The card previews are displayed in order, with the most recently received card being first.
   When a user receives a new card, its preview is displayed on the home page without requiring a manual refresh.


#### 2. The homepage for the Instructor shall display all pending card submissions for each class they manage.
   * **Acceptance Criteria:**
   * If no pending cards, display “No cards to review”
   * Pending cards are displayed with the student name, class, and card preview.
   * **Future Acceptance Criteria:**
   * -The instructor can click a card to open the full view.


#### 3. The user’s (instructors and students) home page shall display a clickable preview for each card submitted by that user. Each preview item shall display the status of the attempted submission. Card requests must have one of the following states: Approved, Denied, Pending, or Received.
   * **Acceptance Criteria:**
   * When a user has not sent any cards, the system displays a message such as “No Cards Sent”.
   * **Future Acceptance Criteria:**
   * The card requests are displayed in order, with the most recently sent card being first.
   * The system displays the card title, a preview of the text, and the status of each request.
   * When the status of any of the user’s card requests changes, the new status is shown without needing to refresh manually.
   * When a user submits a new card request, it is displayed on the user’s home page with the status “Pending”.
   * _Cards that were rejected will display a rejection reason, with the full text being displayed in a clickable overlay_. 


#### 4. The Navigation Menu shall be available at the top of all pages, and will allow the user to navigate to any page available to that user. (Home Page and Generate Kudos, Sign-in / Sign-out, Instructor Statistics Page). *Pages not finalized*
   * **Acceptance Criteria:**
   * Each available page is accessible with a separate labeled button.
   * From the home page, the “Logout” button redirects the user to the login page, and the “Send Kudos Card” button redirects the user to the card generation page.


#### 5. The homepage shall provide users access to a notification tray, showing the count of unread notifications for that user.
   * **Acceptance Criteria:**
   * The system uses a button to provide access to an expanded notifications pop-up menu.  
   * The notification menu will contain all notifications that the user has received within the last month.
   * Notifications are displayed in order, with the most recently received notifications on top.
   * The notification menu will indicate which notifications have not been read.


#### 6. The instructors shall be provided access to approve or reject a pending card from their home page.
   * **Acceptance Criteria:**
   *  When “Reject” is selected, the rejection section becomes available. There will be a field for the Instructor to specify a Rejection Reason. 
   *  The reason for rejection section shall include: A drop-down menu with predefined reasons + a comment text box (with a limit of 250 characters) for additional notes. 
   *  If “Other” is selected from the dropdown, the comment text box becomes required before submission.
   
   * When the Instructor selects a Kudos Card, the options to “Approve” or “Reject” are listed.
   * There will be a field for the Instructor to specify a Rejection Reason.
   * **Future Acceptance Criteria:**
   * When approving, the card status updates to “Approved” for the student without a refresh.
   * When rejecting a card, the card status updates to “Denied” for the student, without a refresh.
   * After an instructor approves or rejects a Kudos card in the “Submitted” section, the Kudos will move to the “Reviewed” Kudos section on their home page.


#### 7. On the home page, in the user’s Inbox and Outbox, newly updated or received Kudos Cards shall be visually distinct from previously viewed Kudos Cards.
   * **Acceptance Criteria:**
   * When a user receives a new Kudos or a sent Kudos changes status, it appears at the top of the user’s inbox. It will have a distinct indication and coloring.
   * After a user views the new notification, its coloring and indication will change to display that it has already been viewed.


#### 8. There will be “Filter” and “Sort” options for the card inboxes.
   * **Acceptance Criteria:**
   * The “Received Kudos” and “Submitted Kudos” will have a “Sort” button.
   * The “Sent Kudos” and “Reviewed Kudos” will have both “Sort” and “Filter” buttons.
   * **Future Acceptance Criteria:**
   * The “Sort” options will re-order cards in either ascending or descending order according to the selected criteria.    
   * The “Filter” options will only show cards with the specified criteria.


#### 9. The user’s (instructors and students) home page shall display the numeric values for the total number of cards received and the total number sent for that user using separate labels.
   * **Future Acceptance Criteria:**
   * When a user receives a card, the received count is incremented by one without requiring a manual refresh.
   * When a user’s card approval request is approved, the sent count is increased by one without requiring a manual refresh.


**Required Data:**
This data should be stored in the database through some structure. This list is an outline of what data is needed for the front-end functionality to be met. It is not intended to be the final structure of the database.
* Created Kudo cards should not be stored as image files; the system shall reconstruct each card from the information in the database when needed.
* The system must store all cards in the database indefinitely.

**Users:**
* ID
* Name
* Email
* Role
* Course Section 

**Cards:**
* Title
* Message body
* Sender
* Recipant  
* Time + Date Sent
* Instructor who approved

**Related Requirements:**
* The system must ensure users have successfully logged into their account before displaying that user’s home page.
* WCAG 2.0 Compliant 
