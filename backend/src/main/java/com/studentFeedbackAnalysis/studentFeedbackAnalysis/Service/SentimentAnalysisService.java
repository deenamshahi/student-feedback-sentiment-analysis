package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SentimentAnalysisService {

    private final RestTemplate restTemplate;

    @Value("${sentiment.analysis.api.url}")
    private String apiUrl;

    public SentimentAnalysisService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String analyzeSentiment(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, String> response = restTemplate.postForObject(apiUrl + "/predict", request, Map.class);
            return response != null ? response.get("sentiment") : "neutral";
        } catch (Exception e) {
            e.printStackTrace();
            return "neutral"; // Default fallback
        }
    }
}
