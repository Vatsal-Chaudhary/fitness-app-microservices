package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repo.RecommendationRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAiService aiService;
    private final RecommendationRepo recommendationRepo;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Processing activity: {}", activity);
//        log.info("Generating recommendation for activity: {}", aiService.generateRecommendation(activity));
        aiService.generateRecommendation(activity)
                .flatMap(recommendation ->
                                 reactor.core.publisher.Mono.fromCallable(() -> recommendationRepo.save(recommendation))
                                         .subscribeOn(Schedulers.boundedElastic())
                )
                .doOnSuccess(savedRec ->
                                     log.info("Recommendation saved for activity: {}", activity.getId()))
                .doOnError(error ->
                                   log.error("Failed to save recommendation for activity {}: {}",
                                             activity.getId(), error.getMessage()))
                .subscribe();
    }
}
