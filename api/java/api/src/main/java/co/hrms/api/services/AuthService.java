package co.hrms.api.services;


import co.hrms.api.dtos.LoginDto;

public interface AuthService {
    String login(LoginDto loginDto);
}