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
}
