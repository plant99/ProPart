var $create = $('.create')
var $browse = $('.browse')
var $create_board = $('.create-board')
var $browse_board = $('.browse-board')
var $submit = $('.submit')
var invites_container = document.querySelector('.invites_container')
$create.click(function(){
	$create_board.css('display', 'block')
	$browse_board.css('display','none')
})

$browse.click(function(){
	$create_board.css('display', 'none')
	$browse_board.css('display', 'block')
	// load invites after post requests
	$.get('/get_data/', function(response){
		var invites = response.invites ;
		loadInvites(invites, response.user)
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

//categoryFilter event handlers
var categoryFilter = document.querySelector('.categoryFilter') ;
categoryFilter.onchange = function(){
	$.get('/get_data/'+categoryFilter.value,function(response){
		if(response.success){
			var invites = response.invites ;
			loadInvites(invites, response.user)
		}else{
			invites_container.innerHTML = ''
			var p = document.createElement('p')
			p.innerHTML = 'Oops, no invites come under this category' ;
			p.setAttribute('style','font-size:25px; padding:20px ;')
			invites_container.appendChild(p)
		}
	})
}

function loadInvites(invites, user){
	var countOfInvites = 0 ;
	invites_container.innerHTML = '' ;
	if(invites.length){
		for(var i=0;i<invites.length;i++){
			if((invites[i].author.name != user.username) && findIndexOf({username: user.username, id:user._id}, invites[i].applicants)){
				countOfInvites++ ;
				var div = document.createElement('div') ;
				div.setAttribute('class','invite') ;
				div.setAttribute('data',invites[i]._id) ;
				var h4 = document.createElement('h4') ;
				h4.innerHTML = invites[i].author.name ;
				var image = document.createElement('img') ;
				image.src = '/serve_image/' + invites[i].author.image ;
				var detailsContainer = document.createElement('div') ;
				detailsContainer.setAttribute('class','details_container') ;
				var h3 = document.createElement('h3') ;
				h3.innerHTML = invites[i].title ;
				h3.setAttribute('class','invite_header')
				var p = document.createElement('p') ;
				var button = document.createElement('button') ;
				button.setAttribute('data',invites[i]._id) ;
				var required = document.createElement('p') ;
				required.innerHTML = 'Number of partners required: ' + invites[i].requirements ;
				required.setAttribute('class','required')
				button.innerHTML = 'Apply' ;
				p.innerHTML = invites[i].description ;
				detailsContainer.appendChild(h3) ;
				detailsContainer.appendChild(p) ;
				detailsContainer.appendChild(required) ;
				div.appendChild(image)
				div.appendChild(h4) ;
				div.appendChild(detailsContainer) ;
				div.appendChild(button)
				invites_container.appendChild(div) ;
				//set button onclick
				button.onclick = function(e){
					$.post('/add_data/request_for_invite',{id: e.target.getAttribute('data')}, function(response){
						if(response.success){
							var p = document.createElement('p') ;
							p.innerHTML = 'successfully applied to invite' ;
							p.setAttribute('style','font-size:25px; padding:20px;')
							var parentElement = e.target.parentNode ;
							parentElement.innerHTML = '' ;
							parentElement.appendChild(p) ;
							setTimeout(function(){
								document.querySelector('.invites_container').removeChild(parentElement) ;
							}, 3000)
						}else{
							//add no success handler
						}
					})
				}
			}
		}
		if(!countOfInvites){
			var p =document.createElement('p') ;
			p.innerHTML = "Oops, you have applied all of the available Invites."
			invites_container.appendChild(p)
			p.setAttribute('style','font-size:25px; padding:20px ;')
		}
	}else{
		var p =document.createElement('p') ;
		p.innerHTML = "Oops, no invites are active."
		invites_container.appendChild(p)
		p.setAttribute('style','font-size:25px; padding:20px ;')
	}
}

function findIndexOf(object, array){
	for(var i=0 ;i<array.length ;i++){
		if((object.username === array[i].username) && (object.id === array[i].id)){
			return false ;
		}
	}
	return true ;
}