package mr.olloyor.edms.service;

import lombok.AllArgsConstructor;
import mr.olloyor.edms.entity.Attachment;
import mr.olloyor.edms.entity.AttachmentContent;
import mr.olloyor.edms.payload.ApiResponse;
import mr.olloyor.edms.payload.ReqFilter;
import mr.olloyor.edms.repository.AttachmentContentRepository;
import mr.olloyor.edms.repository.AttachmentRepository;
import mr.olloyor.edms.repository.DocumentRepository;
import mr.olloyor.edms.entity.Document;
import mr.olloyor.edms.entity.enums.CorrType;
import mr.olloyor.edms.entity.enums.OrderType;
import mr.olloyor.edms.payload.ReqDoc;
import mr.olloyor.edms.utils.AppConstants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@AllArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentContentRepository attachmentContentRepository;

    public HttpEntity<?> getAllDocs(Pageable pageable) {
        try {
            Page<Document> allDocs = documentRepository.findAll(pageable);

            return ResponseEntity.status(200).body(allDocs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e);
        }
    }

    public HttpEntity<?> getDocById(UUID docId) {
        try {
            Optional<Document> doc = documentRepository.findById(docId);
            if (doc.isPresent()) {
                return ResponseEntity.status(200).body(doc);
            }
            return ResponseEntity.status(404).body(new ApiResponse("Doc Not Found", false));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Something Went Wrong!", false));
        }
    }

    public HttpEntity<?> addDoc(ReqDoc doc) {
        try {
            Optional<Attachment> file = attachmentRepository.findById(doc.getFileId());
            if (file.isPresent()) {
                if (documentRepository.existsByFile(file.get())) {
                    return ResponseEntity.status(409).body(new ApiResponse("Please Upload new File", false));
                }
                Document newDoc = new Document(
                        doc.getRegId(),
                        doc.getOutgoingDoc(),
                        OrderType.valueOf(doc.getOrderType().toUpperCase()),
                        CorrType.valueOf(doc.getCorrespondent().toUpperCase()),
                        doc.getTheme(),
                        doc.getDescription(),
                        doc.getIsAccess(),
                        doc.getIsControl(),
                        file.get(),
                        doc.getOutgoingDate(),
                        doc.getDeadline()
                );
                newDoc = documentRepository.save(newDoc);
                return ResponseEntity.status(200).body(newDoc);
            }
            return ResponseEntity.status(400).body(new ApiResponse("File is wrong", false));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e);
        }
    }

    public HttpEntity<?> editDoc(ReqDoc reqDoc, UUID docId) {
        try {
            Optional<Document> editDoc = documentRepository.findById(docId);
            if (!editDoc.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse("File Not Found", false));
            }
            Optional<Attachment> file = attachmentRepository.findById(reqDoc.getFileId());
            if (file.isPresent()) {
                if (!editDoc.get().getFile().getId().equals(file.get().getId()) && documentRepository.existsByFile(file.get())) {
                    return ResponseEntity.status(400).body(new ApiResponse("Please Upload File", false));
                }
                Document doc = editDoc.get();

                doc.setRegId(reqDoc.getRegId());
                doc.setOutgoingDoc(reqDoc.getOutgoingDoc());
                doc.setOrderType(OrderType.valueOf(reqDoc.getOrderType()));
                doc.setCorrespondent(CorrType.valueOf(reqDoc.getCorrespondent()));
                doc.setTheme(reqDoc.getTheme());
                doc.setDescription(reqDoc.getDescription());
                doc.setIsAccess(reqDoc.getIsAccess());
                doc.setIsControl(reqDoc.getIsControl());
                doc.setOutgoingDoc(reqDoc.getOutgoingDoc());
                doc.setDeadline(reqDoc.getDeadline());
                doc.setFile(file.get());
                doc = documentRepository.save(doc);

                return ResponseEntity.status(200).body(doc);
            }
            return ResponseEntity.status(40).body(new ApiResponse("File Not Found", false));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e);
        }
    }

    @Transactional
    public HttpEntity<?> deleteDoc(UUID docId) {
        try {
            Optional<Document> doc = documentRepository.findById(docId);
            if (doc.isPresent()) {
                documentRepository.deleteById(docId);
                return ResponseEntity.status(200).body(new ApiResponse("Deleted", true));
            }
            return ResponseEntity.status(200).body(new ApiResponse("Already Deleted", true));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse("Something Went Wrong!", false));
        }
    }

    @Transactional
    public HttpEntity<ApiResponse> uploadFile(MultipartHttpServletRequest request) throws IOException {
        Iterator<String> itr = request.getFileNames();
        MultipartFile file;
//        List<ResUploadFile> resUploadFiles = new ArrayList<>();
        List<UUID> resFileIds = new ArrayList<>();
        while (itr.hasNext()) {
//            if (!itr.next().equals("FILE")){
//                return ResponseEntity.status(400).body(new ApiResponse("M",false));
//            }
            file = request.getFile(itr.next());
            if (file.getSize() > AppConstants.FILE_SIZE) { //Means File Size more than
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("File size need to be less than 1MB", false));
            }
            if (file == null || !isSupportedContentType(file.getContentType())) {
                return ResponseEntity.status(400).body(new ApiResponse("Correct File types *.pdf,*.doc,*.docx", false));
            }
            try {
                Attachment attachment = attachmentRepository.save(new Attachment(file.getOriginalFilename(), file.getContentType(), file.getSize()));
                attachmentContentRepository.save(new AttachmentContent(attachment, file.getBytes()));

                resFileIds.add(attachment.getId());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(new ApiResponse("Something Went Wrong!", false));
            }

        }
        return ResponseEntity.status(200).body(new ApiResponse("Uploaded", true, resFileIds));

    }

    private boolean isSupportedContentType(String contentType) {
        return contentType.equals("application/pdf")
                || contentType.equals("application/msword")
                || contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    public HttpEntity<?> getAttachmentContent(UUID attachmentId, HttpServletResponse response) {
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(() -> new ResourceNotFoundException("Attachment Not Found"));
        AttachmentContent attachmentContent = attachmentContentRepository.findByAttachment(attachment).orElseThrow(() -> new ResourceNotFoundException("Attachment content not Found"));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getName() + "\"")
                .body(attachmentContent.getContent());
    }

    public HttpEntity<?> getCorrespondentCountMonthly(String by, String monthStr) {
        try {
            int month;
            try {
                month = Integer.parseInt(monthStr);
            } catch (NumberFormatException e) {
                month = 1;
            }
            if (month < 1 || month > 12 || month > LocalDate.now().getMonthValue()) {
                return ResponseEntity.status(200).body(0);
            }
            LocalDate sDate;
            LocalDate eDate;
            sDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(month);
            if (month == 12) {
                eDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(1).withYear(LocalDate.now().getYear() + 1);
            } else {
                eDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(month + 1);
            }
            Date startDate = convertToDateViaInstant(sDate);
            Date endDate = convertToDateViaInstant(eDate);
            CorrType corrType = CorrType.valueOf(by);

            Long count = documentRepository.findAllByCount(corrType, startDate, endDate);
            return ResponseEntity.status(200).body(count);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(0);
        }
    }


    public HttpEntity<?> getDocsByFilter(Pageable pageable, ReqFilter filter) {
        try {
            if (filter.getStart() >= filter.getEnd()) {
                filter.setEnd(filter.getStart() + 1);
            }
            LocalDate sDate;
            LocalDate eDate;
            sDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(filter.getStart());
            if (filter.getStart() == 12 || filter.getEnd() == 12) {
                eDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(1).withYear(LocalDate.now().getYear() + 1);
            } else {
                eDate = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1).withMonth(filter.getEnd());
            }
            Date startDate = convertToDateViaInstant(sDate);
            Date endDate = convertToDateViaInstant(eDate);

            if (filter.getCorrespondent().equals("ALL") && filter.getOrderType().equals("ALL")) {
                Page<Document> filteredDocsOrder = documentRepository.findAllByFilter(startDate, endDate, filter.getWord(), pageable);
                return ResponseEntity.status(200).body(filteredDocsOrder);
            } else if (filter.getCorrespondent().equals("ALL")) {
                OrderType orderType = OrderType.valueOf(filter.getOrderType());
                Page<Document> filteredDocsOrder = documentRepository.findAllByFilter(orderType, startDate, endDate, filter.getWord(), pageable);
                return ResponseEntity.status(200).body(filteredDocsOrder);
            } else if (filter.getOrderType().equals("ALL")) {
                CorrType corrType = CorrType.valueOf(filter.getCorrespondent());
                Page<Document> filteredDocs = documentRepository.findAllByFilter(corrType, startDate, endDate, filter.getWord(), pageable);
                return ResponseEntity.status(200).body(filteredDocs);
            }
            CorrType corrType = CorrType.valueOf(filter.getCorrespondent());
            OrderType orderType = OrderType.valueOf(filter.getOrderType());
            Page<Document> filteredDocs = documentRepository.findAllByFilter(corrType, orderType, startDate, endDate, filter.getWord(), pageable);
            return ResponseEntity.status(HttpStatus.OK).body(filteredDocs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e);
        }
    }


    private Date convertToDateViaInstant(LocalDate dateToConvert) {
        return java.util.Date.from(dateToConvert.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    public HttpEntity<?> getOrderType() {
        return ResponseEntity.status(200).body(Arrays.asList(OrderType.values()));
    }

    public HttpEntity<?> getCorrespondent() {
        return ResponseEntity.ok().body(Arrays.asList(CorrType.values()));
    }

}
