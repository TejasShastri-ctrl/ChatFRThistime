package com.chatapp.mainapp.Services;

import java.util.List;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Chat;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.GroupChatRequest;

public interface ChatService {
    public Chat createChat(User reqUser, Integer userID2) throws UserException;

    public Chat findChatById(Integer chatId) throws ChatException;

    // public Chat findChatByUserId(Integer userId) throws UserException;

    public List<Chat> findAllChatByUserId(Integer userId) throws UserException;

    public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException;

    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;

    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws ChatException, UserException;

    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException;

    public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException;

}
