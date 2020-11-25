package mr.olloyor.edms.entity.enums;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@AllArgsConstructor
public enum CorrType {

    CB("CB","Central Bank"),
    GNI("GNI","GNI"),
    TCJ("TCJ","TCJ"),;

    private String key;
    private String value;

    public String getKey(){
        return this.key;
    }
    public String getValue() {
        return this.value;
    }


}
