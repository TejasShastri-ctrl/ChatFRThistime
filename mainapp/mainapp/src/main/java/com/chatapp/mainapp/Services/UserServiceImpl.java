package com.chatapp.mainapp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.chatapp.mainapp.Configs.TokenProvider;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Repos.UserRepository;
import com.chatapp.mainapp.Requests.UpdateUserRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Service
@Data

public class UserServiceImpl implements UserService {

    // @Autowired
    private UserRepository userRepository;
    private TokenProvider tokenProvider;

    public UserServiceImpl(UserRepository userRepository, TokenProvider tokenProvider) {
        this.userRepository=userRepository;
        this.tokenProvider=tokenProvider;
    }

    @Override
    public User findUserById(Integer id) throws UserException {
        Optional<User> opt = userRepository.findById(id);
        if(opt.isPresent()) return opt.get();
        throw new UserException("User not found with id = " + id);
    }

    @Override
    public User findUserProfile(String jwt) throws UserException {
        String email = tokenProvider.getEmailFromtoken(jwt);
        if(email==null) {
            throw new BadCredentialsException("recieved invalid token---");
        }
        User user = userRepository.findByEmail(email);

        if(user==null) {
            throw new UserException("user not found with email = " + email);
        }
        return user;
    }

    @Override
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException {
        User user = findUserById(userId);
        if(req.getFull_name() != null) {
            user.setFull_name(req.getFull_name());
        }
        if(req.getProfile_picture()!=null) {
            user.setProfile_picture(req.getProfile_picture());
        }
        return userRepository.save(user);
    }

    @Override
    public List<User> searchUser(String query) {
        List<User> users = userRepository.searchUser(query);//naming similarity with repo is very important
        return users;
    }
}
