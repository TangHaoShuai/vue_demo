import http from "@/apis/user.js"
export function getUserList(params) {
    return http.post('/userlist', {
        params
    })
}
export function fetchUserList1(params) {
    return http.post('/userlist', params)
}
export function fetchUserList2(params) {
    return http.put('/userlist', params)
}
export function fetchUserList3(params) {
    return http.delete('/userlist', {
        data: params
    })
}
export function fetchUserList5(params) {
    return http.get('/userlist', {
        params
    }, {
        silence: true
    }) //不显示加载动画
}
export function fetchUserList4(params) {
    return http.get('/userlist', {
        params,
        responseType: 'Blob'
    }) //下载文件
}