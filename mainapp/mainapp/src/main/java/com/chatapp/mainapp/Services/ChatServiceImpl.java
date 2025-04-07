package com.chatapp.mainapp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Chat;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Repos.ChatRepository;
import com.chatapp.mainapp.Requests.GroupChatRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Service
@Data
public class ChatServiceImpl implements ChatService{

    private ChatRepository chatRepository;
    private UserService userService;

    public ChatServiceImpl(ChatRepository chatRepository, UserService userService) {
        this.chatRepository = chatRepository;
        this.userService = userService;
    }

    @Override
    public Chat createChat(User reqUser, Integer userID2) throws UserException {
        // User user = userService.findUserById(reqUser)
        User user = userService.findUserById(userID2);
        Chat isChat = chatRepository.findSingleChatByUserIds(user, reqUser);
        
        if(isChat!=null) return isChat;

        Chat chat = new Chat();
        chat.setCreatedBy(reqUser);
        chat.getUsers().add(user);
        chat.getUsers().add(reqUser);
        chat.setGroup(false);
        chatRepository.save(chat); //! custom addition
        return chat;
    }

    @Override
    public Chat findChatById(Integer chatId) throws ChatException {
        Optional<Chat> chat = chatRepository.findById(chatId);
        if(chat.isPresent()) return chat.get();

        throw new ChatException("Chat " + chatId + " not found");
    }

    // redundant
    // @Override
    // public Chat findChatByUserId(Integer userId) throws UserException {
    //     return null;
    // }

    @Override
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
        User user = userService.findUserById(userId);
        List<Chat> chats = chatRepository.findChatByUserId(user.getId());
        return chats;
    }

    @Override
    public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException {
        Chat group = new Chat();
        group.setGroup(true);
        group.setChat_image(req.getChat_image());
        group.setChat_name(req.getChat_name());
        group.setCreatedBy(reqUser);
        group.getAdmins().add(reqUser);

        for(Integer userId : req.getUserIds()) {
            User user = userService.findUserById(userId);
            group.getUsers().add(user);
        }
        group.getUsers().add(userService.findUserById(reqUser.getId()));
        chatRepository.save(group);
        return group;
    }

    @Override
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
        Optional<Chat> opt = chatRepository.findById(chatId);
        User user = userService.findUserById(userId);
        if(opt.isPresent()) {
            Chat chat = opt.get();
            if(chat.getAdmins().contains(reqUser)) {
                chat.getUsers().add(user);
                return chatRepository.save(chat);
            } else {
                throw new UserException("You dont have access to edit groups(Not an admin)");
            }
        }
        throw new ChatException("Chat not found : " + chatId);
    }

    @Override
    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws ChatException, UserException {
        Optional<Chat> opt = chatRepository.findById(chatId);
        if(opt.isPresent()) {
            Chat chat = opt.get();
            if(chat.getUsers().contains(reqUser)) {
                chat.setChat_image(groupName);
                return chatRepository.save(chat);
            }
            throw new UserException("User is not a member of this group");
        }
        throw new ChatException("chat not found " + chatId);
    }

    @Override
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException {
        Optional<Chat> opt = chatRepository.findById(chatId);
        User user = userService.findUserById(userId);
        if(opt.isPresent()) {
            Chat chat = opt.get();
            if(chat.getAdmins().contains(reqUser)) {
                chat.getUsers().remove(user);
                return chatRepository.save(chat);
            } else if(chat.getUsers().contains(reqUser)) {
                if(user.getId().equals(reqUser.getId())) {
                    chat.getUsers().remove(user);
                    return chatRepository.save(chat);
                }
            }
            throw new UserException("You cannot remove another user");
            
        }
        throw new ChatException("Chat not found : " + chatId);
    }

    @Override
    public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException {
        Optional<Chat> opt = chatRepository.findById(chatId);
        if(opt.isPresent()) {
            Chat chat = opt.get();
            chatRepository.deleteById(chat.getId());
        }
    }
}
