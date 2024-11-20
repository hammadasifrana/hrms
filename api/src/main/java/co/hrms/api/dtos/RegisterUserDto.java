package co.hrms.api.dtos;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Data
public class RegisterUserDto {
    private String email;
    private String password;
    private String fullName;
    private int clientId;

    // getters and setters here...
}
