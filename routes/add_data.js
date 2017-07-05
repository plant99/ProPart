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
module.exports = router ;