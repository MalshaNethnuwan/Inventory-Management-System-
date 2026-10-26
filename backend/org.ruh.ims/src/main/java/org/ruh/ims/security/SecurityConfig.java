package org.ruh.ims.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER", "SALES_STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER", "SALES_STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/suppliers/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER", "SALES_STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/suppliers/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/suppliers/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/suppliers/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers("/api/purchase-orders/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers("/api/stock/**").hasAnyRole("ADMIN", "INVENTORY_MANAGER")
                        .requestMatchers("/api/sales/**").hasAnyRole("ADMIN", "SALES_STAFF")
                        .requestMatchers("/api/returns/**").hasAnyRole("ADMIN", "SALES_STAFF")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
