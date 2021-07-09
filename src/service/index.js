export const createUser = async (name, email, password) => {
  const options = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  };

  const response = await fetch('http://localhost:9091/api/users', options);
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch('http://localhost:9091/api/users');
  return response.json();
};
