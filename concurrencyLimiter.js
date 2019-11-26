
const arr = [1,2,3];
const callback = async val=>val+1;
const concurrency = {concurrency:2};
async function logValues(array, callback, concurrency){
    // to check that returned value is right
    console.log(await concurrencyLimiter(array, callback, concurrency));
}
async function concurrencyLimiter(array, callback, concurrency){
    const maxConcurrency = concurrency.concurrency;
    // track number of concurrent callbacks
    const concurrentTracker = {count : 0};

    // Run callback for each element of array, allowing only maxConcurrency number of concurrent callbacks
    return Promise.allSettled(array.map(async element => await tryCallback(element, callback, maxConcurrency, concurrentTracker))).then(results=>results.map(result=>result.value));

}

async function tryCallback(element, callback,  maxConcurrency, concurrentTracker){
    // Return callback if maxConcurrency not reached, reject if maxConcurrency reached
    const checkConcurrency = new Promise((resolve, reject) => {
        if(hasRoomForConcurrency(maxConcurrency, concurrentTracker.count)){
        // maxConcurrency wasn't reached
            resolve(callback);
        }else{
            reject(new Error(`Max concurrency [${maxConcurrency}] reached.`));
        }
    });
    try{
        // check if maxConcurrency was reached
        const cb = await checkConcurrency;
        // maxConcurrency wasn't reached, increment number of concurrent callbacks by 1
        concurrentTracker.count++;
        // run callback and store value
        const returnVal = await cb(element);
        // callback was run, reduce count of number of concurrent callbacks by 1
        concurrentTracker.count--;
        return returnVal;
    }catch{
    // maxConcurrency was reached, try again
       return await tryCallback(element, callback, maxConcurrency, concurrentTracker);
    }
};

function hasRoomForConcurrency(maxConcurrency, concurrentCount){
    // return true if there is room to add another concurrent task
    if(concurrentCount >= maxConcurrency) return false;
    return true;
}

export default concurrencyLimiter;