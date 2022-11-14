/* 同步函数的Promise化 */
function promisify(fn){
    return function pfn(...args){
        // 调用新函数一定得到Promise
        return new Promise(
            (resolve,reject)=>{

                for(let i=0;i<args.length;i++){
                   let arg = args[i]
                   if(typeof(arg)==="function"){
                       args[i] = (values)=>{
                           resolve(value)
                       }
                   }
                }

                fn.apply(null,args)
            }
        )
    }
}

module.exports = {
    promisify
}