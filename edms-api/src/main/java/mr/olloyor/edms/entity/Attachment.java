package mr.olloyor.edms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mr.olloyor.edms.entity.tmp.AbsEntity;

import javax.persistence.*;


@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIgnoreProperties(
        value = {"content"},
        allowGetters = true,allowSetters = true)
public class Attachment extends AbsEntity {

    private String name;

    private String contentType;

    private long size;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL,orphanRemoval = true, mappedBy = "attachment",fetch = FetchType.LAZY)
    AttachmentContent content;

    public Attachment(String name, String contentType, long size) {
        this.name = name;
        this.contentType = contentType;
        this.size = size;
    }
}
