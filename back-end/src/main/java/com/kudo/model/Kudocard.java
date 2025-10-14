package com.kudo.model;
import jakarta.json.bind.annotation.JsonbProperty;

import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;

public class Kudocard {
    @JsonbProperty("card_id")
    private UUID card_id;

    @JsonbProperty("sender_id")
    private UUID sender_id;

    @JsonbProperty("recipient_id")
    private UUID recipient_id;

    @JsonbProperty("class_id")
    private UUID class_id;

    @JsonbProperty("title")
    private String title;

    @JsonbProperty("content")
    private String content;

    @JsonbProperty("is_anonymous")
    private boolean is_anonymous = true; //default true

    @JsonbProperty("status")
    private Status status = Status.PENDING; //default pending

    @JsonbProperty("approved_by")
    private UUID approved_by;

    @JsonbProperty("created_at")
    private Timestamp created_at;

    @JsonbProperty("professor_note")
    private String professor_note;

    public enum Status {
        PENDING, APPROVED, DENIED, RECEIVED
    }

    public Kudocard() {}

    public Kudocard(UUID card_id, UUID sender_id, UUID recipient_id, UUID class_id, String title, String content,
                    boolean is_anonymous, Status status, UUID approved_by, Timestamp created_at, String professor_note) {
        this.card_id = card_id;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.class_id = class_id;
        this.title = title;
        this.content = content;
        this.is_anonymous = is_anonymous;
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

    public boolean isIs_anonymous() {
        return is_anonymous;
    }

    public void setIs_anonymous(boolean isAnonymous) {
        this.is_anonymous = isAnonymous;
    }

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

    @Override
    public String toString() {
        return "Kudocard{" +
                "cardId=" + card_id +
                ", senderId=" + sender_id +
                ", recipientId=" + recipient_id +
                ", classId=" + class_id +
                ", title='" + title + '\'' +
                ", isAnonymous=" + is_anonymous +
                ", status=" + status +
                ", approvedBy=" + approved_by +
                '}';
    }

}
