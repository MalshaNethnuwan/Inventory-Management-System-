package org.ruh.ims.service;

import org.ruh.ims.model.User;
import org.ruh.ims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setMustChangePassword(true);
        return userRepository.save(user);
    }

    public User updateUser(String id, User updated) {
        User user = getUserById(id);
        user.setName(updated.getName());
        user.setEmail(updated.getEmail());
        user.setRole(updated.getRole());
        if (updated.getPassword() != null && !updated.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updated.getPassword()));
            user.setMustChangePassword(true);
        }
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
