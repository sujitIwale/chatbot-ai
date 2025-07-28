import client from './client';

interface AuthResponse {
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name: string;
}

export const authApi = {
  loginWithEmail: async (data: LoginData): Promise<AuthResponse> => {
    const response = await client.post('/auth/login', data);
    return response.data;
  },
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await client.post('/auth/signup', data);
    return response.data;
  },
  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },
  logout: async () => {
    await client.get('/auth/logout');
  }
};