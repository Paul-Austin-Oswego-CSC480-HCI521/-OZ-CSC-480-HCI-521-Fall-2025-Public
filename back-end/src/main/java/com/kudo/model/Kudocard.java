package com.kudo.model;
import java.util.UUID;

public class Kudocard {
    private UUID cardId;
    private UUID senderId;
    private UUID recipientId;
    private UUID classId;
    private String title;
    private String content;
    private boolean isAnonymous = true; //default true
    private Status status = Status.PENDING; //default pending
    private UUID approvedBy;

    public enum Status {
        PENDING, APPROVED, DENIED, RECEIVED
    }

    public Kudocard() {}

    public Kudocard(UUID cardId, UUID senderId, UUID recipientId, UUID classId, String title, String content,
            boolean isAnonymous, Status status, UUID approvedBy) {
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

    @Override
    public String toString() {
        return "Kudocard{" +
                "cardId=" + cardId +
                ", senderId=" + senderId +
                ", recipientId=" + recipientId +
                ", classId=" + classId +
                ", title='" + title + '\'' +
                ", isAnonymous=" + isAnonymous +
                ", status=" + status +
                ", approvedBy=" + approvedBy +
                '}';
    }

}
