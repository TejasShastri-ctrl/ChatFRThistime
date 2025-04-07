package com.chatapp.mainapp.Services;

import java.util.List;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.MessageException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Message;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.SendMRequest;

public interface MessageService {

    public Message sendMessage(SendMRequest req) throws UserException, ChatException;

    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;

    public Message findMessageById(Integer messageId) throws MessageException;

    public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException;

}
