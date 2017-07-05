var $create = $('.create')
var $browse = $('.browse')
var $create_board = $('.create-board')
var $browse_board = $('.browse-board')
var $submit = $('.submit')

$create.click(function(){
	$create_board.css('display', 'block')
	$browse_board.css('display','none')
})

$browse.click(function(){
	$create_board.css('display', 'none')
	$browse_board.css('display', 'block')
	// load invites after post requests
	$.get('/get_data/', function(response){
		$('.invites_container').html(response.invites[0]._id)
	})
})

//add invite handler

$submit.click(function(){
	$.post('/add_data/invite',{
		category: $('.category').val(),
		title: $('.title').val(),
		description: $('.description').val(),
		requirements:$('.requirements').val()
	}, function(response){
		clearInvitationFields(response)
	})
})


// function to clear the fields in add invite form
function clearInvitationFields(response){
	if(response.success === true){
		$('.messageInternal').html('Invite was successfully saved!') ;
	}else{
		$('.messageInternal').html('Invite wasn\'t saved!') ;
	}
	$('.category').val('tech_proj') ;
	$('.title').val('') ;
	$('.description').val('') ;
	$('.requirements').val('') ;
	setTimeout(function(){
		$('.messageInternal').html('')
	}, 3000)
}