(()=>{
    console.log("WorkerStarted")
    console.log("navigator.serial",navigator.serial)
    setInterval(()=>console.log("worker"), 10 * 1000)
})()