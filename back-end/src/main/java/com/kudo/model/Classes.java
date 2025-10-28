package com.kudo.model;

import jakarta.json.bind.annotation.JsonbProperty;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

public class Classes {
    @JsonbProperty("class_id")
    private UUID class_id;

    @JsonbProperty("name")
    private String name;

    @JsonbProperty("class_code")
    private Integer class_code;

    @JsonbProperty("created_at")
    private Timestamp created_at;

    @JsonbProperty("closed_at")
    private Timestamp closed_at;



    public Classes() {}

    public Classes(String className, Timestamp createdAt, Timestamp closedAt) {

    }

    public Classes(UUID class_id, String name,  Integer class_code, Timestamp created_at) {
        this.created_at = created_at;
        this.class_code = class_code;
        this.name = name;
        this.class_id = class_id;
    }

    public Classes(UUID class_id, String name, Integer class_code, Timestamp created_at, Timestamp closed_at) {
        this.class_id = class_id;
        this.name = name;
        this.class_code = class_code;
        this.created_at = created_at;
        this.closed_at = closed_at;
    }

    public UUID getClass_id() {
        return class_id;
    }

    public void setClass_id(UUID cardId) {
        this.class_id = cardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getClass_code() {
        return class_code;
    }

    public void setClass_code(Integer class_code) {
        this.class_code = class_code;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getClosed_at() {
        return closed_at;
    }

    public void setClosed_at(Timestamp closed_at) {
        this.closed_at = closed_at;
    }
}
