function myService1(req,resp){
    //Initialize Clearblade
    ClearBlade.init({request: req});
    var prms = req.params;
    //Get the body of published message
    var umessage = prms.body;
    //Convert it into array of object containing process information
    message = JSON.parse(umessage);
    //Get connection to the collection
    var myCollection = ClearBlade.Collection({collectionName: 'myPcLogs'});
    var msg = ClearBlade.Messaging();

    //storing every process information in collection
    for (var i=0; i<message.length; i++){
        myCollection.create(message[i], function(err, data){
            if(err){
                log("Error writing");
            }else{
                log("Successfully written");
            }
        });
    }

    //notify another service that a batch of CPU processes information has been received
    if (message[0].batch >= 2){
        msg.publish("ipc", message[0].batch);
    }
    resp.success("success");
}












