
export const getToken = (): string | null => {
    return localStorage.getItem('authToken'); 
  };

  export const clearToken = () =>{
    localStorage.clear();
  }