package mr.olloyor.edms.controller;

import lombok.AllArgsConstructor;
import mr.olloyor.edms.payload.ApiResponse;
import mr.olloyor.edms.payload.ReqDoc;
import mr.olloyor.edms.payload.ReqFilter;
import mr.olloyor.edms.service.DocumentService;
import mr.olloyor.edms.utils.AppConstants;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.UUID;

@CrossOrigin(origins = {"http://10.10.10.10:3000", "http://localhost:3000"})
@RestController
@RequestMapping("/api/doc")
@AllArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    private HttpEntity<?> getAllDocs(@PageableDefault(page = AppConstants.DEFAULT_PAGE_NUMBER, size = AppConstants.DEFAULT_PAGE_SIZE)
                                         @SortDefault.SortDefaults({
                                                 @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC)
                                         }) Pageable pageable){
        return documentService.getAllDocs(pageable);

    }

    @GetMapping("/{docId}")
    private HttpEntity<?> getDocById(@PathVariable UUID docId) {
        return documentService.getDocById(docId);
    }

    @PostMapping
    private HttpEntity<?> addDoc(@Valid @RequestBody ReqDoc doc) {
        return documentService.addDoc(doc);
    }

    @PutMapping("/{docId}")
    private HttpEntity<?> editDoc(@Valid @RequestBody ReqDoc doc, @PathVariable UUID docId) {
        return documentService.editDoc(doc, docId);
    }

    @DeleteMapping("/{docId}")
    private HttpEntity<?> deleteDoc(@PathVariable UUID docId) {
        return documentService.deleteDoc(docId);
    }

    @PostMapping("/upload")
    private HttpEntity<ApiResponse> uploadFile(MultipartHttpServletRequest request) throws IOException {
        return documentService.uploadFile(request);
    }

    @GetMapping("/download/{id}")
    public HttpEntity<?> getFile(@PathVariable UUID id, HttpServletResponse response) {
        return documentService.getAttachmentContent(id, response);
    }

    @GetMapping("/count")
    public HttpEntity<?> getCorrespondentCountMonthly(@RequestParam(value = "by", required = false) String by,
                                                      @RequestParam(value = "month", required = false) String month){
        return documentService.getCorrespondentCountMonthly(by, month);
    }


    @PostMapping("/filter")
    private HttpEntity<?> getDocsByFilter(
            @PageableDefault(page = AppConstants.DEFAULT_PAGE_NUMBER, size = AppConstants.DEFAULT_PAGE_SIZE)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC)
            }) Pageable pageable, @Valid @RequestBody ReqFilter reqFilter){
        return documentService.getDocsByFilter(pageable, reqFilter);
    }

    @GetMapping("/orderType")
    private HttpEntity<?> getOrderType(){
        return documentService.getOrderType();
    }

    @GetMapping("/correspondent")
    private HttpEntity<?> getCorr(){
        return documentService.getCorrespondent();
    }

}
