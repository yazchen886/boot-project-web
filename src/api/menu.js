import http2 from "@/utils/http2";
//列表
export const getMenuListApi = async() =>{
    return await http2.get("/api/menu/list",null)
}
//上级列表
export const getParentMenuListApi = async() =>{
    return await http2.get("/api/menu/parent",null)
}
//新增
export const addMenuApi = async(pram) =>{
  return await http2.post('/api/menu',pram)
    //return await http.post("/api/menu",pram)
}
//编辑
export const editMenuApi = async(pram) =>{
    return await http2.put("/api/menu",pram)
}
//删除
export const deleteMenuApi = async(pram) =>{
    return await http2.delete("/api/menu",pram)
}
