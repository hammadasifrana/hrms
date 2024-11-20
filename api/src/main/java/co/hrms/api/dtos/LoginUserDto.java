package co.hrms.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class LoginUserDto {
    private String email;
    private String password;
    private int clientId;

    // getters and setters here...
}
