package com.kudo.dto;

import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.validation.constraints.NotNull;

import java.util.List;


public class ClassDTO {
    public static class UserIdList {
        @NotNull
        public List<String> user_id;  // field name must match JSON property

        public UserIdList() {} // required default constructor
    }

    public static class ClassId {
        @JsonbProperty("class_id")
        private String classId;

        public ClassId( String class_id) {
            this.classId = class_id;
        }

        public String getClassId() {
            return classId;
        }

        @Override
        public String toString() {
            String res =  "classIdsList{" +
                    "classIds=";
                res+=classId;
            return res + '}';
        }
    }

    //Wrapper for list of kudos class IDs to allow automatic JSON binding
    public static class ClassIdList {
        @JsonbProperty("class_id")
        private List<String> classIds;

        public ClassIdList(List<String> class_id) {
            this.classIds = class_id;
        }

        public List<String> getClassIds() {
            return classIds;
        }

        @Override
        public String toString() {
            String res =  "classIdsList{" +
                    "classIds=";
            for(String str : classIds)
                res+=str;
            return res + '}';
        }
    }
}
