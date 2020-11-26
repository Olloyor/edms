package mr.olloyor.edms.repository;

import mr.olloyor.edms.entity.Attachment;
import mr.olloyor.edms.entity.Document;
import mr.olloyor.edms.entity.enums.CorrType;
import mr.olloyor.edms.entity.enums.OrderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {

	Boolean existsByFile(Attachment file);

    @Query("select COUNT(d) from document d where d.correspondent = :corr and d.createdAt between :startDate and :endDate")
    Long findAllByCount(CorrType corr, Date startDate, Date endDate);

//    Long countAllByCorrespondentAndCreatedAtBetween();

    @Query("select d from document d where d.correspondent = :corr and d.orderType = :orderType and d.createdAt between :startDate and :endDate and (LOWER(d.theme) LIKE %:w% or LOWER(d.description) LIKE %:w%)")
    Page<Document> findAllByFilter(CorrType corr, OrderType orderType, Date startDate, Date endDate, String w, Pageable p);

    @Query("select d from document d where d.orderType = :orderType and d.createdAt between :startDate and :endDate and (LOWER(d.theme) LIKE %:w% or LOWER(d.description) LIKE %:w%)")
    Page<Document> findAllByFilter(OrderType orderType, Date startDate, Date endDate, String w, Pageable p);

    @Query("select d from document d where d.correspondent = :corr and d.createdAt between :startDate and :endDate and (LOWER(d.theme) LIKE %:w% or LOWER(d.description) LIKE %:w%)")
    Page<Document> findAllByFilter(CorrType corr, Date startDate, Date endDate, String w, Pageable p);

    @Query("select d from document d where d.createdAt between :startDate and :endDate and (LOWER(d.theme) LIKE %:w% or LOWER(d.description) LIKE %:w%)")
    Page<Document> findAllByFilter(Date startDate, Date endDate, String w, Pageable p);

}
