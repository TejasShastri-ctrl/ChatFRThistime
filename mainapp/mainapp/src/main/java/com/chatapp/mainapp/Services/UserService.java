package com.chatapp.mainapp.Services;

import java.util.List;

import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.UpdateUserRequest;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public interface UserService {
    public User findUserById(Integer id) throws UserException;
    public User findUserProfile(String jwt) throws UserException;
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;
    public List<User> searchUser(String query);
}