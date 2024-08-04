package com.dcab.backend.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client/test")
public class testController {

    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("hello");
    }
}
