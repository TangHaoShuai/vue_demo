import axios from 'axios' //引入组件
const baseUrl = 'http://192.168.31.68:8088/'
const request = (url = '', data = {}, type = '') => {
    return new Promise((resolve, reject) => {
        axios({
                method: type,
                url: baseUrl + url,
                data: data
            }).then((response) => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error)
            })
    })
}
export default request