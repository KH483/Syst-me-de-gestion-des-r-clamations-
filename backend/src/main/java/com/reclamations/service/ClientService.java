package com.reclamations.service;

import com.reclamations.dto.ClientDTO;
import com.reclamations.entity.Client;
import com.reclamations.exception.ResourceNotFoundException;
import com.reclamations.mapper.ClientMapper;
import com.reclamations.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public Page<ClientDTO> findAll(Pageable pageable) {
        return clientRepository.findAll(pageable).map(clientMapper::toDTO);
    }

    public ClientDTO findById(Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + id));
    }

    public ClientDTO create(ClientDTO dto) {
        Client client = clientMapper.toEntity(dto);
        return clientMapper.toDTO(clientRepository.save(client));
    }

    public ClientDTO update(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + id));
        clientMapper.updateFromDTO(dto, client);
        return clientMapper.toDTO(clientRepository.save(client));
    }

    public void delete(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'id: " + id);
        }
        clientRepository.deleteById(id);
    }
}
