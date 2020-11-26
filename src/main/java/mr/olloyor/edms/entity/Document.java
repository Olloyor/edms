package mr.olloyor.edms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mr.olloyor.edms.entity.enums.CorrType;
import mr.olloyor.edms.entity.enums.OrderType;
import mr.olloyor.edms.entity.tmp.AbsEntity;

import javax.persistence.*;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "document")
public class Document extends AbsEntity {

    private String regId;

    private String outgoingDoc;


    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CorrType correspondent;

    @Column(length = 100)
    private String theme;

    @Column(length = 1000)
    private String description;

    @Column
    private Boolean isAccess;

    private Boolean isControl;

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true, targetEntity = Attachment.class)
    private Attachment file;

    @Column
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date outgoingDate;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date deadline;
}
