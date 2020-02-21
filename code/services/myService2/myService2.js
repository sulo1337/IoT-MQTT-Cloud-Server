
function myService2(req,resp){
    ClearBlade.init({request:req});
    var params = req.params;
    //to run query in the collection
    var query = ClearBlade.Query({collectionID: "f290f9e40beadab8c9a998e642"});
    //to publish message to analytics topic
    var msg = ClearBlade.Messaging();
    //for inter-service communication
    const TOPIC = "ipc";
    //gets all the required rows from every page
    query.setPage(0,0);
    //initialize batch number for process batch
    var batchNo = 0;
    //initialize wait-loop
    msg.subscribe(TOPIC, WaitLoop);
    
    //function to analyze a batch of process
    function analyze(err, data){
        //message to be published
        var message;
        if (err) {
            message = "No data to analyze right now";
            msg.publish("analytics", message);
        }
        else{
            
            //receive a batch of process from collection
            processes = data["DATA"];
            
            //sort processes according to memory usage
            processes.sort(function(proc1, proc2) {
                return parseFloat(proc2.memory_percent) - parseFloat(proc1.memory_percent);
            });
            
            //obtain top 5 processes
            topProcesses = processes.slice(0,5);
            
            //obtain timestamp for the batch of process
            var unix_timestamp = topProcesses[0].timestamp;
            unix_timestamp = parseInt(unix_timestamp);
            var time = new Date(unix_timestamp*1000).toLocaleTimeString("en-US"); 
            
            //produce analytics
            message = "\nTop 5 processess using your PC memory at this time: "+time+" UTC\n";
            for (var i = 0; i < topProcesses.length; i++){
                var pid = topProcesses[i].pid;
                var mem = Math.round(topProcesses[i].memory_percent);
                var name = topProcesses[i].name;
                var sno = i+1;
                message+= sno+". PID: "+pid+"\t\tMem%: "+mem+" \t\t\tName: "+name+"\n";
            }
        }
        //use mqtt to publish message to 'analytics' topic
        msg.publish("analytics", message);
    }
    
    function WaitLoop(err, data) {
        if (err) {
            resp.error(data);
        }

        while (true) {
            //wait for signal from another myService1
            msg.waitForMessage("ipc", processMessage);
        }
  } 

  function processMessage(err, msg, topic){
                if (err) {
                    resp.error(msg);
                }
                else{ 
                    //find which batch to analyze
                    batchNo = parseInt(msg);
                    
                    //retrieve rows from collection
                    query.equalTo("batch", batchNo);
                    query.fetch(analyze);
                    
                    //delete rows from collection to save memory - optional 
                    query.remove(function (err, data){
                    log("Batch "+batchNo+" removed");
                });
  }
  }
}
