# Requirements for Sprint 3:
#### The header requirements apply to the entire system and will be worked on across multiple sprints. The Acceptance Criteria sections outline the goals for this current two-week sprint.


#### General Page Requirements:
* The Kudo creation process must take place within a dedicated page.
* The system shall provide input fields for: Message, Recipient, Card Design, and an Anonymous checkbox.
* Created Kudo cards should not be stored as image files; the system shall reconstruct each card from the information in the database when needed.
* The system must store all cards in the database indefinitely.
* The page must have a button to return to the homepage, which discards the user’s selections when pressed.

#### Related definitions:
* Card Design / Card Template:
    * A selectable background image used to generate a card.


* Ruled lines:
    * A component of card images and templates, they are a set of evenly spaced horizontal guidelines for displaying the message body.


#### 1. Message Input Field: The system shall provide a text box for entering the Kudos message with a limit of 500 characters.
* **Acceptance Criteria:**
* Users see a counter showing the number of characters used as they type.
* The system provides the users with a text box for entering the message body, separate from the card preview.
* Users are limited to 500 characters.
* The system shall block users from typing once they reach 500 characters.
* The text box will only accept ASCII characters, not including emojis.
* The text box will ignore the tab and enter keys when pressed.
* The system shall require the message to be more than 10 characters long.
* The text box allows the user to paste text from the clipboard. If the pasted text exceeds the character limit, the excess text will be ignored.


#### 2. Card Design and Input Fields: The system shall provide users with a selection menu to choose a card design.
* **Acceptance Criteria:**
* Users can choose from 3–4 card designs (more card designs may be available later), each design displayed as an image in the card design selection menu.


#### 3. Recipient Input Field: The system shall provide a dropdown menu to select recipients from all users in the active class, including all instructors.
* **Acceptance Criteria:**
* The dropdown lists all available users (first and last name)
* Users can check a box to mark the card as non-anonymous; by default, each card is sent anonymously.
* Users can not select more than one recipient per card.


#### 4. Card Preview Requirements: The system shall generate and display a preview of the Kudos card on the card creation page before the submission step.
* **Acceptance Criteria:**
* The preview displays a fully readable image of the card as it will be seen by the recipient. It uses the selected font to display the title and full message body which is overlayed onto the selected card design.
* The preview clearly shows if the card is anonymous (optional).
* The preview updates dynamically when users change the card's design, or message body.
* The text will automatically reformat to fit properly on the card, ensuring it is readable and each word fits entirely on one line.

#### 5. Submit Step: The system must provide the user with a button labeled "Submit”, which, when pressed, the system shall check that the user has filled in all required fields.
* **Acceptance Criteria:**
* All required fields (Message, and Recipient) must be completed before proceeding to the confirmation step.
* All non-required fields (card design, anonymity status) must have a default option pre-selected.
* After a failed submission attempt, the user shall be informed about the error, including the possible cause and solution.

#### 6. Confirmation Step: The system shall allow users to confirm, discard, or edit the Kudos after previewing the Kudos card through a confirmation menu.
* **Acceptance Criteria:**
* The Confirmation Menu shall display a preview of the created card, featuring the user’s written message on the chosen card style.
* “Confirm” submits the Kudos card for approval by an instructor and then redirects the user to their homepage. The Kudos card will appear in the instructor’s “Submitted Kudos” list, and the Kudos card will appear in the student’s “Sent Kudos” list.
* “Discard” discards the card entirely, then redirects the user to their homepage.
* “Edit” returns the user to the card-creation page with their previously chosen card options entered into each selection field.
* The confirmation menu shall provide users with text that clearly explains the function of each of the provided options (“Confirm”, “Discard”, “Edit” ).

#### 7. Card Usability Requirements:
##### The templates shall be offered in a variety of visual styles and colors, and will have a standardized image size and font type.
* **Acceptance Criteria:**
* Each card image and card design template must have a resolution of 1141 pixels wide and 541 pixels tall.
* Each card image must use the same font style for the message body.
* The system will not automatically adjust the font sizes to fit more text.
* Each template must have a unique title that is clearly visible.
* The card images and templates will not display any information pertaining to the sender, recipient, or the date/time sent.

##### Each template must have ruled lines on which the message body text is placed on. Ruled lines must be standardized across templates.
* **Acceptance criteria:**
* Ruled lines must have a consistent size and spacing across all templates.
* Each line must have the same length and width, the lines must all be parallel to the base of the card, and they should be arranged in a rectangular shape.
* Location of ruled lines may vary across templates.
* When placed on the template, the message body text does not overflow off the ruled lines.
* Templates must be able to fit the maximum message body length (a 500-character limit is subject to change and requires testing) on the ruled lines without leaving unused space.
* Text should be wrapped across lines so that each word entirely fits onto one line.  
