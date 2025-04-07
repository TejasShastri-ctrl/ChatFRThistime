package com.chatapp.mainapp.Repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chatapp.mainapp.Models.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByEmail(String email);

    // @Query("select u from User u where u.full_name Like %:name%")
    // List<User> searchUsers(@Param("name") String name);

    // imp lesson
    @Query("select u from User u where u.full_name Like %:query% or u.email Like %:query%")
    public List<User> searchUser(@Param("query") String query);

}