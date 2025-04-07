package com.chatapp.mainapp.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.mainapp.Configs.TokenProvider;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Repos.UserRepository;
import com.chatapp.mainapp.Requests.LoginRequest;
import com.chatapp.mainapp.Responses.AuthResponse;
import com.chatapp.mainapp.Services.CustomUserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private TokenProvider tokenProvider;
    private CustomUserService customUserService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider,
            CustomUserService customUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.customUserService = customUserService;
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user)
            throws UserException {
        String email = user.getEmail();
        String full_name = user.getFull_name();
        String password = user.getPassword();

        User isUser = userRepository.findByEmail(email);
        if (isUser != null) {
            throw new UserException("email is under use already : " + email);
        }
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFull_name(full_name);
        createdUser.setPassword(passwordEncoder.encode(password));
        userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        AuthResponse res = new AuthResponse(jwt, true);
        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    }

    //! trying to debug. above is the original
    // @Autowired
    // private AuthenticationManager authenticationManager;
    // @PostMapping(value = "/signup")
    // public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user)
    // throws UserException {
    // String email = user.getEmail();
    // String full_name = user.getFull_name();
    // String password = user.getPassword();

    // // Check if user already exists
    // User isUser = userRepository.findByEmail(email);
    // if (isUser != null) {
    // throw new UserException("email is under use already : " + email);
    // }

    // // Create and save user
    // User createdUser = new User();
    // createdUser.setEmail(email);
    // createdUser.setFull_name(full_name);
    // createdUser.setPassword(passwordEncoder.encode(password));

    // userRepository.save(createdUser);

    // // Authenticate user
    // Authentication authentication = authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(email, password));

    // // Set the authentication to the SecurityContext
    // SecurityContextHolder.getContext().setAuthentication(authentication);

    // // Generate JWT token
    // String jwt = tokenProvider.generateToken(authentication);

    // AuthResponse res = new AuthResponse(jwt, true);
    // return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    // }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();
        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        AuthResponse res = new AuthResponse(jwt, true);
        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    }

    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid Username");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
