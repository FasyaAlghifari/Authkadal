const API_KEY = "AIzaSyB_rQU5IOIZw2-crhzlYpUeoBZYwEav6AU";

export const getRapat = (callback) => {
    axios
        .get(`${API_KEY}/events`)
        .then((res) => {
            callback(res.data.posts);
        })
        .catch((err) => {
            console.log(err);
        });
}