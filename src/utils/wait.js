
const wait = () => {
return new Promise((resolve,reject)=>{
    setTimeout(resolve, 50000)
})
};

export default wait;