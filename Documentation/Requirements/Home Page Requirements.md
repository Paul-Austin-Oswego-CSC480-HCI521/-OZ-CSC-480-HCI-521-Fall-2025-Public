**Requirements for Sprint 2:**  
	The header requirements apply to the entire system and will be worked on across multiple sprints. The acceptance criteria sections outline the goals for this current two-week sprint. Future acceptance criteria should be considered during the development, but are intended to be completed in future sprints.  

\*\*Further specification is to be added regarding instructor-specific functions, non-functional, and database requirements\*\* 

1. The user’s home page shall display a clickable thumbnail preview for each card received by that user.   
   * Acceptance Criteria:  
   * When a user has not received any cards, the system displays a message such as “No Cards Received".   
   * Future Acceptance Criteria:  
   * The card previews are displayed in order, with the most recently received card being first.   
   * When clicking on a preview, the page displays that entire card in a large view.   
   * When a user receives a new card, its preview is displayed on the home page without requiring a manual refresh.    


2. The user’s home page shall display the total number of cards received and the total number sent for that user using separate labels.  
   * Acceptance Criteria:  
   * When a user has not received or sent any cards, they are shown a count of zero for both labels.     
   * Future Acceptance Criteria:  
   * When a user receives a card, the received count is incremented by one without requiring a manual refresh.   
   * When a user’s card approval request is approved, the sent count is increased by one without requiring a manual refresh.

3. The user’s home page shall display a clickable thumbnail preview for each card created by that user. Each preview item shall display the status of the attempted submission. Card requests must have one of the following states: Approved, Denied, Pending Approval, or Received. \*\*States are not finalized.\*\*   
   * Acceptance Criteria:  
   * When a user has not sent any cards, the system displays a message such as “No Cards Sent”.  
   * Future Acceptance Criteria:  
   * The card requests are displayed in order, with the most recently sent card being first.   
   * The system displays the card title, a preview of the text, and the status of each request.   
   * When the status of any of the user’s card requests changes, the new status is shown without needing to refresh manually.   
   * When a user submits a new card request, it is displayed on the user’s home page with the status “Pending Approval”.   
   


4. On the home page, in the user’s Inbox and Outbox, newly updated or received Kudos Cards shall be visually distinct from previously viewed Kudos Cards.   
   * Acceptance Criteria:  
   * When a user receives a new Kudos or a sent Kudos changes status, it appears at the top of the user’s inbox. It will have a distinct indication and coloring.  
   * After a user views the new notification, its coloring and indication will change to display that it has already been viewed.

5. The Navigation Menu shall be available at the top of all pages, and will allow the user to navigate to any primary pages in the system (Home Page and Generate Kudos, Sign-in / Sign-out, Instructor Statistics Page). \*\*Pages not finalized\*\*  
   * Acceptance Criteria:  
   * Each available page is accessible with a separate labeled button.   
   * From the home page, the “Logout” button redirects the user to the login page, and the “Send Kudos Card” button redirects the user to the card generation page.

6. The homepage for the Instructor shall display all pending card submissions for classes they manage.  
   * Acceptance Criteria:  
     \-If no pending card, display “No Pending Submissions”  
     \-Pending cards are displayed with the student name, class, and card preview.  
   * Future Acceptance Criteria:  
     \-The instructor can click a card to open the full view.  
       
7. The user (the Instructor) shall be able to approve or reject a pending card from their home page.  
   * Acceptance Criteria:  
   * When approving, the card status updates to “Approved” for the student without a refresh.  
   * When rejecting a card, the card status updates to “Denied” for the student, without a refresh.

**Related Requirements:**

* The system must ensure users have successfully logged into their account before displaying that user’s home page.  
* WCAG 2.0 Compliant 


  
**Stakeholder / Client Questions:** 

Can instructors receive and send cards? If yes, should the instructor’s home page display which cards they have received and sent, similar to the student home page? 

- Yes, they can send and receive , Usability asked them about this

Should instructors have the option to type a reason why a card was not approved, which would then be provided to the student? 

- Usability asked them, they said yes \- give the option to give a reason (usability is also going to ask if they should have a text box for it, and a drop-down with reasons as well)

How should new student accounts be added to the system? Do the instructors add new students to the system, or do students register themselves?

- Usability also asked them, they said not a priority right now, will be determined later


Should the instructor's approval list show card previews or the entire card?  

- Basic \- preview is OK, whole card could be distracting

Should instructors be able to bulk approve/reject multiple submissions?

- Bulk approval nice

Should instructors receive an email for each new approval request? If not, then when should they be notified? 

- To be determined \- Once a week

Should the system provide a notification tray on the home page?

- Yes

Are multiple professors allowed to approve cards for the same class? 

- Yes \- possible stretch goal

Should students see emails+names, or just names in dropdowns?

- Just name

Should instructors have a “reviewed summary” showing how many approvals/denials they made each week?

- Stretch goal \- a report of sorts

Should students/instructors be able to delete or archive their kudos history?

- Have an option \- could be something to test later with users \- would have to determine how deleting works \- does it fully delete from the database? Does it just delete from the user’s view?

Should the system allow students/instructors to filter kudos(by date)?

- Yes, filter by sender, date, and approval status

After the semester ends should the database keep all student cards?

- Yes, required since they are used for determining students' grades. 

Character limits?

- Should exist, needs testing (1000 characters to start)

Limit the number of Kudos sent a week?

- Can be a security thing \- to avoid a DDOS attack, or force students to think carefully about how many they send  
- 100 a week as a starting point? (mainly just a backend limit), might make a more usable/realistic limit in the future

Drafts section?

- Stretch goal, could exist, so any created and unfinished Kudos by a student will be saved

Optional non-anonymous cards?

-  Yes students can choose to allow the recipient to see that they are the sender, by default they are sent anonymously.

“Reply” functionality?

- Not a dedicated feature    
  




