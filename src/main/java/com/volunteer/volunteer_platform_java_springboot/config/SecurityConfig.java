package com.volunteer.volunteer_platform_java_springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .securityContext(sc -> sc.securityContextRepository(new HttpSessionSecurityContextRepository()))
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .addFilterBefore(new SessionAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        .requestMatchers("/api/registerAsVolunteer").permitAll()
                        .requestMatchers("/api/registerAsOrganisation").permitAll()
                        .requestMatchers("/api/generateAdminPassword").permitAll()

                        .requestMatchers("/api/volunteer/**").permitAll()
                        .requestMatchers("/api/organisation/**").permitAll()
                        // TEMP: allow all organisation endpoints to unblock createEvent
                        .requestMatchers("/api/org/**").permitAll()
                        // TEMP: allow all admin endpoints
                        .requestMatchers("/api/admin/**").permitAll()
                        .requestMatchers("/api/orgs").permitAll()

                        .requestMatchers("/uploads/**").permitAll()

                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("Content-Type", "X-Requested-With", "X-Org-Email", "Authorization", "Accept")
                        .exposedHeaders("X-Org-Email");
            }
        };
    }

}
