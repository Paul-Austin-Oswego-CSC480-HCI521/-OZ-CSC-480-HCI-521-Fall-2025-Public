package com.kudo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.json.bind.annotation.JsonbProperty;
import com.kudo.model.Kudocard.Status;
import java.util.UUID;

public class KudocardDTO {

    public static class CreateKudoRequest {
        @NotNull
        private UUID senderId;

        @NotNull
        private UUID recipientId;

        @NotNull
        private UUID classId;

        @NotBlank(message =  "title field cannot be empty")
        @Size(max = 200)
        private String title;

        @NotBlank(message =  "Content field cannot be empty")
        @Size(max = 1000)
        private String content;

        @NotNull
        private Boolean isAnonymous;

        public CreateKudoRequest() {} //default constr

        //full constructor
        public CreateKudoRequest(@NotNull UUID senderId, @NotNull UUID recipientId, @NotNull UUID classId,
                @NotBlank(message = "title field cannot be empty") @Size(max = 100) String title,
                @NotBlank(message = "Content field cannot be empty") @Size(max = 1000) String content,
                @NotNull Boolean isAnonymous) {
            this.senderId = senderId;
            this.recipientId = recipientId;
            this.classId = classId;
            this.title = title;
            this.content = content;
            this.isAnonymous = isAnonymous;
        }

        public UUID getSenderId() {
            return senderId;
        }

        public void setSenderId(UUID senderId) {
            this.senderId = senderId;
        }

        public UUID getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(UUID recipientId) {
            this.recipientId = recipientId;
        }

        public UUID getClassId() {
            return classId;
        }

        public void setClassId(UUID classId) {
            this.classId = classId;
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

        public Boolean getIsAnonymous() {
            return isAnonymous;
        }

        public void setIsAnonymous(Boolean isAnonymous) {
            this.isAnonymous = isAnonymous;
        }
    }

    public static class UpdateStatusRequest {
        @NotNull
        private UUID cardId;

        @NotBlank
        @Pattern(regexp = "PENDING|APPROVED|DENIED|RECEIVED", message = "invalid status")
        private String status;

        //optional;  required if approving/denying by instructor
        private UUID approvedBy;

        public UpdateStatusRequest() {}

        public UpdateStatusRequest(@NotNull UUID cardId,
                @NotBlank @Pattern(regexp = "PENDING|APPROVED|DENIED|RECEIVED", message = "invalid status") String status,
                UUID approvedBy) {
            this.cardId = cardId;
            this.status = status;
            this.approvedBy = approvedBy;
        }

        public UUID getCardId() {
            return cardId;
        }

        public void setCardId(UUID cardId) {
            this.cardId = cardId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public UUID getApprovedBy() {
            return approvedBy;
        }

        public void setApprovedBy(UUID approvedBy) {
            this.approvedBy = approvedBy;
        }
    }
    public static class KudoCardResponse {
        private UUID cardId;
        private UUID senderId;
        private UUID recipientId;
        private UUID classId;
        private String title;
        private String content;
        
        @JsonbProperty("isAnonymous")
        private boolean isAnonymous;

        private Status status;
        private UUID approvedBy;

        public KudoCardResponse() {}

        public KudoCardResponse(UUID cardId, UUID senderId, UUID recipientId, UUID classId, String title,
                String content, boolean isAnonymous, Status status, UUID approvedBy) {
            this.cardId = cardId;
            this.senderId = senderId;
            this.recipientId = recipientId;
            this.classId = classId;
            this.title = title;
            this.content = content;
            this.isAnonymous = isAnonymous;
            this.status = status;
            this.approvedBy = approvedBy;
        }

        public UUID getCardId() {
            return cardId;
        }

        public void setCardId(UUID cardId) {
            this.cardId = cardId;
        }

        public UUID getSenderId() {
            return senderId;
        }

        public void setSenderId(UUID senderId) {
            this.senderId = senderId;
        }

        public UUID getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(UUID recipientId) {
            this.recipientId = recipientId;
        }

        public UUID getClassId() {
            return classId;
        }

        public void setClassId(UUID classId) {
            this.classId = classId;
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

        public boolean isAnonymous() {
            return isAnonymous;
        }

        public void setAnonymous(boolean isAnonymous) {
            this.isAnonymous = isAnonymous;
        }

        public Status getStatus() {
            return status;
        }

        public void setStatus(Status status) {
            this.status = status;
        }

        public UUID getApprovedBy() {
            return approvedBy;
        }

        public void setApprovedBy(UUID approvedBy) {
            this.approvedBy = approvedBy;
        }

        
    }

}
