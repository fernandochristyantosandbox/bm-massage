import axios from 'axios';

export function setTokenHeader(token){
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else{
        delete axios.defaults.headers.common['Authorization'];
    }
}
export function apiCall(method, path, data){
    return new Promise((resolve, reject) => {
        return axios[method](path, data).then(res => {
            if(res.status === 200)
                resolve(res.data);
            else
                reject(res.data);
        })
        .catch(err => {
            reject(err.response.data.error);
        })
    })
}