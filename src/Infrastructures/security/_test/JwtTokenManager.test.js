const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('getTokenHeader function', () => {
    it('should throw AuthenticationError when header is not provided', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
  
      // Action & Assert
      await expect(jwtTokenManager.getTokenHeader(null))
        .rejects
        .toThrow('Missing authentication');
    });
  
    it('should return token correctly when header is provided', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const header = 'Bearer mock_token';
  
      // Action
      const token = await jwtTokenManager.getTokenHeader(header);
  
      // Assert
      expect(token).toEqual('mock_token');
    });
  });
  
  describe('verifyAccessToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const mockJwtToken = {
        decode: jest.fn().mockImplementation(() => { throw new Error('Invalid token'); }),
        verify: jest.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      const token = 'invalid_token';
  
      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(token))
        .rejects
        .toThrow(InvariantError);
    });
  
    it('should not throw InvariantError when access token is valid', async () => {
      // Arrange
      const mockJwtToken = {
        decode: jest.fn().mockReturnValue({}),
        verify: jest.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      const token = 'valid_token';
  
      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(token))
        .resolves
        .not.toThrow(InvariantError);
      expect(mockJwtToken.verify).toBeCalled();
    });
  });
  

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });
});
