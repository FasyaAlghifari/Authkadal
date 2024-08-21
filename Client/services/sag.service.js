import axios from "axios";

export const getSags = (callback) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage

  console.log("Token sent:", token); // Log token yang dikirim

  axios
    .get("http://localhost:8080/sag", {
      headers: {
        Authorization: `Bearer ${token}` // Tambahkan token ke header Authorization
      }
    })
    .then((res) => {
      callback(res.data.posts);
    })
    .catch((err) => {
      console.log(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // Handle unauthorized access
        window.location.href = '/login'; // Redirect ke halaman login
      }
    });
};

export async function deleteSag(id) {
  try {
    const response = await axios.delete(`http://localhost:8080/sag/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal hapus SAG dengan id = ${id}. Alasan: ${error.message}`);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login'; // Redirect ke halaman login
    }
    throw error;
  }
}