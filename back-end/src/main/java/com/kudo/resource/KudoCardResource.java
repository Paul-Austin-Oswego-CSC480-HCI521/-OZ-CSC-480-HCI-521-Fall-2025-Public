package com.kudo.resource;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.kudo.service.KudoService;

import com.kudo.dto.KudocardDTO;
import com.kudo.dto.KudocardDTO.CreateKudoRequest;
import com.kudo.model.CardIdList;
import com.kudo.model.Kudocard;
import com.kudo.service.UserService;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import javax.sql.DataSource;
import java.sql.*;
import java.util.UUID;

@ApplicationScoped
@Path("kudo-card")
public class KudoCardResource {

    @Inject
    private KudoService kudoService;

    //Test Resource
    @GET
    @Path("test")
    @Produces(MediaType.TEXT_PLAIN)
    public String test() {
        return "Hello World!";
    }

    @GET
    @Path("list/submitted")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getSubmittedKudos(@QueryParam("professor_id") UUID professorId) {
        return kudoService.getSubmittedCards(professorId);
    }

    @GET
    @Path("list/reviewed")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getReviewedKudos(@QueryParam("professor_id") UUID professorId) {
        return kudoService.getReviewedCards(professorId);
    }


     /**
     * GET /kudo-app/kudo-card/list/sent - Retrieve all card_ids which correspond to cards sent by a given user
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/list/sent?user_id=X-X-X-X-X
     *
     * Query Parameters:
     * - user_id: the UUID of the user who's sent card's card_ids are to be queried
     *
     * Returns: 200 OK with JSON array of UUID card_ids
     * Returns: 200 OK with empty JSON array if no cards sent by the given user are found
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"card_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("list/sent")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getSentKudoList(@QueryParam("user_id") UUID user_id) {
        return kudoService.getCardListBySender(user_id);
    }

    //Returns list of all IDs pertaining to Kudos which are received by this user
    //UUID should be in the format X-X-X-X-X where each X is a string of alphanumerics

    /**
     * GET /kudo-app/kudo-card/list/received - Retrieve all card_ids which correspond to cards received by a given user
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/list/received?user_id=X-X-X-X-X
     *
     * Query Parameters:
     * - user_id: the UUID of the user who's received card's card_ids are to be queried
     *
     * Returns: JSON array of UUID card_ids
     * Returns: empty JSON array if no cards received by the given user are found
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"card_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("list/received")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getReceivedKudoList(@QueryParam("user_id") UUID user_id) {
        return kudoService.getCardListByReceived(user_id);
    }

    /**
     * GET /kudo-app/kudo-card/{card_id} - retrieve the card which has the given card_id if it is accessible to the user with the given user_id
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/{W-W-W-W-W}?user_id=Y-Y-Y-Y-Y
     *
     * Path Parameters:
     * - card_id: the UUID card_id of the card which is requested
     *
     * Query Parameters:
     * - user_id: the UUID of the user who has access to the card with the given card_id
     *
     * Returns: Returns JSON representation of a Kudos card. If anonymous is set to true, and the given user_id is not an instructor,
     *          The sender_id is expunged from the returned JSON
     * Returns: 404 Not Found if a card with the given card_id does not exist or if the given user_id does not have permission
     *          to access the card with the given card_id
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {
     *  "anonymous":false,
     *  "card_id":"W-W-W-W-W",
     *  "class_id":"X-X-X-X-X",
     *  "content":"Good work today!",
     *  "recipient_id":"Y-Y-Y-Y-Y",
     *  "sender_id":"Z-Z-Z-Z-Z",
     *  "status":"PENDING",
     *  "title":"Good work!",
     *  "created_at":"date",
     *  "professor_note":null
     * }
     */
    @GET
    @Path("{card_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Kudocard getCard(@PathParam("card_id") UUID card_id, @QueryParam("user_id") UUID user_id) {
        return kudoService.getCard(card_id, user_id);
    }

    /*
     * POST /kudo-app/api/kudo-card - create new kudo card
     * Content-type: JSON
     * Request Body: 
     * {
        "sender_id": "SENDER-UUID",
        "recipient_id": "RECIPIENT-UUID",
        "class_id": "CLASS-UUID",
        "title": "{card title}",
        "content": "{card content}",
        "is_anonymous": true (DEFAULT)
        }   
     * If successful, should return saved Kudos card response, status:CREATED
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createKudo(@Valid CreateKudoRequest req) {

        //quick check: sender !== recipient
        if (req.getSender_id().equals(req.getRecipient_id())) {
            throw new BadRequestException("sender and recip. UUID must be different");
        }
        Kudocard card;
        try {
            card = kudoService.createCard(req);
        } catch (SQLException e){
            throw new InternalServerErrorException("Database error");
        }
        if(card == null) {
            throw new InternalServerErrorException("Failed to create Kudocard");
        } else
        {
            return Response.status(Response.Status.CREATED).entity(card).build();
        }
    }

    /*
 * PATCH /kudo-app/api/kudo-card - update a kudos card to change its status
 * Content-type: JSON
 * Request Body:
 * {
    "card_id":"X-X-X-X-X",
    "status":"PENDING|APPROVED|DENIED|RECEIVED",
    "approvedBy":"Y-Y-Y-Y-Y",
    "professor_note":"abcdefg123456"|null
    *
    }
 * If successful, returns the request
 */
    @PATCH
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateKudoStatus(@Valid KudocardDTO.UpdateStatusRequest req) {

        //get the user_id of the card sender
       Kudocard kudocard = getCard(req.getCard_id(), req.getApproved_by());

       //Check if the approvedBy is the professor of the user
        if(!kudoService.isInstructorOf(req.getApproved_by(), kudocard.getSender_id())) {
            throw new NotFoundException();
        }

        kudoService.updateCard(req);
        return Response.status(Response.Status.CREATED).entity(req).build();
    }


    /**
     * DELETE /kudo-app/kudo-card/{card_id} - delete the card which has the given card_id if it is accessible to the user with the given user_id
     *
     * Call: DELETE http://localhost:9080/kudo-app/kudo-card/{W-W-W-W-W}?user_id=Y-Y-Y-Y-Y
     *
     * Path Parameters:
     * - card_id: the UUID card_id of the card which is requested
     *
     * Query Parameters:
     * - user_id: the UUID of the user who has access to the card with the given card_id
     *
     * Returns: 200 ok if the deletion was successful
     * Returns: 404 Not Found if a card with the given card_id does not exist or if the given user_id does not have permission
     *          to access the card with the given card_id
     * Returns: 500 Internal Server Error for database issues
     *
     */
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{card_id}")
    public Response deleteKudo(@PathParam("card_id") UUID card_id, @QueryParam("user_id") UUID user_id) {
        kudoService.deleteCard(card_id, user_id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
