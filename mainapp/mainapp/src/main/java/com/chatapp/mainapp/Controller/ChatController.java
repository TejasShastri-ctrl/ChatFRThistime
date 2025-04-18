package com.chatapp.mainapp.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.web.server.ServerHttpSecurity.HttpsRedirectSpec;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Chat;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.GroupChatRequest;
import com.chatapp.mainapp.Requests.SingleChatRequest;
import com.chatapp.mainapp.Responses.ApiResponse;
import com.chatapp.mainapp.Services.ChatService;
import com.chatapp.mainapp.Services.UserService;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private ChatService chatService;
    private UserService userService;

    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatRequest singleChatRequest, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfile(jwt);
        Chat chat = chatService.createChat(reqUser, singleChatRequest.getUserId());
        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatRequest groupChatRequest, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfile(jwt);
        Chat chat = chatService.createGroup(groupChatRequest, reqUser);
        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        // User reqUser = userService.findUserProfile(jwt);
        Chat chat = chatService.findChatById(chatId);
        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findAllChatByUserIdHandler(@RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserProfile(jwt);
        List<Chat> chats = chatService.findAllChatByUserId(reqUser.getId());
        return new ResponseEntity<List<Chat>>(chats, HttpStatus.OK);
    }


    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandler(@PathVariable Integer chatId, @PathVariable Integer userId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserProfile(jwt);
        Chat chat = chatService.addUserToGroup(userId, chatId, reqUser);
        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroupHandler(@PathVariable Integer chatId, @PathVariable Integer userId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserProfile(jwt);
        Chat chat = chatService.removeFromGroup(chatId, userId, reqUser);
        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserProfile(jwt);
        chatService.deleteChat(chatId, reqUser.getId());
        ApiResponse res = new ApiResponse("chat deleted successfully", true);
        return new ResponseEntity<ApiResponse>(res, HttpStatus.OK);
    }

}
