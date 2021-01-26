const getToken = async () => {
  const resp = await fetch(`${process.env.AUTH_URL}/token`, {
    credentials: 'include',
  });
  if (resp.status === 200) {
    const json = await resp.json();
    return json.token;
  } else {
    return null;
  }
};

export default getToken;
