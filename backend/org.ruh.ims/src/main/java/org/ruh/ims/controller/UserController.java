package org.ruh.ims.controller;

import org.ruh.ims.model.User;
import org.ruh.ims.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        user.setPassword(null);
        return user;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        created.setPassword(null);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        updated.setPassword(null);
        return updated;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
