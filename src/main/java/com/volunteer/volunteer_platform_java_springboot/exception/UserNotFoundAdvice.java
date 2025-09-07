package com.volunteer.volunteer_platform_java_springboot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class UserNotFoundAdvice {


//    private final UserRepository userRepository;
//
//    public UserNotFoundAdvice(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @ResponseBody
//    @ExceptionHandler(UserNotFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public Map<String, String> exceptionHandler(UserNotFoundException exception) {
//        Map<String, String> errorMap = new HashMap<>();               // cream MAp pentru a stoca mesajul de eroare
//        errorMap.put("errorMessage", exception.getMessage());
//
//        return errorMap; // returnam MAp-ul; va fi trimis ca JSON in raspunsul HTTP
//    }

}
