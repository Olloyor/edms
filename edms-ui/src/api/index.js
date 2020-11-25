import axios from 'axios';
import {config} from '../utils/config';
const index = {
    getAllDocs: {url:'/doc', method: "GET"},
    getCount: {url:'/doc/count', method:"GET"},
    getByFilter: {url:'/doc/filter', method:"POST"},
    addDoc: {url:'/doc',method:"POST"},
    editDoc: {url:'/doc',method:"PUT"},
    deleteDoc: {url:'/doc',method:"DELETE"},
    uploadFile: {url:'/doc/upload',method:"POST"},
    getOrderTypeENUM: {url:'/doc/orderType', method:"GET"},
    getCorrespondentENUM: {url:'/doc/correspondent', method:"GET"},
}
const headers = {
    "Access-Control-Allow-Origin":"*",
    "Content-Type": "application/json"
}
const headerFile = {
    "Access-Control-Allow-Origin":"*",
    "Content-Type": "multipart/form-data"
}

export const getAllDocs= async(page=0 ,size=20)=>{
    return await axios.get(config.BASE_URL + index.getAllDocs.url+`/?page=${page}&size=${size}`, {headers});
}

export const getDocsCount= async(correspondent, month=1)=>{
    return await axios.get(config.BASE_URL + index.getCount.url+ `/?by=${correspondent}&month=${month}`)
}

export const getByFilter = async(page=0,size=20, data)=>{
    return await axios.post(config.BASE_URL + index.getByFilter.url +`/?page=${page}&size=${size}`, data,{headers});
}

export const getOrderType = async()=> {
    return await axios.get(config.BASE_URL + index.getOrderTypeENUM.url,{headers});
}
export const getCorrespondentType = async()=> {
    return await axios.get(config.BASE_URL + index.getCorrespondentENUM.url, {headers});
}

export const uploadFile = async(file)=>{
    return await axios.post(config.BASE_URL + index.uploadFile.url, file, {headerFile});
}

export const addNewDoc = async(data)=>{
    return await axios.post(config.BASE_URL + index.addDoc.url, data,{headers});
}

export const editDoc = async(data)=>{
    return await axios.put(config.BASE_URL + index.editDoc.url +`/${data?.id}`, data,{headers});
}

export const deleteDoc = async(docId)=>{
    return await axios.delete(config.BASE_URL + index.deleteDoc.url+`/${docId}`,{headers});
}


