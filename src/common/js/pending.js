// export let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let pending = {_axiosPromiseCancel: [] };
export default pending;