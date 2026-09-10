package com.examly.springapp.util;

import org.springframework.stereotype.Component;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final String SECRET = "STMS_SECRET_KEY_FOR_JWT_AUTHENTICATION_2026_SUPER_SECURE";
    private static final long EXPIRATION_MS = 86400000; // 24 hours

    public String generateToken(String username, String role, String fullName) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION_MS;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format(
            "{\"sub\":\"%s\",\"role\":\"%s\",\"name\":\"%s\",\"iat\":%d,\"exp\":%d}",
            username, role, fullName, now / 1000, exp / 1000
        );

        String encodedHeader = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String encodedPayload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String dataToSign = encodedHeader + "." + encodedPayload;

        String signature = hmacSha256(dataToSign, SECRET);
        return dataToSign + "." + signature;
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || !token.contains(".")) {
                return false;
            }
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }
            String dataToSign = parts[0] + "." + parts[1];
            String expectedSig = hmacSha256(dataToSign, SECRET);
            return expectedSig.equals(parts[2]);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int subIdx = payload.indexOf("\"sub\":\"");
            if (subIdx != -1) {
                int start = subIdx + 7;
                int end = payload.indexOf("\"", start);
                return payload.substring(start, end);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public String extractRole(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int roleIdx = payload.indexOf("\"role\":\"");
            if (roleIdx != -1) {
                int start = roleIdx + 8;
                int end = payload.indexOf("\"", start);
                return payload.substring(start, end);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private static String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("HMAC SHA256 generation failed", e);
        }
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
