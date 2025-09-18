package com.volunteer.volunteer_platform_java_springboot.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class SessionAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();

        // Always ensure a session exists so PRINCIPAL_NAME is consistently indexed
        HttpSession session = request.getSession(true);
        if (session != null) {
            Object principalName = session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME);
            Object role = session.getAttribute("userRole");

            boolean needSetAuth = (currentAuth == null) || (currentAuth.getPrincipal() == null)
                    || (currentAuth.getPrincipal() instanceof String && "anonymousUser".equals(currentAuth.getPrincipal()));

            // Fallback: if principalName is missing but currentAuth has a valid principal
            if (principalName == null && currentAuth != null && currentAuth.getPrincipal() instanceof String) {
                String fallbackEmail = (String) currentAuth.getPrincipal();
                if (fallbackEmail != null && !"anonymousUser".equalsIgnoreCase(fallbackEmail)) {
                    session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, fallbackEmail);
                    principalName = fallbackEmail;
                    System.out.println("Fallback principal set from currentAuth: " + fallbackEmail);
                }
            }

            if (needSetAuth && principalName instanceof String && role instanceof String) {
                String email = (String) principalName;
                String roleStr = (String) role;
                if (email != null && !"anonymousUser".equalsIgnoreCase(email)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority(roleStr))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("Authentication set from session: " + email + " with role " + roleStr);
                }
            } else if (principalName == null) {
                // Index guest principal for unauthenticated sessions
                String email = null;
                if (currentAuth != null && currentAuth.getPrincipal() instanceof String) {
                    email = (String) currentAuth.getPrincipal();
                }
                if (email == null || "anonymousUser".equalsIgnoreCase(email)) {
                    session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, "GUEST");
                    System.out.println("Session marked as GUEST");
                } else {
                    session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, email);
                    System.out.println("Session principal set from currentAuth: " + email);
                }
            }

            System.out.println("Filter sees session ID: " + session.getId());
            System.out.println("Principal from session: " + session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME));
            System.out.println("Role from session: " + role);
        }

        filterChain.doFilter(request, response);
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setCookiePath("/"); // cookie valid pentru tot domeniul
        serializer.setUseHttpOnlyCookie(true);
        serializer.setSameSite("None"); // important pentru cross-origin
        serializer.setUseSecureCookie(true); // true  HTTPS
        return serializer;
    }
}
