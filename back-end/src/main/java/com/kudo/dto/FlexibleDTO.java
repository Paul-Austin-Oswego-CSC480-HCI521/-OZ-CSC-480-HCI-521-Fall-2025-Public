package com.kudo.dto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.json.bind.adapter.JsonbAdapter;
import java.util.Map;

import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTypeAdapter;

import java.util.HashMap;

@JsonbTypeAdapter(FlexibleDTO.FlexibleDTOAdapter.class)
public class FlexibleDTO {

    //This adapter flattens the DTO to just contain the key value pairs
    public static class FlexibleDTOAdapter implements JsonbAdapter<FlexibleDTO, HashMap<String, Object>> {
        @Override
        public HashMap<String, Object> adaptToJson(FlexibleDTO obj) {
            return obj.getFields();
        }

        @Override
        public FlexibleDTO adaptFromJson(HashMap<String, Object> map) {
            FlexibleDTO dto = new FlexibleDTO();
            map.forEach(dto::set);
            return dto;
        }
    }

    //This has to be application scoped in order to allow the adapter to be applied inside of collections
    @ApplicationScoped
    public static class JsonbProvider {
        @Produces
        public Jsonb createJsonb() {
            JsonbConfig config = new JsonbConfig()
                    .withAdapters(new FlexibleDTO.FlexibleDTOAdapter());
            return JsonbBuilder.create(config);
        }
    }

    @JsonbProperty
    private HashMap<String, Object> fields = new HashMap<>();

    public FlexibleDTO() {}

    public void set(String key, Object value) {
        fields.put(key, value);
    }

    public HashMap<String, Object> getFields() {
        return fields;
    }

    @Override
    public String toString() {
        return "FlexibleDTO{" +
                "fields=" + fields +
                '}';
    }
}


