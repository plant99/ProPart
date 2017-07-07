var express = require('express') ;
var router = express.Router() ;
router.post('/invite', function(req, res, next){
	var body = req.body ;
	console.log(req.decoded._doc.image, 'badass')
	var invite = new Invite({
		category: body.category,
		title: body.title,
		description: body.description,
		requirements: body.requirements,
		author: {
			name:req.decoded._doc.username,
			image: req.decoded._doc.image
		},
		applicants: []
	})
	invite.save(function(err, inviteSaved){
		if(err){
			res.json({success: false, message: 'Couldn\'t be saved'})
		}else{
			User.findOne({username: req.decoded._doc.username}, function(err, user){
				user.active_invitations.push(inviteSaved._id)
				user.save(function(err, userSaved){
					if(err){
						res.json({success: false, message: 'Couldn\'t be saved'}) ;
					}else{
						res.json({success:true, invite: invite})
					}
				})
			})
		}
	})
})

router.post('/request_for_invite',function(req, res, next){
	var id = req.body.id ;
	var user = req.decoded._doc ;
	if(id){
		Invite.findOne({_id: id}, function(err, inviteFound){
			if(inviteFound.author.name === user.username){
				res.json({success:false, message: 'You only created the invite.'})
			}else{
				Invite.findOne({_id: id}, function(err, inviteFound){
				if(err){
					res.json({success: false, message: 'Invite not found'})
				}else{
					if(findIndexOf({username: user.username, id: user._id}, inviteFound.applicants) === -1){
						inviteFound.applicants.push({username:user.username, id:user._id}) ;
						User.findOne({username: user.username},function(err, user){
							user.applied_invitations.push({id: id}) ;
							user.save(function(err, savedUser){							if(!err){
									inviteFound.save(function(err, savedInvite){
										res.json({success: true, invite: savedInvite})
									})
								}else{

									res.json({success:false})
								}
							})
						})
					}else{
						res.json({success:false, message:'Already Applied'}) ;
					}
				}
				})

			}
		})
	}else{
		res.json({success:false})
	}
})
module.exports = router ;

/*
Invite.findOne({_id: id}, function(err, inviteFound){
			if(err){
				res.json({success: false, message: 'Invite not found'})
			}else{
				if(findIndexOf({username: user.username, id: user._id}, inviteFound.applicants) === -1){
					inviteFound.applicants.push({username:user.username, id:user._id}) ;
					User.findOne({username: user.username},function(err, user){
						user.applied_invitations.push({id: id}) ;
						user.save(function(err, savedUser){							if(!err){
								inviteFound.save(function(err, savedInvite){
									res.json({success: true, invite: savedInvite})
								})
							}else{

								res.json({success:false})
							}
						})
					})
				}else{
					res.json({success:false, message:'Already Applied'}) ;
				}
			}
		})

*/

function findIndexOf(object, array){
	for(var i=0 ;i<array.length ;i++){
		if((object.username === array[i].username) && (object.id === array[i].id)){
			return i ;
		}
	}
	return -1
}