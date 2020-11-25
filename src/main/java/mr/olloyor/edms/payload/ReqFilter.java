package mr.olloyor.edms.payload;

import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.*;

@Data
public class ReqFilter {

//    @NotBlank(message = "Choose OrderType")
//    @Enumerated(value = EnumType.STRING)
    private String orderType;

//    @NotBlank(message = "Choose Correspondent")
//    @Enumerated
    private String correspondent;

    @Digits(message = "Enter start month num",fraction = 0, integer = 2)
    @Min(value = 1,message = "Minimal 1")
    @Max(value = 12,message = "Maximal 12")
    private Integer start;

    @Digits(message = "Enter end month num", fraction = 0, integer = 2)
    @Min(value = 1,message = "Minimal 1")
    @Max(value = 12,message = "Maximal 12")
    private Integer end;

    private String word;
}
