package com.kudo.model;

import jakarta.json.bind.annotation.JsonbProperty;

import java.util.List;

//Wrapper for list of kudos card IDs to allow automatic JSON binding
public class CardIdList {
    @JsonbProperty("card_id")
    private List<Integer> cardIds;

    public CardIdList(List<Integer> cardIds) {
        this.cardIds = cardIds;
    }

    public List<Integer> getCardIds() {
        return cardIds;
    }
}
