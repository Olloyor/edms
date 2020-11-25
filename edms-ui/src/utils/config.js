let BASE_URL =  'http://localhost:80/api' || 'http://10.10.10.10:80/api';
let FILE_URL = 'http://localhost:80/api/doc/download/' ||  'http://10.10.10.10:80/api/doc/download/';
let MAX_FILE_SIZE = 1048000; //1MB

if (process.env.NODE_ENV === "production") {
    BASE_URL = '/api'
    FILE_URL = '/api/doc/download/'
}
export const config = {
    BASE_URL,
    FILE_URL,
    MAX_FILE_SIZE
}
