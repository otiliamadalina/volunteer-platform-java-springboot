package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.exception.UserNotFoundException;
import com.volunteer.volunteer_platform_java_springboot.model.User;
import com.volunteer.volunteer_platform_java_springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.List;

@RestController
// tells Spring Boot that this class is a REST controller, meaning it will handle HTTP requests (GET, POST, etc.) and return data in JSON format
@CrossOrigin("http://localhost:3000") // connect front w back
public class UserController { // this is the class responsible for managing users (User) in the application

    @Autowired  // tells Spring to automatically create an instance of the repository and inject it here
    private UserRepository userRepository; // UserRepository handles the database operations using Spring Data JPA
    // userRepository you can save or read data from the User table in the database

    // CREEAZA USER
    @PostMapping("/user")
    // responds to POST requests sent to http://localhost:8080/user
    User newUser(@RequestBody User newUser) { // the data sent in the request body (JSON) is automatically converted into a User object
        return userRepository.save(newUser); // saves the User object in the database
    }

    // RETURNEAZA LISTA TUTURORI USERILOR
    @GetMapping("/users")
    List<User> findAll() {
        return userRepository.findAll();
    }


    // RETURNEAZA UN USER DUPA ID
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // actualizeaza datele unui user uxistent in db
    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable Long id) {
        return userRepository.findById(id)                                      // cautam userul existent in DB dupa ID
                .map(existingUser -> {                                    // daca userul este gasit, il actualizam
                    existingUser.setUsername(newUser.getUsername());            // setam noul username primit
                    existingUser.setName(newUser.getName());
                    existingUser.setEmail(newUser.getEmail());
                    return userRepository.save(existingUser);                   // salvam modificarile in DB si returnam userul actualizat
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }


    // STERGE
    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);
        return "User with id " + id + " has been deleted";
    }
}
