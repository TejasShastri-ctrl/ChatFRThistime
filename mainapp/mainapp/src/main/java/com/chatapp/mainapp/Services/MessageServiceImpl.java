package com.chatapp.mainapp.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.MessageException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Chat;
import com.chatapp.mainapp.Models.Message;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Repos.MessageRepository;
import com.chatapp.mainapp.Requests.SendMRequest;

import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor //! MAY NEED A CUSTOM IMPLEMENTATION

public class MessageServiceImpl implements MessageService{

    private MessageRepository messageRepository;
    private UserService userService;
    private ChatService chatService;

    @Override
    public Message sendMessage(SendMRequest req) throws UserException, ChatException {
        User user = userService.findUserById(req.getUserId());
        Chat chat = chatService.findChatById(req.getChatId());

        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        return message;
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {
        Chat chat = chatService.findChatById(chatId);
        if(!chat.getUsers().contains(reqUser)) {
            throw new UserException("You are not related to the chat " + chatId);
        }
        List<Message> messages = messageRepository.findByChatId(chat.getId());
        return messages;
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        Optional<Message> opt = messageRepository.findById(messageId);
        if(opt.isPresent()) return opt.get();
        throw new MessageException("Message not found : " + messageId);
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException {
        Message message = findMessageById(messageId); //nice
        if(message.getUser().getId().equals(reqUser.getId())) {
            messageRepository.delete(message);
        }
        throw new MessageException("You cannot delete another user's message " + reqUser);
    }
}
