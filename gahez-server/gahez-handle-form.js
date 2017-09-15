var con;

module.exports.setConnection = (connection)=>{
	con = connection;
};



module.exports.loginUser = (data,callback)=>{
	var q = `select * from client where client_email='${data.loginUsername}' and client_password='${data.loginPassword}' `;
	//console.log(q);
	con.query(q,function(err,result,field){		
		if(result[0]){
			//console.log(result);
			result[0].client_password='';
			result[0].messageTitle = 'login';
			result[0].error = false;
			callback(true,result[0]);
			//return;
		}
		else
		{
			callback(false,{messageTitle:'login',error:'invalid user or password'});
		}
		

		
    });
}