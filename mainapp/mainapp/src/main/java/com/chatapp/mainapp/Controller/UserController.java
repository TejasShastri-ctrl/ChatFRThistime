package com.chatapp.mainapp.Controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.UpdateUserRequest;
import com.chatapp.mainapp.Responses.ApiResponse;
import com.chatapp.mainapp.Services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // @Autowired
    public UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token)
            throws UserException {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " from the token
        }
        User user = userService.findUserProfile(token);
        for (int i = 0; i < 100; i++) {
            System.err.println("TOKEN TOKEN!! : " + token);
            System.out.println("Token Token : " + token);
        }
        return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
    }

    //! trying things out. Above is the working one
    // @GetMapping("/profile")
    // public ResponseEntity<User>
    // getUserProfileHandler(@RequestHeader("Authorization") String token)
    // throws UserException {
    // if (token.startsWith("Bearer ")) {
    // token = token.substring(7); // Remove "Bearer " from the token
    // }
    // User user = userService.findUserProfile(token);
    // return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
    // }

    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String q) {
        List<User> users = userService.searchUser(q);
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateUserHandler(@PathVariable("id") Integer id, @RequestBody UpdateUserRequest req,
            @RequestHeader("Authorization") String token) throws UserException {
        User user = userService.findUserProfile(token);
        user = userService.findUserById(id); //* sloppy fix.
        userService.updateUser(user.getId(), req);

        ApiResponse response = new ApiResponse("User updated", true);
        return new ResponseEntity<ApiResponse>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/search")
    public ResponseEntity<HashSet<User>> searchUsersByName(@RequestParam("name") String name) {
        System.out.println("commencing users search - ");
        List<User> users = userService.searchUser(name);
        HashSet<User> set = new HashSet<>(users);
        System.out.println("Search results ------- " + set);
        return new ResponseEntity<>(set, HttpStatus.ACCEPTED);
    }
}