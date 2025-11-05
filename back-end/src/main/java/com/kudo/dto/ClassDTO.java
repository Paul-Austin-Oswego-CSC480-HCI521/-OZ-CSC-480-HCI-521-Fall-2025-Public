package com.kudo.dto;

import jakarta.json.bind.annotation.JsonbDateFormat;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.BadRequestException;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;


public class ClassDTO {
    public static class UserIdList {
        @NotNull
        public List<String> user_id;  // field name must match JSON property

        public UserIdList() {} // required default constructor
    }

    public static class ClassId {
        @JsonbProperty("class_id")
        private String class_id;

        public ClassId( String class_id) {
            this.class_id = class_id;
        }

        public String getClass_id() {
            return class_id;
        }

        @Override
        public String toString() {
            String res =  "classIdsList{" +
                    "classIds=";
                res+= class_id;
            return res + '}';
        }
    }

    //Wrapper for list of kudos class IDs to allow automatic JSON binding
    public static class ClassIdList {
        @JsonbProperty("class_id")
        private List<String> class_id;

        public ClassIdList(List<String> class_id) {
            this.class_id = class_id;
        }

        public List<String> getClass_id() {
            return class_id;
        }

        @Override
        public String toString() {
            String res =  "classIdsList{" +
                    "classIds=";
            for(String str : class_id)
                res+=str;
            return res + '}';
        }
    }

    public static class ClassUpdate {
        @JsonbDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        @NotNull
        private LocalDateTime end_date;

        public ClassUpdate() {}

        public LocalDateTime getEnd_date() {
            return end_date;
        }

        public void setEnd_date(LocalDateTime end_date) {
            this.end_date = end_date;
        }



        public Timestamp getClosedAtAsTimestamp() {
            if (end_date == null) return null;
            try {
                return Timestamp.valueOf(end_date);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid closed_at format. Expected yyyy-MM-dd HH:mm:ss");
            }
        }
    }
}
