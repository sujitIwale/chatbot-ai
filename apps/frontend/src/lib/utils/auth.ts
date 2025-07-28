export const getToken = () => {
  return localStorage.getItem('token');
};

export const handleAfterAuth = (token: string) => {
  localStorage.setItem('token', token);
  window.location.href = '/dashboard';
};


export const tryLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};