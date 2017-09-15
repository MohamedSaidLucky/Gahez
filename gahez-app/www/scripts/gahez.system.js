var System = (function (x) {
    
    x=$;
    var instance;
    var timeToTestConnection;


    function createInstance() {
        var object = {
            ws:{},
            url: "ws://localhost",
            port:28900,
            status:false,
            connect:connect,
            send:send,   
            received:received,         
            updatePosition:updatePosition,
            selectCategory:selectCategory,
            display:display,
            displayPanel:displayPanel,
            init:init,
            makeLogin:makeLogin,
            serializeObject:serializeObject,
            handle:handle
        };
        return object;
    }
    

    /*
        sending current position to server
     */
    function updatePosition(){

        navigator.geolocation.getCurrentPosition(function(position){

            //console.log('geolocation'); 
            var obj = {
                message:'updatePosition',
                lat:position.coords.latitude,
                lng:position.coords.longitude        
            } 

            obj.req = "updatePosition";

            send(obj);
            
        });
    }

    function selectCategory(){


        var obj = {
                message:'getCategoryList',
                parent:0,                       
            }
        instance.send( obj );
        console.log(' select category :' );
    }

    /*
        Send login event to server
     */
    function makeLogin(options){
        options.req = "makelogin";
        //console.log(options)
        instance.send(options);
    } 


    /*
        Display Page Or Panel
        use #
     */
    function display(pageId){
        window.location.href= `${pageId}`;
    }
    function displayPanel(panelId){
         $('#PanelMain').panel( "open" );
        console.log($);
    }


    /*
        connect to socket server
     */
    function connect(){

        //Check The Internet Connection        
        var online = navigator.onLine;
        
        //if No internet Application Stop
        if(!online){
            console.log('No internet connection');
            $('#popDNoInternet').popup('open');
            instance.status=false;            
            
            return;

        }

        navigator.geolocation.getCurrentPosition(function(position){
            $('#popDNoGeoLocation').popup('close');
        },function(err){
            console.log('GPS Disabled');
            $('#popDNoGeoLocation').popup('open');
            instance.status=false; 
            return;
        });
          
        //console.log('.....' + instance.status + ':' + instance.url+instance.port);
        if(!instance.status){
            var url =instance.url+":"+instance.port ;            
            var ws = new WebSocket(url); 

            ws.onopen =function(){  

                $('#popDNoServer').popup('close'); 
                $('#popDNoInternet').popup('close');
                
                console.log('Server Is Up');

                $(document).trigger('serverConnected');
                instance.status=true;
                instance.ws = ws;
                updatePosition();
            }

            ws.onmessage = function (evt) 
            { 
              var msg = JSON.parse(evt.data);
              console.log(msg );
              instance.handle(msg);
            };

            ws.onclose =function(){
                //$('.popDNoServerBtn').trigger('click');
                $('#popDNoServer').popup('open');
                $(document).trigger('serverDisconnected');
                console.log('Server is Down');
                instance.status=false;
                instance.ws = ws;
            }
        }
        else
        {            
            return;
        }
    }

    /*
        check if server alive
     */
    function checkConnection(timeToCheck){
        //run this test ever {timeToCheck} 
        return setInterval(connect,timeToCheck);
    }

    /*
        Handle Message Received
     */
    function received(msg){
        return JSON.parse(msg);
    }
    
    /* 
        send data to socket server
    */
    function send(obj){
        //check is server status is ok
        if(instance.status==true){
            obj = JSON.stringify(obj);
            instance.ws.send(obj);
            //console.log('sending .. updatePosition :' , obj);
        }        
    }

    /*
        serialize form as object
     */
    function serializeObject(formid){
        //serializeform as array
        var obj = $(formid).serializeArray();
        //creat empty object
        var newobj = {};
        //loop through serialized array
        $.each(obj,function(i,v){
            //add key and value for new empty object
            newobj[v.name] = v.value;       
        });
        //adding the form id property
        newobj.formid = formid;
        //return the new empty object
        return newobj;

    }

    /*
        Init The system Object
     */
    function init(){
        
        //connect to server
        connect();
        //check connect
        checkConnection(2000);   


    }


    function handle(obj){
        switch (obj.messageTitle) {
            case 'login':
                if(!obj.error){
                    instance.display('#PageMap');
                }else{
                    
                }
            break;
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };


})();