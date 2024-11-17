package co.hrms.api.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

@RestController
public class GeneralController  {



    @RequestMapping("/hi")
    public ResponseEntity defaultRoute() throws InterruptedException {
        System.out.println("hey, I'm doing something");
        System.out.println(Thread.currentThread().toString());
        Thread.sleep(3000);
        return ResponseEntity.ok("HRMS API Server");
    }

}