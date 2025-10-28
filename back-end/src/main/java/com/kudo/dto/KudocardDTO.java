package com.kudo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


import com.kudo.model.Kudocard.Status;

import java.sql.Timestamp;
import java.util.UUID;

public class KudocardDTO {

    public static class CreateKudoRequest {
        @NotNull
        private UUID sender_id;

        @NotNull
        private UUID recipient_id;

        @NotNull
        private UUID class_id;

        @NotBlank(message =  "title field cannot be empty")
        @Size(max = 200)
        private String title;

        @NotBlank(message =  "Content field cannot be empty")
        @Size(max = 1000)
        private String content;

        // @NotNull
        // private Boolean is_anonymous;

        public CreateKudoRequest() {} //default constr

        //full constructor
        public CreateKudoRequest(@NotNull UUID sender_id, @NotNull UUID recipient_id, @NotNull UUID class_id,
                                 @NotBlank(message = "title field cannot be empty") @Size(max = 200) String title,
                                 @NotBlank(message = "Content field cannot be empty") @Size(max = 1000) String content)
                                {
            this.sender_id = sender_id;
            this.recipient_id = recipient_id;
            this.class_id = class_id;
            this.title = title;
            this.content = content;
            // this.is_anonymous = is_anonymous;
        }

        public UUID getSender_id() {
            return sender_id;
        }

        public void setSender_id(UUID sender_id) {
            this.sender_id = sender_id;
        }

        public UUID getRecipient_id() {
            return recipient_id;
        }

        public void setRecipient_id(UUID recipient_id) {
            this.recipient_id = recipient_id;
        }

        public UUID getClass_id() {
            return class_id;
        }

        public void setClass_id(UUID class_id) {
            this.class_id = class_id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title != null ? title.trim() : null;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content != null ? content.trim() : null;
        }

        // public Boolean getIs_anonymous() {
            // return is_anonymous;
        // }

        // public void setIs_anonymous(Boolean is_anonymous) {
            // this.is_anonymous = is_anonymous;
        // }
    }

    public static class UpdateStatusRequest {
        @NotNull
        private UUID card_id;

        @NotBlank
        @Pattern(regexp = "PENDING|APPROVED|DENIED|RECEIVED", message = "invalid status")
        private String status;

        //optional;  required if approving/denying by instructor
        private UUID approved_by;

        private String professor_note;

        public UpdateStatusRequest() {}

        public UpdateStatusRequest(@NotNull UUID card_id,
                                   @NotBlank @Pattern(regexp = "PENDING|APPROVED|DENIED|RECEIVED", message = "invalid status") String status,
                                   UUID approved_by,
                                   String professor_note) {
            this.card_id = card_id;
            this.status = status;
            this.approved_by = approved_by;
            this.professor_note = professor_note;
        }

        public UUID getCard_id() {
            return card_id;
        }

        public void setCard_id(UUID card_id) {
            this.card_id = card_id;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public UUID getApproved_by() {
            return approved_by;
        }

        public void setApproved_by(UUID approved_by) {
            this.approved_by = approved_by;
        }

        public String getProfessor_note() {
            return professor_note;
        }

        public void setProfessor_note(String professor_note) {
            this.professor_note = professor_note;
        }
    }
    public static class KudoCardResponse {
        private UUID card_id;
        private UUID sender_id;
        private UUID recipient_id;
        private UUID class_id;
        private String title;
        private String content;

        // @JsonbProperty("is_anonymous")
        // private boolean is_anonymous;

        private Status status;
        private UUID approved_by;

        private Timestamp created_at;
        private String professor_note;

        public KudoCardResponse() {}

        public KudoCardResponse(UUID card_id, UUID sender_id, UUID recipient_id, UUID class_id, String title,
                                String content, Status status, UUID approved_by,
                                Timestamp created_at, String professor_note) {
            this.card_id = card_id;
            this.sender_id = sender_id;
            this.recipient_id = recipient_id;
            this.class_id = class_id;
            this.title = title;
            this.content = content;
            // this.is_anonymous = is_anonymous;
            this.status = status;
            this.approved_by = approved_by;
            this.created_at = created_at;
            this.professor_note = professor_note;
        }

        public UUID getCard_id() {
            return card_id;
        }

        public void setCard_id(UUID card_id) {
            this.card_id = card_id;
        }

        public UUID getSender_id() {
            return sender_id;
        }

        public void setSender_id(UUID sender_id) {
            this.sender_id = sender_id;
        }

        public UUID getRecipient_id() {
            return recipient_id;
        }

        public void setRecipient_id(UUID recipient_id) {
            this.recipient_id = recipient_id;
        }

        public UUID getClass_id() {
            return class_id;
        }

        public void setClass_id(UUID class_id) {
            this.class_id = class_id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        // public boolean isIs_anonymous() {
            // return is_anonymous;
        // }

        // public void setIs_anonymous(boolean isAnonymous) {
            // this.is_anonymous = isAnonymous;
        // }

        public Status getStatus() {
            return status;
        }

        public void setStatus(Status status) {
            this.status = status;
        }

        public UUID getApproved_by() {
            return approved_by;
        }

        public void setApproved_by(UUID approved_by) {
            this.approved_by = approved_by;
        }

        public Timestamp getCreated_at() {
            return created_at;
        }

        public void setCreated_at(Timestamp created_at) {
            this.created_at = created_at;
        }

        public String getProfessor_note() {
            return professor_note;
        }

        public void setProfessor_note(String professor_note) {
            this.professor_note = professor_note;
        }
    }


}
