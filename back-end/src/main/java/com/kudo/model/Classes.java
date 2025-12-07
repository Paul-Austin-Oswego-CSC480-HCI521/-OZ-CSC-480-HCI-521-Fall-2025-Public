package com.kudo.model;

import jakarta.json.bind.annotation.JsonbProperty;

import java.sql.Timestamp;
import java.util.UUID;

public class Classes {
    @JsonbProperty("class_id")
    private UUID class_id;

    @JsonbProperty("class_name")
    private String class_name;

    @JsonbProperty("join_code")
    private Integer join_code;

    @JsonbProperty("created_date")
    private Timestamp created_date;

    @JsonbProperty("created_by")
    private UUID created_by;

    @JsonbProperty("end_date")
    private Timestamp end_date;

    public Classes() {}

    public Classes(UUID class_id, String name,  Integer join_code, Timestamp created_date, UUID created_by) {
        this.created_date = created_date;
        this.join_code = join_code;
        this.class_name = name;
        this.class_id = class_id;
        this.created_by = created_by;
    }

    public Classes(UUID class_id, String name, Integer join_code, Timestamp created_date, UUID created_by, Timestamp end_date) {
        this.class_id = class_id;
        this.class_name = name;
        this.join_code = join_code;
        this.created_date = created_date;
        this.end_date = end_date;
        this.created_by = created_by;
    }

    public UUID getClass_id() {
        return class_id;
    }

    public void setClass_id(UUID cardId) {
        this.class_id = cardId;
    }

    public String getName() {
        return class_name;
    }

    public String getClass_name(){
        return class_name;
    }

    public void setName(String name) {
        this.class_name = name;
    }

    public void setClass_name(String name){
        this.class_name = name;
    }

    public Integer getJoin_code() {
        return join_code;
    }

    public void setJoin_code(Integer join_code) {
        this.join_code = join_code;
    }

    public Timestamp getCreated_date() {
        return created_date;
    }

    public void setCreated_date(Timestamp created_date) {
        this.created_date = created_date;
    }

    public UUID getCreated_by() {
        return created_by;
    }

    public void setCreated_by(UUID created_by) {
        this.created_by = created_by;
    }

    public Timestamp getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Timestamp end_date) {
        this.end_date = end_date;
    }
}
