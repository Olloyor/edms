package mr.olloyor.edms.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private String message;
    private boolean success;

    private Object result;

    public ApiResponse(String message, Boolean success) {
        this.message = message;
        this.success = success;
        this.result = null;
    }

    public ApiResponse(String message, Boolean success, Object result) {
        this.success = success;
        this.message = message;
        this.result = result;
    }

}
