package mr.olloyor.edms.repository;

import mr.olloyor.edms.entity.Attachment;
import mr.olloyor.edms.entity.AttachmentContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AttachmentContentRepository extends JpaRepository<AttachmentContent, UUID> {

    Optional<AttachmentContent> findByAttachment(Attachment attachment);


}
