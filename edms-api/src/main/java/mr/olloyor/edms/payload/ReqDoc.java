package mr.olloyor.edms.payload;
import javax.validation.constraints.NotBlank;


import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class ReqDoc {

    @NotBlank(message = "Enter RegionId")
    private String regId;

    @NotBlank(message = "Enter OutgoingDoc")
    private String outgoingDoc;

    @NotBlank(message = "Choose OrderType")
    private String orderType;

    @NotBlank(message = "Choose Correspondent")
    private String correspondent;

    @NotBlank(message = "Enter theme")
    private String theme;

    @NotBlank(message = "Enter description")
    private String description;

    private Boolean isAccess;

    private Boolean isControl;

    private Date outgoingDate;
    private Date deadline;

    private UUID fileId;

}
