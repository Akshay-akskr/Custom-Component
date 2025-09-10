const { getAuth } = require('firebase-admin/auth');

class UsersController {

	getUserbyUID(req, res) {
		const { uid } = req.body;
		if (!uid) {
		  return res.status(422).json({
			uid: "User unique id is required"
		  });
		}
		
		getAuth().getUser(uid)
			.then((userRecord) => {	
				let userResult =  { 
									"uid": userRecord["uid"],
									"disabled": userRecord["disabled"],									
									"emailVerified": userRecord["emailVerified"],
									"email": userRecord["email"],
									"displayName": userRecord["displayName"],
									"photoURL": userRecord["photoURL"],
									"providerData": userRecord["providerData"]
								};
				res.status(201).json({  status: "ACK", result: userResult });
				//res.status(201).send({ result: userRecord.toJSON() });
			})
			.catch((error) => {
				const errorMessage = error.message || "Error fetching user data";
				res.status(500).json({ status: "NACK", error: errorMessage });
			});

    }
	
	
	getUserbyEmail(req, res) {
		const { email } = req.body;
		if (!email) {
		  return res.status(422).json({
			email: "User email id is required"
		  });
		}
		
		getAuth().getUserByEmail(email)
			.then((userRecord) => {
				let userResult =  { 
									"uid": userRecord["uid"],
									"disabled": userRecord["disabled"],									
									"emailVerified": userRecord["emailVerified"],
									"email": userRecord["email"],
									"displayName": userRecord["displayName"],
									"photoURL": userRecord["photoURL"],
									"providerData": userRecord["providerData"]
								};
				res.status(201).json({ status: "ACK", result: userResult });
				//res.status(201).send({ result: userRecord.toJSON() });
			})
			.catch((error) => {
				const errorMessage = error.message || "Error fetching user data";
				res.status(500).json({ status: "NACK", error: errorMessage });
			});
    }
	
	getAllUsers(req, res) {		
	
		const listAllUsers = (nextPageToken) => {
		  // List batch of users, 1000 at a time.
		  getAuth().listUsers(1000, nextPageToken)
			.then((listUsersResult) => {
				listUsersResult.users.forEach((userRecord) => {
					console.log('user', userRecord.toJSON());
					//res.status(201).json({ message: "Verification email sent! User created successfully!" });
				});
				if (listUsersResult.pageToken) {
					// List next batch of users.
					listAllUsers(listUsersResult.pageToken);
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).json({ error: "Error listing users" });
			});
		}
		
		listAllUsers();
    }
    
}

module.exports = new UsersController();