package com.kudo.model;

import jakarta.json.bind.annotation.JsonbProperty;

import java.util.UUID;

public class Classes {
    @JsonbProperty("class_id")
    private UUID class_id;

    @JsonbProperty("name")
    private String name;

    public Classes() {}

    public Classes(UUID cardId, String name) {
        this.class_id = cardId;
        this.name = name;
    }

    public Classes(String name) {
        this.name = name;
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
}
