package com.reclamations.config;

import com.reclamations.entity.AgentSAV;
import com.reclamations.entity.Client;
import com.reclamations.entity.User;
import com.reclamations.repository.AgentSAVRepository;
import com.reclamations.repository.ClientRepository;
import com.reclamations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AgentSAVRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Seed admin (AGENT_SAV)
        User adminUser;
        if (!userRepository.existsByUsername("admin")) {
            adminUser = userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.AGENT_SAV)
                    .build());
        } else {
            adminUser = userRepository.findByUsername("admin").orElseThrow();
        }
        if (agentRepository.findByUserUsername("admin").isEmpty()) {
            agentRepository.save(AgentSAV.builder()
                    .nom("Admin SAV")
                    .competence("Gestion générale")
                    .user(adminUser)
                    .build());
        }

        // Seed agent1 (AGENT_SAV)
        User agent1User;
        if (!userRepository.existsByUsername("agent1")) {
            agent1User = userRepository.save(User.builder()
                    .username("agent1")
                    .password(passwordEncoder.encode("agent123"))
                    .role(User.Role.AGENT_SAV)
                    .build());
        } else {
            agent1User = userRepository.findByUsername("agent1").orElseThrow();
        }
        if (agentRepository.findByUserUsername("agent1").isEmpty()) {
            agentRepository.save(AgentSAV.builder()
                    .nom("Agent SAV 1")
                    .competence("Support technique")
                    .user(agent1User)
                    .build());
        }

        // Seed client1 (CLIENT)
        User clientUser;
        if (!userRepository.existsByUsername("client1")) {
            clientUser = userRepository.save(User.builder()
                    .username("client1")
                    .password(passwordEncoder.encode("client123"))
                    .role(User.Role.CLIENT)
                    .build());
        } else {
            clientUser = userRepository.findByUsername("client1").orElseThrow();
        }
        if (clientRepository.findByUserId(clientUser.getId()).isEmpty()) {
            clientRepository.save(Client.builder()
                    .nom("Client Un")
                    .email("client1@example.com")
                    .telephone("0600000001")
                    .user(clientUser)
                    .build());
        }
    }
}
