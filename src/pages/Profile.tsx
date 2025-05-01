import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Container>
        <h2>Loading profile...</h2>
      </Container>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <Container>
      <ProfileCard>
        <h1>My Profile</h1>
        
        <ProfileSection>
          <h2>Personal Information</h2>
          <InfoRow>
            <Label>Name:</Label>
            <Value>{user.name}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Email:</Label>
            <Value>{user.email}</Value>
          </InfoRow>
          {user.phone && (
            <InfoRow>
              <Label>Phone:</Label>
              <Value>{user.phone}</Value>
            </InfoRow>
          )}
        </ProfileSection>

        {user.addresses && user.addresses.length > 0 && (
          <ProfileSection>
            <h2>Addresses</h2>
            {user.addresses.map((address, index) => (
              <AddressCard key={address.id || index} isDefault={address.isDefault}>
                {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
              </AddressCard>
            ))}
          </ProfileSection>
        )}

        <ButtonsRow>
          <EditButton onClick={() => alert('Edit profile functionality coming soon!')}>
            Edit Profile
          </EditButton>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </ButtonsRow>
      </ProfileCard>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 32px;
  
  h1 {
    color: #0F5132;
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 28px;
  }
`;

const ProfileSection = styled.div`
  margin-bottom: 30px;
  
  h2 {
    color: #0F5132;
    font-size: 20px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-weight: 600;
  width: 120px;
  color: #333;
`;

const Value = styled.div`
  flex: 1;
`;

const AddressCard = styled.div<{ isDefault: boolean }>`
  background-color: ${props => props.isDefault ? '#f0f7f3' : '#f9f9f9'};
  border: 1px solid ${props => props.isDefault ? '#c1e0d0' : '#e0e0e0'};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  
  p {
    margin: 4px 0;
  }
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #0F5132;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const EditButton = styled(Button)`
  background-color: #0F5132;
  color: white;
  border: none;
  
  &:hover {
    background-color: #0a3f27;
  }
`;

const LogoutButton = styled(Button)`
  background-color: white;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  
  &:hover {
    background-color: #d32f2f;
    color: white;
  }
`;

export default Profile; 